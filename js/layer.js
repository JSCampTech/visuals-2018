import THREE from '../third-party/three.js';
import easings from '../third-party/easings.js';
import Maf from '../js/maf.js';

class Layer {

  constructor(renderer) {
    console.log('Layer ctor');
    this.fromOpacity = 0;
    this.nextOpacity = 0;
    this.startTime = performance.now();
    this.renderer = renderer;
    this.scene = new THREE.Scene();
  }

  set opacity(o) {
    this.fromOpacity = this.nextOpacity;
    this.nextOpacity = o;
    this.startTime = performance.now();
  }

  get opacity() {
    const t = Maf.clamp((performance.now() - this.startTime)/1000, 0., 1.);
    const d = this.nextOpacity - this.fromOpacity;
    return this.fromOpacity + d * easings.InOutQuad(t);
  }

}

export default Layer
