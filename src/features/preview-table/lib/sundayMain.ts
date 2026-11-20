import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  TextureLoader,
} from 'three'
import { sundayMenu } from '../../../shared/config/tableIdea'

// Corresponding points on the upper and lower edge of the photographed fillet.
// UVs refer to the 320 × 213 catalog thumbnail; neighboring seats share one mesh resource.
const contour = [
  [77, 116, 88, 148],
  [106, 93, 115, 131],
  [148, 77, 157, 112],
  [203, 68, 213, 99],
  [214, 69, 236, 99],
  [223, 82, 238, 103],
  [197, 96, 204, 116],
  [157, 110, 161, 132],
  [121, 131, 124, 146],
  [93, 139, 95, 154],
]

export function createSundayMain(onLoad: () => void) {
  const map = new TextureLoader().load(
    import.meta.env.BASE_URL + 'images/catalog/banquet/' + sundayMenu.main + '-320.webp',
    onLoad,
  )
  map.colorSpace = SRGBColorSpace
  const geometry = new BufferGeometry()
  const positions = [0, 0.057, 0]
  const uv = [149 / 320, 1 - 98 / 213]
  const indices: number[] = []
  for (const [x, y, bottomX, bottomY] of contour) {
    const dx = (x - 149) * 0.00155
    const dz = (y - 98) * 0.0024
    positions.push(dx, 0.048, dz, dx * 0.98, 0.009, dz * 0.98)
    uv.push(x / 320, 1 - y / 213, bottomX / 320, 1 - bottomY / 213)
  }
  for (let i = 0; i < contour.length; i++) {
    const a = 1 + i * 2
    const b = 1 + ((i + 1) % contour.length) * 2
    indices.push(0, b, a, a, b, a + 1, b, b + 1, a + 1)
  }
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  const fish = new Mesh(geometry, new MeshStandardMaterial({ map, roughness: 0.82 }))
  fish.castShadow = true
  fish.receiveShadow = true
  return fish
}
