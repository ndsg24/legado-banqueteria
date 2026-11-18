import {
  BufferGeometry, ExtrudeGeometry, Float32BufferAttribute, Group, LatheGeometry, Mesh,
  Shape, Vector2, type Material,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { NapkinFold } from '../../types/table'

function flatwareBlank() {
  const shape = new Shape()
  shape.moveTo(-.008, .026)
  shape.bezierCurveTo(-.007, -.049, -.018, -.15, -.014, -.174)
  shape.quadraticCurveTo(0, -.19, .014, -.174)
  shape.bezierCurveTo(.018, -.15, .007, -.049, .008, .026)
  return shape
}

function forged(shape: Shape, material: Material) {
  shape.closePath()
  const geometry = new ExtrudeGeometry(shape, { depth: .004, bevelSize: .0014, bevelThickness: .0015, bevelSegments: 2, curveSegments: 8 })
  geometry.rotateX(-Math.PI / 2)
  return new Mesh(geometry, material)
}

export function createCutlery(material: Material) {
  const cutlery = new Group()
  const fork = flatwareBlank()
  fork.bezierCurveTo(.008,.052,.028,.063,.028,.083)
  // Four separate tines taper towards the tip, with a rounded root in each gap.
  for (let i = 0; i < 4; i++) {
    const x = .024 - i * .016
    fork.lineTo(x + .002, .177)
    fork.lineTo(x - .002, .177)
    fork.lineTo(x - .005, .10)
    if (i < 3) fork.quadraticCurveTo(x - .008,.085,x - .011,.10)
  }
  fork.lineTo(-.028,.083); fork.bezierCurveTo(-.028,.063,-.008,.052,-.008,.026)
  const forkMesh = forged(fork, material)
  forkMesh.position.x = -.273
  cutlery.add(forkMesh)

  const knife = flatwareBlank()
  knife.lineTo(.014,.045); knife.lineTo(.014,.197)
  knife.quadraticCurveTo(-.028,.189,-.026,.13)
  knife.lineTo(-.021,.039); knife.lineTo(-.008,.026)
  const knifeMesh = forged(knife, material)
  knifeMesh.position.x = .259
  cutlery.add(knifeMesh)

  const spoon = new Group()
  const handle = flatwareBlank()
  handle.lineTo(.008,.094); handle.lineTo(-.008,.094)
  spoon.add(forged(handle,material))
  const profile = [[0,0],[.019,.003],[.034,.012],[.037,.019],[.035,.020],[.030,.014],[.017,.008],[0,.005]]
  const bowl = new Mesh(new LatheGeometry(profile.map(([r,y]) => new Vector2(r,y)),32),material)
  bowl.scale.z = 1.48
  bowl.position.z = -.134
  spoon.add(bowl)
  const dessert = spoon.clone()
  dessert.scale.setScalar(.71)
  dessert.rotation.y = Math.PI/2
  dessert.position.z = -.272
  spoon.position.x = .323
  cutlery.add(spoon,dessert)
  cutlery.position.y = .001
  cutlery.traverse(object => { if (object instanceof Mesh) object.castShadow = true })
  return cutlery
}

// Sample each folded sheet from the tucked base to its uneven upper hem.
function foldedSheet(columns: number, sample: (u: number, t: number) => number[]) {
  const vertices: number[] = [], indices: number[] = []
  const rows = 10
  for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) {
    vertices.push(...sample(col / columns,row / rows))
    if (row < rows && col < columns) {
      const a = row*(columns+1)+col, b = a+columns+1
      indices.push(a,b,a+1,b,b+1,a+1)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position',new Float32BufferAttribute(vertices,3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function createNapkin(fold: NapkinFold, cloth: Material, accent: Material) {
  const group = new Group()
  if (fold === 'flat') {
    const napkin = new Mesh(new RoundedBoxGeometry(.17,.025,.25,2,.006),cloth)
    napkin.position.y = .04
    napkin.rotation.y = .1
    group.add(napkin)
  } else {
    group.position.set(.23,.175,-.248)
    if (fold === 'doubleV') {
      const roll = foldedSheet(40,(u,t) => {
        const angle = u*Math.PI*2.5
        const radius = (.014 + .013*u) * (.7 + .3*t)
        return [radius*Math.cos(angle), t*(.40 + .047*Math.cos(angle)), radius*Math.sin(angle)]
      })
      for (const side of [-1,1]) {
        const tip = new Mesh(roll, cloth)
        tip.rotation.z = side*.29
        tip.rotation.y = side*.45
        group.add(tip)
      }
    } else if (fold === 'fan') {
      const fan = foldedSheet(14,(u,t) => {
        const angle = (u-.5)*1.55
        const crease = Math.cos(14*Math.PI*u)
        const length = .045 + t*(.29 + .025*u)
        return [Math.sin(angle)*length, Math.cos(angle)*length, crease*(.009+.025*t) + .018*t*t]
      })
      group.add(new Mesh(fan,cloth))
    } else {
      const crown = foldedSheet(64,(u,t) => {
        const angle = u * Math.PI * 2
        const peak = Math.abs(((u*4 + .5) % 1)*2-1)
        const radius = .021 + t*(.068 + .022*Math.cos(8*angle))
        return [radius*Math.cos(angle),t*(.205 + .135*peak + .025*Math.sin(angle)),radius*Math.sin(angle)]
      })
      group.add(new Mesh(crown,cloth))
      if (fold === 'duo') {
        const inner = new Mesh(crown,accent)
        inner.rotation.y = Math.PI/4
        inner.scale.set(.75,1.17,.75)
        group.add(inner)
      }
    }
  }
  group.traverse(object => {
    if (object instanceof Mesh) { object.userData.part = 'napkin'; object.castShadow = true }
  })
  return group
}
