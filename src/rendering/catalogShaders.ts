export const catalogVertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uFocus;

  void main() {
    vUv = uv;
    vec3 p = position;
    float dome = sin(uv.x * 3.14159265) * sin(uv.y * 3.14159265);
    p.z += dome * uFocus * 0.045;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

export const catalogFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform vec4 uBounds;
  uniform float uReveal;
  uniform float uFocus;
  uniform float uSweep;
  uniform float uOpacity;
  uniform float uBlur;

  void main() {
    vec2 sampleUv = uBounds.xy + vUv * uBounds.zw;
    vec4 color = texture2D(uMap, sampleUv);
    if (uBlur > 0.00001) {
      float blur = uBlur;
      color *= 0.5;
      color += texture2D(uMap, sampleUv + vec2(blur, 0.0)) * 0.125;
      color += texture2D(uMap, sampleUv - vec2(blur, 0.0)) * 0.125;
      color += texture2D(uMap, sampleUv + vec2(0.0, blur)) * 0.125;
      color += texture2D(uMap, sampleUv - vec2(0.0, blur)) * 0.125;
    }

    float sweep = exp(-pow((vUv.x * 0.8 + vUv.y * 0.4 - uSweep) * 8.0, 2.0));
    float highlights = smoothstep(0.35, 0.9, dot(color.rgb, vec3(0.2126, 0.7152, 0.0722)));
    color.rgb += vec3(0.075, 0.065, 0.045) * sweep * uFocus * highlights;
    gl_FragColor = vec4(color.rgb, color.a * uReveal * uOpacity);
    #include <colorspace_fragment>
  }
`
