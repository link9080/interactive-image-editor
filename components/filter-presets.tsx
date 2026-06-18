'use client'

import { type Adjustments, PRESETS, adjustmentsEqual, buildFilterString } from '@/lib/editor-types'

type Props = {
  thumbSrc: string | null
  current: Adjustments
  onSelect: (a: Adjustments) => void
}

export function FilterPresets({ thumbSrc, current, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PRESETS.map((preset) => {
        const active = adjustmentsEqual(current, preset.adjustments)
        return (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelect({ ...preset.adjustments })}
            className={`group overflow-hidden rounded-md border text-left transition-all ${
              active
                ? 'border-primary ring-2 ring-primary'
                : 'border-border hover:border-primary'
            }`}
          >
            <div className="checkerboard relative aspect-[4/3] w-full overflow-hidden">
              {thumbSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbSrc || '/placeholder.svg'}
                  alt={`${preset.name}のプレビュー`}
                  className="h-full w-full object-cover"
                  style={{ filter: buildFilterString(preset.adjustments) }}
                  crossOrigin="anonymous"
                />
              ) : null}
            </div>
            <span
              className={`block px-2 py-1.5 text-xs font-bold tracking-wide ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground'
              }`}
            >
              {preset.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
