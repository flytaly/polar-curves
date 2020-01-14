import * as THREE from 'three';
import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment-02.frag';
import BaseSketch from './lib/base-sketch';
import gsap from 'gsap';

export default class Sketch extends BaseSketch {
  constructor(selector) {
    super(selector);

    this.addObjects();
    this.datGuiSettings();
    this.animate();
    this.gsapAnimation();
  }

  datGuiSettings() {
    this.gui.add(this.material.uniforms.u_isPolar, 'value').name('isPolar');
    this.gui.add(this.material.uniforms.u_period, 'value', 1, 100, 1).name('period');
    this.gui.add(this.material.uniforms.u_radius, 'value', 0, 1, 0.01).name('radius');
    this.gui.add(this.material.uniforms.u_amplitude, 'value', 0, 0.5, 0.001).name('amplitude');
    this.gui.add(this.material.uniforms.u_width, 'value', 0, 0.5, 0.001).name('width');
    this.gui.add(this.material.uniforms.u_blur, 'value', 0, 0.5, 0.001).name('blur');
    this.gui.add(this.material.uniforms.u_length, 'value', 0, 5, 0.1).name('length');
    this.gui.add(this.material.uniforms.u_repeat, 'value', 1, 8, 1).name('repeat');

    this.gui.add(this.material.uniforms.u_time, 'value', 0, 150, 0.05).name('time');
  }

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);

    const uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2(this.width, this.height) },
      u_isPolar: { type: 'b', value: true },
      u_period: { type: 'f', value: 4 },
      u_radius: { type: 'f', value: 0.3 },
      u_amplitude: { type: 'f', value: 0.14 },
      u_width: { type: 'f', value: 0.001 },
      u_blur: { type: 'f', value: 0.008 },
      u_length: { type: 'f', value: 4.1 },
      u_repeat: { type: 'f', value: 6 },
    };
    this.material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  gsapAnimation() {
    gsap.timeline().fromTo(
      this.material.uniforms.u_length,
      { value: 0 },
      {
        duration: 10,
        ease: 'power2.out',
        value: 4.6,
        repeat: -1,
        yoyo: true,
      },
    );
  }

  animate() {
    this.time += 0.05;

    this.material.uniforms.u_time.value = this.time;
    this.render();
    requestAnimationFrame(() => this.animate());
  }
}
