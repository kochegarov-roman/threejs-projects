import * as THREE from 'three';

import fragment from './fragmentParticles.glsl';
import vertex from './vertexParticles.glsl';
import AbstractScene from '../AbstractScene';
import { LoaderManager } from '../../shared/managers/LoaderManager';
import { BASE_ASSETS_PATH, RAF, START_SCENE } from '../../shared/constants';
import { createCustomEvent } from '../../shared/utils/ThreejsUtils';

export default class Brain extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.raycaster = new THREE.Raycaster();
    this.mouseV = new THREE.Vector2();
    this.pointsMesh = null;
    this.load();
  }

  buildCamera() {
    super.buildCamera();
    this.camera.position.set(0, 0.1, 3.5);
  }

  load() {
    LoaderManager.load(
      [
        {
          name: 'brain',
          gltf: `${BASE_ASSETS_PATH}brain/brain.glb`,
        },
      ],
      this.init.bind(this),
    );
  }

  init() {
    super.buildStats();
    super.buildScene();
    super.buildRender();

    this.buildCamera();
    super.buildControls();
    this.addObjects();

    // start RAF
    window.dispatchEvent(createCustomEvent(START_SCENE));
    this.events();
  }

  events() {
    const mousemoveCallback = (e) => this.onMouseMove(e);
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
    this.eventManager.addListener(
      'windowEvents',
      window,
      'mousemove',
      mousemoveCallback,
      { passive: true },
    );
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.plane = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({ color: 0x00ff55, visible: false }),
    );
    this.scene.add(this.plane);

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
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

    const { gltf } = LoaderManager.subjects.brain;
    let geo = new THREE.BufferGeometry();
    let pos = gltf.scene.children[0].geometry.attributes.position.array;

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    let bBox = geo.computeBoundingBox();
    this.pointsMesh = new THREE.Points(geo, this.material);
    this.scene.add(this.pointsMesh);
  }

  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouseV.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseV.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  render = (e) => {
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping

    this.material.uniforms.time.value = now / 100;

    if (this.pointsMesh) {
      this.pointsMesh.rotation.y += 0.01;
    }

    this.raycaster.setFromCamera(this.mouseV, this.camera);

    const intersects = this.raycaster.intersectObjects([this.plane]);
    if (intersects.length > 0) {
      this.material.uniforms.mousePos.value = intersects[0].point;
    }

    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  };
}
