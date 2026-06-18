'use client'

import { useCallback, useRef, useState } from 'react'
import { ImageUp, ImagePlus } from 'lucide-react'

type Props = {
  onFile: (file: File) => void
}

export function UploadDropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (file && file.type.startsWith('image/')) {
        onFile(file)
      }
    },
    [onFile],
  )

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={`flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed bg-card px-8 py-16 text-center transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary hover:bg-primary/5'
        }`}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {dragging ? (
            <ImagePlus className="size-8" />
          ) : (
            <ImageUp className="size-8" />
          )}
        </div>
        <div className="space-y-1.5">
          <p className="text-xl font-bold tracking-tight text-foreground text-balance">
            写真をドロップして編集を開始
          </p>
          <p className="text-sm text-muted-foreground text-pretty">
            ここに画像をドラッグ＆ドロップするか、クリックして選択してください。JPG、PNG、WebP
            に対応しています。すべての処理はブラウザ内で完結します。
          </p>
        </div>
        <span className="inline-flex items-center rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">
          画像を選択
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  )
}
