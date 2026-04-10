export type AccountCategory = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
export type BalanceSide = 'debit' | 'credit'

export interface AccountType {
  id: string
  name: string
  category: AccountCategory
  normalBalance: BalanceSide
  displayOrder: number
}

export interface TransactionTemplate {
  id: string
  name: string
  description: string
  defaultAmount: number
  lines: Array<{ accountId: string; side: BalanceSide; ratio: number }>
}

export interface Transaction {
  id: string
  templateId: string
  description: string
  amount: number
  date: string
}

export interface JournalEntryLine {
  accountId: string
  side: BalanceSide
  amount: number
}

export interface JournalEntry {
  id: string
  transactionId: string
  description: string
  lines: JournalEntryLine[]
  date: string
}

export interface LedgerEntry {
  journalEntryId: string
  side: BalanceSide
  amount: number
}

export interface AccountBalance {
  accountId: string
  entries: LedgerEntry[]
  debitTotal: number
  creditTotal: number
  balance: number
}

export interface FinancialStatements {
  balanceSheet: {
    assets: Array<{ accountId: string; name: string; amount: number }>
    liabilities: Array<{ accountId: string; name: string; amount: number }>
    equity: Array<{ accountId: string; name: string; amount: number }>
    totalAssets: number
    totalLiabilities: number
    totalEquity: number
  }
  incomeStatement: {
    revenues: Array<{ accountId: string; name: string; amount: number }>
    expenses: Array<{ accountId: string; name: string; amount: number }>
    totalRevenues: number
    totalExpenses: number
    netIncome: number
  }
}

export type AnimationPhase =
  | 'idle'
  | 'journalizing'
  | 'posting'
  | 'financial_stmt'
  | 'complete'

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'instant'
