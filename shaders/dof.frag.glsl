uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float uFocusDistance;
uniform float uAperture;
uniform vec2 uResolution;
varying vec2 vUv;

float getCoC(float depth) {
  float diff = abs(depth - uFocusDistance);
  float maxCoc = (1.0 / uAperture) * 20.0;
  return clamp(diff * maxCoc, 0.0, 10.0);
}

void main() {
  float depth = texture2D(tDepth, vUv).r;
  float coc = getCoC(depth);

  if (coc < 0.5) {
    gl_FragColor = texture2D(tDiffuse, vUv);
    return;
  }

  vec2 poissonDisk[16];
  poissonDisk[0]  = vec2(-0.94201624, -0.39906216);
  poissonDisk[1]  = vec2( 0.94558609, -0.76890725);
  poissonDisk[2]  = vec2(-0.09418410, -0.92938870);
  poissonDisk[3]  = vec2( 0.34495938,  0.29387760);
  poissonDisk[4]  = vec2(-0.91588581,  0.45771432);
  poissonDisk[5]  = vec2(-0.81544232, -0.87912464);
  poissonDisk[6]  = vec2(-0.38277543,  0.27676845);
  poissonDisk[7]  = vec2( 0.97484398,  0.75648379);
  poissonDisk[8]  = vec2( 0.44323325, -0.97511554);
  poissonDisk[9]  = vec2( 0.53742981, -0.47373420);
  poissonDisk[10] = vec2(-0.26496911, -0.41893023);
  poissonDisk[11] = vec2( 0.79197514,  0.19090188);
  poissonDisk[12] = vec2(-0.24188840,  0.99706507);
  poissonDisk[13] = vec2(-0.81409955,  0.91437590);
  poissonDisk[14] = vec2( 0.19984126,  0.78641367);
  poissonDisk[15] = vec2( 0.14383161, -0.14100790);

  vec4 result = vec4(0.0);
  vec2 r = vec2(coc) / uResolution;

  for (int i = 0; i < 16; i++) {
    result += texture2D(tDiffuse, vUv + poissonDisk[i] * r);
  }

  gl_FragColor = result / 16.0;
}
