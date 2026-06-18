'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Aperture,
  Download,
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
  Sliders,
  Sparkles,
  Undo2,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadDropzone } from '@/components/upload-dropzone'
import { EditorCanvas } from '@/components/editor-canvas'
import { AdjustmentSlider } from '@/components/adjustment-slider'
import { FilterPresets } from '@/components/filter-presets'
import {
  type Adjustments,
  ADJUSTMENT_CONFIGS,
  DEFAULT_ADJUSTMENTS,
  adjustmentsEqual,
} from '@/lib/editor-types'

type Tab = 'adjust' | 'filters'

export function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('image')
  const [adjustments, setAdjustments] = useState<Adjustments>({ ...DEFAULT_ADJUSTMENTS })
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [tab, setTab] = useState<Tab>('adjust')

  // Load image element whenever the source changes
  useEffect(() => {
    if (!src) {
      setImage(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImage(img)
    img.src = src
  }, [src])

  const handleFile = useCallback((file: File) => {
    setFileName(file.name.replace(/\.[^/.]+$/, '') || 'image')
    const reader = new FileReader()
    reader.onload = () => {
      setSrc(reader.result as string)
      setAdjustments({ ...DEFAULT_ADJUSTMENTS })
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
    }
    reader.readAsDataURL(file)
  }, [])

  const setAdjustment = (key: keyof Adjustments, value: number) =>
    setAdjustments((prev) => ({ ...prev, [key]: value }))

  const resetAll = () => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS })
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
  }

  const isPristine =
    adjustmentsEqual(adjustments, DEFAULT_ADJUSTMENTS) &&
    rotation === 0 &&
    !flipH &&
    !flipV

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}-edited.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 md:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Aperture className="size-5" />
          </div>
          <div className="leading-none">
            <h1 className="text-base font-extrabold tracking-tight text-foreground">
              Image Editor
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground">
              ブラウザ画像エディター
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {src ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('replace-input')?.click()}
              >
                <Upload className="size-3.5" />
                <span className="hidden sm:inline">新しい画像</span>
              </Button>
              <input
                id="replace-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                  e.currentTarget.value = ''
                }}
              />
              <Button size="sm" onClick={handleDownload}>
                <Download className="size-3.5" />
                <span className="hidden sm:inline">ダウンロード</span>
              </Button>
            </>
          ) : null}
        </div>
      </header>

      {!src ? (
        <UploadDropzone onFile={handleFile} />
      ) : (
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Workspace */}
          <main className="flex-1 bg-secondary/5 p-3 md:p-6">
            <EditorCanvas
              canvasRef={canvasRef}
              image={image}
              adjustments={adjustments}
              rotation={rotation}
              flipH={flipH}
              flipV={flipV}
            />

            {/* Transform toolbar */}
            <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((r) => (r + 270) % 360)}
              >
                <RotateCcw className="size-3.5" />
                左回転
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((r) => (r + 90) % 360)}
              >
                <RotateCw className="size-3.5" />
                右回転
              </Button>
              <Button
                variant={flipH ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFlipH((v) => !v)}
              >
                <FlipHorizontal2 className="size-3.5" />
                左右反転
              </Button>
              <Button
                variant={flipV ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFlipV((v) => !v)}
              >
                <FlipVertical2 className="size-3.5" />
                上下反転
              </Button>
            </div>
          </main>

          {/* Side panel */}
          <aside className="w-full shrink-0 border-t border-border bg-card lg:w-80 lg:border-l lg:border-t-0">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setTab('adjust')}
                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold tracking-wide transition-colors ${
                  tab === 'adjust'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sliders className="size-4" />
                調整
              </button>
              <button
                type="button"
                onClick={() => setTab('filters')}
                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold tracking-wide transition-colors ${
                  tab === 'filters'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sparkles className="size-4" />
                フィルター
              </button>
            </div>

            <div className="max-h-[42vh] overflow-y-auto p-4 lg:max-h-[calc(100vh-8.5rem)]">
              {tab === 'adjust' ? (
                <div className="space-y-5">
                  {ADJUSTMENT_CONFIGS.map((config) => (
                    <AdjustmentSlider
                      key={config.key}
                      config={config}
                      value={adjustments[config.key]}
                      onChange={(v) => setAdjustment(config.key, v)}
                      onReset={() => setAdjustment(config.key, config.neutral)}
                    />
                  ))}
                </div>
              ) : (
                <FilterPresets
                  thumbSrc={src}
                  current={adjustments}
                  onSelect={(a) => setAdjustments(a)}
                />
              )}
            </div>

            <div className="border-t border-border p-4">
              <Button
                variant="outline"
                size="lg"
                onClick={resetAll}
                disabled={isPristine}
                className="w-full"
              >
                <Undo2 className="size-4" />
                すべての編集をリセット
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
