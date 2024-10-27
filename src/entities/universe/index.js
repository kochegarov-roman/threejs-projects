import * as THREE from 'three';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import fragmentTubeParticles from './fragmentTubeParticles.glsl';
import vertexTubeParticles from './vertexTubeParticles.glsl';
import fragmentTube from './fragmentTube.glsl';
import vertexTube from './vertexTube.glsl';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { universeOptions } from '@/entities/universe/options';
import { createCustomEvent, llerp } from '@/shared/utils/ThreejsUtils';
import AbstractScene from '@/entities/AbstractScene';
import { LoaderManager } from '@/shared/managers/LoaderManager';
import { BASE_ASSETS_PATH, RAF, START_SCENE } from '@/shared/constants';
import DeviceUtils from '@/shared/utils/DeviceUtils';

export default class Scene extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.point = new THREE.Vector3();
    this.materials = [];
    this.materialsForTimeUpdate = [];
    this.angleTube = 11;

    this.load();
  }

  load() {
    LoaderManager.load(
      [
        {
          name: 'oneparticle',
          texture: `${BASE_ASSETS_PATH}universe/oneparticle.png`,
        },
        { name: 'stripes', texture: `${BASE_ASSETS_PATH}universe/stripes.png` },
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
    this.addAllObjects();
    this.initPost();
    if (!DeviceUtils.isMobile()) this.initRaycaster();

    // start RAF
    window.dispatchEvent(createCustomEvent(START_SCENE));
    this.events();
  }

  events() {
    const resizeCallback = (e) => super.onWindowResize(e);
    const pointermoveCallback = (e) => this.onPointerMove(e);

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
      'pointermove',
      pointermoveCallback,
      { passive: true },
    );
  }

  buildCamera() {
    let aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(70, aspect, 0.001, 1000);
    this.camera.position.set(0, 8, 4);
    this.camera.rotation.set(-1.1, 0, 0);
  }

  initPost() {
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      10.4,
      20.7,
      0.5,
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
  }

  addTube(radius, countLines, heightLines, tubeRadius) {
    let points = [];
    for (let i = 0; i <= 100; i++) {
      let angle = (2 * Math.PI * i) / 100;
      let x = Math.sin(angle) + radius * Math.sin(countLines * angle);
      let y = Math.cos(angle) - radius * Math.cos(countLines * angle);
      let z = -Math.sin(heightLines * angle);
      points.push(new THREE.Vector3(x, y, z));
    }

    let curve = new THREE.CatmullRomCurve3(points);
    this.tubeGeo = new THREE.TubeGeometry(curve, 1000, tubeRadius, 500, true);

    const { stripes } = LoaderManager.subjects;

    let dotsTexture = stripes.texture;
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
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.tube = new THREE.Mesh(this.tubeGeo, this.tubeMat);
    this.scene.add(this.tube);
    this.materialsForTimeUpdate.push(this.tubeMat);

    this.tube.rotation.set(this.angleTube, 0, 0);
    this.tube.position.set(0, -1, 0);
  }

  addParticlesTube(
    mainRadius,
    countLines,
    heightLines,
    tubeRadius,
    timeFactor,
  ) {
    let number = 50000;

    this.geometryParticlesTube = new THREE.BufferGeometry();
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

    this.geometryParticlesTube.setAttribute(
      'position',
      new THREE.BufferAttribute(this.position, 3),
    );
    this.geometryParticlesTube.setAttribute(
      'aRandom',
      new THREE.BufferAttribute(this.randoms, 3),
    );
    this.geometryParticlesTube.setAttribute(
      'size',
      new THREE.BufferAttribute(this.sizes, 1),
    );

    const { oneparticle } = LoaderManager.subjects;

    this.materialParticlesTube = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        timeFactor: { value: timeFactor },
        tubeRadius: { value: tubeRadius },
        mainRadius: { value: mainRadius },
        countLines: { value: countLines },
        heightLines: { value: heightLines },

        alphaFactor: { value: 0.1 },
        uMouse: { value: new THREE.Vector3() },
        time: { value: 0 },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uNormals: { value: oneparticle.texture },
      },
      transparent: true,
      vertexShader: vertexTubeParticles,
      fragmentShader: fragmentTubeParticles,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.particlesTube = new THREE.Points(
      this.geometryParticlesTube,
      this.materialParticlesTube,
    );
    this.scene.add(this.particlesTube);
    this.materialsForTimeUpdate.push(this.materialParticlesTube);

    this.particlesTube.rotation.set(this.angleTube, 0, 0);
    this.particlesTube.position.set(0, -1, 0);
  }

  addPointsObjects(op) {
    const { oneparticle } = LoaderManager.subjects;
    let count = op.count;
    let min_radius = op.min_radius;
    let max_radius = op.max_radius;

    let particlegeo = new THREE.PlaneGeometry(1, 1);
    let geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = count;
    geo.setAttribute('position', particlegeo.getAttribute('position'));
    geo.index = particlegeo.index;

    let pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let theta = Math.random() * 2 * Math.PI;
      let r = llerp(min_radius, max_radius, Math.random());
      let x = r * Math.sin(theta) - op.x_offset;
      let y = (Math.random() - 0.5) * 0.05 - op.y_offset;
      let z = r * Math.cos(theta);

      pos.set([x, y, z], i * 3);
    }

    geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3, false));

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        size: { value: op.size },
        uColor: { value: new THREE.Color(op.color) },
        uAmp: { value: op.amp },
        uMouse: { value: new THREE.Vector3() },
        uTexture: { value: oneparticle.texture },
        resolution: { value: new THREE.Vector4() },
      },
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.points = new THREE.Mesh(geo, this.material);
    this.materials.push(this.material);
    this.scene.add(this.points);
  }

  addAllObjects() {
    universeOptions.forEach((op) => {
      this.addPointsObjects(op);
    });

    this.addTube(3, 4, 3, 0.1);
    this.addParticlesTube(2.5, 3, 7, 0.9, 1);

    this.addTube(7, 2, 5, 0.1);
    this.addParticlesTube(7, 2, 5, 1, 1.5);
  }

  onPointerMove(event) {
    if (DeviceUtils.isMobile()) return;
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects([this.meshForRaycaster]);
    if (intersects[0]) {
      this.point.copy(intersects[0].point);
    }
  }

  initRaycaster() {
    this.meshForRaycaster = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 100, 100).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    );
  }

  // RAF
  render = (e) => {
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping

    this.materials.forEach((m, ind) => {
      m.uniforms.time.value = (now / 2000) * universeOptions[ind].velocity;
      m.uniforms.uMouse.value = this.point;
    });

    this.materialsForTimeUpdate.forEach((m) => {
      m.uniforms.time.value = now / 2000;
      if (m.uniforms.uMouse) m.uniforms.uMouse.value = this.point;
    });

    this.composer.render();
    this.stats.end();
  };
}
