import React, { useEffect, useRef } from 'react';
import { init, scene, gl, camera, controls } from "@/components/init/init";
import GUI from "lil-gui";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SMAAPass } from '@/ThreeJS/three.js-master/three.js-master/examples/jsm/Addons';
import vertexShader from "@/components/shaders/vertex.js";
import fragmentShader from "@/components/shaders/fragment.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from '@/ThreeJS/three.js-master/three.js-master/examples/jsm/Addons';

const ThreeScene = () => {
 const composerRef = useRef();
 const clockRef = useRef(new THREE.Clock());
 const torusRef = useRef();

 useEffect(() => {
    init();
    scene.background = new THREE.Color(0x0A0923);
    let gui = new GUI();
    torusRef.current = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.3, 1000, 1000),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
        },
      })
    );

    scene.add(torusRef.current);

    composerRef.current = new EffectComposer(gl);
    composerRef.current.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.4,
      0.0001,
      0.01
    );
    composerRef.current.addPass(bloomPass);

    const animate = () => {
      const elapsedTime = clockRef.current.getElapsedTime();
      torusRef.current.material.uniforms.uTime.value = elapsedTime;
      composerRef.current.render();
      controls.update();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup logic here
      scene.remove(torusRef.current);
      composerRef.current.dispose();
    };
 }, []);

 return <canvas className="w-full h-full" id="canvas"></canvas>;
};

export default ThreeScene;
