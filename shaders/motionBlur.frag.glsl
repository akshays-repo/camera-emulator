uniform sampler2D tDiffuse;
uniform float uShutter;
uniform vec2 uMotionDirection;
varying vec2 vUv;

void main() {
  float strength = clamp(uShutter * 800.0, 0.0, 1.0);
  int samples = int(strength * 12.0);

  if (samples < 2) {
    gl_FragColor = texture2D(tDiffuse, vUv);
    return;
  }

  vec4 result = vec4(0.0);
  vec2 step = uMotionDirection * strength * 0.025;
  float total = 0.0;

  for (int i = 0; i < 12; i++) {
    if (i >= samples) break;
    float t = float(i) / float(samples - 1) - 0.5;
    result += texture2D(tDiffuse, vUv + step * t);
    total += 1.0;
  }

  gl_FragColor = result / total;
}
