import { motion } from 'framer-motion'
import { useAccountingStore } from '../store/accountingStore'

// 金額を短く表示（万・百万）
function fmt(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 10_000) return `${Math.round(v / 10_000)}万`
  return v.toLocaleString()
}

// 比率に応じた高さのボックス1つ
function SegmentBox({
  label,
  amount,
  ratio,
  colorClass,
  highlight,
  minHeight = 28,
}: {
  label: string
  amount: number
  ratio: number        // 0〜1
  colorClass: string
  highlight?: boolean
  minHeight?: number
}) {
  const height = Math.max(minHeight, Math.round(ratio * 220))
  return (
    <motion.div
      layout
      animate={{ height }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={`relative w-full overflow-hidden border-b border-black/20 last:border-b-0 flex flex-col justify-center px-2 ${colorClass} ${
        highlight ? 'ring-2 ring-white/40 ring-inset z-10' : ''
      }`}
      style={{ height }}
    >
      <div className="text-xs font-medium leading-tight truncate">{label}</div>
      <motion.div
        key={amount}
        initial={highlight ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        className="text-xs font-mono opacity-80"
      >
        ¥{fmt(amount)}
      </motion.div>
    </motion.div>
  )
}

export function FinancialStatements() {
  const { financialStatements: fs, animationPhase, journalEntries, activeEntryId } = useAccountingStore()

  const isActive = animationPhase === 'financial_stmt'
  const activeEntry = journalEntries.find(e => e.id === activeEntryId)
  const activeAccountIds = new Set(activeEntry?.lines.map(l => l.accountId) ?? [])

  const { balanceSheet: bs, incomeStatement: is } = fs
  const isBalanced = bs.totalAssets > 0 && bs.totalAssets === bs.totalLiabilities + bs.totalEquity

  const totalRight = bs.totalLiabilities + bs.totalEquity
  const hasBS = bs.totalAssets > 0
  const hasPL = is.totalRevenues > 0 || is.totalExpenses > 0

  return (
    <div className="flex flex-col gap-5 pb-4">

      {/* ── 貸借対照表 ── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-yellow-400 animate-pulse' : 'bg-slate-600'}`} />
            貸借対照表（B/S）
          </h3>
          {isBalanced && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-emerald-400 font-bold"
            >
              ✓ 一致
            </motion.span>
          )}
        </div>

        {!hasBS && (
          <div className="text-slate-600 text-xs text-center py-6 border border-dashed border-slate-800 rounded-lg">
            記帳するとB/Sが表示されます
          </div>
        )}

        {hasBS && (
          <div className={`rounded-xl overflow-hidden border transition-colors ${
            isActive && isBalanced ? 'border-emerald-500 shadow-lg shadow-emerald-900/30'
            : isActive ? 'border-yellow-500'
            : 'border-slate-700'
          }`}>
            {/* ラベル行 */}
            <div className="grid grid-cols-2 divide-x divide-slate-700 bg-slate-800/80">
              <div className="text-center text-xs text-blue-400 font-bold py-1">資産</div>
              <div className="text-center text-xs text-rose-400 font-bold py-1">負債・純資産</div>
            </div>

            {/* ボックス本体 */}
            <div className="grid grid-cols-2 divide-x divide-slate-700">
              {/* 左：資産 */}
              <div className="flex flex-col">
                {bs.assets.map(a => (
                  <SegmentBox
                    key={a.accountId}
                    label={a.name}
                    amount={a.amount}
                    ratio={bs.totalAssets > 0 ? a.amount / bs.totalAssets : 0}
                    colorClass="bg-blue-900/60 text-blue-200"
                    highlight={isActive && activeAccountIds.has(a.accountId)}
                  />
                ))}
              </div>

              {/* 右：負債 → 純資産 */}
              <div className="flex flex-col">
                {bs.liabilities.map(l => (
                  <SegmentBox
                    key={l.accountId}
                    label={l.name}
                    amount={l.amount}
                    ratio={totalRight > 0 ? l.amount / totalRight : 0}
                    colorClass="bg-rose-900/60 text-rose-200"
                    highlight={isActive && activeAccountIds.has(l.accountId)}
                  />
                ))}
                {bs.equity.map(e => (
                  <SegmentBox
                    key={e.accountId}
                    label={e.name}
                    amount={e.amount}
                    ratio={totalRight > 0 ? e.amount / totalRight : 0}
                    colorClass="bg-emerald-900/60 text-emerald-200"
                    highlight={isActive && activeAccountIds.has(e.accountId)}
                  />
                ))}
              </div>
            </div>

            {/* 合計行 */}
            <div className="grid grid-cols-2 divide-x divide-slate-700 bg-slate-800/80 border-t border-slate-700">
              <div className="text-center text-xs font-mono text-blue-300 py-1">
                ¥{bs.totalAssets.toLocaleString()}
              </div>
              <div className="text-center text-xs font-mono text-rose-300 py-1">
                ¥{totalRight.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 損益計算書 ── */}
      <section>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          損益計算書（P/L）
        </h3>

        {!hasPL && (
          <div className="text-slate-600 text-xs text-center py-6 border border-dashed border-slate-800 rounded-lg">
            記帳するとP/Lが表示されます
          </div>
        )}

        {hasPL && (
          <div className={`rounded-xl overflow-hidden border transition-colors ${
            isActive ? 'border-emerald-500 shadow-lg shadow-emerald-900/30' : 'border-slate-700'
          }`}>
            {/* ラベル行 */}
            <div className="grid grid-cols-2 divide-x divide-slate-700 bg-slate-800/80">
              <div className="text-center text-xs text-emerald-400 font-bold py-1">収益</div>
              <div className="text-center text-xs text-rose-400 font-bold py-1">費用・利益</div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-700">
              {/* 左：収益 */}
              <div className="flex flex-col">
                {is.revenues.map(r => (
                  <SegmentBox
                    key={r.accountId}
                    label={r.name}
                    amount={r.amount}
                    ratio={is.totalRevenues > 0 ? r.amount / is.totalRevenues : 0}
                    colorClass="bg-emerald-900/60 text-emerald-200"
                    highlight={isActive && activeAccountIds.has(r.accountId)}
                  />
                ))}
              </div>

              {/* 右：費用 + 当期純利益 */}
              <div className="flex flex-col">
                {is.expenses.map(e => (
                  <SegmentBox
                    key={e.accountId}
                    label={e.name}
                    amount={e.amount}
                    ratio={is.totalRevenues > 0 ? e.amount / is.totalRevenues : 0}
                    colorClass="bg-rose-900/60 text-rose-200"
                    highlight={isActive && activeAccountIds.has(e.accountId)}
                  />
                ))}
                {is.netIncome > 0 && (
                  <SegmentBox
                    key="net_income"
                    label="当期純利益"
                    amount={is.netIncome}
                    ratio={is.totalRevenues > 0 ? is.netIncome / is.totalRevenues : 0}
                    colorClass="bg-yellow-800/60 text-yellow-200"
                    highlight={isActive}
                  />
                )}
                {is.netIncome < 0 && (
                  <SegmentBox
                    key="net_loss"
                    label="当期純損失"
                    amount={Math.abs(is.netIncome)}
                    ratio={0.15}
                    colorClass="bg-red-900/80 text-red-200"
                    highlight={isActive}
                  />
                )}
              </div>
            </div>

            {/* 合計行 */}
            <div className="grid grid-cols-2 divide-x divide-slate-700 bg-slate-800/80 border-t border-slate-700">
              <div className="text-center text-xs font-mono text-emerald-300 py-1">
                ¥{is.totalRevenues.toLocaleString()}
              </div>
              <div className={`text-center text-xs font-mono py-1 ${is.netIncome >= 0 ? 'text-yellow-300' : 'text-red-400'}`}>
                純利益 ¥{is.netIncome.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
