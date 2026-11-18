import {
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
} from 'three'

type Outfit = 'manta' | 'huasa'

function textile(outfit: Outfit) {
  const tile = document.createElement('canvas')
  tile.width = tile.height = 128
  const ctx = tile.getContext('2d')!
  ctx.fillStyle = outfit === 'manta' ? '#902d38' : '#f5dfcc'
  ctx.fillRect(0, 0, 128, 128)
  if (outfit === 'manta') {
    for (const start of [8, 82]) {
      ctx.fillStyle = '#29283b'
      ctx.fillRect(start, 0, 22, 128)
      ctx.fillStyle = '#eed5a7'
      ctx.fillRect(start + 4, 0, 3, 128)
      ctx.fillRect(start + 16, 0, 2, 128)
      ctx.fillStyle = '#bc794a'
      ctx.fillRect(start + 9, 0, 4, 128)
    }
    ctx.fillStyle = '#f9e4c01a'
    for (let y = 0; y < 128; y += 3) ctx.fillRect(0, y, 128, 1)
  } else {
    for (const [x, y] of [
      [32, 32],
      [96, 96],
      [98, 28],
      [27, 96],
    ]) {
      ctx.fillStyle = '#577346'
      ctx.beginPath()
      ctx.ellipse(x + 9, y + 8, 9, 3, -0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#b53048'
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5
        ctx.beginPath()
        ctx.arc(x + 4 * Math.cos(angle), y + 4 * Math.sin(angle), 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#eeb156'
      ctx.fillRect(x - 2, y - 2, 4, 4)
    }
  }
  const map = new CanvasTexture(tile)
  map.colorSpace = SRGBColorSpace
  map.wrapS = map.wrapT = RepeatWrapping
  if (outfit === 'huasa') map.repeat.set(4, 1)
  return new MeshStandardMaterial({ map, side: DoubleSide, roughness: 0.88 })
}

function poncho(group: Group, cloth: MeshStandardMaterial, ivory: MeshStandardMaterial) {
  const vertices: number[] = [],
    uv: number[] = [],
    faces: number[] = []
  const columns = 64,
    rows = 12
  const fringe = new InstancedMesh(new CylinderGeometry(0.0018, 0.001, 1, 5), ivory, columns)
  const tuft = new Object3D()
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= columns; i++) {
      const t = j / rows,
        a = (i * Math.PI * 2) / columns
      const c = Math.cos(a),
        s = Math.sin(a)
      const depth = 0.106 * Math.sin((t * Math.PI) / 2)
      const x = c * (0.032 + 0.112 * t),
        z = s * (0.032 + depth) * (1 + 0.06 * Math.sin(9 * a))
      const y = 0.393 - t * (0.168 + 0.087 * Math.pow(Math.abs(s), 3)) + 0.006 * t * Math.cos(9 * a)
      vertices.push(x, y, z)
      uv.push(0.5 + x / 0.3, t)
      if (j < rows && i < columns) {
        const k = j * (columns + 1) + i,
          b = k + columns + 1
        faces.push(k, b, k + 1, b, b + 1, k + 1)
      }
      if (j === rows && i < columns) {
        const length = 0.018 + 0.007 * Math.cos(a * 8)
        tuft.position.set(x, y - length / 2, z)
        tuft.scale.y = length
        tuft.rotation.z = 0.14 * c
        tuft.updateMatrix()
        fringe.setMatrixAt(i, tuft.matrix)
      }
    }
  const shape = new BufferGeometry()
  shape.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  shape.setAttribute('uv', new Float32BufferAttribute(uv, 2))
  shape.setIndex(faces)
  shape.computeVertexNormals()
  group.add(new Mesh(shape, cloth), fringe)
}

export function createWineBottle(outfit: Outfit) {
  const group = new Group()
  const material = (color: string, roughness = 0.8) =>
    new MeshStandardMaterial({ color, roughness, side: DoubleSide })
  const cloth = textile(outfit),
    ivory = material('#fff0d3'),
    ribbon = material('#a62b41')
  function turned(profile: number[][], surface: MeshStandardMaterial, folds = 0) {
    const geometry = new LatheGeometry(
      profile.map(([r, y]) => new Vector2(r, y)),
      72,
    )
    const points = geometry.attributes.position
    if (folds) {
      for (let i = 0; i < points.count; i++) {
        const x = points.getX(i),
          z = points.getZ(i)
        const factor = 1 + folds * Math.sin(10 * Math.atan2(x, z))
        points.setXYZ(i, x * factor, points.getY(i), z * factor)
      }
      geometry.computeVertexNormals()
    }
    const mesh = new Mesh(geometry, surface)
    group.add(mesh)
    return mesh
  }
  turned(
    [
      [0, 0],
      [0.056, 0],
      [0.057, 0.29],
      [0.053, 0.335],
      [0.025, 0.388],
      [0.024, 0.49],
      [0.029, 0.5],
      [0.029, 0.53],
      [0, 0.53],
    ],
    material('#342322', 0.21),
  )
  turned(
    [
      [0.027, 0.474],
      [0.03, 0.5],
      [0.03, 0.532],
      [0, 0.534],
    ],
    ribbon,
  )
  if (outfit === 'manta') {
    poncho(group, cloth, ivory)
    const felt = material('#3b302a')
    const hat = turned(
      [
        [0, 0],
        [0.096, 0],
        [0.101, 0.005],
        [0.095, 0.011],
        [0.048, 0.009],
        [0.043, 0.056],
        [0.032, 0.06],
        [0, 0.058],
      ],
      felt,
    )
    hat.position.y = 0.506
    hat.rotation.z = -0.09
    const band = turned(
      [
        [0.047, 0.012],
        [0.046, 0.022],
      ],
      material('#c79862'),
    )
    band.position.copy(hat.position)
    band.rotation.copy(hat.rotation)
  } else {
    turned(
      [
        [0.062, 0.244],
        [0.077, 0.295],
        [0.065, 0.34],
        [0.031, 0.365],
      ],
      cloth,
    )
    turned(
      [
        [0.134, 0.01],
        [0.134, 0.02],
        [0.099, 0.116],
        [0.065, 0.252],
      ],
      cloth,
      0.105,
    )
    for (const [y, r] of [
      [0.019, 0.135],
      [0.092, 0.11],
      [0.154, 0.09],
    ]) {
      turned(
        [
          [r, y],
          [r + 0.002, y + 0.008],
          [r - 0.008, y + 0.033],
        ],
        ivory,
        0.11,
      )
      turned(
        [
          [r + 0.002, y + 0.008],
          [r, y + 0.013],
        ],
        ribbon,
        0.11,
      )
    }
    turned(
      [
        [0.071, 0.238],
        [0.071, 0.257],
      ],
      ribbon,
    )
    turned(
      [
        [0.075, 0.327],
        [0.066, 0.352],
        [0.031, 0.365],
      ],
      ivory,
      0.07,
    )
    for (const side of [-1, 1]) {
      const sleeve = new Mesh(new SphereGeometry(1, 16, 12), cloth)
      sleeve.position.set(side * 0.066, 0.313, 0)
      sleeve.scale.copy(new Vector3(0.035, 0.047, 0.039))
      group.add(sleeve)
    }
  }
  group.traverse((object) => {
    if (object instanceof Mesh) object.castShadow = true
  })
  return group
}
