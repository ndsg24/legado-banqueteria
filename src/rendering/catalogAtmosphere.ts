import { Color, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import type { CatalogItem } from '../types/catalog'

/** Culinary atmosphere: warm dishes breathe, chilled dishes sparkle, drinks effervesce. */
export function atmosphereKind(item: CatalogItem): number {
  if (/^(aperitivos|bajativos|bar)-/.test(item.id)) return 2
  if (/^(principales|guarniciones|salsas|nocturnos)-/.test(item.id) && !/ceviche|ensalada|frí[oa]/i.test(item.name)) return 0
  return 1
}

export function createAtmosphere(item: CatalogItem, geometry: PlaneGeometry) {
  const style = getComputedStyle(document.documentElement)
  const material = new ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    uniforms: {
      uTime: { value: 0 }, uStrength: { value: 0 }, uKind: { value: atmosphereKind(item) },
      uGold: { value: new Color(style.getPropertyValue('--gold').trim()) },
      uMist: { value: new Color(style.getPropertyValue('--muted').trim()) },
    },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime, uStrength, uKind;
      uniform vec3 uGold, uMist;
      float iceCube(vec2 uv, vec2 center, float angle, float size){
        vec2 p=uv-center;
        p=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p;
        vec2 q=abs(p)-vec2(size);
        float box=length(max(q,0.0))+min(max(q.x,q.y),0.0)-0.007;
        float edge=1.0-smoothstep(0.001,0.004,abs(box));
        float inside=1.0-smoothstep(-0.003,0.001,box);
        float facet=(1.0-smoothstep(0.001,0.003,abs(p.x+p.y*0.55)))*inside;
        float glint=exp(-length(p-vec2(-size,size))*110.0);
        return edge*0.62+inside*0.07+facet*0.2+glint*0.6;
      }
      float hash(float n){return fract(sin(n*127.1)*43758.5453);}
      void main(){
        vec2 uv=vUv;
        float alpha=0.0;
        vec3 color=uGold;
        if(uKind<0.5){
          // Several translucent, curling ribbons, fading before the frame edges.
          for(int i=0;i<5;i++){
            float seed=float(i);
            float rise=fract(uTime*0.16+seed*0.217);
            float y=0.42+rise*0.52;
            float center=0.5+(seed-2.0)*0.065+sin(uv.y*15.0-uTime*1.3+seed*2.0)*0.025;
            float width=0.018+rise*0.045;
            float ribbon=exp(-pow((uv.x-center)/width,2.0));
            float plume=exp(-pow((uv.y-y)/0.15,2.0));
            alpha+=ribbon*plume*sin(rise*3.14159)*0.34;
          }
          color=uMist;
        }else{
          for(int i=0;i<24;i++){
            float seed=float(i)+1.0;
            float life=fract(uTime*(0.13+hash(seed)*0.11)+hash(seed*3.1));
            float angle=hash(seed*7.3)*6.28318;
            vec2 pos;
            if(uKind>1.5){
              pos=vec2(0.5+(hash(seed*2.7)-0.5)*0.38+sin(life*7.0+seed)*0.018,0.28+life*0.64);
            }else{
              float radius=0.23+life*0.21;
              pos=vec2(0.5,0.49)+vec2(cos(angle),sin(angle)*0.75)*radius;
            }
            float radius=uKind>1.5 ? mix(0.005,0.012,hash(seed*8.1)) : mix(0.0025,0.006,hash(seed*8.1));
            float distance=length(uv-pos);
            float fade=sin(life*3.14159);
            float dot=1.0-smoothstep(radius*0.4,radius*1.6,distance);
            float halo=exp(-distance*distance/(radius*radius*14.0))*0.12;
            if(uKind>1.5) dot*=smoothstep(radius*0.35,radius*0.75,distance);
            alpha+=(dot+halo)*fade*(uKind>1.5 ? 1.15 : 0.8);
          }
        }
        if(uKind>1.5){
          // Slow faceted ice reflections at the edges of the glass, never baked into the photograph.
          float ice=iceCube(uv,vec2(0.30+sin(uTime*0.45)*0.013,0.46+cos(uTime*0.55)*0.016),-0.22+sin(uTime*0.3)*0.12,0.043);
          ice+=iceCube(uv,vec2(0.69+cos(uTime*0.4)*0.012,0.64+sin(uTime*0.48)*0.018),0.32+cos(uTime*0.35)*0.1,0.032);
          ice+=iceCube(uv,vec2(0.60+sin(uTime*0.35)*0.01,0.29+cos(uTime*0.4)*0.01),-0.35,0.024);
          float sparkle=pow(max(0.0,sin(uTime*1.4)),8.0);
          alpha+=ice*(0.8+sparkle*0.2);
          color=mix(uGold,vec3(0.68,0.88,1.0),0.78);
        }
        alpha*=uStrength*smoothstep(0.0,0.08,uv.y)*(1.0-smoothstep(0.92,1.0,uv.y));
        gl_FragColor=vec4(color, min(alpha,0.82));
        #include <colorspace_fragment>
      }
    `,
  })
  const mesh = new Mesh(geometry, material)
  mesh.scale.set(2.02, 2.02, 1)
  mesh.position.z = 0.1
  mesh.renderOrder = 2
  return mesh
}
