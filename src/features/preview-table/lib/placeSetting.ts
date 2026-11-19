import {
  BufferGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  Mesh,
  Shape,
  Vector2,
  type Material,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { NapkinFold } from '../../../entities/table'

function flatwareBlank() {
  const shape = new Shape()
  shape.moveTo(-0.008, 0.026)
  shape.bezierCurveTo(-0.007, -0.049, -0.018, -0.15, -0.014, -0.174)
  shape.quadraticCurveTo(0, -0.19, 0.014, -0.174)
  shape.bezierCurveTo(0.018, -0.15, 0.007, -0.049, 0.008, 0.026)
  return shape
}

function forged(shape: Shape, material: Material) {
  shape.closePath()
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.004,
    bevelSize: 0.0014,
    bevelThickness: 0.0015,
    bevelSegments: 2,
    curveSegments: 8,
  })
  geometry.rotateX(-Math.PI / 2)
  return new Mesh(geometry, material)
}

export function createCutlery(material: Material) {
  const cutlery = new Group()
  const fork = flatwareBlank()
  fork.bezierCurveTo(0.008, 0.052, 0.028, 0.063, 0.028, 0.083)
  // Four separate tines taper towards the tip, with a rounded root in each gap.
  for (let i = 0; i < 4; i++) {
    const x = 0.024 - i * 0.016
    fork.lineTo(x + 0.002, 0.177)
    fork.lineTo(x - 0.002, 0.177)
    fork.lineTo(x - 0.005, 0.1)
    if (i < 3) fork.quadraticCurveTo(x - 0.008, 0.085, x - 0.011, 0.1)
  }
  fork.lineTo(-0.028, 0.083)
  fork.bezierCurveTo(-0.028, 0.063, -0.008, 0.052, -0.008, 0.026)
  const forkMesh = forged(fork, material)
  forkMesh.position.x = -0.273
  cutlery.add(forkMesh)

  const knife = flatwareBlank()
  knife.lineTo(0.014, 0.045)
  knife.lineTo(0.014, 0.197)
  knife.quadraticCurveTo(-0.028, 0.189, -0.026, 0.13)
  knife.lineTo(-0.021, 0.039)
  knife.lineTo(-0.008, 0.026)
  const knifeMesh = forged(knife, material)
  knifeMesh.position.x = 0.259
  cutlery.add(knifeMesh)

  const spoon = new Group()
  const handle = flatwareBlank()
  handle.lineTo(0.008, 0.094)
  handle.lineTo(-0.008, 0.094)
  spoon.add(forged(handle, material))
  const profile = [
    [0, 0],
    [0.019, 0.003],
    [0.034, 0.012],
    [0.037, 0.019],
    [0.035, 0.02],
    [0.03, 0.014],
    [0.017, 0.008],
    [0, 0.005],
  ]
  const bowl = new Mesh(
    new LatheGeometry(
      profile.map(([r, y]) => new Vector2(r, y)),
      32,
    ),
    material,
  )
  bowl.scale.z = 1.48
  bowl.position.z = -0.134
  spoon.add(bowl)
  const dessert = spoon.clone()
  dessert.scale.setScalar(0.71)
  dessert.rotation.y = Math.PI / 2
  dessert.position.z = -0.272
  spoon.position.x = 0.323
  cutlery.add(spoon, dessert)
  cutlery.position.y = 0.001
  cutlery.traverse((object) => {
    if (object instanceof Mesh) object.castShadow = true
  })
  return cutlery
}

// Sample each folded sheet from the tucked base to its uneven upper hem.
function foldedSheet(columns: number, sample: (u: number, t: number) => number[]) {
  const vertices: number[] = [],
    indices: number[] = []
  const rows = 10
  for (let row = 0; row <= rows; row++)
    for (let col = 0; col <= columns; col++) {
      vertices.push(...sample(col / columns, row / rows))
      if (row < rows && col < columns) {
        const a = row * (columns + 1) + col,
          b = a + columns + 1
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function createNapkin(fold: NapkinFold, cloth: Material, accent: Material) {
  const group = new Group()
  if (fold === 'flat') {
    const napkin = new Mesh(new RoundedBoxGeometry(0.17, 0.025, 0.25, 2, 0.006), cloth)
    napkin.position.y = 0.04
    napkin.rotation.y = 0.1
    group.add(napkin)
  } else {
    group.position.set(0.23, 0.175, -0.248)
    if (fold === 'doubleV') {
      const roll = foldedSheet(40, (u, t) => {
        const angle = u * Math.PI * 2.5
        const radius = (0.014 + 0.013 * u) * (0.7 + 0.3 * t)
        return [
          radius * Math.cos(angle),
          t * (0.4 + 0.047 * Math.cos(angle)),
          radius * Math.sin(angle),
        ]
      })
      for (const side of [-1, 1]) {
        const tip = new Mesh(roll, cloth)
        tip.rotation.z = side * 0.29
        tip.rotation.y = side * 0.45
        group.add(tip)
      }
    } else if (fold === 'fan') {
      const fan = foldedSheet(14, (u, t) => {
        const angle = (u - 0.5) * 1.55
        const crease = Math.cos(14 * Math.PI * u)
        const length = 0.045 + t * (0.29 + 0.025 * u)
        return [
          Math.sin(angle) * length,
          Math.cos(angle) * length,
          crease * (0.009 + 0.025 * t) + 0.018 * t * t,
        ]
      })
      group.add(new Mesh(fan, cloth))
    } else {
      const crown = foldedSheet(64, (u, t) => {
        const angle = u * Math.PI * 2
        const peak = Math.abs(((u * 4 + 0.5) % 1) * 2 - 1)
        const radius = 0.021 + t * (0.068 + 0.022 * Math.cos(8 * angle))
        return [
          radius * Math.cos(angle),
          t * (0.205 + 0.135 * peak + 0.025 * Math.sin(angle)),
          radius * Math.sin(angle),
        ]
      })
      group.add(new Mesh(crown, cloth))
      if (fold === 'duo') {
        const inner = new Mesh(crown, accent)
        inner.rotation.y = Math.PI / 4
        inner.scale.set(0.75, 1.17, 0.75)
        group.add(inner)
      }
    }
  }
  group.traverse((object) => {
    if (object instanceof Mesh) {
      object.userData.part = 'napkin'
      object.castShadow = true
    }
  })
  return group
}
