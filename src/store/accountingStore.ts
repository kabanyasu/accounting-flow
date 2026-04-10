import { create } from 'zustand'
import type {
  Transaction,
  JournalEntry,
  AccountBalance,
  FinancialStatements,
  AnimationPhase,
  AnimationSpeed,
} from '../types/accounting'
import { ACCOUNTS, ACCOUNT_MAP } from '../data/accounts'
import { TEMPLATES } from '../data/templates'

interface AccountingState {
  transactions: Transaction[]
  journalEntries: JournalEntry[]
  balances: Record<string, AccountBalance>
  financialStatements: FinancialStatements
  animationPhase: AnimationPhase
  animationSpeed: AnimationSpeed
  activeEntryId: string | null

  addTransaction: (templateId: string, amount: number) => void
  setAnimationSpeed: (speed: AnimationSpeed) => void
  reset: () => void
}

function buildFinancialStatements(balances: Record<string, AccountBalance>): FinancialStatements {
  const assets = ACCOUNTS.filter(a => a.category === 'asset').map(a => ({
    accountId: a.id,
    name: a.name,
    amount: balances[a.id]?.balance ?? 0,
  }))
  const liabilities = ACCOUNTS.filter(a => a.category === 'liability').map(a => ({
    accountId: a.id,
    name: a.name,
    amount: balances[a.id]?.balance ?? 0,
  }))

  // 収益・費用から当期純利益を計算して純資産に加算
  const revenues = ACCOUNTS.filter(a => a.category === 'revenue').map(a => ({
    accountId: a.id,
    name: a.name,
    amount: balances[a.id]?.balance ?? 0,
  }))
  const expenses = ACCOUNTS.filter(a => a.category === 'expense').map(a => ({
    accountId: a.id,
    name: a.name,
    amount: balances[a.id]?.balance ?? 0,
  }))
  const totalRevenues = revenues.reduce((s, r) => s + r.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netIncome = totalRevenues - totalExpenses

  const equityAccounts = ACCOUNTS.filter(a => a.category === 'equity').map(a => ({
    accountId: a.id,
    name: a.name,
    amount: balances[a.id]?.balance ?? 0,
  }))
  const equityWithIncome = [
    ...equityAccounts,
    { accountId: 'net_income', name: '当期純利益', amount: netIncome },
  ].filter(e => e.amount !== 0)

  const totalAssets = assets.reduce((s, a) => s + a.amount, 0)
  const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0)
  const totalEquity = equityWithIncome.reduce((s, e) => s + e.amount, 0)

  return {
    balanceSheet: {
      assets: assets.filter(a => a.amount !== 0),
      liabilities: liabilities.filter(l => l.amount !== 0),
      equity: equityWithIncome,
      totalAssets,
      totalLiabilities,
      totalEquity,
    },
    incomeStatement: {
      revenues: revenues.filter(r => r.amount !== 0),
      expenses: expenses.filter(e => e.amount !== 0),
      totalRevenues,
      totalExpenses,
      netIncome,
    },
  }
}

const initialBalances = (): Record<string, AccountBalance> =>
  Object.fromEntries(
    ACCOUNTS.map(a => [a.id, { accountId: a.id, entries: [], debitTotal: 0, creditTotal: 0, balance: 0 }])
  )

let entryCounter = 0

export const useAccountingStore = create<AccountingState>((set, get) => ({
  transactions: [],
  journalEntries: [],
  balances: initialBalances(),
  financialStatements: buildFinancialStatements(initialBalances()),
  animationPhase: 'idle',
  animationSpeed: 'normal',
  activeEntryId: null,

  addTransaction: (templateId, amount) => {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (!template) return

    const id = `entry_${++entryCounter}`
    const date = new Date().toLocaleDateString('ja-JP')

    const transaction: Transaction = {
      id: `txn_${entryCounter}`,
      templateId,
      description: template.name,
      amount,
      date,
    }

    const journalEntry: JournalEntry = {
      id,
      transactionId: transaction.id,
      description: template.name,
      lines: template.lines.map(l => ({
        accountId: l.accountId,
        side: l.side,
        amount: Math.round(amount * l.ratio),
      })),
      date,
    }

    const speedMs: Record<AnimationSpeed, number> = {
      slow: 800, normal: 400, fast: 150, instant: 0,
    }
    const speed = get().animationSpeed
    const delay = speedMs[speed]

    // Phase 1: journalizing
    set(s => ({
      transactions: [...s.transactions, transaction],
      journalEntries: [...s.journalEntries, journalEntry],
      animationPhase: 'journalizing',
      activeEntryId: id,
    }))

    if (delay === 0) {
      // instant: skip animation
      const newBalances = applyEntry(get().balances, journalEntry)
      set({
        balances: newBalances,
        financialStatements: buildFinancialStatements(newBalances),
        animationPhase: 'complete',
      })
      setTimeout(() => set({ animationPhase: 'idle' }), 300)
      return
    }

    setTimeout(() => {
      // Phase 2: posting to ledger
      set({ animationPhase: 'posting' })
      const newBalances = applyEntry(get().balances, journalEntry)
      set({ balances: newBalances })

      setTimeout(() => {
        // Phase 3: financial statements
        set({
          animationPhase: 'financial_stmt',
          financialStatements: buildFinancialStatements(newBalances),
        })

        setTimeout(() => {
          set({ animationPhase: 'complete' })
          setTimeout(() => set({ animationPhase: 'idle' }), delay)
        }, delay * 2)
      }, delay * 2)
    }, delay * 2)
  },

  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  reset: () => set({
    transactions: [],
    journalEntries: [],
    balances: initialBalances(),
    financialStatements: buildFinancialStatements(initialBalances()),
    animationPhase: 'idle',
    activeEntryId: null,
  }),
}))

function applyEntry(
  prev: Record<string, AccountBalance>,
  entry: JournalEntry
): Record<string, AccountBalance> {
  const next = { ...prev }
  for (const line of entry.lines) {
    const acc = ACCOUNT_MAP[line.accountId]
    if (!acc) continue
    const bal = { ...next[line.accountId] }
    bal.entries = [...bal.entries, { journalEntryId: entry.id, side: line.side, amount: line.amount }]
    bal.debitTotal = bal.entries.filter(e => e.side === 'debit').reduce((s, e) => s + e.amount, 0)
    bal.creditTotal = bal.entries.filter(e => e.side === 'credit').reduce((s, e) => s + e.amount, 0)
    bal.balance = acc.normalBalance === 'debit'
      ? bal.debitTotal - bal.creditTotal
      : bal.creditTotal - bal.debitTotal
    next[line.accountId] = bal
  }
  return next
}
