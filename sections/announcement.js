import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';
import speakers from '../assets/speakers.js';
import {FontAtlas, Text} from '../js/text.js';
import speakerVertexShader from '../shaders/speaker-vs.js';
import speakerFragmentShader from '../shaders/speaker-fs.js';

class Announcement extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('Announcement ctor');

    this.textGroup = new THREE.Group();
    this.scene.add(this.textGroup);
    this.lines = [];

    this.montserratAtlas = new FontAtlas( {
      renderer: renderer,
      fontName: 'Montserrat',
      fontStyle: '',
      woff2Src: `url(https://fonts.gstatic.com/s/montserrat/v12/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2')`
    }, () => {
      this.titleText = new Text(this.montserratAtlas);
      this.titleText.mesh.scale.setScalar(4);
      this.titleText.set('');
      this.titleText.mesh.position.set(.25,.125,0);
      this.textGroup.add( this.titleText.mesh );
    } );
    this.montserratBoldAtlas = new FontAtlas( {
      renderer: renderer,
      fontName: 'Montserrat',
      fontStyle: 'bold',
      woff2Src: `url(https://fonts.gstatic.com/s/montserrat/v12/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2')`
    }, () => {
      this.linesGroup = new THREE.Group();
      for (let j=0; j<30; j++) {
        const line = new Text(this.montserratBoldAtlas);
        line.mesh.scale.setScalar(4);
        line.set('');
        this.linesGroup.add( line.mesh );
        this.lines.push(line);
      }
      this.textGroup.add(this.linesGroup);
    } );

    this.camera = new THREE.PerspectiveCamera( 70, 1, .1, 10000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set(0,0,5);
    this.camera.lookAt( this.camera.target );
    this.scene.add( this.camera );

  }

  preload() {
    const loader = new THREE.TextureLoader();

    speakers.forEach( s => {
      loader.load(`assets/speakers/${s.image}`, (texture) => {
        this.speakers.set(s.id, {...s, texture});
        this.names[s.id] = s.id;
      });
    })
  }

  set(lines) {
    this.lines.forEach( l => l.set(''));
    let w = 0;
    let h = lines.length;
    lines.forEach( (l, i) => {
      this.lines[i].set(l);
      this.lines[i].mesh.position.x = -.5 * .004 * this.lines[i].width;
      this.lines[i].mesh.position.y = - .33 + ( - i ) * .4 + .5 * h * .4;
      w = Math.max(w, this.lines[i].width);
    });
  }

  render() {
    const t = .0005 * performance.now();
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

export default Announcement
