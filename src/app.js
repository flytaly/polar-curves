import * as THREE from 'three';
import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';
import BaseSketch from './base-sketch';
import * as dat from 'dat.gui';
import gsap from 'gsap';

export default class Sketch extends BaseSketch {
  constructor(selector) {
    super(selector);

    this.addObjects();
    this.datGuiSettings();
    this.animate();
    this.initialAnimation();
  }

  datGuiSettings() {
    const gui = new dat.GUI();
    gui.add(this.material.uniforms.u_isPolar, 'value').name('isPolar');
    gui.add(this.material.uniforms.u_period, 'value', 1, 100, 1).name('period');
    gui.add(this.material.uniforms.u_radius, 'value', 0, 1, 0.01).name('radius');
    gui.add(this.material.uniforms.u_amplitude, 'value', 0, 0.5, 0.001).name('amplitude');
    gui.add(this.material.uniforms.u_width, 'value', 0, 0.5, 0.001).name('width');
    gui.add(this.material.uniforms.u_blur, 'value', 0, 0.5, 0.001).name('blur');
    gui.add(this.material.uniforms.u_time, 'value', 0, 150, 0.05).name('time');
  }

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);

    const uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2(this.width, this.height) },
      u_isPolar: { type: 'b', value: true },
      u_period: { type: 'f', value: 8 },
      u_radius: { type: 'f', value: 0 }, // 0.3
      u_amplitude: { type: 'f', value: 0 }, // 0.03
      u_width: { type: 'f', value: 0 }, //0.12
      u_blur: { type: 'f', value: 0.01 },
    };
    this.material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

    const mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(mesh);
  }

  animate() {
    this.time += 0.05;

    this.material.uniforms.u_time.value = this.time;

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  initialAnimation() {
    gsap
      .timeline({ defaults: { duration: 2, ease: 'bounce.out' } })
      .to(this.material.uniforms.u_radius, { value: 0.3 })
      .to(this.material.uniforms.u_width, { value: 0.12 }, '-=1')
      .to(this.material.uniforms.u_amplitude, { duration: 1, ease: 'back.out(4),', value: 0.03 }, '-=1.5');
  }
}

new Sketch('container');
