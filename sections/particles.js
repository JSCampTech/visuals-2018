import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';
import particleVertexShader from '../shaders/particle-vs.js';
import particleFragmentShader from '../shaders/particle-fs.js';
import MAf from '../js/maf.js';

class Particles extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('Particles ctor');

    this.shader = new THREE.RawShaderMaterial({
      uniforms: {
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      depthTest: false,
      depthWrite: true,
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    const POINTS = 1000;
    var vertices = new Float32Array(POINTS*3);

    for (let j=0; j<POINTS; j++) {
      vertices[j*3] = Maf.randomInRange(-1,1);
      vertices[j*3+1] = Maf.randomInRange(-1,1);
      vertices[j*3+2] = Maf.randomInRange(-1,1);
    }

    this.geometry = new THREE.BufferGeometry();
    this.attribute = new THREE.BufferAttribute( vertices, 3 ).setDynamic(true);
    this.geometry.addAttribute( 'position', this.attribute );

    this.particles = new THREE.Points(this.geometry, this.shader);
    this.scene.add(this.particles);

    this.camera = new THREE.PerspectiveCamera( 70, 1, .1, 10000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set( 0, 0, 1.5 );
    this.camera.lookAt( this.camera.target );
    this.scene.add( this.camera );
  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render(delta) {

    const vertices = this.geometry.attributes.position;
    for (let p=0; p<vertices.count; p++) {
      let y = vertices.array[p*3+1];
      y += .001 * delta;
      if (y<-1) y += 2;
      if (y>1) y -= 2;
      vertices.array[p*3+1] = y;
    }
    this.attribute.needsUpdate = true;

    let a = this.particles.rotation.x;
    let b = this.particles.rotation.y + .001 * delta;
    let c = this.particles.rotation.z;

    this.particles.rotation.set(a,b,c);

    this.renderer.render(this.scene, this.camera);
  }
}

export default Particles
