import THREE from '../third-party/three.js';

class Layer {

  constructor(renderer) {
    console.log('Layer ctor');
    this.renderer = renderer;
    this.scene = new THREE.Scene();
  }

}

export default Layer
