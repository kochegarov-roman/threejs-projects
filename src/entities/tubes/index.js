import * as THREE from 'three';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

import fragmentTube from './fragmentTube.glsl';
import vertexTube from './vertexTube.glsl';
import AbstractScene from '@/entities/AbstractScene';
import { LoaderManager } from '@/shared/managers/LoaderManager';
import { createCustomEvent } from '@/shared/utils/threejs-utils';
import { BASE_ASSETS_PATH, RAF, START_SCENE } from '@/shared/constants';

export default class Scene extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.load();
  }

  load() {
    LoaderManager.load(
      [
        { name: 'bubble', texture: `${BASE_ASSETS_PATH}tubes/bubble.png` },
        { name: 'dots', texture: `${BASE_ASSETS_PATH}tubes/dots.png` },
        { name: 'stripes', texture: `${BASE_ASSETS_PATH}tubes/stripes.png` },
      ],
      this.init.bind(this),
    );
  }

  buildCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );
    this.camera.position.set(5, -3, -2);
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
    window.addEventListener('resize', super.onWindowResize.bind(this));
    window.addEventListener(RAF, this.render, { passive: true });
  }

  addObjects() {
    let number = 50000;

    this.geometry = new THREE.BufferGeometry();
    this.position = new Float32Array(number * 3);
    this.randoms = new Float32Array(number * 3);
    this.sizes = new Float32Array(number * 1);

    for (let i = 0; i < number * 3; i += 3) {
      this.position[i + 0] = Math.random() - 0.5;
      this.position[i + 1] = Math.random() - 0.5;
      this.position[i + 2] = Math.random() - 0.5;

      this.randoms[i + 0] = Math.random();
      this.randoms[i + 1] = Math.random();
      this.randoms[i + 2] = Math.random();

      this.sizes[i + 0] = 0.5 + 0.5 * Math.random();
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.position, 3),
    );
    this.geometry.setAttribute(
      'aRandom',
      new THREE.BufferAttribute(this.randoms, 3),
    );
    this.geometry.setAttribute(
      'size',
      new THREE.BufferAttribute(this.sizes, 1),
    );

    const { texture } = LoaderManager.subjects.bubble;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uNormals: { value: texture },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      // depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);

    let points = [];
    for (let i = 0; i <= 100; i++) {
      let angle = (2 * Math.PI * i) / 100;
      let x = Math.sin(angle) + 10 * Math.sin(3 * angle);
      let y = Math.cos(angle) - 10 * Math.cos(3 * angle);
      let z = -Math.sin(7 * angle);
      points.push(new THREE.Vector3(x, y, z));
    }

    let curve = new THREE.CatmullRomCurve3(points);
    this.tubeGeo = new THREE.TubeGeometry(curve, 300, 0.4, 100, true);

    const { dots, stripes } = LoaderManager.subjects;
    let dotsTexture = dots.texture;
    let stripeTexture = stripes.texture;

    dotsTexture.wrapS = THREE.RepeatWrapping;
    dotsTexture.wrapT = THREE.RepeatWrapping;

    stripeTexture.wrapS = THREE.RepeatWrapping;
    stripeTexture.wrapT = THREE.RepeatWrapping;

    this.tubeMat = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.FrontSide,
      uniforms: {
        time: { value: 0 },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uDots: { value: dotsTexture },
        uStripes: { value: stripeTexture },
      },
      transparent: true,
      vertexShader: vertexTube,
      fragmentShader: fragmentTube,
    });

    this.tube = new THREE.Mesh(this.tubeGeo, this.tubeMat);
    this.scene.add(this.tube);
  }

  // RAF
  render = (e) => {
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping

    this.material.uniforms.time.value = now / 2000;
    this.tubeMat.uniforms.time.value = now / 2000;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  };
}
