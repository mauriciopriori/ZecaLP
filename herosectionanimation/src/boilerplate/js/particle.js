import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
// let OrbitControls = require("three-orbit-controls")(THREE);
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { OrbitControls } from 'three-orbit-controls';
import simFragment from "./shader/simFragment.glsl";
import simVertex from "./shader/simVertex.glsl";
import Sketch from "./Uvmap";

export default class index {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth || window.innerWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1); 
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;
    this.setupFBO
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

getRenderTarget() {
  const renderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
});
return renderTarget;

setupFBO();{
  this.size = 128;
  this.fbo = this.getRenderTarget();
  this.fbo1 = this.getRenderTarget();

  this.fboScene = new THREE.Scene();
  this.fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  this.fboCamera.position.set(0, 0, 0.5);
  this.fboCamera.lookAt(0,0,0);
  let geometry = new THREE.PlaneGeometry(2, 2);

  this.data = new Float32Array(this.size * this.size * 4);

  for (let i = 0; i < this.size; i++) {
  for (let j = 0; j < this.size; j++) {
    let index = (i + j * this.size) * 4;
    let theta = Math.random() * Math.PI * 2;
    let r = 0.5 + 0.5*Math.random();
    this.data[index+0] = r*Math.cos(theta);
    this.data [index+1] = r*Math.sin(theta);
    this.data [index+2] = 1.;
    this.data [index+3] = 1.;
  }
}

this.fboTexture = new THREE.DataTexture(this.data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
this.fboTexture.magFilter = THREE.NearestFilter;
this.fboTexture.minFilter = THREE.NearestFilter;
this.fboTexture.needsUpdate = true;

  this.fboMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPositions: {value: this.fboTexture},
      time: {value: 0},
    },
    vertexShader: simVertex,
    fragmentShader: simFragment,
  })

  this.fboMesh = new THREE.Mesh(geometry, this.fboMaterial);
  this.fboScene.add(this.fboMesh);

}

  resize();
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying){
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    //this.renderer.render(this.scene, this.camera);

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.fboScene, this.fboCamera);
  }
}
