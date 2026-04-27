import type { AppData } from '../types'
import { isSupabaseConfigured, supabaseAnonKey, supabaseConfigProblem, supabaseUrl } from './supabase'

const LOCAL_PREFIX = 'controle-pix:'
const REQUEST_TIMEOUT_MS = 12000

export function buildEmptyData(): AppData {
  return {
    settings: {
      accountBalance: 0,
      periodStartDay: 27,
      savingsGoal: 0,
      fixedCosts: 0,
    },
    transactions: [],
  }
}

export async function loadAppData(vaultId: string): Promise<{ data: AppData; source: 'supabase' | 'local'; warning?: string }> {
  const safeVaultId = normalizeVaultId(vaultId)

  if (isSupabaseConfigured) {
    try {
      const response = await requestSupabase(
        `/rest/v1/pix_finance_profiles?vault_id=eq.${encodeURIComponent(safeVaultId)}&select=settings,transactions&limit=1`,
        { method: 'GET' },
      )

      const rows = await response.json() as Array<{ settings?: Partial<AppData['settings']>; transactions?: unknown }>
      const row = rows[0]

      if (row) {
        return {
          data: {
            settings: { ...buildEmptyData().settings, ...(row.settings ?? {}) },
            transactions: Array.isArray(row.transactions) ? row.transactions : [],
          },
          source: 'supabase',
        }
      }
    } catch (error) {
      const local = loadLocalData(safeVaultId)
      return {
        data: local,
        source: 'local',
        warning: `Não foi possível conectar ao Supabase. Dados locais carregados. Detalhe: ${getErrorMessage(error)}`,
      }
    }
  }

  return {
    data: loadLocalData(safeVaultId),
    source: 'local',
    warning: supabaseConfigProblem ?? undefined,
  }
}

export async function saveAppData(vaultId: string, data: AppData): Promise<{ source: 'supabase' | 'local'; warning?: string }> {
  const safeVaultId = normalizeVaultId(vaultId)

  if (isSupabaseConfigured) {
    try {
      await requestSupabase('/rest/v1/pix_finance_profiles?on_conflict=vault_id', {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          vault_id: safeVaultId,
          settings: data.settings,
          transactions: data.transactions,
          updated_at: new Date().toISOString(),
        }),
      })

      return { source: 'supabase' }
    } catch (error) {
      saveLocalData(safeVaultId, data)
      return {
        source: 'local',
        warning: `Erro ao salvar no Supabase. Os dados foram salvos localmente. Detalhe: ${getErrorMessage(error)}`,
      }
    }
  }

  saveLocalData(safeVaultId, data)
  return { source: 'local', warning: supabaseConfigProblem ?? undefined }
}

async function requestSupabase(path: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const headers = new Headers(init.headers)
    headers.set('apikey', supabaseAnonKey)
    headers.set('Authorization', `Bearer ${supabaseAnonKey}`)
    headers.set('Content-Type', 'application/json')

    const response = await fetch(`${supabaseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers,
    })

    if (!response.ok) {
      const message = await readResponseMessage(response)
      throw new Error(`Supabase respondeu ${response.status}: ${message}`)
    }

    return response
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('tempo limite de conexão esgotado')
    }
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('falha de rede/CORS antes de receber resposta do Supabase')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

async function readResponseMessage(response: Response): Promise<string> {
  const text = await response.text()
  if (!text) return response.statusText || 'sem detalhes'

  try {
    const parsed = JSON.parse(text) as { message?: string; hint?: string; details?: string; code?: string }
    return [parsed.message, parsed.hint, parsed.details, parsed.code].filter(Boolean).join(' | ')
  } catch {
    return text
  }
}

function loadLocalData(safeVaultId: string): AppData {
  const local = localStorage.getItem(`${LOCAL_PREFIX}${safeVaultId}`)
  if (!local) return buildEmptyData()

  try {
    const parsed = JSON.parse(local) as Partial<AppData>
    return {
      settings: { ...buildEmptyData().settings, ...(parsed.settings ?? {}) },
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    }
  } catch {
    return buildEmptyData()
  }
}

function saveLocalData(safeVaultId: string, data: AppData): void {
  localStorage.setItem(`${LOCAL_PREFIX}${safeVaultId}`, JSON.stringify(data))
}

export function normalizeVaultId(vaultId: string): string {
  const trimmed = vaultId.trim()
  return trimmed || 'default'
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'erro desconhecido'
}
