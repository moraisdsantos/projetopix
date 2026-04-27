import { ChangeEvent, DragEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, Copy, Database, DollarSign, FileText, Moon, RefreshCcw, Save, Sun, TrendingUp, Upload, XCircle } from 'lucide-react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { AppData, Settings, Transaction } from '../types'
import { extractPixReceiptFromPdf } from '../lib/pdfParser'
import { formatCurrency, formatDateTime, formatPeriodDate } from '../lib/format'
import { endOfDay, getFinancialPeriod, startOfDay, sumTransactions, transactionsInRange } from '../lib/period'
import { buildEmptyData, loadAppData, normalizeVaultId, saveAppData } from '../lib/storage'
import { isSupabaseConfigured, supabaseConfigProblem } from '../lib/supabase'

const DEFAULT_VAULT_ID = 'controle-pix-pessoal'

export function FinancialDashboard() {
  const [vaultId, setVaultId] = useState(DEFAULT_VAULT_ID)
  const [settings, setSettings] = useState<Settings>(buildEmptyData().settings)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [storageMode, setStorageMode] = useState<'supabase' | 'local'>(isSupabaseConfigured ? 'supabase' : 'local')
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const period = useMemo(() => getFinancialPeriod(settings.periodStartDay), [settings.periodStartDay])
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)
  const yesterdayEnd = new Date(todayStart.getTime() - 1)

  const periodTransactions = useMemo(
    () => transactionsInRange(transactions, period.start, period.end),
    [transactions, period.start, period.end],
  )

  const totalSpent = useMemo(() => sumTransactions(periodTransactions), [periodTransactions])
  const spentToday = useMemo(
    () => sumTransactions(transactionsInRange(transactions, todayStart, todayEnd)),
    [transactions, todayStart, todayEnd],
  )
  const spentBeforeToday = useMemo(
    () => sumTransactions(transactionsInRange(transactions, period.start, yesterdayEnd)),
    [transactions, period.start, yesterdayEnd],
  )

  const availableBudget = settings.accountBalance - settings.fixedCosts - settings.savingsGoal
  const dailyLimit = Math.max(0, availableBudget / period.daysInPeriod)
  const budgetUpToToday = dailyLimit * period.daysPassed
  const surplusAccumulated = budgetUpToToday - totalSpent
  const surplusBeforeToday = dailyLimit * Math.max(0, period.daysPassed - 1) - spentBeforeToday
  const availableToday = Math.max(0, dailyLimit + surplusBeforeToday)
  const remainingToday = availableToday - spentToday
  const availableForPeriod = Math.max(0, availableBudget - totalSpent)

  const chartData = [
    { name: 'Gasto', value: Math.max(0, totalSpent), color: '#ef4444' },
    { name: 'Comprometido', value: Math.max(0, settings.fixedCosts), color: '#f59e0b' },
    { name: 'Disponível', value: Math.max(0, availableForPeriod), color: '#10b981' },
  ].filter((item) => item.value > 0)

  useEffect(() => {
    const savedTheme = localStorage.getItem('controle-pix-theme')
    setIsDarkMode(savedTheme === 'dark')
    void handleLoadVault(DEFAULT_VAULT_ID, false)
  }, [])

  useEffect(() => {
    localStorage.setItem('controle-pix-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    if (!hasLoaded) return
    const timeout = window.setTimeout(() => {
      void saveData(false)
    }, 650)
    return () => window.clearTimeout(timeout)
  }, [settings, transactions, vaultId, hasLoaded])

  async function handleLoadVault(id = vaultId, showMessage = true) {
    try {
      const normalized = normalizeVaultId(id)
      setVaultId(normalized)
      const loaded = await loadAppData(normalized)
      setSettings(loaded.data.settings)
      setTransactions(loaded.data.transactions)
      setStorageMode(loaded.source)
      setHasLoaded(true)
      if (loaded.warning) {
        setNotice({ type: 'info', message: loaded.warning })
      } else if (showMessage) {
        setNotice({
          type: 'success',
          message: loaded.source === 'supabase'
            ? 'Cofre carregado no Supabase.'
            : 'Cofre carregado localmente no navegador.',
        })
      }
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
      setHasLoaded(true)
    }
  }

  async function saveData(showMessage = true) {
    try {
      setIsSaving(true)
      const saved = await saveAppData(vaultId, { settings, transactions })
      setStorageMode(saved.source)
      if (saved.warning) {
        setNotice({ type: 'info', message: saved.warning })
      } else if (showMessage) {
        setNotice({
          type: 'success',
          message: saved.source === 'supabase'
            ? 'Dados salvos no Supabase.'
            : 'Dados salvos localmente no navegador.',
        })
      }
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsSaving(false)
    }
  }

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  async function handleUpload(file?: File | null) {
    if (!file) return

    try {
      setIsProcessing(true)
      setNotice(null)
      const parsed = await extractPixReceiptFromPdf(file)
      const transactionId = parsed.controlNumber || `${parsed.date}-${parsed.value}-${parsed.recipient}`

      if (transactions.some((transaction) => transaction.controlNumber && transaction.controlNumber === parsed.controlNumber)) {
        setNotice({ type: 'info', message: 'Este comprovante já foi registrado anteriormente.' })
        return
      }

      const transaction: Transaction = {
        id: transactionId,
        date: parsed.date,
        value: parsed.value,
        recipient: parsed.recipient,
        controlNumber: parsed.controlNumber,
        sourceFile: file.name,
        createdAt: new Date().toISOString(),
      }

      setTransactions((current) => [transaction, ...current])
      setNotice({
        type: 'success',
        message: `Transação adicionada: ${formatCurrency(transaction.value)} para ${transaction.recipient}.`,
      })
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsProcessing(false)
    }
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    void handleUpload(file)
    event.target.value = ''
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    void handleUpload(file)
  }

  function onDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
  }

  function copyVaultId() {
    void navigator.clipboard.writeText(vaultId)
    setNotice({ type: 'success', message: 'ID do cofre copiado.' })
  }

  function removeTransaction(id: string) {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id))
    setNotice({ type: 'info', message: 'Transação removida.' })
  }

  return (
    <main className={`app-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <h1>Controle de Gastos PIX</h1>
            <p>Gerencie seus gastos diários com inteligência</p>
          </div>

          <div className="header-actions">
            <button className="ghost-button" type="button" onClick={() => setIsDarkMode((value) => !value)}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              {isDarkMode ? 'Modo claro' : 'Modo escuro'}
            </button>
          </div>
        </header>

        <section className="vault-card">
          <div className="vault-title">
            <Database size={18} />
            <span>{storageMode === 'supabase' ? 'Salvando no Supabase' : 'Salvando localmente'}</span>
          </div>
          <div className="vault-controls">
            <input
              value={vaultId}
              onChange={(event) => setVaultId(event.target.value)}
              aria-label="ID do cofre financeiro"
            />
            <button type="button" className="small-button" onClick={copyVaultId} title="Copiar ID">
              <Copy size={16} />
            </button>
            <button type="button" className="small-button" onClick={() => void handleLoadVault()}>
              <RefreshCcw size={16} />
              Abrir
            </button>
            <button type="button" className="small-button primary" onClick={() => void saveData()} disabled={isSaving}>
              <Save size={16} />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {!isSupabaseConfigured && (
            <p className="vault-hint">Supabase não configurado: usando localStorage como fallback. {supabaseConfigProblem}</p>
          )}
        </section>

        {notice && (
          <div className={`notice ${notice.type}`}>
            {notice.type === 'success' ? <CheckCircle size={20} /> : notice.type === 'error' ? <XCircle size={20} /> : <FileText size={20} />}
            <span>{notice.message}</span>
          </div>
        )}

        <section className="config-grid" aria-label="Configurações financeiras">
          <EditableMetricCard
            accent="purple"
            icon={<DollarSign size={28} />}
            label="Saldo Total"
            value={formatCurrency(settings.accountBalance)}
            inputValue={settings.accountBalance}
            onChange={(value) => updateSetting('accountBalance', value)}
            inputLabel="Quanto dinheiro tem na conta"
          />
          <EditableMetricCard
            accent="blue"
            icon={<Calendar size={28} />}
            label="Início do Período"
            value={`Dia ${settings.periodStartDay}`}
            inputValue={settings.periodStartDay}
            onChange={(value) => updateSetting('periodStartDay', Math.min(28, Math.max(1, Math.trunc(value || 1))))}
            inputLabel="Dia de início do ciclo"
            min={1}
            max={28}
            step={1}
          />
          <EditableMetricCard
            accent="orange"
            icon={<DollarSign size={28} />}
            label="Custos Fixos"
            value={formatCurrency(settings.fixedCosts)}
            inputValue={settings.fixedCosts}
            onChange={(value) => updateSetting('fixedCosts', value)}
            inputLabel="Custos fixos totais"
          />
          <EditableMetricCard
            accent="teal"
            icon={<TrendingUp size={28} />}
            label="Meta de Economia"
            value={formatCurrency(settings.savingsGoal)}
            inputValue={settings.savingsGoal}
            onChange={(value) => updateSetting('savingsGoal', value)}
            inputLabel="Quanto quero economizar"
          />
        </section>

        <section className="metric-grid" aria-label="Indicadores calculados">
          <CalculatedCard
            tone="blue"
            icon={<Calendar size={26} />}
            label="Limite Diário Calculado"
            value={formatCurrency(dailyLimit)}
            description="Baseado no saldo, custos fixos e meta"
          />
          <CalculatedCard
            tone={surplusAccumulated >= 0 ? 'green' : 'red'}
            icon={<TrendingUp size={26} />}
            label="Surplus Acumulado"
            value={formatCurrency(surplusAccumulated)}
            description={surplusAccumulated >= 0 ? 'Dentro do orçamento' : 'Orçamento excedido'}
          />
          <CalculatedCard
            tone={remainingToday >= 0 ? 'emerald' : 'red'}
            icon={<DollarSign size={26} />}
            label="Disponível Hoje"
            value={formatCurrency(Math.max(0, availableToday))}
            description={`Gasto hoje: ${formatCurrency(spentToday)} | Restante: ${formatCurrency(remainingToday)}`}
          />
          <CalculatedCard
            tone="indigo"
            icon={<Calendar size={26} />}
            label="Período Atual"
            value={`${formatPeriodDate(period.start)} - ${formatPeriodDate(period.end)}`}
            description={`${period.daysRemaining} dias restantes`}
          />
        </section>

        <section className="main-grid">
          <article className="panel chart-panel">
            <h2>Visão Geral do Mês</h2>
            <div className="chart-wrapper">
              {chartData.length === 0 ? (
                <div className="empty-chart-ring">
                  <span>Informe o saldo para iniciar</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={390}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={136}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatCurrency(Number(value))}`}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="chart-summary">
              <MiniTotal label="Gasto" value={totalSpent} className="red" />
              <MiniTotal label="Comprometido" value={settings.fixedCosts} className="orange" />
              <MiniTotal label="Disponível" value={availableForPeriod} className="green" />
            </div>
          </article>

          <article className="panel transactions-panel">
            <h2>Transações do Período</h2>
            <label className={`upload-zone ${isProcessing ? 'processing' : ''}`} onDrop={onDrop} onDragOver={onDragOver}>
              <Upload size={40} />
              <strong>{isProcessing ? 'Lendo comprovante...' : 'Clique para fazer upload ou arraste o PDF'}</strong>
              <span>Comprovante PIX em formato PDF</span>
              <input type="file" accept="application/pdf" onChange={onFileInputChange} disabled={isProcessing} />
            </label>

            <div className="transaction-list">
              {periodTransactions.length === 0 ? (
                <div className="empty-state">
                  <FileText size={46} />
                  <strong>Nenhuma transação registrada</strong>
                  <span>Faça upload de comprovantes PIX para começar</span>
                </div>
              ) : (
                periodTransactions
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div className="transaction-item" key={transaction.id}>
                      <div className="transaction-icon"><FileText size={18} /></div>
                      <div className="transaction-body">
                        <strong>{transaction.recipient}</strong>
                        <span>{formatDateTime(transaction.date)}</span>
                        {transaction.controlNumber && <small>{transaction.controlNumber}</small>}
                      </div>
                      <div className="transaction-value">- {formatCurrency(transaction.value)}</div>
                      <button type="button" onClick={() => removeTransaction(transaction.id)} aria-label="Remover transação">×</button>
                    </div>
                  ))
              )}
            </div>
          </article>
        </section>

        <section className="panel summary-panel">
          <h2>Resumo do Período</h2>
          <div className="summary-grid">
            <MiniTotal label="Orçamento do Período" value={dailyLimit * period.daysInPeriod} />
            <MiniTotal label="Disponível até Hoje" value={budgetUpToToday} className="blue" />
            <MiniTotal label="Orçamento Disponível" value={availableBudget} className="purple" />
            <div className="summary-item">
              <span>Total de Transações</span>
              <strong>{periodTransactions.length}</strong>
            </div>
            <div className="summary-item">
              <span>Dias no Período</span>
              <strong>{period.daysInPeriod} dias</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

interface EditableMetricCardProps {
  accent: 'purple' | 'blue' | 'orange' | 'teal'
  icon: ReactNode
  label: string
  value: string
  inputLabel: string
  inputValue: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

function EditableMetricCard({ accent, icon, label, value, inputLabel, inputValue, onChange, min, max, step = 0.01 }: EditableMetricCardProps) {
  return (
    <article className="config-card">
      <div className="card-heading">
        <div className={`icon-box ${accent}`}>{icon}</div>
        <div>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      </div>
      <label className="sr-only">{inputLabel}</label>
      <input
        type="number"
        value={inputValue}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
      />
    </article>
  )
}

interface CalculatedCardProps {
  tone: 'blue' | 'green' | 'emerald' | 'indigo' | 'red'
  icon: ReactNode
  label: string
  value: string
  description: string
}

function CalculatedCard({ tone, icon, label, value, description }: CalculatedCardProps) {
  return (
    <article className={`calculated-card ${tone}`}>
      <div className="card-heading compact">
        <div className="solid-icon">{icon}</div>
        <div>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      </div>
      <p>{description}</p>
    </article>
  )
}

function MiniTotal({ label, value, className = '' }: { label: string; value: number; className?: string }) {
  return (
    <div className={`summary-item ${className}`}>
      <span>{label}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  )
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Ocorreu um erro inesperado.'
}
