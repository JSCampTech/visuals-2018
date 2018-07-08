import THREE from '../third-party/three.js';

class Flat {

  constructor(renderer, shader, width, height) {
    console.log('Flat ctor');

    this.renderer = renderer;
    this.shader = shader;
    this.orthoScene = new THREE.Scene();
    this.orthoCamera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, .00001, 1000 );
    this.orthoQuad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ), this.shader );
    this.orthoQuad.scale.set( width, height, 1. );
    this.orthoScene.add( this.orthoQuad );

  }

  render() {
      this.renderer.render(this.orthoScene, this.orthoCamera);
  }

  setSize(width, height) {
    this.orthoQuad.scale.set( width, height, 1. );

    this.orthoCamera.left   = - width / 2;
    this.orthoCamera.right  =   width / 2;
    this.orthoCamera.top    =   height / 2;
    this.orthoCamera.bottom = - height / 2;
    this.orthoCamera.updateProjectionMatrix();
  }

}

export default Flat
