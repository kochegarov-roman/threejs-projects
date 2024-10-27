import * as THREE from 'three';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { AberrationShader } from './customPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { createCustomEvent } from '@/shared/utils/ThreejsUtils';
import { BASE_ASSETS_PATH, RAF, START_SCENE } from '@/shared/constants';
import { LoaderManager } from '@/shared/managers/LoaderManager';
import AbstractScene from '@/entities/AbstractScene';

export default class DNAScene extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.load();
  }

  load() {
    LoaderManager.load(
      [
        {
          name: 'dna',
          gltf: `${BASE_ASSETS_PATH}dna/dna.glb`,
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
    this.setUpSettings();
    this.addObjects();
    this.initPost();

    // start RAF
    window.dispatchEvent(createCustomEvent(START_SCENE));
    this.events();
  }

  buildCamera() {
    this.speed = 0.5;
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );
    this.camera.position.set(-1, -1, 3.5);
    this.camera.rotation.set(0.3, -0.3, 0.08);
  }

  onWheel(e) {
    this.speed += e.deltaY * 0.0002;
  }

  events() {
    const resizeCallback = (e) => super.onWindowResize(e);
    const wheelCallback = (e) => this.onWheel(e);

    this.eventManager.addListener(
      'windowEvents',
      window,
      'resize',
      resizeCallback,
      { passive: true },
    );
    this.eventManager.addListener(
      'windowEvents',
      window,
      'wheel',
      wheelCallback,
      { passive: true },
    );
    this.eventManager.addListener('windowEvents', window, RAF, this.render, {
      passive: true,
    });
  }

  initPost() {
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4,
      0.7,
      0.5,
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);

    this.effect1 = new ShaderPass(AberrationShader);
    this.composer.addPass(this.effect1);
    this.composer.addPass(this.bloomPass);
  }

  setUpSettings() {
    this.settings = {
      progress: 0,
      bloomThreshold: 0.5,
      bloomStrength: 0.4,
      bloomRadius: 0.7,
    };
  }

  onWindowResize() {
    super.onWindowResize();
    this.composer.setSize(this.width, this.height);
  }

  addObjects() {
    const { gltf } = LoaderManager.subjects.dna;
    this.geometry = gltf.scene.children[0].geometry;
    this.geometry.center();

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        uColor1: { value: new THREE.Color(0x612574) },
        uColor2: { value: new THREE.Color(0x293581) },
        uColor3: { value: new THREE.Color(0x1954ec) },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.number = this.geometry.attributes.position.array.length;

    let randoms = new Float32Array(this.number / 3);
    let colorRandoms = new Float32Array(this.number / 3);

    for (let i = 0; i < this.number / 3; i++) {
      randoms.set([Math.random()], i);
      colorRandoms.set([Math.random()], i);
    }

    this.geometry.setAttribute(
      'randoms',
      new THREE.BufferAttribute(randoms, 1),
    );
    this.geometry.setAttribute(
      'colorRandoms',
      new THREE.BufferAttribute(colorRandoms, 1),
    );

    this.dna = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.dna);
  }

  // RAF
  render = (e) => {
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping

    if (this.bloomPass) {
      this.bloomPass.threshold = this.settings.bloomThreshold;
      this.bloomPass.strength = this.settings.bloomStrength;
      this.bloomPass.radius = this.settings.bloomRadius;
    }

    this.dna.rotation.y = -now / 1000 - this.speed;
    this.dna.position.y = this.speed * 2;

    this.composer.render();
    this.stats.end();
  };
}
