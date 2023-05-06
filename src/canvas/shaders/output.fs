uniform sampler2D tDiffuse;

varying vec2 vUv;

const vec3 bg = vec3(28.0/255.0, 28.0/255.0, 30.0/255.0);
const vec3 walker = vec3(243.0/255.0, 243.0/255.0, 243.0/255.0);

void main() {
  float alpha = texture2D(tDiffuse, vUv).r;
  alpha = clamp(alpha, 0.0, 1.0);
  vec3 color = mix(bg, walker * alpha, step(0.1, alpha));

  gl_FragColor = vec4(color,1.0);
}