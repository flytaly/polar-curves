import * as THREE from 'three';
import * as dat from 'dat.gui';

export default class BaseSketch {
  constructor(selector, width, height) {
    this.width = width || window.innerWidth;
    this.height = height || window.innerHeight;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ alpha: true });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    this.container = document.getElementById(selector);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.Camera();
    this.camera.position.z = 1;
    this.time = 0;

    this.listenResize();
    this.setSizes();
    this.gui = new dat.GUI();
  }

  listenResize() {
    window.addEventListener('resize', () => this.setSizes());
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.gui) {
      this.gui.destroy();
    }
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  setSizes() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    if (this.material && this.material.uniforms.u_resolution) {
      this.material.uniforms.u_resolution.value.x = w;
      this.material.uniforms.u_resolution.value.y = h;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
