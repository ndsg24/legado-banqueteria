import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import type { TableDesign } from '../../../entities/table'
import { fabricMaterial, overlayGeometry, tableclothGeometry } from './fabrics'

import { servingView } from './servingView'
export function renderServingSurface(
  canvas: HTMLCanvasElement,
  cloth: string,
  runner: string,
  overlayStyle: TableDesign['overlayStyle'],
) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
  const scene = new Scene()
  const { halfWidth, halfHeight, elevation, targetHeight } = servingView
  const camera = new OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.1, 20)
  camera.position.set(0, targetHeight + 5 * Math.sin(elevation), 5 * Math.cos(elevation))
  camera.lookAt(0, targetHeight, 0)
  const linen = fabricMaterial()
  linen.color.set(cloth)
  const silk = fabricMaterial(true)
  silk.color.set(runner)
  const table = new Mesh(tableclothGeometry(), linen)
  const isRunner = overlayStyle === 'runner'
  const overlay = new Mesh(isRunner ? overlayGeometry(0.54, 3.42) : overlayGeometry(), silk)
  overlay.rotation.y = isRunner ? -0.45 : Math.PI / 4
  scene.add(table, overlay, new AmbientLight(0xffffff, 1.25))
  const windowLight = new DirectionalLight(0xfff7e8, 1.85)
  windowLight.position.set(-3, 5, 3)
  scene.add(windowLight)
  const resize = () => {
    const width = Math.min(1600, Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 2)))
    if (!width) return
    renderer.setSize(width, Math.round(width * 0.6), false)
    renderer.render(scene, camera)
  }
  const observer = new ResizeObserver(resize)
  const dispose = () => {
    observer.disconnect()
    table.geometry.dispose()
    overlay.geometry.dispose()
    linen.dispose()
    silk.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
  try {
    resize()
    observer.observe(canvas)
    return dispose
  } catch (error) {
    dispose()
    throw error
  }
}
