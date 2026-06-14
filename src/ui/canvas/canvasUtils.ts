export const setupHiDpiCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D => {
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D non disponible')
  ctx.scale(dpr, dpr)
  return ctx
}

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
): void => {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}

export const createResizeObserver = (
  target: Element,
  onResize: (w: number, h: number) => void,
): ResizeObserver => {
  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      onResize(Math.round(width), Math.round(height))
    }
  })
  observer.observe(target)
  return observer
}
