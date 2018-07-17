import THREE from '../third-party/three.js';
import Background from '../sections/background.js';
//import Particles from '../sections/particles.js';
import Intro from '../sections/intro.js';
import Logo from '../sections/logo.js';
import Speaker from '../sections/speaker.js';
import Sponsor from '../sections/sponsor.js';
import Technology from '../sections/technology.js';
import Announcement from '../sections/announcement.js';
import Maf from '../js/maf.js';

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
    this.sponsor = new Sponsor(this.renderer);
    this.technology = new Technology(this.renderer);
    this.background = new Background(this.renderer);
    //this.particles = new Particles(this.renderer);
    this.announcement = new Announcement(this.renderer);

    this.loopSpeakers = true;
    this.loopSponsors = true;
    this.loopTechnologies = true;
    this.currentPosition = 0;
    this.loopOptions = [];

    this.resize();
    window.addEventListener('resize', () => this.resize() );

    this.prevTime = performance.now();

    this.waitForLayers();
  }

  waitForLayers() {
    if ([
      this.logo.ready,
      this.intro.ready,
      this.speaker.ready,
      this.sponsor.ready,
      this.technology.ready,
      this.background.ready,
      this.announcement.ready
    ].every( v => v === true )) {
      this.showIntro();
      this.render();
    } else {
      setTimeout( () => this.waitForLayers(), 500 );
    }
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w,h);

    this.logo.setSize(w,h);
    this.intro.setSize(w,h);
    //this.particles.setSize(w,h);
    this.speaker.setSize(w,h);
    this.sponsor.setSize(w,h);
    this.technology.setSize(w,h);
    this.background.setSize(w,h);
    this.announcement.setSize(w,h);
  }

  render() {
    requestAnimationFrame( () => this.render() );

    this.updateLoop();

    const t = performance.now();
    const delta = (t - this.prevTime)/(1000/60);
    this.currentPosition += delta;

    this.renderer.autoClear = false;
    this.renderer.clear(true,true, true);
    this.background.render();
    this.logo.render();
    this.intro.render();
    this.speaker.render();
    this.sponsor.render();
    this.technology.render();
    this.announcement.render();
    //this.particles.render(delta);
    this.renderer.autoClear = true;

    this.prevTime = t;
  }

  setAnnouncement(text) {
    this.loopOptions = [] = '';
    this.sponsor.opacity = 0;
    this.technology.opacity = 0;
    this.logo.opacity = 1;
    this.intro.opacity = 0;
    this.announcement.opacity = 1;
    this.speaker.opacity = 0;
    this.announcement.set(text);
  }

  selectSpeaker(id) {
    this.loopOptions = [] = '';
    this.sponsor.opacity = 0;
    this.technology.opacity = 0;
    this.logo.opacity = 1;
    this.intro.opacity = 0;
    this.announcement.opacity = 0;
    this.speaker.opacity = 1;
    this.speaker.selectSpeaker(id, false);
  }

  showIntro() {
    this.loopOptions = [] = '';
    this.sponsor.opacity = 0;
    this.technology.opacity = 0;
    this.logo.opacity = 0;
    this.announcement.opacity = 0;
    this.intro.opacity = 1;
    this.speaker.opacity = 0;
  }

  startLoop() {
    this.intro.opacity = 0;
    this.sponsor.opacity = 0;
    this.technology.opacity = 0;
    this.logo.opacity = 1;
    this.announcement.opacity = 0;
    this.speaker.opacity = 0;
    this.loopOptions = [];
    if (this.loopSpeakers) {
      for (let n of Object.keys(this.speaker.names)) {
        this.loopOptions.push( {section: 'speaker', id: n});
      }
    }
    if (this.loopSponsors) {
      for (let n of Object.keys(this.sponsor.names)) {
        this.loopOptions.push( {section: 'sponsor', id: n});
      }
    }
    if (this.loopTechnologies) {
      for (let n of Object.keys(this.technology.names)) {
        this.loopOptions.push( {section: 'technology', id: n});
      }
    }
    this.loopOptions = this.loopOptions.sort( (a,b) => .5 - Math.random() );
    this.currentPosition = 0;
    this.prevTime = performance.now();
  }

  updateLoop() {
    const time = 400;
    const t = (this.currentPosition % time ) / time;
    if (this.loopOptions.length === 0 ) return;
    const s = Math.floor(( this.currentPosition / time ) % this.loopOptions.length);
    const o = this.loopOptions[s];
    switch (o.section) {
      case 'speaker':
      this.sponsor.opacity = 0;
      this.technology.opacity = 0;
      this.speaker.selectSpeaker(o.id, true);
      this.speaker.opacity = Maf.parabola(t,1);
      break;
      case 'sponsor':
      this.speaker.opacity = 0;
      this.technology.opacity = 0;
      this.sponsor.selectSponsor(o.id, true);
      this.sponsor.opacity = Maf.parabola(t,1);
      break;
      case 'technology':
      this.sponsor.opacity = 0;
      this.speaker.opacity = 0;
      this.technology.selectTechnology(o.id, true);
      this.technology.opacity = Maf.parabola(t,1);
      break;
    }
  }

}

const visuals = new Visuals();
window.visuals = visuals;

const bc = new BroadcastChannel('jscamp');
bc.onmessage = function (ev) {
  console.log(ev);
  switch (ev.data.action){
    case 'selectSpeaker':
    visuals.selectSpeaker(ev.data.id, false);
    break;
    case 'showIntro':
    visuals.showIntro();
    break;
    case 'setAnnouncement':
    visuals.setAnnouncement(ev.data.text);
    break;
    case 'startLoop':
    visuals.loopSpeakers = ev.data.speakers;
    visuals.loopSponsors = ev.data.sponsors;
    visuals.loopTechnologies = ev.data.technologies;
    visuals.startLoop();
    break;
  }
}

export default visuals
