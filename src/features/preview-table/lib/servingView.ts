// The orthographic camera sees the circular top as an ellipse. Project the same
// surface for the HTML place settings and the non-WebGL preview.
export const tabletopRadius = 1.18
export const tabletopHeight = 1.04
export const servingView = {
  halfWidth: 2.24,
  halfHeight: 1.344,
  elevation: Math.PI * 0.275,
  targetHeight: 0.66,
}
const { halfWidth, halfHeight, elevation, targetHeight } = servingView
const width = (tabletopRadius / halfWidth) * 100
const height = ((tabletopRadius * Math.sin(elevation)) / halfHeight) * 100
const centerY = 50 - (((tabletopHeight - targetHeight) * Math.cos(elevation)) / halfHeight) * 50

export const tabletopFrame = {
  left: (100 - width) / 2 + '%',
  top: centerY - height / 2 + '%',
  width: width + '%',
  height: height + '%',
}
