"use client";

import { init, scene, gl, camera, controls } from "@/components/init/init";
import GUI from "lil-gui";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { vertexShader } from "../components/shaders/vertex.js";
import { fragmentShader } from "../components/shaders/fragment.js";

init();
let gui = new GUI();
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.3, 100, 100),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    wireframe: true,
    uniforms: {
      uTime: { value: 0 },
    },
  })
);

scene.add(torus);

let composer = new EffectComposer(gl);
composer.addPass(new RenderPass(scene, camera));

const clock = new THREE.Clock();

let animate = () => {
  const elapsedTime = clock.getElapsedTime();
  torus.material.uniforms.uTime.value = elapsedTime;
  composer.render();
  controls.update();
  requestAnimationFrame(animate);
};
animate();
