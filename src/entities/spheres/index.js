import * as THREE from 'three';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import smallFragment from './small-fragment.glsl';
import smallVertex from './small-vertex.glsl';
import { DotScreenShader } from './customShader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import AbstractScene from '@/entities/AbstractScene';
import { RAF, START_SCENE } from '@/shared/constants';
import { createCustomEvent } from '@/shared/utils/threejs-utils';

export default class SpheresScene extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.init();
  }

  init() {
    super.buildStats();
    super.buildScene();
    super.buildRender();

    this.buildCamera();
    super.buildControls();
    this.addObjects();
    this.initPost();

    // start RAF
    window.dispatchEvent(createCustomEvent(START_SCENE));
    this.events();
  }

  events() {
    window.addEventListener('resize', super.onWindowResize.bind(this));
    window.addEventListener(RAF, this.render, { passive: true });
  }

  buildCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );

    this.camera.position.set(0, 0, 1.3);
  }

  initPost() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const effect1 = new ShaderPass(DotScreenShader);
    effect1.uniforms['scale'].value = 4;
    this.composer.addPass(effect1);
  }

  addObjects() {
    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipMapLinearFilter,
    });

    this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.cubeRenderTarget);

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.SphereGeometry(1.5, 32, 32);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);

    let geo = new THREE.SphereGeometry(0.4, 32, 32);
    this.mat = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        tCube: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: smallVertex,
      fragmentShader: smallFragment,
    });

    this.smallSphere = new THREE.Mesh(geo, this.mat);
    this.scene.add(this.smallSphere);
  }

  // RAF
  render = (e) => {
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping
    this.cubeCamera.update(this.renderer, this.scene);
    this.mat.uniforms.tCube.value = this.cubeRenderTarget.texture;
    this.material.uniforms.time.value = now / 1000;
    this.composer.render();
    this.stats.end();
  };
}
