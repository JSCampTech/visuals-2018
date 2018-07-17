import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';
import Flat from '../js/flat.js';
import flatVertexShader from '../shaders/flat-vs.js';
import backgroundFragmentShader from '../shaders/background-fs.js';

// TODO
// Add lists of colors+tolerances (HSL) and then rotate

class Background extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('Background ctor');

    this.shader = new THREE.RawShaderMaterial({
      uniforms: {
        angle: { value: 0 },
        center: { value: new THREE.Vector2(.5,.5) },
        scale: { value: new THREE.Vector2(1,1) },
        color1: { value: new THREE.Color(0,0,1)},
        color2: { value: new THREE.Color(1,0,1)}
      },
      vertexShader: flatVertexShader,
      fragmentShader: backgroundFragmentShader,
      depthTest: false,
      depthWrite: false
    })
    this.flat = new Flat(renderer,this.shader, 1, 1);
    this.ready = true;
  }

  setSize(w, h) {
    this.flat.setSize(w,h);
  }

  render() {
    this.shader.uniforms.angle.value = .0001 * performance.now();
    const t = .001 * performance.now();
    const t2 = .0011 * performance.now();
    this.shader.uniforms.scale.value.x = 1. + .5 * Math.sin(t);
    this.shader.uniforms.scale.value.y = 1. + .5 * Math.cos(t2);
    const tc1 = .0012 * performance.now();
    const tc2 = .0009 * performance.now();
    this.shader.uniforms.center.value.x = .5 + .25 * Math.sin(tc1);
    this.shader.uniforms.center.value.y = .5 + .25 * Math.cos(tc2);
    const tcol1 = .0001 * performance.now();
    const tcol2 = .00015 * performance.now();
    this.shader.uniforms.color1.value.setHSL( .5 + .5 * Math.cos(tcol1),.75,.5);
    this.shader.uniforms.color2.value.setHSL( .5 + .5 * Math.sin(tcol2),.75,.5);
//    this.shader.uniforms.color1.value.setHSL( 300/360 + .1 + .05 * Math.cos(tcol1),.75,.5);
//    this.shader.uniforms.color2.value.setHSL( 240/360 + .1 + .05 * Math.sin(tcol2),.75,.5);
    this.flat.render();
  }
}

export default Background
