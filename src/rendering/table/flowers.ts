import { CylinderGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import { floralDefaults } from '../../config/table'
import type { FloralOptions, FloralStyle } from '../../types/table'

import { createPhotoCenterpiece } from './photoCenterpieces'

import { createWineBottle } from './wineBottle'

export function createFlowers(style: FloralStyle, options: FloralOptions = floralDefaults) {
  const arrangement = createArrangement(style === 'ribbonBottle' ? 'burgundy' : style, options)
  if (options.bottleOutfit === 'none') return arrangement
  const group = new Group()
  group.position.y = 1.06
  const huaso = createWineBottle('manta')
  const huasa = createWineBottle('huasa')
  const spacing = style === 'none' ? .16 : .28
  huaso.position.set(-spacing, 0, .07)
  huasa.position.set(spacing, 0, -.07)
  if (style !== 'none') {
    const offset = new Group()
    offset.add(arrangement)
    offset.scale.setScalar(.82)
    offset.position.set(0, -1.06*.82, -.16)
    group.add(offset)
  }
  group.add(huaso, huasa)
  return group
}

function createArrangement(style: Exclude<FloralStyle,'ribbonBottle'>, options: FloralOptions) {
  if (style !== 'none' && style !== 'botanical') {
    const classic = style === 'white' || style === 'rose'
    if (!classic || options.flowerKind !== 'original' || options.flowerColor !== 'original') return createPhotoCenterpiece(style, options)
  }
  const group = new Group()
  if (style === 'none') return group
  const gold = new MeshStandardMaterial({ color: '#a58b59', metalness: 0.65, roughness: 0.35 })
  const green = new MeshStandardMaterial({ color: '#526b49', roughness: 0.85 })
  const petals = new MeshStandardMaterial({ color: style === 'rose' ? '#c88e9c' : '#f5eee0', roughness: 0.72 })
  const vase = new Mesh(new CylinderGeometry(0.085, 0.11, 0.22, 32), gold)
  vase.position.y = 1.17; vase.castShadow = true; group.add(vase)
  const petalGeometry = new SphereGeometry(0.047, 12, 8)
  const leafGeometry = new SphereGeometry(0.07, 12, 8)
  for (let i = 0; i < (style === 'botanical' ? 16 : 9); i++) {
    const angle = i * 2.399, radius = style === 'botanical' ? 0.16 : 0.12
    const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius
    const height = 1.35 + Math.sin(i * 2) * 0.05 + (style === 'botanical' ? i % 3 * 0.06 : 0)
    const stem = new Mesh(new CylinderGeometry(0.004, 0.004, height - 1.15, 6), green)
    stem.position.set(x, (height + 1.15) / 2, z); group.add(stem)
    for (let j = 0; j < (style === 'botanical' ? 3 : 6); j++) {
      const a = j / 6 * Math.PI * 2
      const petal = new Mesh(style === 'botanical' ? leafGeometry : petalGeometry, style === 'botanical' ? green : petals)
      petal.position.set(x + Math.cos(a) * 0.035, height, z + Math.sin(a) * 0.035)
      petal.scale.set(1, style === 'botanical' ? 0.24 : 0.5, style === 'botanical' ? 0.55 : 1)
      petal.rotation.y = a; petal.castShadow = true; group.add(petal)
    }
    const leaf = new Mesh(leafGeometry, green)
    leaf.position.set(x * 1.3, height - 0.09, z * 1.3); leaf.scale.set(1, 0.22, 0.5); leaf.rotation.y = angle; group.add(leaf)
  }
  return group
}
