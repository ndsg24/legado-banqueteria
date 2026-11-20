import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  InstancedMesh,
  Raycaster,
  Scene,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { gsap } from 'gsap'
import { createCutlery, createNapkin } from './placeSetting'
import { createFlowers } from './flowers'
import {
  dinnerwareStyles,
  fabricColor,
  napkinFolds,
  tableParts,
  type TableDesign,
  type TablePart,
} from '../../../entities/table'
import { bowLoopGeometry, fabricMaterial, overlayGeometry, tableclothGeometry } from './fabrics'

export type TableView = 'table' | 'chairs' | 'overhead' | 'centerpiece' | 'setting'

export class TableScene {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera = new PerspectiveCamera(36, 1, 0.1, 40)
  private controls: OrbitControls
  private fabrics = Object.fromEntries(
    tableParts.map((part) => [part, fabricMaterial(part === 'sash')]),
  ) as Record<TablePart, MeshPhysicalMaterial>
  private floorMaterial = new MeshStandardMaterial({ roughness: 1 })
  private exportBackground = ''
  private themeObserver = new MutationObserver(() => this.syncTheme())
  private tableSurface = new Group()
  private overlay!: Mesh
  private runner!: Mesh
  private chairs: Group[] = []
  private settings: Group[] = []
  private napkins = new Map<TableDesign['napkinFold'], Group[]>()
  private napkinAccent = fabricMaterial()
  private plateMaterial = new MeshPhysicalMaterial()
  private plateRims: Mesh[] = []
  private centerpiece?: { key: string; model: Group }
  private resizeObserver: ResizeObserver
  private frame = 0
  private disposed = false
  private raycaster = new Raycaster()
  private pointer = new Vector2()
  private press = new Vector2()
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  constructor(
    private canvas: HTMLCanvasElement,
    private onSelect: ((part: TablePart) => void) | undefined,
    private onError: () => void,
    createMain?: (onLoad: () => void) => Mesh,
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.debug.onShaderError = onError
    this.camera.position.set(4.6, 3.5, 5.4)
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.target.set(0, 0.65, 0)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.09
    this.controls.enablePan = false
    this.controls.minDistance = 4.2
    this.controls.maxDistance = 9
    this.controls.maxPolarAngle = Math.PI * 0.47
    this.controls.minPolarAngle = 0.12
    this.controls.addEventListener('change', this.requestRender)
    this.scene.add(new HemisphereLight(0xf6efe4, 0x62695c, 2.5), new AmbientLight(0xffffff, 0.3))
    const key = new DirectionalLight(0xfff1dd, 3.3)
    key.position.set(-3, 7, 4)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 15 })
    key.shadow.normalBias = 0.025
    this.scene.add(key)
    const rim = new DirectionalLight(0xe0eaff, 1.8)
    rim.position.set(4, 4, -4)
    this.scene.add(rim)
    this.build(createMain?.(this.requestRender))
    this.syncTheme()
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    this.resizeObserver = new ResizeObserver(this.resize)
    this.resizeObserver.observe(canvas.parentElement!)
    if (onSelect) {
      canvas.addEventListener('pointerdown', this.pointerDown)
      canvas.addEventListener('pointerup', this.pointerUp)
      canvas.addEventListener('pointermove', this.pointerMove)
    }
    canvas.addEventListener('webglcontextlost', this.contextLost)
    this.resize()
  }

  private mesh(geometry: Mesh['geometry'], material: Material, parent: Object3D, part?: TablePart) {
    const mesh = new Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    if (part) mesh.userData.part = part
    parent.add(mesh)
    return mesh
  }

  private syncTheme() {
    const palette = getComputedStyle(this.canvas)
    this.floorMaterial.color.set(palette.getPropertyValue('--table-stage-floor').trim())
    this.exportBackground = palette.getPropertyValue('--table-stage-export').trim()
    this.requestRender()
  }

  private build(main?: Mesh) {
    const gold = new MeshStandardMaterial({ color: 0xb59961, metalness: 0.75, roughness: 0.27 })
    const glass = new MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.82,
      transparent: true,
      opacity: 0.6,
      roughness: 0.07,
      thickness: 0.04,
      ior: 1.45,
    })
    this.scene.add(this.tableSurface)
    this.mesh(tableclothGeometry(), this.fabrics.tablecloth, this.tableSurface, 'tablecloth')
    this.runner = this.mesh(
      overlayGeometry(0.54, 3.42),
      this.fabrics.overlay,
      this.tableSurface,
      'overlay',
    )
    this.overlay = this.mesh(overlayGeometry(), this.fabrics.overlay, this.tableSurface, 'overlay')
    this.overlay.rotation.y = Math.PI / 4
    const floor = this.mesh(
      new CylinderGeometry(3.1, 3.1, 0.035, 128),
      this.floorMaterial,
      this.scene,
    )
    floor.position.y = -0.035
    floor.castShadow = false

    const cutlery = createCutlery(gold)
    const foldedNapkins = napkinFolds.map((fold) => {
      this.napkins.set(fold, [])
      return { fold, model: createNapkin(fold, this.fabrics.napkin, this.napkinAccent) }
    })

    for (let i = 0; i < 10; i++) {
      const angle = (i / 6) * Math.PI * 2
      const chair = new Group()
      chair.position.set(Math.sin(angle) * 1.86, 0, Math.cos(angle) * 1.86)
      chair.rotation.y = angle + Math.PI
      this.scene.add(chair)
      this.chairs.push(chair)
      this.mesh(
        new RoundedBoxGeometry(0.5, 0.11, 0.49, 3, 0.035),
        this.fabrics.chairCover,
        chair,
        'chairCover',
      ).position.y = 0.51
      const back = this.mesh(
        new RoundedBoxGeometry(0.49, 0.66, 0.1, 4, 0.045),
        this.fabrics.chairCover,
        chair,
        'chairCover',
      )
      back.position.set(0, 0.87, -0.22)
      back.rotation.x = -0.06
      // Skirt panels have a slight flare instead of a rigid box silhouette.
      const skirt = this.mesh(
        new CylinderGeometry(0.25, 0.285, 0.48, 4, 12, true),
        this.fabrics.chairCover,
        chair,
        'chairCover',
      )
      skirt.position.y = 0.255
      skirt.rotation.y = Math.PI / 4
      const band = this.mesh(
        new RoundedBoxGeometry(0.505, 0.12, 0.12, 3, 0.018),
        this.fabrics.sash,
        chair,
        'sash',
      )
      band.position.set(0, 0.91, -0.23)
      this.mesh(bowLoopGeometry(1), this.fabrics.sash, chair, 'sash')
      this.mesh(bowLoopGeometry(-1), this.fabrics.sash, chair, 'sash')
      this.mesh(
        new RoundedBoxGeometry(0.065, 0.08, 0.065, 2, 0.015),
        this.fabrics.sash,
        chair,
        'sash',
      ).position.set(0, 0.91, -0.32)
      for (const side of [-1, 1]) {
        const tail = this.mesh(
          new PlaneGeometry(0.075, 0.3, 3, 8),
          this.fabrics.sash,
          chair,
          'sash',
        )
        tail.position.set(side * 0.055, 0.75, -0.32)
        tail.rotation.z = side * -0.2
      }

      const setting = new Group()
      setting.position.set(Math.sin(angle) * 0.82, 1.07, Math.cos(angle) * 0.82)
      setting.rotation.y = angle
      this.scene.add(setting)
      this.settings.push(setting)
      // Trace the profile from the outer lip toward the center so its glazed face points up.
      const plateProfile = [
        new Vector2(0.235, 0.032),
        new Vector2(0.23, 0.025),
        new Vector2(0.2, 0.012),
        new Vector2(0.15, 0),
        new Vector2(0, 0),
      ]
      this.mesh(new LatheGeometry(plateProfile, 64), this.plateMaterial, setting)
      const lip = this.mesh(new TorusGeometry(0.232, 0.002, 6, 64), gold, setting)
      lip.rotation.x = Math.PI / 2
      lip.position.y = 0.032
      this.plateRims.push(lip)
      setting.add(cutlery.clone())
      if (main) setting.add(main.clone())
      for (const { fold, model } of foldedNapkins) {
        const folded = model.clone()
        this.napkins.get(fold)!.push(folded)
        if (main && fold === 'flat') folded.position.set(-0.31, 0.004, 0)
        setting.add(folded)
      }
      const glassGroup = new Group()
      glassGroup.position.set(0.23, 0, -0.248)
      setting.add(glassGroup)
      const bowl = this.mesh(
        new LatheGeometry(
          [
            new Vector2(0, 0.14),
            new Vector2(0.055, 0.15),
            new Vector2(0.075, 0.2),
            new Vector2(0.065, 0.29),
          ],
          24,
        ),
        glass,
        glassGroup,
      )
      bowl.castShadow = false
      this.mesh(new CylinderGeometry(0.007, 0.007, 0.14, 10), glass, glassGroup).position.y = 0.075
      this.mesh(new CylinderGeometry(0.055, 0.055, 0.008, 24), glass, glassGroup).position.y = 0.008
    }
  }

  setDesign(design: TableDesign) {
    this.runner.visible = design.overlayStyle === 'runner'
    this.overlay.visible = !this.runner.visible
    const finish = dinnerwareStyles[design.dinnerware]
    this.plateMaterial.color.set(finish.color)
    this.plateMaterial.roughness = finish.roughness
    this.plateMaterial.clearcoat = finish.clearcoat
    this.plateRims.forEach((rim) => {
      rim.visible = design.dinnerware === 'goldRim'
    })
    const chairs = design.roundSeats?.[0] ?? design.chairs
    const scale = 1 + (chairs - 6) * 0.06
    this.tableSurface.scale.set(scale, 1, scale)
    this.chairs.forEach((chair, index) => {
      const angle = (index / chairs) * Math.PI * 2,
        radius = 1.86 + (scale - 1) * 1.18
      chair.visible = index < chairs
      chair.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius)
      chair.rotation.y = angle + Math.PI
      const setting = this.settings[index]
      setting.visible = chair.visible
      setting.scale.setScalar(1 - 0.05 * (chairs - 6))
      setting.position.set(Math.sin(angle) * 0.82 * scale, 1.07, Math.cos(angle) * 0.82 * scale)
      setting.rotation.y = angle
    })
    this.napkins.forEach((models, fold) => {
      for (const model of models) model.visible = design.napkinFold === fold
    })
    this.napkinAccent.color.set(fabricColor(design.napkin === 'gold' ? 'ivory' : 'gold').hex)
    this.requestRender()
    const key = [design.floral, design.flowerKind, design.flowerColor, design.bottleOutfit].join(
      '/',
    )
    if (this.centerpiece?.key !== key) {
      if (this.centerpiece) {
        this.scene.remove(this.centerpiece.model)
        this.disposeMeshes(this.centerpiece.model)
      }
      const model = createFlowers(design.floral, design)
      this.centerpiece = { key, model }
      this.scene.add(model)
    }
    for (const part of tableParts) {
      const material = this.fabrics[part],
        target = new Color(fabricColor(design[part]).hex)
      const texture = design.textures[part]
      material.userData.fabricKind.value = texture === 'satin' ? 1 : texture === 'damask' ? 2 : 0
      material.roughness = texture === 'satin' ? 0.38 : texture === 'damask' ? 0.65 : 0.92
      material.sheen = texture === 'satin' ? 1 : 0.4
      gsap.to(material.color, {
        r: target.r,
        g: target.g,
        b: target.b,
        duration: this.reducedMotion.matches ? 0 : 0.55,
        overwrite: true,
        onUpdate: this.requestRender,
      })
    }
    this.napkinAccent.roughness = this.fabrics.napkin.roughness
    this.napkinAccent.sheen = this.fabrics.napkin.sheen
    this.napkinAccent.userData.fabricKind.value = this.fabrics.napkin.userData.fabricKind.value
  }

  setView(view: TableView) {
    const close = view === 'centerpiece'
    const setting = view === 'setting'
    this.controls.minDistance = close || setting ? 0.8 : 4.2
    const duration = this.reducedMotion.matches ? 0 : 1.2
    gsap.to(this.controls.target, {
      y: close ? 1.34 : setting ? 1.26 : 0.65,
      z: setting ? this.settings[0].position.z - 0.1 : 0,
      duration,
      ease: 'power3.inOut',
      overwrite: true,
    })
    const position = setting
      ? { x: 0.19, y: 2.43, z: this.settings[0].position.z + 0.9 }
      : close
        ? { x: 1.01, y: 2.07, z: 1.42 }
        : view === 'overhead'
          ? { x: 0.01, y: 7.5, z: 0.8 }
          : view === 'chairs'
            ? { x: 3.8, y: 2.1, z: 3.6 }
            : { x: 4.6, y: 3.5, z: 5.4 }
    gsap.to(this.camera.position, {
      ...position,
      duration,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => {
        this.controls.update()
        this.requestRender()
      },
    })
  }

  capturePreview() {
    this.renderer.render(this.scene, this.camera)
    const picture = document.createElement('canvas')
    picture.width = Math.min(1200, this.canvas.width)
    picture.height = Math.max(
      1,
      Math.round((picture.width * this.canvas.height) / this.canvas.width),
    )
    const context = picture.getContext('2d')
    if (!context) return undefined
    context.fillStyle = this.exportBackground
    context.fillRect(0, 0, picture.width, picture.height)
    context.drawImage(this.canvas, 0, 0, picture.width, picture.height)
    return picture.toDataURL('image/jpeg', 0.9)
  }

  async saveImage() {
    const size = this.renderer.getSize(new Vector2()),
      ratio = this.renderer.getPixelRatio()
    const aspect = this.camera.aspect,
      zoom = this.camera.zoom,
      background = this.scene.background
    let blob: Blob | null = null
    try {
      const width = Math.min(3840, this.renderer.capabilities.maxTextureSize)
      this.renderer.setPixelRatio(1)
      this.renderer.setSize(width, Math.round(width / 1.6), false)
      this.camera.aspect = 1.6
      this.camera.zoom = 1
      this.camera.updateProjectionMatrix()
      this.scene.background = new Color(this.exportBackground)
      this.renderer.render(this.scene, this.camera)
      blob = await new Promise<Blob | null>((resolve) => this.canvas.toBlob(resolve, 'image/png'))
    } finally {
      this.scene.background = background
      this.camera.aspect = aspect
      this.camera.zoom = zoom
      this.camera.updateProjectionMatrix()
      this.renderer.setPixelRatio(ratio)
      this.renderer.setSize(size.x, size.y, false)
      this.requestRender()
    }
    if (!blob) throw new Error('table.share.saveError')
    const url = URL.createObjectURL(blob),
      link = document.createElement('a')
    link.href = url
    link.download = 'mi-mesa-legado-4k.png'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  private hit(event: PointerEvent): TablePart | undefined {
    const rect = this.canvas.getBoundingClientRect()
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(this.pointer, this.camera)
    return this.raycaster.intersectObjects(this.scene.children, true).find((hit) => {
      let node: Object3D | null = hit.object
      while (node) {
        if (!node.visible) return false
        node = node.parent
      }
      return true
    })?.object.userData.part
  }
  private pointerDown = (event: PointerEvent) => {
    this.press.set(event.clientX, event.clientY)
  }
  private pointerUp = (event: PointerEvent) => {
    if (this.press.distanceTo(new Vector2(event.clientX, event.clientY)) > 6) return
    const part = this.hit(event)
    if (part) this.onSelect?.(part)
  }
  private pointerMove = (event: PointerEvent) => {
    this.canvas.style.cursor = this.hit(event) ? 'pointer' : 'grab'
  }
  private contextLost = (event: Event) => {
    event.preventDefault()
    this.onError()
  }
  private resize = () => {
    const { width, height } = this.canvas.getBoundingClientRect()
    if (!width || !height) return
    this.camera.aspect = width / height
    this.camera.zoom = Math.min(1, this.camera.aspect / 1.15)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.requestRender()
  }
  private requestRender = () => {
    if (!this.disposed && !this.frame) this.frame = requestAnimationFrame(this.render)
  }
  private render = () => {
    this.frame = 0
    if (this.disposed) return
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
  private disposeMeshes(root: Object3D) {
    const materials = new Set<Material>()
    const geometries = new Set<Mesh['geometry']>()
    root.traverse((object) => {
      if (object instanceof InstancedMesh) object.dispose()
      if (!(object instanceof Mesh)) return
      geometries.add(object.geometry)
      for (const material of Array.isArray(object.material) ? object.material : [object.material])
        materials.add(material)
    })
    geometries.forEach((geometry) => geometry.dispose())
    materials.forEach((material) => {
      if (material instanceof MeshStandardMaterial) {
        gsap.killTweensOf(material.color)
        material.map?.dispose()
      }
      material.dispose()
    })
  }
  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frame)
    this.resizeObserver.disconnect()
    this.themeObserver.disconnect()
    this.controls.dispose()
    gsap.killTweensOf([this.camera.position, this.controls.target])
    this.disposeMeshes(this.scene)
    this.canvas.removeEventListener('pointerdown', this.pointerDown)
    this.canvas.removeEventListener('pointerup', this.pointerUp)
    this.canvas.removeEventListener('pointermove', this.pointerMove)
    this.canvas.removeEventListener('webglcontextlost', this.contextLost)
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}
