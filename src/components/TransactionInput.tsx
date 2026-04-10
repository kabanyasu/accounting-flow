import { useState } from 'react'
import { TEMPLATES } from '../data/templates'
import { ACCOUNT_MAP } from '../data/accounts'
import { useAccountingStore } from '../store/accountingStore'
import type { AnimationSpeed } from '../types/accounting'

export function TransactionInput() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id)
  const [amount, setAmount] = useState<number>(TEMPLATES[0].defaultAmount)
  const { addTransaction, animationPhase, animationSpeed, setAnimationSpeed, reset } = useAccountingStore()

  const isAnimating = animationPhase !== 'idle'
  const tmpl = TEMPLATES.find(t => t.id === selectedTemplate)!

  const handleTemplateChange = (id: string) => {
    setSelectedTemplate(id)
    const t = TEMPLATES.find(t => t.id === id)
    if (t) setAmount(t.defaultAmount)
  }

  const speedLabels: Record<AnimationSpeed, string> = {
    slow: 'ゆっくり', normal: '普通', fast: '速い', instant: '即時',
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-lg font-bold text-slate-100 border-b border-slate-700 pb-2">
        取引を入力
      </h2>

      {/* テンプレート選択 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">取引種別</label>
        <div className="grid grid-cols-2 gap-1.5">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => handleTemplateChange(t.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                selectedTemplate === t.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white'
              }`}
            >
              <div className="font-medium">{t.name}</div>
              <div className="text-xs opacity-70 mt-0.5 truncate">{t.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 金額入力 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">金額（円）</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          step={10000}
          min={1}
        />
        <div className="flex gap-1.5 flex-wrap">
          {[10000, 50000, 100000, 300000, 1000000].map(v => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
            >
              {v.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* 仕訳プレビュー */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="text-xs text-slate-400 mb-2">仕訳プレビュー</div>
        {tmpl.lines.map((line, i) => (
          <div key={i} className="flex items-center justify-between text-sm py-0.5">
            <span className={line.side === 'debit' ? 'text-blue-400' : 'pl-4 text-rose-400'}>
              {line.side === 'debit' ? '（借）' : '（貸）'}
              {ACCOUNT_MAP[line.accountId]?.name ?? line.accountId}
            </span>
            <span className="text-slate-300 font-mono text-xs">
              ¥{(amount * line.ratio).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* 記帳ボタン */}
      <button
        onClick={() => !isAnimating && addTransaction(selectedTemplate, amount)}
        disabled={isAnimating}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          isAnimating
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50 active:scale-95'
        }`}
      >
        {isAnimating ? '記帳中...' : '記帳する →'}
      </button>

      {/* アニメーション速度 */}
      <div className="flex flex-col gap-2 mt-auto">
        <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">アニメーション速度</label>
        <div className="flex gap-1.5">
          {(['slow', 'normal', 'fast', 'instant'] as AnimationSpeed[]).map(s => (
            <button
              key={s}
              onClick={() => setAnimationSpeed(s)}
              className={`flex-1 py-1.5 rounded text-xs transition-all ${
                animationSpeed === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {speedLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={reset}
        disabled={isAnimating}
        className="w-full py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-slate-500 transition-all"
      >
        リセット
      </button>
    </div>
  )
}
