import { motion } from 'framer-motion'
import { useAccountingStore } from '../store/accountingStore'
import { ACCOUNTS } from '../data/accounts'

export function LedgerView() {
  const { balances, animationPhase, journalEntries, activeEntryId } = useAccountingStore()

  // アクティブな仕訳で影響を受ける勘定科目ID
  const activeEntry = journalEntries.find(e => e.id === activeEntryId)
  const activeAccountIds = new Set(activeEntry?.lines.map(l => l.accountId) ?? [])

  const activeAccounts = ACCOUNTS.filter(a => balances[a.id]?.entries.length > 0)

  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-lg font-bold text-slate-100 border-b border-slate-700 pb-2 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${animationPhase === 'posting' ? 'bg-yellow-400 animate-pulse' : 'bg-slate-600'}`} />
        総勘定元帳（T勘定）
      </h2>

      {activeAccounts.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
          記帳するとT勘定が更新されます
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {activeAccounts.map(account => {
            const bal = balances[account.id]
            const isActive = (animationPhase === 'posting') && activeAccountIds.has(account.id)

            return (
              <motion.div
                key={account.id}
                animate={isActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`rounded-lg border overflow-hidden transition-colors ${
                  isActive
                    ? 'border-yellow-500 shadow-lg shadow-yellow-900/30'
                    : 'border-slate-700'
                }`}
              >
                {/* 勘定科目名 */}
                <div className={`px-2 py-1 text-center text-xs font-bold border-b ${
                  isActive ? 'bg-yellow-950/60 border-yellow-700 text-yellow-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {account.name}
                </div>

                {/* T字型 */}
                <div className="grid grid-cols-2 divide-x divide-slate-700 bg-slate-900/50">
                  <div className="p-1.5">
                    <div className="text-xs text-blue-500 text-center mb-1">借方</div>
                    {bal.entries.filter(e => e.side === 'debit').map((e, i) => (
                      <motion.div
                        key={`${e.journalEntryId}-${i}`}
                        initial={e.journalEntryId === activeEntryId ? { opacity: 0, x: -8 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-right font-mono text-xs text-slate-300 py-0.5"
                      >
                        {e.amount.toLocaleString()}
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-1.5">
                    <div className="text-xs text-rose-500 text-center mb-1">貸方</div>
                    {bal.entries.filter(e => e.side === 'credit').map((e, i) => (
                      <motion.div
                        key={`${e.journalEntryId}-${i}`}
                        initial={e.journalEntryId === activeEntryId ? { opacity: 0, x: 8 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-right font-mono text-xs text-slate-300 py-0.5"
                      >
                        {e.amount.toLocaleString()}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 残高 */}
                <div className={`px-2 py-1 text-right text-xs font-mono border-t font-bold ${
                  isActive ? 'border-yellow-700 text-yellow-300' : 'border-slate-700 text-slate-400'
                }`}>
                  残高: {bal.balance.toLocaleString()}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
