import type { TransactionTemplate } from '../types/accounting'

export const TEMPLATES: TransactionTemplate[] = [
  {
    id: 'cash_sale',
    name: '現金売上',
    description: '商品を現金で販売した',
    defaultAmount: 100000,
    lines: [
      { accountId: 'cash', side: 'debit', ratio: 1 },
      { accountId: 'sales', side: 'credit', ratio: 1 },
    ],
  },
  {
    id: 'credit_sale',
    name: '掛け売上',
    description: '商品を掛けで販売した',
    defaultAmount: 200000,
    lines: [
      { accountId: 'accounts_receivable', side: 'debit', ratio: 1 },
      { accountId: 'sales', side: 'credit', ratio: 1 },
    ],
  },
  {
    id: 'collect_receivable',
    name: '売掛金回収',
    description: '売掛金を現金で回収した',
    defaultAmount: 200000,
    lines: [
      { accountId: 'cash', side: 'debit', ratio: 1 },
      { accountId: 'accounts_receivable', side: 'credit', ratio: 1 },
    ],
  },
  {
    id: 'buy_equipment',
    name: '備品購入',
    description: '備品を現金で購入した',
    defaultAmount: 50000,
    lines: [
      { accountId: 'equipment', side: 'debit', ratio: 1 },
      { accountId: 'cash', side: 'credit', ratio: 1 },
    ],
  },
  {
    id: 'pay_salary',
    name: '給料支払',
    description: '従業員に給料を支払った',
    defaultAmount: 300000,
    lines: [
      { accountId: 'salary', side: 'debit', ratio: 1 },
      { accountId: 'cash', side: 'credit', ratio: 1 },
    ],
  },
  {
    id: 'pay_rent',
    name: '家賃支払',
    description: '事務所の家賃を支払った',
    defaultAmount: 100000,
    lines: [
      { accountId: 'rent', side: 'debit', ratio: 1 },
      { accountId: 'cash', side: 'credit', ratio: 1 },
    ],
  },
  {
    id: 'borrow_money',
    name: '借入',
    description: '銀行から借入をした（現金受取）',
    defaultAmount: 1000000,
    lines: [
      { accountId: 'cash', side: 'debit', ratio: 1 },
      { accountId: 'borrowings', side: 'credit', ratio: 1 },
    ],
  },
  {
    id: 'invest_capital',
    name: '資本金払込',
    description: '株主から出資を受けた',
    defaultAmount: 1000000,
    lines: [
      { accountId: 'cash', side: 'debit', ratio: 1 },
      { accountId: 'capital', side: 'credit', ratio: 1 },
    ],
  },
]
