import * as THREE from 'three';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

import { Lethargy } from 'lethargy';
import { WheelGesture } from '@use-gesture/vanilla';
import AbstractScene from '@/entities/AbstractScene';
import { RAF, START_SCENE } from '@/shared/constants';
import { LoaderManager } from '@/shared/managers/LoaderManager';
import { createCustomEvent } from '@/shared/utils/ThreejsUtils';

const sec1 = '/scenes/sec1.png';
const sec2 = '/scenes/sec2.png';
const sec3 = '/scenes/sec3.png';
const bg1 = '/scenes/bg1.jpg';
const bg2 = '/scenes/bg2.jpg';
const bg3 = '/scenes/bg3.jpg';

const SCENES_LENGTH = 3;

export default class Scenes extends AbstractScene {
  constructor(options) {
    super(options);
    if (options.container.hasChildNodes()) return;

    this.mouse = new THREE.Vector2();
    this.scenes = [];
    const images = [
      { name: 'bg1', texture: bg1 },
      { name: 'bg2', texture: bg2 },
      { name: 'bg3', texture: bg3 },
      { name: 'matcap1', texture: sec1 },
      { name: 'matcap2', texture: sec2 },
      { name: 'matcap3', texture: sec3 },
    ];

    this.load(images);
  }

  load(data) {
    LoaderManager.load(data, this.init.bind(this));
  }

  init() {
    super.buildStats();
    this.buildCamera();
    super.buildRender();
    this.buildScenes();
    this.setUpScroll();
    this.initPost();

    // start RAF
    window.dispatchEvent(createCustomEvent(START_SCENE));
    this.events();
  }

  buildCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );

    this.camera.position.set(0, 0, 2);
  }

  buildScenes() {
    Array(SCENES_LENGTH)
      .fill(0)
      .forEach((_, index) => {
        let sceneData = { scene: this.createScene(index + 1) };
        this.renderer.compile(sceneData.scene, this.camera);
        sceneData.target = new THREE.WebGLRenderTarget(this.width, this.height);
        this.scenes.push(sceneData);
      });
  }

  createScene(i) {
    let scene = new THREE.Scene();
    scene.background = LoaderManager.subjects['bg' + i].texture;
    let material = new THREE.MeshMatcapMaterial({
      matcap: LoaderManager.subjects['matcap' + i].texture,
    });
    let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    let mesh = new THREE.Mesh(geometry, material);

    for (let index = 0; index < 10; index++) {
      let random = new THREE.Vector3().randomDirection();
      let clone = mesh.clone();
      clone.position.copy(random);
      clone.rotation.x = Math.random();
      clone.rotation.y = Math.random();
      scene.add(clone);
    }

    return scene;
  }

  setUpScroll() {
    this.current = 0;
    function equals(current, target) {
      return Math.abs(current).toFixed(2) === Math.abs(target).toFixed(2);
    }

    this.currentState = 0;
    this.stepAnimation = parseFloat((1 / 100).toFixed(2));
    this.lethargy = new Lethargy(); //7, 100, 0.05
    let scrollLock = false;
    this.gesture = new WheelGesture(
      document.body,
      ({ event, last, memo: wait = false }) => {
        let target;
        if (!last) {
          const s = this.lethargy.check(event);
          if (s) {
            if (!wait && !scrollLock) {
              target = this.currentState - s;
              if (target < 0 || target > 3.5) return true;

              let checkScroll = setInterval(() => {
                if (!equals(this.currentState, target)) {
                  scrollLock = true;
                  this.currentState -= this.stepAnimation * s;
                  if (this.currentState.toFixed(2) === '-0.00')
                    this.currentState = 0;
                } else {
                  clearInterval(checkScroll);
                  scrollLock = false;
                }
              }, 8);
              return true;
            }
          } else return false;
        } else {
          return false;
        }
      },
    );
  }

  onMouseMove(event) {
    this.mouse.x = event.clientX - this.windowHalf.x;
    this.mouse.y = event.clientY - this.windowHalf.x;
  }

  events() {
    const resizeCallback = (e) => super.onWindowResize(e);
    const mousemoveCallback = (e) => this.onMouseMove(e);

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
      'mousemove',
      mousemoveCallback,
      { passive: true },
    );
    this.eventManager.addListener('windowEvents', window, RAF, this.render, {
      passive: true,
    });
  }

  initPost() {
    this.postScene = new THREE.Scene();
    let frustumSize = 1;
    let aspect = 1;
    this.postCamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000,
    );

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        progress: { value: 0 },
        uTexture1: { value: new THREE.TextureLoader().load(bg1) },
        uTexture2: { value: new THREE.TextureLoader().load(bg2) },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);

    this.postScene.add(this.quad);
  }

  render = (e) => {
    // eslint-disable-next-line no-unused-vars
    const { now } = e.detail;
    this.stats.begin();
    if (this.controls) this.controls.update(); // for damping

    let _x = (1 - this.mouse.x) * 0.0002;
    let _y = (1 - this.mouse.y) * 0.0002;

    this.camera.rotation.x += 0.05 * (_y - this.camera.rotation.x);
    this.camera.rotation.y += 0.05 * (_x - this.camera.rotation.y);

    this.current = Math.floor(this.currentState);
    this.next = Math.floor((this.currentState + 1) % SCENES_LENGTH);

    this.progress = this.currentState % 1;

    this.renderer.setRenderTarget(this.scenes[this.current].target);
    this.renderer.render(this.scenes[this.current].scene, this.camera);

    this.renderer.setRenderTarget(this.scenes[this.next].target);
    this.renderer.render(this.scenes[this.next].scene, this.camera);
    this.renderer.setRenderTarget(null);

    this.material.uniforms.uTexture1.value =
      this.scenes[this.current].target.texture;
    this.material.uniforms.uTexture2.value =
      this.scenes[this.next].target.texture;

    this.material.uniforms.progress.value = this.progress;
    this.renderer.render(this.postScene, this.postCamera);

    this.stats.end();
  };
}
