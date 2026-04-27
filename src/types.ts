export interface Transaction {
  id: string
  date: string
  value: number
  recipient: string
  controlNumber?: string
  sourceFile?: string
  createdAt: string
}

export interface Settings {
  accountBalance: number
  periodStartDay: number
  savingsGoal: number
  fixedCosts: number
}

export interface AppData {
  settings: Settings
  transactions: Transaction[]
}

export interface ParsedPixReceipt {
  date: string
  value: number
  recipient: string
  controlNumber?: string
  rawText: string
}
