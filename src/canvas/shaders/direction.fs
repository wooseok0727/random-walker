uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  vec2 ratio = mix(vec2(uResolution.x / uResolution.y, 1.0), vec2(1.0, uResolution.y / uResolution.x), step(uResolution.x , uResolution.y));
  uv *= ratio;
  
  vec2 uv2 = vUv;
  vec4 accum = texture2D(tDiffuse, uv2);

  float r = random(vec2(uTime));

  vec2 dir = vec2(0.0);
  float dx = mix(1.0, -1.0, step(0.25, r));
  float dy = mix(1.0, -1.0, step(0.75, r));
  dir.x = mix(dx, 0.0, step(0.5, r));
  dir.y = mix(0.0, dy, step(0.5, r));

  vec2 nextDir = vec2(0.0);
  nextDir = clamp(accum.zw + dir * 0.1, -1.0 * ratio, 1.0 * ratio) * step(0., uTime);

  gl_FragColor = vec4(accum.r,0.0, nextDir);
}
