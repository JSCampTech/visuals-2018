import THREE from '../third-party/three.js';
import Layer from '../js/layer.js';
import speakers from '../assets/speakers.js';
import {FontAtlas, Text} from '../js/text.js';
import speakerVertexShader from '../shaders/speaker-vs.js';
import speakerFragmentShader from '../shaders/speaker-fs.js';

class Speaker extends Layer {

  constructor(renderer) {
    super(renderer);
    console.log('Speaker ctor');

    this.names = {};

    this.montserratAtlas = new FontAtlas( {
      renderer: renderer,
      fontName: 'Montserrat',
      fontStyle: '',
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
      woff2Src: `url(https://fonts.gstatic.com/s/montserrat/v12/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2')`
    }, () => {
      this.titleTalk = new THREE.Group();
      this.talkTitleLines = [];
      for (let j=0; j<3; j++) {
        const line = new Text(this.montserratBoldAtlas);
        line.mesh.position.y = -.8 - j * .4;
        line.mesh.position.x = -1.2;
        line.mesh.scale.setScalar(4);
        line.set('');
        this.titleTalk.add( line.mesh );
        this.talkTitleLines.push(line);
      }
      this.scene.add(this.titleTalk);
    } );

    this.speakers = new Map();
    this.preload();

    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.RawShaderMaterial({
        uniforms: {
          map: { value: null }
        },
        vertexShader: speakerVertexShader,
        fragmentShader: speakerFragmentShader,
        depthTest: false,
        depthWrite: true,
      })
    );
    this.plane.position.x = -2;
    this.plane.position.z = -1;
    this.plane.rotation.set(.05,.05,.05);
    this.scene.add(this.plane);

    this.nameplate = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.MeshBasicMaterial({
        color: 0xff00ff
      })
    );
    this.scene.add(this.nameplate);

    this.talkplate = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.MeshBasicMaterial({
        color: 0x18d4d5
      })
    );
    this.scene.add(this.talkplate);

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
        this.names[s.id] = s.id;
      });
    })
  }

  selectSpeaker(id) {
    const speaker = this.speakers.get(id);
    const texture = speaker.texture;
    this.plane.material.uniforms.map.value = texture;
    const aspect = texture.image.naturalWidth / texture.image.naturalHeight;
    this.plane.scale.setScalar(4, 4*aspect, 1);
    this.plane.material.needsUpdate = true;
    texture.needsUpdate = true;
    this.speakerName.set(speaker.name);
    this.nameplate.position.x = .0025*.9*this.speakerName.width - 1.15;
    this.nameplate.position.y = .33;
    this.nameplate.scale.x = .005*this.speakerName.width;
    this.nameplate.scale.y = .5;
    this.talkTitleLines.forEach( l => l.set(''));
    let w = 0;
    speaker.talk.forEach( (l, i) => {
      this.talkTitleLines[i].set(l);
      w = Math.max(w, this.talkTitleLines[i].width);
    } );
    this.talkplate.position.x = .0025*.9*w - 1.15;
    this.talkplate.position.y = -.8;
    this.talkplate.scale.x = .005*w;
    this.talkplate.scale.y = .4 * speaker.talk.length;
  }

  render() {
    const t = .001 * performance.now();
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
