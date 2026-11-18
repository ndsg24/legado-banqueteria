import {
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector4,
  WebGLRenderer,
} from 'three'
import { gsap } from 'gsap'
import type { CatalogItem } from '../types/catalog'
import { createAtmosphere } from './catalogAtmosphere'
import { catalogFragmentShader, catalogVertexShader } from './catalogShaders'

type MotionState = {
  reveal: number
  scale: number
  x: number
  y: number
  focus: number
  sweep: number
  opacity: number
  blur: number
  atmosphere: number
}

type ProductView = {
  stage: HTMLElement
  scene: Scene
  mesh: Mesh<PlaneGeometry, ShaderMaterial>
  atmosphere: Mesh<PlaneGeometry, ShaderMaterial>
  state: MotionState
  timeline: gsap.core.Timeline
  visible: boolean
  ready: boolean
  size: Vector2
  rect: { x: number; y: number; width: number; height: number }
  dispose: () => void
}

/** One GPU context, many scissored product views, rendered only on demand. */
export class CatalogScene {
  private renderer: WebGLRenderer
  private camera = new PerspectiveCamera(38, 1, 0.1, 20)
  private geometry = new PlaneGeometry(1, 1, 24, 24)
  private views: ProductView[] = []
  private themeObserver: MutationObserver
  private resizeObserver: ResizeObserver
  private visibilityObserver: IntersectionObserver
  private media = window.matchMedia('(prefers-reduced-motion: reduce)')
  private frame = 0
  private disposed = false
  private failed = false
  private generation = 0
  private width = 0
  private height = 0

  constructor(
    private container: HTMLDivElement,
    private canvas: HTMLCanvasElement,
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.autoClear = false
    this.renderer.debug.onShaderError = this.fallback
    this.themeObserver = new MutationObserver(() => {
      const style = getComputedStyle(document.documentElement)
      for (const view of this.views) {
        view.atmosphere.material.uniforms.uGold.value.set(style.getPropertyValue('--gold').trim())
        view.atmosphere.material.uniforms.uMist.value.set(style.getPropertyValue('--muted').trim())
      }
      this.requestRender()
    })
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    this.camera.position.z = 3
    this.resizeObserver = new ResizeObserver(this.resize)
    this.resizeObserver.observe(container)
    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const view = this.views.find((candidate) => candidate.stage === entry.target)
          if (!view) continue
          view.visible = entry.isIntersecting
          if (view.visible && view.ready) view.timeline.play()
          if (!view.visible && view.state.atmosphere > 0) this.focusView(null)
        }
        this.requestRender()
      },
      { threshold: 0.12 },
    )
    this.canvas.addEventListener('webglcontextlost', this.contextLost)
    document.addEventListener('visibilitychange', this.visibilityChanged)
    document.fonts.addEventListener('loadingdone', this.resize)
    this.media.addEventListener('change', this.motionPreferenceChanged)
  }

  setItems(items: readonly CatalogItem[]) {
    this.clearViews()
    const generation = this.generation
    if (this.failed) {
      this.container.dataset.visuals = 'fallback'
      return
    }
    this.container.dataset.visuals = 'ready'

    items.forEach((item, index) => {
      const stage = this.container.querySelector<HTMLElement>(`[data-product="${item.id}"]`)
      if (!stage) return
      const bounds = item.imageBounds
      const pad = 2
      const x = Math.max(0, bounds.x - pad)
      const y = Math.max(0, bounds.y - pad)
      const width = Math.min(item.imageWidth - x, bounds.width + pad * 2)
      const height = Math.min(item.imageHeight - y, bounds.height + pad * 2)
      const longest = Math.max(width, height)
      const material = new ShaderMaterial({
        uniforms: {
          uMap: { value: null },
          uBounds: {
            value: new Vector4(
              x / item.imageWidth,
              1 - (y + height) / item.imageHeight,
              width / item.imageWidth,
              height / item.imageHeight,
            ),
          },
          uReveal: { value: 0 },
          uFocus: { value: 0 },
          uSweep: { value: -0.4 },
          uOpacity: { value: 1 },
          uBlur: { value: 0 },
        },
        vertexShader: catalogVertexShader,
        fragmentShader: catalogFragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      })
      const mesh = new Mesh(this.geometry, material)
      mesh.scale.set((width / longest) * 1.7, (height / longest) * 1.7, 1)
      const scene = new Scene()
      const atmosphere = createAtmosphere(item, this.geometry)
      scene.add(mesh, atmosphere)
      const state: MotionState = {
        reveal: 0,
        scale: 1,
        x: 0,
        y: 0.035,
        focus: 0,
        sweep: -0.4,
        opacity: 1,
        blur: 0,
        atmosphere: 0,
      }
      const copy =
        stage.closest('article')?.querySelectorAll<HTMLElement>('[data-catalog-copy]') ?? []
      const timeline = gsap.timeline({ paused: true, onUpdate: this.requestRender })
      const delay = (index % 4) * 0.065
      timeline.to(state, { reveal: 1, duration: 0.9, ease: 'sine.inOut' }, delay)
      timeline.fromTo(
        copy,
        { opacity: 0 },
        { opacity: 1, duration: 0.75, stagger: 0.055, ease: 'power3.out' },
        0.2,
      )

      const view: ProductView = {
        stage,
        scene,
        mesh,
        atmosphere,
        state,
        timeline,
        visible: false,
        ready: false,
        size: new Vector2((width / longest) * 1.7, (height / longest) * 1.7),
        rect: { x: 0, y: 0, width: 0, height: 0 },
        dispose: () => {},
      }
      const xTo = gsap.quickTo(state, 'x', {
        duration: 0.75,
        ease: 'power3.out',
        onUpdate: this.requestRender,
      })
      const yTo = gsap.quickTo(state, 'y', {
        duration: 0.75,
        ease: 'power3.out',
        onUpdate: this.requestRender,
      })
      const enter = (event: Event) => {
        if (this.media.matches || (event instanceof PointerEvent && event.pointerType !== 'mouse'))
          return
        this.focusView(view)
      }
      const move = (event: PointerEvent) => {
        if (this.media.matches || event.pointerType !== 'mouse') return
        const rect = stage.getBoundingClientRect()
        xTo(((event.clientX - rect.left) / rect.width - 0.5) * 0.085)
        yTo(0.035 - ((event.clientY - rect.top) / rect.height - 0.5) * 0.055)
      }
      const leave = () => {
        xTo(0)
        yTo(0.035)
        this.focusView(null)
      }
      stage.addEventListener('pointerenter', enter)
      stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerleave', leave)
      stage.addEventListener('focusin', enter)
      stage.addEventListener('focusout', leave)
      let loadTimeout = 0
      view.dispose = () => {
        window.clearTimeout(loadTimeout)
        timeline.kill()
        gsap.killTweensOf(state)
        xTo.tween.kill()
        yTo.tween.kill()
        gsap.set(copy, { clearProps: 'opacity,visibility,transform' })
        material.uniforms.uMap.value?.dispose()
        material.dispose()
        atmosphere.material.dispose()
        stage.removeEventListener('pointerenter', enter)
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerleave', leave)
        stage.removeEventListener('focusin', enter)
        stage.removeEventListener('focusout', leave)
        delete stage.dataset.rendered
        delete stage.dataset.failed
        delete stage.dataset.exploring
      }
      this.views.push(view)
      this.visibilityObserver.observe(stage)
      loadTimeout = window.setTimeout(() => {
        if (view.ready) return
        stage.dataset.failed = 'true'
        timeline.progress(1).pause()
      }, 4000)
      const source =
        stage.querySelector('img')?.currentSrc ||
        `${import.meta.env.BASE_URL}${item.imageSmall ?? item.image}`
      new TextureLoader().load(
        source,
        (texture) => {
          if (this.disposed || generation !== this.generation) {
            texture.dispose()
            return
          }
          window.clearTimeout(loadTimeout)
          delete stage.dataset.failed
          texture.colorSpace = SRGBColorSpace
          texture.anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 4)
          material.uniforms.uMap.value = texture
          view.ready = true
          stage.dataset.rendered = 'true'
          if (this.media.matches) this.finishView(view)
          else if (view.visible) timeline.play()
          this.requestRender()
        },
        undefined,
        () => {
          if (this.disposed || generation !== this.generation) return
          window.clearTimeout(loadTimeout)
          timeline.progress(1).pause()
          stage.dataset.failed = 'true'
          delete stage.dataset.rendered
        },
      )
    })
    this.resize()
  }

  private focusView(active: ProductView | null) {
    for (const view of this.views) {
      const focused = view === active
      view.stage.dataset.exploring = String(focused)
      const background = active !== null && !focused
      if (focused) view.state.sweep = -0.4
      gsap.to(view.state, {
        focus: focused ? 1 : 0,
        atmosphere: focused && !this.media.matches ? 1 : 0,
        scale: focused ? 1.075 : background ? 0.985 : 1,
        opacity: background ? 0.52 : 1,
        blur: background ? 0.0022 : 0,
        ...(focused ? { sweep: 1.7 } : {}),
        duration: focused ? 1.05 : 0.75,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: this.requestRender,
      })
    }
  }

  private finishView(view: ProductView) {
    view.timeline.progress(1).pause()
    gsap.killTweensOf(view.state)
    Object.assign(view.state, {
      reveal: 1,
      scale: 1,
      x: 0,
      y: 0.035,
      focus: 0,
      opacity: 1,
      blur: 0,
      atmosphere: 0,
    })
  }

  private resize = () => {
    if (this.disposed) return
    const root = this.container.getBoundingClientRect()
    this.width = root.width
    this.height = root.height
    if (this.width < 1 || this.height < 1) return
    this.renderer.setSize(this.width, this.height, false)
    for (const view of this.views) {
      const rect = view.stage.getBoundingClientRect()
      view.rect = {
        x: rect.left - root.left,
        y: root.height - (rect.bottom - root.top),
        width: rect.width,
        height: rect.height,
      }
    }
    this.requestRender()
  }

  private requestRender = () => {
    if (this.disposed || this.failed || this.frame || document.hidden) return
    this.frame = requestAnimationFrame(this.render)
  }

  private render = () => {
    this.frame = 0
    if (this.disposed || this.failed || !this.width || !this.height) return
    this.renderer.setScissorTest(false)
    this.renderer.clear()
    this.renderer.setScissorTest(true)
    for (const view of this.views) {
      if (!view.ready || !view.visible) continue
      const { rect, state, mesh } = view
      if (!rect.width || !rect.height) continue
      mesh.material.uniforms.uReveal.value = state.reveal
      mesh.material.uniforms.uFocus.value = state.focus
      mesh.material.uniforms.uSweep.value = state.sweep
      mesh.material.uniforms.uOpacity.value = state.opacity
      mesh.material.uniforms.uBlur.value = state.blur
      view.atmosphere.material.uniforms.uTime.value = performance.now() / 1000
      view.atmosphere.material.uniforms.uStrength.value = state.atmosphere
      view.atmosphere.visible = state.atmosphere > 0.001
      mesh.position.set(state.x, state.y, 0)
      mesh.rotation.set(-state.y * 0.04, state.x * 0.4, 0)
      mesh.scale.set(view.size.x * state.scale, view.size.y * state.scale, 1)
      this.renderer.setViewport(rect.x, rect.y, rect.width, rect.height)
      this.renderer.setScissor(rect.x, rect.y, rect.width, rect.height)
      this.renderer.render(view.scene, this.camera)
    }
    if (
      !this.media.matches &&
      this.views.some((view) => view.visible && view.ready && view.state.atmosphere > 0.001)
    )
      this.requestRender()
  }

  private visibilityChanged = () => {
    if (!document.hidden) this.requestRender()
  }
  private motionPreferenceChanged = () => {
    if (this.media.matches) for (const view of this.views) this.finishView(view)
    this.requestRender()
  }
  private contextLost = (event: Event) => {
    event.preventDefault()
    this.fallback()
  }
  private fallback = () => {
    this.failed = true
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.container.dataset.visuals = 'fallback'
    for (const view of this.views) {
      this.finishView(view)
      delete view.stage.dataset.rendered
    }
    this.canvas.style.visibility = 'hidden'
  }

  private clearViews() {
    this.generation += 1
    for (const view of this.views) {
      this.visibilityObserver.unobserve(view.stage)
      view.dispose()
    }
    this.views = []
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frame)
    this.clearViews()
    this.resizeObserver.disconnect()
    this.themeObserver.disconnect()
    this.visibilityObserver.disconnect()
    this.media.removeEventListener('change', this.motionPreferenceChanged)
    this.canvas.removeEventListener('webglcontextlost', this.contextLost)
    document.removeEventListener('visibilitychange', this.visibilityChanged)
    document.fonts.removeEventListener('loadingdone', this.resize)
    this.geometry.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}
