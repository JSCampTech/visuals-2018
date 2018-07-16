import THREE from '../third-party/three.js';
import Background from '../sections/background.js';
//import Particles from '../sections/particles.js';
import Intro from '../sections/intro.js';
import Logo from '../sections/logo.js';
import Speaker from '../sections/speaker.js';
import Announcement from '../sections/announcement.js';

class Visuals {

  constructor() {
    console.log('Visuals ctor');
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.domElement.setAttribute('id', 'visuals-canvas');
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.logo = new Logo(this.renderer);
    this.intro = new Intro(this.renderer);
    this.speaker = new Speaker(this.renderer);
    this.background = new Background(this.renderer);
    //this.particles = new Particles(this.renderer);
    this.announcement = new Announcement(this.renderer);

    this.resize();
    window.addEventListener('resize', () => this.resize() );

    this.prevTime = performance.now();

    this.showIntro();
    this.render();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w,h);

    this.logo.setSize(w,h);
    this.intro.setSize(w,h);
    //this.particles.setSize(w,h);
    this.speaker.setSize(w,h);
    this.background.setSize(w,h);
    this.announcement.setSize(w,h);
  }

  render() {
    requestAnimationFrame( () => this.render() );

    const t = performance.now();
    const delta = (t - this.prevTime)/(1000/60);

    this.renderer.autoClear = false;
    this.renderer.clear(true,true, true);
    this.background.render();
    this.logo.render();
    this.intro.render();
    this.speaker.render();
    this.announcement.render();
    //this.particles.render(delta);
    this.renderer.autoClear = true;

    this.prevTime = t;
  }

  setAnnouncement(text) {
    this.logo.opacity = 1;
    this.intro.opacity = 0;
    this.announcement.opacity = 1;
    this.speaker.opacity = 0;
    this.announcement.set(text);
  }

  selectSpeaker(id) {
    this.logo.opacity = 1;
    this.intro.opacity = 0;
    this.announcement.opacity = 0;
    this.speaker.opacity = 1;
    this.speaker.selectSpeaker(id);
  }

  showIntro() {
    this.logo.opacity = 0;
    this.announcement.opacity = 0;
    this.intro.opacity = 1;
    this.speaker.opacity = 0;
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
    visuals.showIntro();
    break;
    case 'setAnnouncement':
    visuals.setAnnouncement(ev.data.text);
    break;
  }
}

export default visuals
