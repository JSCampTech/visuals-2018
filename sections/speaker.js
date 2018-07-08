import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';
import speakers from '../assets/speakers.js';
import {FontAtlas, Text} from '../js/text.js';

class Speaker extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('Speaker ctor');

    this.montserratAtlas = new FontAtlas( {
      renderer: renderer,
      fontName: 'Montserrat',
      fontStyle: '',
      woffSrc: 'url(https://fonts.gstatic.com/s/shadowsintolight/v6/clhLqOv7MXn459PTh0gXYMdQSYiIg2Yb25Hg13-ek1M.woff)',
      woff2Src: `url(https://fonts.gstatic.com/s/montserrat/v12/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2')`
    }, () => {
      this.speakerName = new Text(this.montserratAtlas);
      this.speakerName.mesh.scale.setScalar(4);
      this.speakerName.mesh.position.x = -1;
      this.speakerName.set('');
      this.scene.add( this.speakerName.mesh );
    } );
    this.montserratBoldAtlas = new FontAtlas( {
      renderer: renderer,
      fontName: 'Montserrat',
      fontStyle: 'bold',
      woffSrc: 'url(https://fonts.gstatic.com/s/shadowsintolight/v6/clhLqOv7MXn459PTh0gXYMdQSYiIg2Yb25Hg13-ek1M.woff)',
      woff2Src: `url(https://fonts.gstatic.com/s/montserrat/v12/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2')`
    }, () => {
      this.talkTitleLines = [];
      for (let j=0; j<3; j++) {
        const line = new Text(this.montserratBoldAtlas);
        line.mesh.position.y = -.4- j * .4;
        line.mesh.position.x = -1.2;
        line.mesh.scale.setScalar(4);
        line.set('');
        this.scene.add( line.mesh );
        this.talkTitleLines.push(line);
      }
    } );

    this.speakers = new Map();
    this.preload();

    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.MeshBasicMaterial({}
    ));
   this.scene.add(this.plane);

    this.camera = new THREE.PerspectiveCamera( 70, 1, .1, 10000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set(0,0,5);
    this.camera.lookAt( this.camera.target );
    this.scene.add( this.camera );
  }

  preload() {
    const loader = new THREE.TextureLoader();

    speakers.forEach( s => {
      loader.load(`/assets/speakers/${s.image}`, (texture) => {
        this.speakers.set(s.id, {...s, texture});
      });
    })
  }

  selectSpeaker(id) {
    const speaker = this.speakers.get(id);
    const texture = speaker.texture;
    this.plane.material.map = texture;
    const aspect = texture.image.naturalWidth / texture.image.naturalHeight;
    this.plane.scale.setScalar(4, 4*aspect, 1);
    this.plane.material.needsUpdate = true;
    texture.needsUpdate = true;
    this.speakerName.set(speaker.name);
    this.talkTitleLines.forEach( l => l.set(''));
    speaker.talk.forEach( (l, i) => { this.talkTitleLines[i].set(l) } );
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

export default Speaker
