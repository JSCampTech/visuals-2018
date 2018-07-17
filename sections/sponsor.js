import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';
import sponsors from '../assets/sponsors.js';

class Speaker extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('Speaker ctor');

    this.names = {};

    this.sponsors = new Map();
    this.preload();

    this.geometry = new THREE.PlaneBufferGeometry(1,1);
    this.material =  new THREE.MeshBasicMaterial({
      depthTest: false,
      depthWrite: true,
      transparent: true,
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);

    this.camera = new THREE.PerspectiveCamera( 70, 1, .1, 10000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set(0,0,5);
    this.camera.lookAt( this.camera.target );
    this.scene.add( this.camera );

    this.selectedSponsor = null;
  }

  checkReady() {
    this.ready = Object.keys(sponsors).length === Object.keys(this.names).length;
  }

  preload() {
    const loader = new THREE.TextureLoader();

    sponsors.forEach( s => {
      loader.load(`assets/sponsors/${s.image}`, (texture) => {
        this.sponsors.set(s.id, {...s, texture});
        this.names[s.id] = s.id;
        this.checkReady();
      });
    })
  }

  selectSponsor(id) {
    if (this.selectedSponsor === id ) {
      return;
    }
    this.selectedSponsor = id;
    const sponsor = this.sponsors.get(id);
    const texture = sponsor.texture;
    this.plane.material.map = texture;
    const MAXW = 5;
    const MAXH = 3;
    let w = texture.image.naturalWidth * 10;
    let h = texture.image.naturalHeight * 10;
    if (w>MAXW) {
      w = MAXW;
      h = w * texture.image.naturalHeight / texture.image.naturalWidth;
    }
    if (h>MAXH) {
      h = MAXH;
      w = h * texture.image.naturalWidth / texture.image.naturalHeight;
    }
    this.plane.scale.set(w, h, 1);
    this.plane.material.needsUpdate = true;
    texture.needsUpdate = true;
  }

  unselectSponsor() {
  }

  render() {
    this.plane.material.opacity = this.opacity;
    const t = .0005 * performance.now();
    const f = .025 * Math.sin(t);
    this.plane.rotation.set(f,f,f);
    const x = .25 * Math.cos(.9*t);
    const y = .25 * Math.sin(1.1*t);
    this.camera.position.set(x,y,5);
    this.camera.lookAt(this.camera.target);
    this.renderer.render(this.scene, this.camera);
  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

export default Speaker
