import * as THREE from 'three';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import { createCustomEvent } from '@/shared/utils/ThreejsUtils';
import { BASE_ASSETS_PATH, RAF, START_SCENE } from '@/shared/constants';
import { LoaderManager } from '@/shared/managers/LoaderManager';
import AbstractScene from '@/entities/AbstractScene';

export default class BlocksScene extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.load();
  }

  load() {
    LoaderManager.load(
      [
        {
          name: 'block',
          gltf: `${BASE_ASSETS_PATH}blocks/block.glb`,
        },
        {
          name: 'matcap',
          texture: `${BASE_ASSETS_PATH}blocks/block-matcap.png`,
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
    const resizeCallback = (e) => this.onWindowResize(e);
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

  buildCamera() {
    super.buildCamera();
    this.camera.position.set(-150, 150, 0);
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  addObjects() {
    const { texture } = LoaderManager.subjects.matcap;
    this.dummy = new THREE.Object3D();

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        uMatcap: { value: texture },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    const { gltf } = LoaderManager.subjects.block;
    let geo1 = gltf.scene.children[0].geometry;
    geo1.scale(1, 0.1, 2);

    let rows = 40;
    this.count = rows * rows;
    let random = new Float32Array(this.count);
    let angles = new Float32Array(this.count);
    this.instanced = new THREE.InstancedMesh(geo1, this.material, this.count);
    this.scene.add(this.instanced);

    let index = 0;
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 85; j++) {
        // цельный круг
        let angle = (j * 2 * Math.PI) / 85;
        random[index] = Math.random();
        angles[index] = angle;

        let radius = 25;
        this.dummy.scale.set(
          this.getRandomArbitrary(1, 1.5),
          this.getRandomArbitrary(1, 1.5),
          1,
        );
        this.dummy.position.set(
          (radius + 0.7) * Math.sin(angle),
          i * 3,
          (radius + 0.7) * Math.cos(angle),
        );

        this.dummy.rotation.y = angle;
        this.dummy.updateMatrix();
        this.instanced.setMatrixAt(index++, this.dummy.matrix);
      }
    }

    this.instanced.instanceMatrix.needsUpdate = true;
    this.instanced.geometry.setAttribute(
      'aRandom',
      new THREE.InstancedBufferAttribute(random, 1),
    );
    this.instanced.geometry.setAttribute(
      'aAngles',
      new THREE.InstancedBufferAttribute(angles, 1),
    );
  }

  onWindowResize() {
    super.onWindowResize();
  }

  // RAF
  render = (e) => {
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping
    this.material.uniforms.time.value = now / 5;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  };
}
