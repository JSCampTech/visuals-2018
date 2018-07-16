import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';

class Intro extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('intro ctor');

    const loader = new THREE.TextureLoader();
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.MeshBasicMaterial({
        map: loader.load('assets/logo-mask-inverted.png'),
        transparent: true,
        opacity: this.opacity,
        depthWrite: false
      })
    );
    this.plane.scale.setScalar(5);
    this.scene.add(this.plane);

    this.camera = new THREE.PerspectiveCamera( 70, 1, .1, 10000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set(0, 0, 5 );
    this.camera.lookAt( this.camera.target );
    this.scene.add( this.camera );
  }

  render() {
    this.plane.material.opacity = this.opacity;
    this.renderer.render(this.scene, this.camera);
  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

export default Intro
