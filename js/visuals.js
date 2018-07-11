import THREE from '../third-party/three.js';
import Background from '../sections/background.js';
import Particles from '../sections/particles.js';
import Intro from '../sections/intro.js';
import Speaker from '../sections/speaker.js';

class Visuals {

  constructor() {
    console.log('Visuals ctor');
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.domElement.setAttribute('id', 'visuals-canvas');
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.intro = new Intro(this.renderer);
    this.speaker = new Speaker(this.renderer);
    this.background = new Background(this.renderer);
    this.particles = new Particles(this.renderer);

    //this.speaker.selectSpeaker('michaela-lehr');

    this.resize();
    window.addEventListener('resize', () => this.resize() );

    this.prevTime = performance.now();

    this.render();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w,h);

    this.intro.setSize(w,h);
    this.particles.setSize(w,h);
    this.speaker.setSize(w,h);
    this.background.setSize(w,h);
  }

  render() {
    requestAnimationFrame( () => this.render() );

    const t = performance.now();
    const delta = (t - this.prevTime)/(1000/60);

    this.renderer.autoClear = false;
    this.renderer.clear(true,true, true);
    this.background.render();
    this.intro.render();
    this.speaker.render();
    this.particles.render(delta);
    this.renderer.autoClear = true;

    this.prevTime = t;
  }

  selectSpeaker(id) {
    this.intro.plane.visible = false;
    this.speaker.selectSpeaker(id);
  }

  showLogo() {
    this.speaker.unselectSpeaker();
    this.intro.plane.visible = true;
  }

}

const visuals = new Visuals();
window.visuals = visuals;

const bc = new BroadcastChannel('jscamp');
bc.onmessage = function (ev) {
  console.log(ev);
  switch (ev.data.action){
    case 'selectSpeaker':
    visuals.selectSpeaker(ev.data.id);
    break;
    case 'showIntro':
    visuals.showLogo();
    break;
  }
}

export default visuals
