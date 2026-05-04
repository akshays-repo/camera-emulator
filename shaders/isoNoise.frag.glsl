uniform sampler2D tDiffuse;
uniform float uISO;
uniform float uTime;
varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  float noiseFactor = clamp((uISO - 800.0) / 5600.0, 0.0, 1.0);
  noiseFactor = pow(noiseFactor, 1.5);

  if (noiseFactor < 0.01) {
    gl_FragColor = color;
    return;
  }

  float luma    = rand(vUv + mod(uTime, 100.0)) * 2.0 - 1.0;
  float chromaR = rand(vUv * 1.3 + mod(uTime * 1.1, 100.0)) * 2.0 - 1.0;
  float chromaB = rand(vUv * 0.7 + mod(uTime * 0.9, 100.0)) * 2.0 - 1.0;

  float amt = noiseFactor * 0.10;
  color.r = clamp(color.r + luma * amt + chromaR * amt * 0.4, 0.0, 1.0);
  color.g = clamp(color.g + luma * amt, 0.0, 1.0);
  color.b = clamp(color.b + luma * amt + chromaB * amt * 0.4, 0.0, 1.0);

  gl_FragColor = color;
}
