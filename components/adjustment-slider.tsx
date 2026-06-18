'use client'

import type { AdjustmentConfig } from '@/lib/editor-types'

type Props = {
  config: AdjustmentConfig
  value: number
  onChange: (value: number) => void
  onReset: () => void
}

export function AdjustmentSlider({ config, value, onChange, onReset }: Props) {
  const { label, min, max, step, unit, neutral } = config
  const pct = ((value - min) / (max - min)) * 100
  const changed = value !== neutral

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:text-primary"
          aria-label={`${label}をリセット`}
        >
          {label}
        </button>
        <span
          className={`font-mono text-xs tabular-nums ${
            changed ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {step < 1 ? value.toFixed(1) : value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="editor-range"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
    </div>
  )
}
