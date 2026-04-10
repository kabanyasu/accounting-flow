import { AnimatePresence, motion } from 'framer-motion'
import { useAccountingStore } from '../store/accountingStore'
import { ACCOUNT_MAP } from '../data/accounts'

export function JournalView() {
  const { journalEntries, animationPhase, activeEntryId } = useAccountingStore()

  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-lg font-bold text-slate-100 border-b border-slate-700 pb-2 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${animationPhase === 'journalizing' ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
        仕訳帳
      </h2>

      {journalEntries.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
          取引を入力すると仕訳が表示されます
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
        <AnimatePresence>
          {[...journalEntries].reverse().map(entry => {
            const isActive = entry.id === activeEntryId && animationPhase === 'journalizing'
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className={`rounded-lg border p-3 transition-colors ${
                  isActive
                    ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-900/30'
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <div className="text-xs text-slate-500 mb-1.5 flex justify-between">
                  <span>{entry.description}</span>
                  <span>{entry.date}</span>
                </div>
                {entry.lines.map((line, i) => (
                  <div key={i} className={`flex items-center justify-between text-sm py-0.5 ${line.side === 'credit' ? 'pl-4' : ''}`}>
                    <span className={line.side === 'debit' ? 'text-blue-400' : 'text-rose-400'}>
                      {line.side === 'debit' ? '（借）' : '（貸）'}
                      {ACCOUNT_MAP[line.accountId]?.name ?? line.accountId}
                    </span>
                    <span className="font-mono text-xs text-slate-300">
                      ¥{line.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
