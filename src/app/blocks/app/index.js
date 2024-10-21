import * as THREE from "three";
import fragment from "./fragment.glsl";
import vertex from "./vertex.glsl";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import "babel-polyfill";


export default class Scene {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.dummy = new THREE.Object3D();

    this.scene.background = new THREE.Color( 0x030303 );
    this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    let aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );
    this.camera.position.set( -150, 150, 0 );

    this.time = 0;
    this.isPlaying = true;

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.listenToKeyEvents( window ); // optional

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // use a full url path
    this.loader.setDRACOLoader(this.dracoLoader);

    window.addEventListener( 'resize', this.onWindowResize );

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
  }

  play() {
    if(!this.isPlaying){
      this.render()
      this.isPlaying = true;
    }
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  async addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: {  value: 0 },
        uMatcap: {value: new THREE.TextureLoader().load("block-matcap.png")},
        resolution: {value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    let {scene: children} = await this.loader.loadAsync("block.glb");

    let geo1 = children.children[0].geometry;
    geo1.scale(1, 0.1, 2);

    let rows = 35;
    this.count = rows*rows;
    let random = new Float32Array(this.count);
    let angles = new Float32Array(this.count);
    this.instanced = new THREE.InstancedMesh(geo1, this.material, this.count);
    this.scene.add(this.instanced);

    let index = 0;
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 85; j++) { // цельный круг
        let angle = j*2*Math.PI/85;
        random[index] = Math.random();
        angles[index] = angle;

        let radius = 25;
        this.dummy.scale.set(this.getRandomArbitrary(1, 1.5), this.getRandomArbitrary(1, 1.5), 1);
        this.dummy.position.set(
          (radius + 0.7)*Math.sin(angle),
          i*3,
          (radius + 0.7)*Math.cos(angle));

        this.dummy.rotation.y = angle;
        this.dummy.updateMatrix();
        this.instanced.setMatrixAt(index++, this.dummy.matrix)
      }
    }

    this.instanced.instanceMatrix.needsUpdate = true;
    this.instanced.geometry.setAttribute("aRandom", new THREE.InstancedBufferAttribute(random, 1));
    this.instanced.geometry.setAttribute("aAngles", new THREE.InstancedBufferAttribute(angles, 1))
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  resize() {
    this.camera.updateProjectionMatrix();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 3;
    this.material.uniforms.time.value = this.time;

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render( this.scene, this.camera );
  }
}