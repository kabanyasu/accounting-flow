import { TransactionInput } from './components/TransactionInput'
import { JournalView } from './components/JournalView'
import { LedgerView } from './components/LedgerView'
import { FinancialStatements } from './components/FinancialStatements'
import { FlowIndicator } from './components/FlowIndicator'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-indigo-400 tracking-tight">AccountingFlow</span>
          <span className="text-xs bg-indigo-950 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-full">MVP</span>
        </div>
        <span className="text-slate-500 text-sm ml-2">取引 → 仕訳 → 財務諸表 の流れを可視化</span>
      </header>

      {/* Flow indicator */}
      <FlowIndicator />

      {/* Main content */}
      <main className="flex-1 grid grid-cols-[280px_1fr_1fr_300px] gap-0 divide-x divide-slate-800 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

        {/* Col 1: Transaction Input */}
        <div className="p-4 overflow-y-auto bg-slate-900/50">
          <TransactionInput />
        </div>

        {/* Col 2: Journal */}
        <div className="p-4 overflow-y-auto">
          <JournalView />
        </div>

        {/* Col 3: Ledger */}
        <div className="p-4 overflow-y-auto">
          <LedgerView />
        </div>

        {/* Col 4: Financial Statements */}
        <div className="p-4 overflow-y-auto bg-slate-900/30">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            財務諸表
          </h2>
          <FinancialStatements />
        </div>
      </main>
    </div>
  )
}
