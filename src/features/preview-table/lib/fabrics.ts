import { BufferGeometry, Float32BufferAttribute, MeshPhysicalMaterial } from 'three'

/** Radial cloth: flat at the tabletop, falling in folds below its rim. */
export function tableclothGeometry() {
  const vertices: number[] = [],
    uvs: number[] = [],
    indices: number[] = []
  const rings = 48,
    slices = 160
  for (let j = 0; j <= rings; j++) {
    const distance = (j / rings) * 1.92
    const fall = Math.max(0, distance - 1.18)
    for (let i = 0; i <= slices; i++) {
      const angle = (i / slices) * Math.PI * 2
      const fold = Math.sin(angle * 22 + Math.sin(angle * 5) * 0.7)
      const radius = Math.min(distance, 1.18) + fall * 0.15 + fold * Math.min(fall * 0.1, 0.055)
      const y = 1.04 - fall + Math.sin(angle * 11) * fall * 0.018
      vertices.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      uvs.push(i / slices, j / rings)
      if (j < rings && i < slices) {
        const a = j * (slices + 1) + i,
          b = a + slices + 1
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function overlayGeometry(width = 1.85, length = 1.85) {
  const vertices: number[] = [],
    indices: number[] = [],
    segments = 40
  for (let j = 0; j <= segments; j++)
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments - 0.5) * width,
        z = (j / segments - 0.5) * length
      const radius = Math.hypot(x, z),
        fall = Math.max(0, radius - 1.19)
      const fold = Math.sin(Math.atan2(z, x) * 22 + Math.sin(Math.atan2(z, x) * 5) * 0.7)
      const scale = fall > 0 ? (1.19 + fall * (0.16 + 0.1 * fold)) / radius : 1
      vertices.push(
        x * scale,
        1.058 - fall * 0.9 + Math.sin(x * 30 + z * 8) * fall * 0.055,
        z * scale,
      )
      if (j < segments && i < segments) {
        const a = j * (segments + 1) + i,
          b = a + segments + 1
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function bowLoopGeometry(side: number) {
  const vertices: number[] = [],
    indices: number[] = [],
    segments = 40
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    for (let edge = 0; edge < 2; edge++) {
      const width = (edge - 0.5) * 0.07
      vertices.push(
        side * Math.sin(t / 2) * 0.24,
        0.91 + Math.sin(t) * 0.075 + width,
        -0.31 - Math.sin(t) * 0.05,
      )
    }
    if (i < segments) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function fabricMaterial(satin = false) {
  const material = new MeshPhysicalMaterial({
    roughness: satin ? 0.48 : 0.86,
    metalness: 0,
    sheen: satin ? 0.9 : 0.45,
    sheenRoughness: 0.75,
    side: 2,
  })
  material.userData.fabricKind = { value: satin ? 1 : 0 }
  // Fine woven fibers from object-space coordinates; no external texture downloads.
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFabricKind = material.userData.fabricKind
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      '#include <common>\nvarying vec3 vFabricPosition;',
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvFabricPosition = position;',
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      '#include <common>\nvarying vec3 vFabricPosition; uniform float uFabricKind;',
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
       float weave = sin(vFabricPosition.x * 650.0)
         * sin((vFabricPosition.y + vFabricPosition.z) * 650.0);
       vec2 fabricUv = vec2(vFabricPosition.x, vFabricPosition.y + vFabricPosition.z);
       float damask = pow(abs(sin(fabricUv.x * 38.0) * cos(fabricUv.y * 38.0)), 2.0);
       float pattern = uFabricKind > 1.5 ? 0.85 + damask * 0.15
         : uFabricKind > 0.5 ? 0.99 + weave * 0.01 : 0.95 + weave * 0.05;
       diffuseColor.rgb *= pattern;`,
    )
  }
  return material
}
