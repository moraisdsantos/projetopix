const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl)
export const supabaseAnonKey = normalizeEnvValue(rawSupabaseAnonKey)

export const supabaseConfigProblem = getSupabaseConfigProblem(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = supabaseConfigProblem === null

function normalizeEnvValue(value?: string): string {
  return (value ?? '').trim()
}

function normalizeSupabaseUrl(value?: string): string {
  return normalizeEnvValue(value).replace(/\/+$/, '')
}

function getSupabaseConfigProblem(url: string, anonKey: string): string | null {
  if (!url || !anonKey) return 'Variáveis do Supabase ausentes.'
  if (anonKey === 'sua_chave_aqui' || anonKey.includes('SUA_CHAVE') || anonKey.includes('COLE_AQUI')) {
    return 'A chave pública do Supabase ainda está como placeholder.'
  }
  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    return 'URL do Supabase inválida.'
  }
  if (!anonKey.startsWith('eyJ') || anonKey.length < 100) {
    return 'Chave pública do Supabase inválida. Use a anon/public key ou publishable key.'
  }
  return null
}
