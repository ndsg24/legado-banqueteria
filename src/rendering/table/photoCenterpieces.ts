import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Shape,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three'

import { flowerPalette } from '../../config/table'
import type { FloralOptions, PhotoCenterpiece } from '../../types/table'

const recipes = {
  white: { colors: ['#fff8ea'], radius: 0.13, rise: 0.1, height: 0.25 },
  rose: { colors: ['#cb90a1'], radius: 0.13, rise: 0.1, height: 0.25 },
  harvest: {
    colors: ['#edad26', '#ad491e', '#731d37', '#ffdc85'],
    radius: 0.23,
    rise: 0.19,
    height: 0.22,
  },
  burgundy: { colors: ['#f6f1dd', '#5c1934', '#fff9ef'], radius: 0.22, rise: 0.15, height: 0.17 },
  sunlight: { colors: ['#f2c62c', '#fff6e3', '#e6ac1c'], radius: 0.18, rise: 0.14, height: 0.16 },
  cascade: { colors: ['#234eb7', '#fcf7df', '#fffdf4'], radius: 0.34, rise: 0.38, height: 0.16 },
  fifteen: { colors: ['#634472', '#44283f', '#d7b4cc'], radius: 0.16, rise: 0.18, height: 0.17 },
} as const

// Curved blades with a central crease. The same surface takes different proportions
// in daisy petals, cupped rose petals, broad leaves and trailing grasses.
function bladeGeometry() {
  const points: number[] = [],
    faces: number[] = []
  const rows = 9,
    columns = 4
  for (let row = 0; row <= rows; row++) {
    const t = row / rows
    const width = 0.015 + Math.sin(Math.PI * t) ** 0.78
    for (let col = 0; col <= columns; col++) {
      const side = (col / columns) * 2 - 1
      points.push(side * width, 0.65 * t * t + 0.19 * side * side * width, t)
      if (row < rows && col < columns) {
        const a = row * (columns + 1) + col,
          b = a + columns + 1
        faces.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
  }
  const shape = new BufferGeometry()
  shape.setAttribute('position', new Float32BufferAttribute(points, 3))
  shape.setIndex(faces)
  shape.computeVertexNormals()
  return shape
}

type Piece = { matrix: Matrix4; color: string }
const goldenAngle = Math.PI * (3 - Math.sqrt(5))

function anniversaryTopper() {
  const one = new Shape()
  one.moveTo(0, 0.118)
  one.lineTo(0.039, 0.15)
  one.lineTo(0.057, 0.15)
  one.lineTo(0.057, 0.018)
  one.lineTo(0.077, 0.018)
  one.lineTo(0.077, 0)
  one.lineTo(0.005, 0)
  one.lineTo(0.005, 0.018)
  one.lineTo(0.031, 0.018)
  one.lineTo(0.031, 0.115)
  one.lineTo(0.01, 0.1)
  one.closePath()
  const five = new Shape()
  five.moveTo(0.1, 0.15)
  five.lineTo(0.193, 0.15)
  five.lineTo(0.19, 0.125)
  five.lineTo(0.123, 0.125)
  five.lineTo(0.12, 0.093)
  five.bezierCurveTo(0.21, 0.113, 0.228, -0.009, 0.141, -0.004)
  five.quadraticCurveTo(0.112, -0.004, 0.093, 0.011)
  five.lineTo(0.104, 0.032)
  five.bezierCurveTo(0.17, -0.01, 0.202, 0.085, 0.102, 0.066)
  five.closePath()
  const mesh = new Mesh(
    new ExtrudeGeometry([one, five], {
      depth: 0.009,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
    }),
    new MeshStandardMaterial({ color: '#981a61', metalness: 0.35, roughness: 0.38 }),
  )
  mesh.geometry.translate(-0.1, 0, 0)
  mesh.position.y = 0.42
  mesh.rotation.y = 0.58
  return mesh
}

export function createPhotoCenterpiece(
  style: Exclude<PhotoCenterpiece, 'ribbonBottle'> | 'white' | 'rose',
  { flowerKind, flowerColor }: FloralOptions,
): Group {
  const recipe = recipes[style]
  const group = new Group()
  group.position.y = 1.06
  const blades: Piece[] = [],
    beads: Piece[] = [],
    stalks: Piece[] = []
  const part = new Object3D()
  const up = new Vector3(0, 1, 0)
  const bowl = new LatheGeometry(
    [
      [0, 0],
      [0.075, 0],
      [0.1, 0.025],
      [0.112, 0.082],
      [0.11, 0.105],
      [0.098, 0.103],
      [0.091, 0.065],
      [0, 0.061],
    ].map(([x, y]) => new Vector2(x, y)),
    48,
  )
  const classic = style === 'white' || style === 'rose'
  if (classic) bowl.scale(0.98, 2.1, 0.98)
  group.add(
    new Mesh(
      bowl,
      new MeshStandardMaterial({
        metalness: classic ? 0.65 : 0,
        color: classic ? '#a58b59' : style === 'fifteen' ? '#51344d' : '#3d3431',
        roughness: 0.48,
      }),
    ),
  )

  function add(batch: Piece[], color: string, parent?: Matrix4) {
    part.updateMatrix()
    const matrix = part.matrix.clone()
    if (parent) matrix.premultiply(parent)
    batch.push({ matrix, color })
  }
  function stem(start: Vector3, end: Vector3, radius = 0.003) {
    const axis = end.clone().sub(start)
    part.position.copy(start).lerp(end, 0.5)
    part.scale.set(radius, axis.length(), radius)
    part.quaternion.setFromUnitVectors(up, axis.normalize())
    add(stalks, '#456036')
  }
  function blade(
    position: Vector3,
    yaw: number,
    tilt: number,
    width: number,
    curve: number,
    length: number,
    color: string,
    frame?: Matrix4,
  ) {
    part.position.copy(position)
    part.rotation.set(tilt, yaw, 0, 'YXZ')
    // Mirror both axes on recurved petals to keep the instanced face winding.
    part.scale.set(curve < 0 ? -width : width, curve, length)
    add(blades, color, frame)
  }

  const count = style === 'cascade' ? 32 : 22
  for (let i = 0; i < count; i++) {
    const angle = i * goldenAngle
    const t = Math.sqrt((i + 0.3) / count)
    const r = recipe.radius * t
    const head = new Vector3(
      Math.cos(angle) * r,
      recipe.height +
        recipe.rise * (style === 'cascade' ? (1 - t) * 1.55 : Math.sqrt(1 - t * t)) +
        0.016 * Math.sin(3 * i),
      Math.sin(angle) * r,
    )
    stem(new Vector3(head.x * 0.16, 0.07, head.z * 0.16), head)
    const foliage = head.clone().multiplyScalar(0.76)
    blade(foliage, Math.PI / 2 - angle + 0.62, -0.4, 0.022, 0.023, 0.105, '#4d7245')
    const flower = new Object3D()
    flower.position.copy(head)
    flower.quaternion.setFromUnitVectors(
      up,
      new Vector3(t * Math.cos(angle), 1 - 0.65 * t, t * Math.sin(angle)).normalize(),
    )
    flower.updateMatrix()
    const rose =
      flowerKind === 'rose' ||
      (flowerKind === 'original' &&
        (style === 'rose' || (style === 'cascade' && (i % 3 === 0 || t < 0.55))))
    const shade = flowerPalette[flowerColor].hex ?? recipe.colors[i % recipe.colors.length]
    const size = 0.058 + 0.013 * (0.5 + 0.5 * Math.cos(i * 7))
    if (flowerKind === 'lily') {
      for (let j = 0; j < 6; j++) {
        const turn = (j * Math.PI) / 3
        blade(
          new Vector3(),
          turn,
          -0.68,
          size * 0.36,
          -size * 0.54,
          size * 1.5,
          shade,
          flower.matrix,
        )
        part.rotation.set(0.24 * Math.cos(turn), 0, 0.24 * Math.sin(turn))
        part.position.set(0.009 * Math.sin(turn), 0.022, 0.009 * Math.cos(turn))
        part.scale.set(0.0015, 0.042, 0.0015)
        add(stalks, '#a49051', flower.matrix)
        part.position.set(0.014 * Math.sin(turn), 0.042, 0.014 * Math.cos(turn))
        part.scale.set(0.003, 0.006, 0.003)
        add(beads, '#975324', flower.matrix)
      }
      continue
    }
    const petals = rose ? 20 : 27
    for (let j = 0; j < petals; j++) {
      const layer = j / petals,
        turn = goldenAngle * j
      const spread = rose ? 0.005 + 0.018 * layer : 0.007
      const start = new Vector3(
        Math.sin(turn) * spread,
        0.012 * (1 - layer),
        Math.cos(turn) * spread,
      )
      blade(
        start,
        turn,
        rose ? -0.6 + 0.54 * layer : 0.1 + layer * 0.12,
        size * (rose ? 0.39 : 0.135),
        size * (rose ? 0.82 : 0.28),
        size * (0.45 + 0.55 * layer),
        shade,
        flower.matrix,
      )
    }
    if (!rose) {
      part.position.set(0, 0.012, 0)
      part.rotation.set(0, 0, 0)
      part.scale.set(0.015, 0.009, 0.015)
      add(beads, i % 3 ? '#c6a044' : '#94703a', flower.matrix)
    }
  }
  for (let i = 0; i < 42; i++) {
    const a = i * goldenAngle
    const origin = new Vector3(Math.sin(a) * 0.08, 0.09 + (0.09 * (i % 4)) / 3, Math.cos(a) * 0.08)
    blade(
      origin,
      a,
      -0.25 + (0.65 * (i % 5)) / 4,
      0.016 + 0.011 * (i % 3),
      0.021,
      recipe.radius * (0.8 + (0.45 * (i % 4)) / 3),
      i % 2 ? '#405b36' : '#648153',
    )
  }
  if (style === 'cascade' || style === 'harvest') {
    for (let i = 0; i < 18; i++) {
      const a = i * goldenAngle
      const spray = new Vector3(
        Math.sin(a) * recipe.radius * 0.8,
        recipe.height + recipe.rise * (0.18 + 0.09 * (i % 6)),
        Math.cos(a) * recipe.radius * 0.8,
      )
      for (let j = 0; j < 5; j++) {
        const branch = a + j * goldenAngle
        const bud = spray
          .clone()
          .add(
            new Vector3(
              0.035 * Math.sin(branch),
              0.025 + 0.008 * (j % 3),
              0.035 * Math.cos(branch),
            ),
          )
        stem(spray, bud, 0.0012)
        part.position.copy(bud)
        part.rotation.set(0, 0, 0)
        part.scale.set(0.008, 0.007, 0.008)
        add(beads, style === 'cascade' ? '#faf4df' : '#ab5151')
      }
    }
  }
  if (style === 'cascade') {
    for (let i = 0; i < 24; i++) {
      const a = i * goldenAngle
      blade(
        new Vector3(0.08 * Math.sin(a), 0.15, 0.08 * Math.cos(a)),
        a,
        0.15,
        0.006,
        -0.12,
        0.35 + 0.025 * (i % 5),
        '#516943',
      )
    }
    for (let i = 0; i < 5; i++) {
      const angle = goldenAngle * i
      let tip = new Vector3(0, 0.14, 0)
      for (let j = 1; j <= 6; j++) {
        const next = new Vector3(
          Math.sin(angle) * j * 0.075,
          Math.max(0.012, 0.14 - 0.03 * j),
          Math.cos(angle) * j * 0.075,
        )
        stem(tip, next, 0.002)
        blade(next, angle + (j % 2 ? 0.8 : -0.8), -0.08, 0.025, 0.021, 0.07, '#3b663c')
        tip = next
      }
    }
  }
  if (style === 'fifteen') {
    stem(new Vector3(0, 0.18, 0), new Vector3(0, 0.47, 0))
    group.add(anniversaryTopper())
    const ribbon = new Mesh(
      new CylinderGeometry(0.112, 0.11, 0.018, 48),
      new MeshStandardMaterial({ color: '#b182bd', roughness: 0.42 }),
    )
    ribbon.position.y = 0.081
    group.add(ribbon)
  }
  function batch(geometry: BufferGeometry, pieces: Piece[]) {
    const mesh = new InstancedMesh(
      geometry,
      new MeshStandardMaterial({ side: DoubleSide, roughness: 0.83 }),
      pieces.length,
    )
    pieces.forEach(({ matrix, color }, index) => {
      mesh.setMatrixAt(index, matrix)
      mesh.setColorAt(index, new Color(color))
    })
    mesh.castShadow = true
    group.add(mesh)
  }
  batch(bladeGeometry(), blades)
  batch(new SphereGeometry(1, 10, 6), beads)
  batch(new CylinderGeometry(1, 1, 1, 5), stalks)
  return group
}
