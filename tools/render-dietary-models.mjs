// Build the transparent turntables from a 5 × 3 cutout atlas.
// PLAYWRIGHT_CHANNEL=chrome node tools/render-dietary-models.mjs
import { chromium } from '@playwright/test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

// Bounds are in the coordinates of a 900px-wide preview of the source atlas.
const subjects = [
  ['wheat', 4, 4, 194, 184],
  ['milk', 207, 6, 338, 184],
  ['egg', 357, 24, 527, 176],
  ['nuts', 541, 22, 702, 179],
  ['peanut', 710, 23, 891, 181],
  ['crustaceans', 1, 196, 185, 342],
  ['molluscs', 185, 192, 357, 343],
  ['fish', 356, 214, 540, 323],
  ['soy', 540, 197, 708, 337],
  ['sesame', 711, 188, 895, 346],
  ['gluten', 4, 357, 185, 519],
  ['lactose', 186, 351, 347, 518],
  ['vegan', 349, 355, 524, 512],
  ['vegetarian', 526, 354, 705, 511],
  ['light', 705, 355, 898, 516],
]

const source = await readFile(new URL('./assets/dietary/source.png', import.meta.url), 'base64')
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL })
try {
  const page = await browser.newPage()
  await page.route('http://models.local/**', async (route) => {
    const file = new URL(route.request().url()).pathname.slice(1)
    if (!file)
      return route.fulfill({ contentType: 'text/html', body: '<title>Ingredient models</title>' })
    const module = await readFile(new URL('../node_modules/three/build/' + file, import.meta.url))
    await route.fulfill({ contentType: 'text/javascript', body: module })
  })
  await page.goto('http://models.local/')
  const images = await page.evaluate(
    async ({ source, subjects }) => {
      const T = await import('/three.module.js')
      const atlas = new Image()
      atlas.src = 'data:image/png;base64,' + source
      await atlas.decode()
      const scale = atlas.naturalWidth / 900
      const renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      })
      const width = 252,
        height = 204,
        frames = 16
      renderer.setSize(width * 2, height * 2)
      const camera = new T.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        1,
        1000,
      )
      camera.position.z = 350
      const scene = new T.Scene()
      const images = {}
      for (const [id, x, y, right, bottom] of subjects) {
        const textureCanvas = document.createElement('canvas')
        const w = (textureCanvas.width = Math.round((right - x) * scale))
        const h = (textureCanvas.height = Math.round((bottom - y) * scale))
        const ctx = textureCanvas.getContext('2d')
        ctx.drawImage(atlas, x * scale, y * scale, w, h, 0, 0, w, h)
        const pixels = ctx.getImageData(0, 0, w, h).data

        // Distance to the cutout silhouette gives the surface rounded edges.
        const distance = new Float32Array(w * h)
        for (let py = 1; py < h - 1; py++)
          for (let px = 1; px < w - 1; px++) {
            const i = py * w + px
            if (pixels[i * 4 + 3] > 90) distance[i] = 1 + Math.min(distance[i - 1], distance[i - w])
          }
        for (let i = distance.length - w - 2; i > w; i--) {
          distance[i] = Math.min(distance[i], distance[i + 1] + 1, distance[i + w] + 1)
        }
        const geometry = new T.PlaneGeometry(w, h, 90, 90)
        const vertices = geometry.attributes.position
        for (let i = 0; i < vertices.count; i++) {
          const px = Math.min(w - 1, Math.max(0, Math.round(vertices.getX(i) + w / 2)))
          const py = Math.min(h - 1, Math.max(0, Math.round(h / 2 - vertices.getY(i))))
          vertices.setZ(i, 4 * Math.sqrt(distance[py * w + px]))
        }
        const map = new T.CanvasTexture(textureCanvas)
        map.colorSpace = T.SRGBColorSpace
        const material = new T.MeshBasicMaterial({ map, transparent: true })
        const model = new T.Mesh(geometry, material)
        model.scale.setScalar(Math.min((width * 0.86) / w, (height * 0.9) / h))
        scene.add(model)
        const sheet = document.createElement('canvas')
        sheet.width = width * frames
        sheet.height = height
        const output = sheet.getContext('2d')
        for (let frame = 0; frame < frames; frame++) {
          model.rotation.y = (frame / (frames - 1) - 0.16) * 0.47
          model.rotation.x = (frame / (frames - 1)) * 0.045
          renderer.render(scene, camera)
          output.drawImage(renderer.domElement, width * frame, 0, width, height)
        }
        images[id] = sheet.toDataURL('image/webp', 0.91).split(',')[1]
        const still = document.createElement('canvas')
        still.width = width
        still.height = height
        still.getContext('2d').drawImage(sheet, 0, 0)
        images['still/' + id] = still.toDataURL('image/webp', 0.86).split(',')[1]
        scene.remove(model)
        geometry.dispose()
        material.dispose()
        map.dispose()
      }
      renderer.dispose()
      return images
    },
    { source, subjects },
  )
  await mkdir(new URL('../apps/web/public/images/dietary/still/', import.meta.url), { recursive: true })
  for (const [id, encoded] of Object.entries(images)) {
    await writeFile(
      new URL('../apps/web/public/images/dietary/' + id + '.webp', import.meta.url),
      Buffer.from(encoded, 'base64'),
    )
  }
} finally {
  await browser.close()
}
