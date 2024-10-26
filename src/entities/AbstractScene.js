import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats-js';

export default class AbstractScene {
  constructor(options) {
    this.options = options;
    this.canvas = options.container;
    this.setUnits();
  }

  buildScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030303);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
  }

  buildStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  buildControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.listenToKeyEvents(window); // optional
  }

  buildRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x030303, 1);
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
    this.width = this.canvas.parentNode.offsetWidth;
    this.height = this.canvas.parentNode.offsetHeight;
    this.windowHalf = new THREE.Vector2(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
  }
}
