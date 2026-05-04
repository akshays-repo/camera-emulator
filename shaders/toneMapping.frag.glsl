uniform sampler2D tDiffuse;
uniform float uExposure;
varying vec2 vUv;

vec3 reinhard(vec3 c) {
  return c / (c + vec3(1.0));
}

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  vec3 exposed = color.rgb * uExposure;
  vec3 mapped = reinhard(exposed);
  vec3 gamma = pow(mapped, vec3(1.0 / 2.2));
  gl_FragColor = vec4(gamma, color.a);
}
