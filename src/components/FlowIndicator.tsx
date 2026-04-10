import { motion } from 'framer-motion'
import { useAccountingStore } from '../store/accountingStore'
import type { AnimationPhase } from '../types/accounting'

const PHASES: Array<{ phase: AnimationPhase; label: string; color: string }> = [
  { phase: 'journalizing', label: '仕訳', color: 'bg-blue-500' },
  { phase: 'posting', label: '転記', color: 'bg-yellow-500' },
  { phase: 'financial_stmt', label: '財務諸表', color: 'bg-emerald-500' },
]

export function FlowIndicator() {
  const { animationPhase } = useAccountingStore()

  if (animationPhase === 'idle') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center gap-2 py-2 bg-slate-800/80 border-b border-slate-700"
    >
      {PHASES.map((p, i) => (
        <div key={p.phase} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            animationPhase === p.phase
              ? `${p.color} text-white shadow-lg`
              : animationPhase === 'complete'
              ? 'bg-slate-700 text-slate-400'
              : PHASES.findIndex(x => x.phase === animationPhase) > i
              ? 'bg-slate-700 text-slate-300'
              : 'bg-slate-800 text-slate-600'
          }`}>
            {animationPhase === p.phase && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            {p.label}
          </div>
          {i < PHASES.length - 1 && (
            <span className="text-slate-600 text-xs">→</span>
          )}
        </div>
      ))}
    </motion.div>
  )
}
