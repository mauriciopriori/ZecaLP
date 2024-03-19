import React, { useEffect, useRef } from 'react';
import { init, scene, gl, camera, controls } from "@/components/init/init";
import GUI from "lil-gui";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import vertexShader from "@/components/shaders/vertex.js";
import fragmentShader from "@/components/shaders/fragment.js";

const ThreeScene = () => {
 const composerRef = useRef();
 const clockRef = useRef(new THREE.Clock());
 const torusRef = useRef();

 useEffect(() => {
    init();
    let gui = new GUI();
    torusRef.current = new THREE.Mesh(
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

    scene.add(torusRef.current);

    composerRef.current = new EffectComposer(gl);
    composerRef.current.addPass(new RenderPass(scene, camera));

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
