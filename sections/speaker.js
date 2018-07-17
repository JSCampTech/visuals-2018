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
    this.group = new THREE.Group();

    this.montserratAtlas = new FontAtlas( {
      renderer: renderer,
      fontName: 'Montserrat',
      fontStyle: '',
      woff2Src: `url(https://fonts.gstatic.com/s/montserrat/v12/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2')`
    }, () => {
      this.titleTalk = new THREE.Group();
      this.talkTitleLines = [];
      for (let j=0; j<3; j++) {
        const line = new Text(this.montserratAtlas);
        line.mesh.position.x = -1.5;
        line.mesh.position.y = -.8 - j * .4;
        line.mesh.scale.setScalar(4);
        line.set('');
        this.titleTalk.add( line.mesh );
        this.talkTitleLines.push(line);
      }
      this.textGroup.add(this.titleTalk);
      this.checkReady();
    });
    this.montserratBoldAtlas = new FontAtlas( {
      renderer: renderer,
      fontName: 'Montserrat',
      fontStyle: 'bold',
      woff2Src: `url(https://fonts.gstatic.com/s/montserrat/v12/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2')`
    }, () => {
      this.speakerName = new Text(this.montserratBoldAtlas);
      this.speakerName.mesh.scale.setScalar(4);
      this.speakerName.set('');
      this.speakerName.mesh.position.set(.25,.125,0);
      this.textGroup.add( this.speakerName.mesh );
      this.checkReady();
    });

    this.speakers = new Map();
    this.preload();

    this.textGroup = new THREE.Group();
    this.group.add(this.textGroup);

    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.RawShaderMaterial({
        uniforms: {
          map: { value: null },
          opacity: { value: 0 },
        },
        vertexShader: speakerVertexShader,
        fragmentShader: speakerFragmentShader,
        depthTest: false,
        depthWrite: true,
        transparent: true,
      })
    );
    this.plane.position.x = -2.5;
    this.plane.position.z = -1;
    this.plane.rotation.set(.05,.05,.05);
    this.group.add(this.plane);

    this.nameplate = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0,
      })
    );
    const m = new THREE.Matrix4().makeTranslation(.5,0,0);
    this.nameplate.geometry.applyMatrix(m);
    this.nameplate.position.z = -.5;
    this.textGroup.add(this.nameplate);

    this.talkplate = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1,1),
      new THREE.MeshBasicMaterial({
        color: 0x18d4d5,
        transparent: true,
        opacity: 0
      })
    );
    this.talkplate.geometry.applyMatrix(m);
    this.talkplate.position.x = -2;
    this.talkplate.position.y = -.8;
    this.talkplate.position.z = -.5;
    this.textGroup.add(this.talkplate);

    this.textGroup.position.x = -1;
    this.textGroup.position.y = -1.5;

    this.camera = new THREE.PerspectiveCamera( 70, 1, .1, 10000 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set(0,0,5);
    this.camera.lookAt( this.camera.target );
    this.scene.add( this.camera );

    this.scene.add(this.group);

    this.selectedSpeaker = null;

  }

  checkReady() {
    this.ready = (
      this.titleTalk !== undefined &&
      this.speakerName !== undefined &&
      Object.keys(speakers).length === Object.keys(this.names).length );
  }

  preload() {
    const loader = new THREE.TextureLoader();

    speakers.forEach( s => {
      loader.load(`assets/speakers/${s.image}`, (texture) => {
        this.speakers.set(s.id, {...s, texture});
        this.names[s.id] = s.id;
        this.checkReady();
      });
    })
  }

  selectSpeaker(id, quick) {
    if (this.selectedSpeaker === id ) {
      return;
    }
    this.selectedSpeaker = id;
    const speaker = this.speakers.get(id);
    const texture = speaker.texture;
    this.plane.material.uniforms.map.value = texture;
    const aspect = texture.image.naturalWidth / texture.image.naturalHeight;
    this.plane.scale.setScalar(4, 4*aspect, 1);
    this.plane.material.needsUpdate = true;
    texture.needsUpdate = true;
    this.speakerName.set(speaker.name);
    this.nameplate.position.y = .45;
    this.nameplate.scale.x = .25 + .005 * this.speakerName.width;
    this.nameplate.scale.y = .75;
    this.talkTitleLines.forEach( l => l.set(''));
    let w = 0;
    speaker.talk.forEach( (l, i) => {
      this.talkTitleLines[i].set(l);
      w = Math.max(w, this.talkTitleLines[i].width);
      this.talkTitleLines[i].mesh.visible = !quick;
    } );
    this.talkplate.scale.x = .25 + .005 * w;
    this.talkplate.scale.y = .5 + .4 * speaker.talk.length;
    this.talkplate.position.y = -.4 - .4 * .5 * speaker.talk.length;
    this.plane.material.uniforms.opacity.value = 1;
    this.nameplate.material.opacity = 1;
    this.talkplate.material.opacity = 1;
    this.talkplate.visible = !quick;
    this.group.position.y = quick ? 0 : 1;
    this.speakerName.mesh.position.y = quick ? .25 : .15;
  }

  unselectSpeaker() {
    this.speakerName.set('');
    this.nameplate.material.opacity = 0;
    this.talkplate.material.opacity = 0;
    this.talkTitleLines.forEach( l => l.set('') );
    this.plane.material.uniforms.opacity.value = 0;
  }

  render() {
    if (this.speakerName) {
      this.speakerName.material.uniforms.opacity.value = this.opacity;
    }
    if (this.talkTitleLines) {
      this.talkTitleLines.forEach( (l) => {
        l.material.uniforms.opacity.value = this.opacity;
      });
    }
    this.nameplate.material.opacity = this.opacity;
    this.talkplate.material.opacity = this.opacity;
    this.plane.material.uniforms.opacity.value = this.opacity;
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
