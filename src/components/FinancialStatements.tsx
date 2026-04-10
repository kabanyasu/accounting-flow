import { motion, AnimatePresence } from 'framer-motion'
import { useAccountingStore } from '../store/accountingStore'

function CountUp({ value, isActive }: { value: number; isActive: boolean }) {
  return (
    <motion.span
      key={value}
      initial={isActive ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="font-mono tabular-nums"
    >
      ¥{value.toLocaleString()}
    </motion.span>
  )
}

export function FinancialStatements() {
  const { financialStatements: fs, animationPhase, journalEntries, activeEntryId } = useAccountingStore()

  const isActive = animationPhase === 'financial_stmt'
  const activeEntry = journalEntries.find(e => e.id === activeEntryId)
  const activeAccountIds = new Set(activeEntry?.lines.map(l => l.accountId) ?? [])

  const { balanceSheet: bs, incomeStatement: is } = fs

  const isBalanced = bs.totalAssets === bs.totalLiabilities + bs.totalEquity

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">

      {/* 損益計算書 */}
      <div className={`rounded-xl border p-4 transition-all ${isActive ? 'border-emerald-500 shadow-lg shadow-emerald-900/30' : 'border-slate-700'}`}>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          損益計算書（P/L）
        </h3>

        {/* 収益 */}
        <div className="mb-2">
          <div className="text-xs text-slate-500 mb-1">収益</div>
          <AnimatePresence>
            {is.revenues.map(r => (
              <motion.div
                key={r.accountId}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex justify-between text-sm py-0.5 px-2 rounded transition-colors ${
                  isActive && activeAccountIds.has(r.accountId) ? 'bg-emerald-950/60 text-emerald-300' : 'text-slate-300'
                }`}
              >
                <span>{r.name}</span>
                <CountUp value={r.amount} isActive={isActive && activeAccountIds.has(r.accountId)} />
              </motion.div>
            ))}
          </AnimatePresence>
          {is.revenues.length > 0 && (
            <div className="flex justify-between text-sm font-bold border-t border-slate-700 mt-1 pt-1 text-slate-200 px-2">
              <span>収益合計</span>
              <CountUp value={is.totalRevenues} isActive={isActive} />
            </div>
          )}
        </div>

        {/* 費用 */}
        <div className="mb-2">
          <div className="text-xs text-slate-500 mb-1">費用</div>
          <AnimatePresence>
            {is.expenses.map(e => (
              <motion.div
                key={e.accountId}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex justify-between text-sm py-0.5 px-2 rounded transition-colors ${
                  isActive && activeAccountIds.has(e.accountId) ? 'bg-rose-950/60 text-rose-300' : 'text-slate-300'
                }`}
              >
                <span>{e.name}</span>
                <CountUp value={e.amount} isActive={isActive && activeAccountIds.has(e.accountId)} />
              </motion.div>
            ))}
          </AnimatePresence>
          {is.expenses.length > 0 && (
            <div className="flex justify-between text-sm font-bold border-t border-slate-700 mt-1 pt-1 text-slate-200 px-2">
              <span>費用合計</span>
              <CountUp value={is.totalExpenses} isActive={isActive} />
            </div>
          )}
        </div>

        {/* 当期純利益 */}
        {(is.totalRevenues > 0 || is.totalExpenses > 0) && (
          <div className={`flex justify-between text-sm font-bold border-t-2 border-slate-600 mt-2 pt-2 px-2 rounded ${
            is.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            <span>当期純利益</span>
            <CountUp value={is.netIncome} isActive={isActive} />
          </div>
        )}

        {is.revenues.length === 0 && is.expenses.length === 0 && (
          <div className="text-slate-600 text-xs text-center py-2">収益・費用なし</div>
        )}
      </div>

      {/* 貸借対照表 */}
      <div className={`rounded-xl border p-4 transition-all ${
        isActive ? (isBalanced && bs.totalAssets > 0 ? 'border-emerald-500 shadow-lg shadow-emerald-900/30' : 'border-yellow-500 shadow-lg shadow-yellow-900/20') : 'border-slate-700'
      }`}>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-yellow-400 animate-pulse' : 'bg-slate-600'}`} />
          貸借対照表（B/S）
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* 資産 */}
          <div>
            <div className="text-xs text-blue-400 font-bold mb-1">資産の部</div>
            <AnimatePresence>
              {bs.assets.map(a => (
                <motion.div
                  key={a.accountId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex justify-between text-xs py-0.5 px-1 rounded ${
                    isActive && activeAccountIds.has(a.accountId) ? 'bg-blue-950/60 text-blue-300' : 'text-slate-300'
                  }`}
                >
                  <span className="truncate mr-1">{a.name}</span>
                  <span className="font-mono shrink-0"><CountUp value={a.amount} isActive={isActive && activeAccountIds.has(a.accountId)} /></span>
                </motion.div>
              ))}
            </AnimatePresence>
            {bs.assets.length > 0 && (
              <div className="flex justify-between text-xs font-bold border-t border-slate-700 mt-1 pt-1 text-blue-300 px-1">
                <span>資産合計</span>
                <CountUp value={bs.totalAssets} isActive={isActive} />
              </div>
            )}
            {bs.assets.length === 0 && <div className="text-slate-600 text-xs">なし</div>}
          </div>

          {/* 負債・純資産 */}
          <div>
            <div className="text-xs text-rose-400 font-bold mb-1">負債の部</div>
            <AnimatePresence>
              {bs.liabilities.map(l => (
                <motion.div
                  key={l.accountId}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex justify-between text-xs py-0.5 px-1 rounded ${
                    isActive && activeAccountIds.has(l.accountId) ? 'bg-rose-950/60 text-rose-300' : 'text-slate-300'
                  }`}
                >
                  <span className="truncate mr-1">{l.name}</span>
                  <CountUp value={l.amount} isActive={isActive && activeAccountIds.has(l.accountId)} />
                </motion.div>
              ))}
            </AnimatePresence>
            {bs.liabilities.length === 0 && <div className="text-slate-600 text-xs mb-2">なし</div>}

            <div className="text-xs text-emerald-400 font-bold mt-2 mb-1">純資産の部</div>
            <AnimatePresence>
              {bs.equity.map(e => (
                <motion.div
                  key={e.accountId}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex justify-between text-xs py-0.5 px-1 rounded ${
                    isActive && activeAccountIds.has(e.accountId) ? 'bg-emerald-950/60 text-emerald-300' : 'text-slate-300'
                  }`}
                >
                  <span className="truncate mr-1">{e.name}</span>
                  <CountUp value={e.amount} isActive={isActive && activeAccountIds.has(e.accountId)} />
                </motion.div>
              ))}
            </AnimatePresence>

            {(bs.liabilities.length > 0 || bs.equity.length > 0) && (
              <div className="flex justify-between text-xs font-bold border-t border-slate-700 mt-1 pt-1 text-rose-300 px-1">
                <span>負債・純資産合計</span>
                <CountUp value={bs.totalLiabilities + bs.totalEquity} isActive={isActive} />
              </div>
            )}
          </div>
        </div>

        {/* バランス確認 */}
        {bs.totalAssets > 0 && (
          <motion.div
            animate={isBalanced ? { opacity: [0.7, 1, 0.7] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`mt-3 text-center text-xs font-bold py-1.5 rounded-lg ${
              isBalanced ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700' : 'bg-rose-950/60 text-rose-400 border border-rose-700'
            }`}
          >
            {isBalanced ? '✓ 貸借一致' : '⚠ 貸借不一致'}
          </motion.div>
        )}
      </div>
    </div>
  )
}
