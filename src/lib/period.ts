import type { Transaction } from '../types'

export interface PeriodInfo {
  start: Date
  end: Date
  daysInPeriod: number
  daysPassed: number
  daysRemaining: number
}

const MS_IN_DAY = 1000 * 60 * 60 * 24

export function getFinancialPeriod(periodStartDay: number, referenceDate = new Date()): PeriodInfo {
  const safeDay = Math.min(28, Math.max(1, Math.trunc(periodStartDay || 1)))
  const today = new Date(referenceDate)

  const start = today.getDate() >= safeDay
    ? new Date(today.getFullYear(), today.getMonth(), safeDay)
    : new Date(today.getFullYear(), today.getMonth() - 1, safeDay)

  const end = today.getDate() >= safeDay
    ? new Date(today.getFullYear(), today.getMonth() + 1, safeDay, 0, 0, 0, -1)
    : new Date(today.getFullYear(), today.getMonth(), safeDay, 0, 0, 0, -1)

  const daysInPeriod = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / MS_IN_DAY))
  const daysPassed = Math.min(
    daysInPeriod,
    Math.max(1, Math.floor((startOfDay(today).getTime() - startOfDay(start).getTime()) / MS_IN_DAY) + 1),
  )

  return {
    start,
    end,
    daysInPeriod,
    daysPassed,
    daysRemaining: Math.max(0, daysInPeriod - daysPassed),
  }
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function transactionsInRange(transactions: Transaction[], start: Date, end: Date): Transaction[] {
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    return date >= start && date <= end
  })
}

export function sumTransactions(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.value, 0)
}
