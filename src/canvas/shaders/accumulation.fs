uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

vec2 remap(vec2 a, vec2 b, vec2 c, vec2 d, vec2 t) {
    return vec2(
        clamp((t.x - a.x) / (b.x - a.x), 0.0, 1.0) * (d.x - c.x) + c.x,
        clamp((t.y - a.y) / (b.y - a.y), 0.0, 1.0) * (d.y - c.y) + c.y
    );
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  vec2 ratio = mix(vec2(uResolution.x / uResolution.y, 1.0), vec2(1.0, uResolution.y / uResolution.x), step(uResolution.x , uResolution.y));
  uv *= ratio;
  
  vec2 uv2 = vUv;
  vec4 dir = texture2D(tDiffuse, uv2); 
  vec2 move = remap(-1.0 * ratio, 1.0 * ratio, -0.93 * ratio, 0.93 * ratio, dir.zw);

  vec2 cellSize = vec2(1.0 / 10.0);
  vec2 cell = floor((uv / cellSize));
  vec2 center = (cell + 0.5) * cellSize;

  vec2 dist = abs(center - move);
  vec2 range = cellSize * 0.5;
  float inRange = clamp(step(dist.x, range.x) * step(dist.y, range.y), 0.0, 0.2);

  float color = dir.r * 0.998 + inRange * step(0.0, uTime);

   gl_FragColor = vec4(color, 0.0, dir.zw);
}

