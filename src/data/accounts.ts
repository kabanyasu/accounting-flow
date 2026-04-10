import type { AccountType } from '../types/accounting'

export const ACCOUNTS: AccountType[] = [
  // 資産
  { id: 'cash', name: '現金', category: 'asset', normalBalance: 'debit', displayOrder: 1 },
  { id: 'accounts_receivable', name: '売掛金', category: 'asset', normalBalance: 'debit', displayOrder: 2 },
  { id: 'merchandise', name: '商品', category: 'asset', normalBalance: 'debit', displayOrder: 3 },
  { id: 'equipment', name: '備品', category: 'asset', normalBalance: 'debit', displayOrder: 4 },
  { id: 'buildings', name: '建物', category: 'asset', normalBalance: 'debit', displayOrder: 5 },
  // 負債
  { id: 'accounts_payable', name: '買掛金', category: 'liability', normalBalance: 'credit', displayOrder: 10 },
  { id: 'borrowings', name: '借入金', category: 'liability', normalBalance: 'credit', displayOrder: 11 },
  { id: 'accrued_expenses', name: '未払金', category: 'liability', normalBalance: 'credit', displayOrder: 12 },
  // 純資産
  { id: 'capital', name: '資本金', category: 'equity', normalBalance: 'credit', displayOrder: 20 },
  { id: 'retained_earnings', name: '繰越利益剰余金', category: 'equity', normalBalance: 'credit', displayOrder: 21 },
  // 収益
  { id: 'sales', name: '売上高', category: 'revenue', normalBalance: 'credit', displayOrder: 30 },
  { id: 'interest_income', name: '受取利息', category: 'revenue', normalBalance: 'credit', displayOrder: 31 },
  // 費用
  { id: 'cost_of_sales', name: '売上原価', category: 'expense', normalBalance: 'debit', displayOrder: 40 },
  { id: 'salary', name: '給料', category: 'expense', normalBalance: 'debit', displayOrder: 41 },
  { id: 'rent', name: '家賃', category: 'expense', normalBalance: 'debit', displayOrder: 42 },
  { id: 'misc_expense', name: '雑費', category: 'expense', normalBalance: 'debit', displayOrder: 43 },
]

export const ACCOUNT_MAP = Object.fromEntries(ACCOUNTS.map(a => [a.id, a]))
