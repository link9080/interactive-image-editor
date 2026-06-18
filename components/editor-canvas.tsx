'use client'

import { type RefObject, useEffect } from 'react'
import { type Adjustments, buildFilterString } from '@/lib/editor-types'

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  image: HTMLImageElement | null
  adjustments: Adjustments
  rotation: number
  flipH: boolean
  flipV: boolean
}

export function EditorCanvas({
  canvasRef,
  image,
  adjustments,
  rotation,
  flipH,
  flipV,
}: Props) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const swap = rotation === 90 || rotation === 270
    const w = image.naturalWidth
    const h = image.naturalHeight
    canvas.width = swap ? h : w
    canvas.height = swap ? w : h

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.filter = buildFilterString(adjustments)
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.drawImage(image, -w / 2, -h / 2, w, h)
    ctx.restore()
  }, [canvasRef, image, adjustments, rotation, flipH, flipV])

  return (
    <div className="checkerboard relative flex h-full min-h-[60vh] w-full items-center justify-center overflow-hidden rounded-lg p-4 md:p-8">
      <canvas
        ref={canvasRef}
        className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
        style={{ maxHeight: '70vh' }}
      />
    </div>
  )
}
