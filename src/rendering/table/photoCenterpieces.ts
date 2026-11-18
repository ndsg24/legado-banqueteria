import {
  BufferGeometry, Color, CylinderGeometry, DoubleSide, ExtrudeGeometry, Float32BufferAttribute,
  Group, InstancedMesh, LatheGeometry, Matrix4, Mesh, MeshStandardMaterial, Object3D,
  Shape, SphereGeometry, Vector2, Vector3,
} from 'three'

import { flowerPalette } from '../../config/table'
import type { FloralOptions, PhotoCenterpiece } from '../../types/table'

const recipes = {
  white: { colors: ['#fff8ea'], radius: .13, rise: .10, height: .25 },
  rose: { colors: ['#cb90a1'], radius: .13, rise: .10, height: .25 },
  harvest: { colors: ['#edad26', '#ad491e', '#731d37', '#ffdc85'], radius: .23, rise: .19, height: .22 },
  burgundy: { colors: ['#f6f1dd', '#5c1934', '#fff9ef'], radius: .22, rise: .15, height: .17 },
  sunlight: { colors: ['#f2c62c', '#fff6e3', '#e6ac1c'], radius: .18, rise: .14, height: .16 },
  cascade: { colors: ['#234eb7', '#fcf7df', '#fffdf4'], radius: .34, rise: .38, height: .16 },
  fifteen: { colors: ['#634472', '#44283f', '#d7b4cc'], radius: .16, rise: .18, height: .17 },
} as const

// Curved blades with a central crease. The same surface takes different proportions
// in daisy petals, cupped rose petals, broad leaves and trailing grasses.
function bladeGeometry() {
  const points: number[] = [], faces: number[] = []
  const rows = 9, columns = 4
  for (let row = 0; row <= rows; row++) {
    const t = row / rows
    const width = .015 + Math.sin(Math.PI * t) ** .78
    for (let col = 0; col <= columns; col++) {
      const side = col / columns * 2 - 1
      points.push(side * width, .65 * t * t + .19 * side * side * width, t)
      if (row < rows && col < columns) {
        const a = row * (columns + 1) + col, b = a + columns + 1
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
  one.moveTo(0, .118); one.lineTo(.039, .15); one.lineTo(.057, .15)
  one.lineTo(.057, .018); one.lineTo(.077, .018); one.lineTo(.077, 0)
  one.lineTo(.005, 0); one.lineTo(.005, .018); one.lineTo(.031, .018)
  one.lineTo(.031, .115); one.lineTo(.01, .10); one.closePath()
  const five = new Shape()
  five.moveTo(.10, .15); five.lineTo(.193, .15); five.lineTo(.19, .125); five.lineTo(.123, .125); five.lineTo(.12, .093)
  five.bezierCurveTo(.21, .113, .228, -.009, .141, -.004)
  five.quadraticCurveTo(.112, -.004, .093, .011); five.lineTo(.104, .032)
  five.bezierCurveTo(.17, -.01, .202, .085, .102, .066); five.closePath()
  const mesh = new Mesh(new ExtrudeGeometry([one, five], { depth: .009, bevelThickness: .002, bevelSize: .002, bevelSegments: 2 }),
    new MeshStandardMaterial({ color: '#981a61', metalness: .35, roughness: .38 }))
  mesh.geometry.translate(-.10, 0, 0)
  mesh.position.y = .42
  mesh.rotation.y = .58
  return mesh
}

export function createPhotoCenterpiece(style: Exclude<PhotoCenterpiece,'ribbonBottle'> | 'white' | 'rose', { flowerKind, flowerColor }: FloralOptions): Group {
  const recipe = recipes[style]
  const group = new Group()
  group.position.y = 1.06
  const blades: Piece[] = [], beads: Piece[] = [], stalks: Piece[] = []
  const part = new Object3D()
  const up = new Vector3(0, 1, 0)
  const bowl = new LatheGeometry([[0, 0], [.075, 0], [.10, .025], [.112, .082], [.11, .105], [.098, .103], [.091, .065], [0, .061]].map(([x,y]) => new Vector2(x,y)), 48)
  const classic = style === 'white' || style === 'rose'
  if (classic) bowl.scale(.98, 2.1, .98)
  group.add(new Mesh(bowl, new MeshStandardMaterial({ metalness: classic ? .65 : 0, color: classic ? '#a58b59' : style === 'fifteen' ? '#51344d' : '#3d3431', roughness: .48 })))

  function add(batch: Piece[], color: string, parent?: Matrix4) {
    part.updateMatrix()
    const matrix = part.matrix.clone()
    if (parent) matrix.premultiply(parent)
    batch.push({ matrix, color })
  }
  function stem(start: Vector3, end: Vector3, radius = .003) {
    const axis = end.clone().sub(start)
    part.position.copy(start).lerp(end, .5)
    part.scale.set(radius, axis.length(), radius)
    part.quaternion.setFromUnitVectors(up, axis.normalize())
    add(stalks, '#456036')
  }
  function blade(position: Vector3, yaw: number, tilt: number, width: number, curve: number, length: number, color: string, frame?: Matrix4) {
    part.position.copy(position)
    part.rotation.set(tilt, yaw, 0, 'YXZ')
    // Mirror both axes on recurved petals to keep the instanced face winding.
    part.scale.set(curve < 0 ? -width : width, curve, length)
    add(blades, color, frame)
  }

  const count = style === 'cascade' ? 32 : 22
  for (let i = 0; i < count; i++) {
    const angle = i * goldenAngle
    const t = Math.sqrt((i + .3) / count)
    const r = recipe.radius * t
    const head = new Vector3(Math.cos(angle) * r, recipe.height + recipe.rise * (style === 'cascade' ? (1 - t) * 1.55 : Math.sqrt(1-t*t)) + .016 * Math.sin(3*i), Math.sin(angle) * r)
    stem(new Vector3(head.x * .16, .07, head.z * .16), head)
    const foliage = head.clone().multiplyScalar(.76)
    blade(foliage, Math.PI/2-angle+.62, -.4, .022, .023, .105, '#4d7245')
    const flower = new Object3D()
    flower.position.copy(head)
    flower.quaternion.setFromUnitVectors(up, new Vector3(t * Math.cos(angle), 1 - .65*t, t * Math.sin(angle)).normalize())
    flower.updateMatrix()
    const rose = flowerKind === 'rose' || (flowerKind === 'original' && (style === 'rose' || (style === 'cascade' && (i % 3 === 0 || t < .55))))
    const shade = flowerPalette[flowerColor].hex ?? recipe.colors[i % recipe.colors.length]
    const size = .058 + .013 * (.5 + .5 * Math.cos(i*7))
    if (flowerKind === 'lily') {
      for (let j=0; j<6; j++) {
        const turn = j*Math.PI/3
        blade(new Vector3(), turn, -.68, size*.36, -size*.54, size*1.5, shade, flower.matrix)
        part.rotation.set(.24*Math.cos(turn),0,.24*Math.sin(turn))
        part.position.set(.009*Math.sin(turn),.022,.009*Math.cos(turn)); part.scale.set(.0015,.042,.0015)
        add(stalks,'#a49051',flower.matrix)
        part.position.set(.014*Math.sin(turn),.042,.014*Math.cos(turn)); part.scale.set(.003,.006,.003)
        add(beads,'#975324',flower.matrix)
      }
      continue
    }
    const petals = rose ? 20 : 27
    for (let j = 0; j < petals; j++) {
      const layer = j / petals, turn = goldenAngle * j
      const spread = rose ? .005 + .018*layer : .007
      const start = new Vector3(Math.sin(turn)*spread, .012*(1-layer), Math.cos(turn)*spread)
      blade(start, turn, rose ? -.60 + .54*layer : .10 + layer * .12,
        size * (rose ? .39 : .135), size * (rose ? .82 : .28), size * (.45 + .55*layer), shade, flower.matrix)
    }
    if (!rose) {
      part.position.set(0, .012, 0); part.rotation.set(0, 0, 0); part.scale.set(.015, .009, .015)
      add(beads, i % 3 ? '#c6a044' : '#94703a', flower.matrix)
    }
  }
  for (let i = 0; i < 42; i++) {
    const a = i * goldenAngle
    const origin = new Vector3(Math.sin(a) * .08, .09 + .09*(i%4)/3, Math.cos(a)*.08)
    blade(origin, a, -.25 + .65*(i%5)/4, .016 + .011*(i%3), .021, recipe.radius*(.8 + .45*(i%4)/3), i%2 ? '#405b36' : '#648153')
  }
  if (style === 'cascade' || style === 'harvest') {
    for (let i = 0; i < 18; i++) {
      const a = i * goldenAngle
      const spray = new Vector3(Math.sin(a)*recipe.radius*.8, recipe.height + recipe.rise*(.18+.09*(i%6)), Math.cos(a)*recipe.radius*.8)
      for (let j = 0; j < 5; j++) {
        const branch = a + j*goldenAngle
        const bud = spray.clone().add(new Vector3(.035*Math.sin(branch), .025+.008*(j%3), .035*Math.cos(branch)))
        stem(spray, bud, .0012)
        part.position.copy(bud); part.rotation.set(0,0,0); part.scale.set(.008,.007,.008)
        add(beads, style === 'cascade' ? '#faf4df' : '#ab5151')
      }
    }
  }
  if (style === 'cascade') {
    for (let i = 0; i < 24; i++) {
      const a = i*goldenAngle
      blade(new Vector3(.08*Math.sin(a), .15, .08*Math.cos(a)), a, .15, .006, -.12, .35 + .025*(i%5), '#516943')
    }
    for (let i = 0; i < 5; i++) {
      const angle = goldenAngle * i
      let tip = new Vector3(0, .14, 0)
      for (let j = 1; j <= 6; j++) {
        const next = new Vector3(Math.sin(angle)*j*.075, Math.max(.012, .14-.03*j), Math.cos(angle)*j*.075)
        stem(tip, next, .002)
        blade(next, angle + (j%2 ? .8 : -.8), -.08, .025, .021, .07, '#3b663c')
        tip = next
      }
    }
  }
  if (style === 'fifteen') {
    stem(new Vector3(0,.18,0), new Vector3(0,.47,0))
    group.add(anniversaryTopper())
    const ribbon = new Mesh(new CylinderGeometry(.112,.11,.018,48), new MeshStandardMaterial({color:'#b182bd',roughness:.42}))
    ribbon.position.y = .081
    group.add(ribbon)
  }
  function batch(geometry: BufferGeometry, pieces: Piece[]) {
    const mesh = new InstancedMesh(geometry, new MeshStandardMaterial({ side: DoubleSide, roughness: .83 }), pieces.length)
    pieces.forEach(({ matrix, color }, index) => { mesh.setMatrixAt(index, matrix); mesh.setColorAt(index, new Color(color)) })
    mesh.castShadow = true
    group.add(mesh)
  }
  batch(bladeGeometry(), blades)
  batch(new SphereGeometry(1, 10, 6), beads)
  batch(new CylinderGeometry(1, 1, 1, 5), stalks)
  return group
}
