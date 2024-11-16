import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import DeviceUtils from '@/shared/utils/DeviceUtils';
import { EventManager } from '@/shared/managers/EventManager';

export default class AbstractScene {
  constructor(options) {
    this.options = options;
    this.canvas = options.container;
    this.eventManager = new EventManager();
    this.setUnits();
  }

  buildScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030303);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
  }

  buildStats() {
    this.stats = new Stats();
    const searchParams = new URLSearchParams(window.location.search);
    const queryValue = searchParams.get('stats');
    if (queryValue) {
      const statsContainer = document.getElementById('stats-container');
      this.stats.showPanel(0);
      statsContainer.appendChild(this.stats.dom);
    }
  }

  clearStats() {
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) statsContainer.innerHTML = '';
  }

  buildControls() {
    if (!DeviceUtils.isMobile()) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.listenToKeyEvents(window); // optional
    }
  }

  clearListeners() {
    this.eventManager.clearAllListeners();
  }

  clear() {
    this.geometry?.dispose();
    this.material?.dispose();
    this.clearStats();
    this.clearListeners();
  }

  buildRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x030303, 1);
    this.renderer.shadowMap.enabled = false;
    this.renderer.physicallyCorrectLights = true;
    this.options.container.appendChild(this.renderer.domElement);
  }

  buildCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    this.camera.position.set(0, 0, 0);
  }

  onWindowResize() {
    this.setUnits();
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setUnits() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.windowHalf = new THREE.Vector2(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
  }
}
