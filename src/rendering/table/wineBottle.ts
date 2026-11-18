import {
  BufferGeometry, CanvasTexture, CylinderGeometry, DoubleSide, Float32BufferAttribute,
  Group, InstancedMesh, LatheGeometry, Mesh, MeshStandardMaterial, Object3D, RepeatWrapping,
  SphereGeometry, SRGBColorSpace, Vector2, Vector3,
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
      ctx.fillStyle = '#29283b'; ctx.fillRect(start, 0, 22, 128)
      ctx.fillStyle = '#eed5a7'; ctx.fillRect(start+4, 0, 3, 128); ctx.fillRect(start+16, 0, 2, 128)
      ctx.fillStyle = '#bc794a'; ctx.fillRect(start+9, 0, 4, 128)
    }
    ctx.fillStyle = '#f9e4c01a'
    for (let y=0; y<128; y+=3) ctx.fillRect(0,y,128,1)
  } else {
    for (const [x,y] of [[32,32],[96,96],[98,28],[27,96]]) {
      ctx.fillStyle = '#577346'
      ctx.beginPath(); ctx.ellipse(x+9,y+8,9,3,-.55,0,Math.PI*2); ctx.fill()
      ctx.fillStyle = '#b53048'
      for (let i=0; i<5; i++) {
        const angle=i*Math.PI*2/5
        ctx.beginPath(); ctx.arc(x+4*Math.cos(angle),y+4*Math.sin(angle),4,0,Math.PI*2); ctx.fill()
      }
      ctx.fillStyle='#eeb156'; ctx.fillRect(x-2,y-2,4,4)
    }
  }
  const map = new CanvasTexture(tile)
  map.colorSpace = SRGBColorSpace
  map.wrapS = map.wrapT = RepeatWrapping
  if (outfit === 'huasa') map.repeat.set(4, 1)
  return new MeshStandardMaterial({ map, side: DoubleSide, roughness: .88 })
}

function poncho(group: Group, cloth: MeshStandardMaterial, ivory: MeshStandardMaterial) {
  const vertices: number[] = [], uv: number[] = [], faces: number[] = []
  const columns = 64, rows = 12
  const fringe = new InstancedMesh(new CylinderGeometry(.0018,.001,1,5), ivory, columns)
  const tuft = new Object3D()
  for (let j=0; j<=rows; j++) for (let i=0; i<=columns; i++) {
    const t=j/rows, a=i*Math.PI*2/columns
    const c=Math.cos(a), s=Math.sin(a)
    const depth = .106*Math.sin(t*Math.PI/2)
    const x = c*(.032+.112*t), z=s*(.032+depth)*(1+.06*Math.sin(9*a))
    const y=.393 - t*(.168+.087*Math.pow(Math.abs(s),3)) + .006*t*Math.cos(9*a)
    vertices.push(x,y,z); uv.push(.5+x/.30, t)
    if (j<rows && i<columns) {
      const k=j*(columns+1)+i, b=k+columns+1
      faces.push(k,b,k+1,b,b+1,k+1)
    }
    if (j===rows && i<columns) {
      const length=.018+.007*Math.cos(a*8)
      tuft.position.set(x,y-length/2,z); tuft.scale.y=length; tuft.rotation.z=.14*c; tuft.updateMatrix()
      fringe.setMatrixAt(i,tuft.matrix)
    }
  }
  const shape=new BufferGeometry()
  shape.setAttribute('position',new Float32BufferAttribute(vertices,3))
  shape.setAttribute('uv',new Float32BufferAttribute(uv,2))
  shape.setIndex(faces); shape.computeVertexNormals()
  group.add(new Mesh(shape,cloth),fringe)
}

export function createWineBottle(outfit: Outfit) {
  const group = new Group()
  const material = (color: string, roughness = .8) => new MeshStandardMaterial({color, roughness, side: DoubleSide})
  const cloth = textile(outfit), ivory = material('#fff0d3'), ribbon = material('#a62b41')
  function turned(profile: number[][], surface: MeshStandardMaterial, folds = 0) {
    const geometry = new LatheGeometry(profile.map(([r,y]) => new Vector2(r,y)),72)
    const points=geometry.attributes.position
    if (folds) {
      for (let i=0; i<points.count; i++) {
        const x=points.getX(i), z=points.getZ(i)
        const factor=1+folds*Math.sin(10*Math.atan2(x,z))
        points.setXYZ(i,x*factor,points.getY(i),z*factor)
      }
      geometry.computeVertexNormals()
    }
    const mesh = new Mesh(geometry,surface)
    group.add(mesh)
    return mesh
  }
  turned([[0,0],[.056,0],[.057,.29],[.053,.335],[.025,.388],[.024,.49],[.029,.50],[.029,.53],[0,.53]],material('#342322',.21))
  turned([[.027,.474],[.03,.50],[.03,.532],[0,.534]],ribbon)
  if (outfit === 'manta') {
    poncho(group,cloth,ivory)
    const felt=material('#3b302a')
    const hat=turned([[0,0],[.096,0],[.101,.005],[.095,.011],[.048,.009],[.043,.056],[.032,.06],[0,.058]],felt)
    hat.position.y=.506; hat.rotation.z=-.09
    const band=turned([[.047,.012],[.046,.022]],material('#c79862'))
    band.position.copy(hat.position); band.rotation.copy(hat.rotation)
  } else {
    turned([[.062,.244],[.077,.295],[.065,.34],[.031,.365]],cloth)
    turned([[.134,.01],[.134,.02],[.099,.116],[.065,.252]],cloth,.105)
    for (const [y,r] of [[.019,.135],[.092,.110],[.154,.090]]) {
      turned([[r,y],[r+.002,y+.008],[r-.008,y+.033]],ivory,.11)
      turned([[r+.002,y+.008],[r,y+.013]],ribbon,.11)
    }
    turned([[.071,.238],[.071,.257]],ribbon)
    turned([[.075,.327],[.066,.352],[.031,.365]],ivory,.07)
    for (const side of [-1,1]) {
      const sleeve = new Mesh(new SphereGeometry(1,16,12),cloth)
      sleeve.position.set(side*.066,.313,0); sleeve.scale.copy(new Vector3(.035,.047,.039))
      group.add(sleeve)
    }
  }
  group.traverse(object => { if (object instanceof Mesh) object.castShadow = true })
  return group
}
