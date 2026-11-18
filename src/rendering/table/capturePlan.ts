export async function capturePlan(svg: SVGSVGElement, resolution: number) {
  const { width, height } = svg.viewBox.baseVal
  const scale = resolution / Math.max(width, height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  const palette = getComputedStyle(svg)
  const copy = svg.cloneNode(true) as SVGSVGElement
  copy.style.color = palette.color
  context.fillStyle = palette.getPropertyValue('--table-stage-export').trim()
  context.fillRect(0, 0, canvas.width, canvas.height)
  copy.setAttribute('width', String(canvas.width))
  copy.setAttribute('height', String(canvas.height))
  const url = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml' }),
  )
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    context.drawImage(image, 0, 0)
    return canvas.toDataURL('image/png')
  } finally {
    URL.revokeObjectURL(url)
  }
}
