export default `
precision highp float;
uniform float angle;
uniform vec3 color1;
uniform vec3 color2;
uniform vec2 center;
uniform vec2 scale;

varying vec2 vUv;

#define LINEAR_TO_SRGB(c) pow((c), vec3(1.0 / 2.2))

float gradientNoise(in vec2 uv){
  const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(uv, magic.xy)));
}

void main() {

  vec2 a = center - vec2(scale.x*cos(angle), scale.y*sin(angle));
  vec2 b = center + vec2(scale.x*cos(angle), scale.y*sin(angle));

  vec2 ba = b - a;
  float t = dot(vUv - a, ba) / dot(ba, ba);
  t = smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0));
  vec3 color = mix(color1, color2, t);

  // Convert color from linear to sRGB color space (=gamma encode).
  color = LINEAR_TO_SRGB(color);
  color += (1.0/255.0) * gradientNoise(vUv) - (0.5/255.0);

  gl_FragColor.rgb = color;
}
`;
