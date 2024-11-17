import * as THREE from 'three';

import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import AbstractScene from '../AbstractScene';
import { RAF, START_SCENE } from '../../shared/constants';
import { createCustomEvent } from '../../shared/utils/ThreejsUtils';

export default class CustomSphere extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.init();
  }

  buildCamera() {
    super.buildCamera();
    this.camera.position.set(0, 0.1, 3.5);
  }

  init() {
    super.buildStats();
    super.buildScene();
    super.buildRender();
    this.renderer.setClearColor(0x101214);

    this.buildCamera();
    super.buildControls();
    this.addObjects();

    // start RAF
    window.dispatchEvent(createCustomEvent(START_SCENE));
    this.events();
  }

  events() {
    const resizeCallback = (e) => super.onWindowResize(e);
    this.eventManager.addListener(
      'windowEvents',
      window,
      'resize',
      resizeCallback,
      { passive: true },
    );
    this.eventManager.addListener('windowEvents', window, RAF, this.render, {
      passive: true,
    });
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        uRadius: { type: 'f', value: 0.5 },
        mousePos: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
        pixels: {
          type: 'v2',
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    //this.geometry = new THREE.IcosahedronGeometry(1, 5);
    this.geometry = new THREE.PlaneGeometry(2, 2);
    // this.geometry = new THREE.SphereGeometry(2);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  render = (e) => {
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping

    this.material.uniforms.time.value = now / 1000;

    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  };
}
