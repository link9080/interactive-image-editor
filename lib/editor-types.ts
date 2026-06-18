export type Adjustments = {
  brightness: number
  contrast: number
  saturate: number
  grayscale: number
  sepia: number
  hueRotate: number
  blur: number
  invert: number
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  invert: 0,
}

export type AdjustmentConfig = {
  key: keyof Adjustments
  label: string
  min: number
  max: number
  step: number
  unit: string
  /** value that represents "no change" for reset-to-default indicators */
  neutral: number
}

export const ADJUSTMENT_CONFIGS: AdjustmentConfig[] = [
  { key: 'brightness', label: '明るさ', min: 0, max: 200, step: 1, unit: '%', neutral: 100 },
  { key: 'contrast', label: 'コントラスト', min: 0, max: 200, step: 1, unit: '%', neutral: 100 },
  { key: 'saturate', label: '彩度', min: 0, max: 200, step: 1, unit: '%', neutral: 100 },
  { key: 'grayscale', label: 'グレースケール', min: 0, max: 100, step: 1, unit: '%', neutral: 0 },
  { key: 'sepia', label: 'セピア', min: 0, max: 100, step: 1, unit: '%', neutral: 0 },
  { key: 'hueRotate', label: '色相', min: 0, max: 360, step: 1, unit: '°', neutral: 0 },
  { key: 'blur', label: 'ぼかし', min: 0, max: 12, step: 0.1, unit: 'px', neutral: 0 },
  { key: 'invert', label: '色反転', min: 0, max: 100, step: 1, unit: '%', neutral: 0 },
]

export type Preset = {
  name: string
  adjustments: Adjustments
}

export const PRESETS: Preset[] = [
  { name: 'オリジナル', adjustments: { ...DEFAULT_ADJUSTMENTS } },
  {
    name: 'ノワール',
    adjustments: { ...DEFAULT_ADJUSTMENTS, grayscale: 100, contrast: 140, brightness: 95 },
  },
  {
    name: 'ヴィンテージ',
    adjustments: { ...DEFAULT_ADJUSTMENTS, sepia: 60, contrast: 95, brightness: 105, saturate: 120 },
  },
  {
    name: 'ウォーム',
    adjustments: { ...DEFAULT_ADJUSTMENTS, sepia: 30, saturate: 135, brightness: 104 },
  },
  {
    name: 'クール',
    adjustments: { ...DEFAULT_ADJUSTMENTS, hueRotate: 210, saturate: 115, brightness: 102 },
  },
  {
    name: 'ビビッド',
    adjustments: { ...DEFAULT_ADJUSTMENTS, saturate: 185, contrast: 120 },
  },
  {
    name: 'フェード',
    adjustments: { ...DEFAULT_ADJUSTMENTS, contrast: 84, brightness: 110, saturate: 78 },
  },
  {
    name: 'モノクロ',
    adjustments: { ...DEFAULT_ADJUSTMENTS, grayscale: 100, sepia: 12, brightness: 102 },
  },
]

export function buildFilterString(a: Adjustments): string {
  return [
    `brightness(${a.brightness}%)`,
    `contrast(${a.contrast}%)`,
    `saturate(${a.saturate}%)`,
    `grayscale(${a.grayscale}%)`,
    `sepia(${a.sepia}%)`,
    `hue-rotate(${a.hueRotate}deg)`,
    `blur(${a.blur}px)`,
    `invert(${a.invert}%)`,
  ].join(' ')
}

export function adjustmentsEqual(a: Adjustments, b: Adjustments): boolean {
  return (Object.keys(a) as (keyof Adjustments)[]).every((k) => a[k] === b[k])
}
