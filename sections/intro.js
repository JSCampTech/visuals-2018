import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';

class Intro extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('intro ctor');
    this.cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1), new THREE.MeshNormalMaterial());
    //this.scene.add(this.cube);

    this.camera = new THREE.PerspectiveCamera( 70, 1, .1, 10000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set( 2.5, 2.5, 2.5 );
    this.camera.lookAt( this.camera.target );
    this.scene.add( this.camera );
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

export default Intro
