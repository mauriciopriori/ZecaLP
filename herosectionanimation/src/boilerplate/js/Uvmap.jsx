// Sketch.js
'use client'
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
extend({ OrbitControls });

const Sketch = () => {
 const [isPlaying, setIsPlaying] = useState(true);
 const [time, setTime] = useState(0);
 const containerRef = useRef(null);
 const rendererRef = useRef(null);
 const cameraRef = useRef(null);
 const controlsRef = useRef(null);
 const sceneRef = useRef(null);
 const planeRef = useRef(null);

 useEffect(() => {
    if (!containerRef.current) return; // Ensure the containerRef is defined

    sceneRef.current = new THREE.Scene();
    rendererRef.current = new THREE.WebGLRenderer();
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    rendererRef.current.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    rendererRef.current.setClearColor(0x000000, 1);
    rendererRef.current.gammaFactor = 2.2; 
    containerRef.current.appendChild(rendererRef.current.domElement);

    cameraRef.current = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    cameraRef.current.position.set(0, 0, 2);

    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);

    addObjects();
    resize();
    render();
    setupResize();
 }, []); // Removed dom from the dependency array since we're using containerRef

 const addObjects = () => {
    const material = new THREE.ShaderMaterial({
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
      vertexShader: vertex,
      fragmentShader: fragment
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    planeRef.current = new THREE.Mesh(geometry, material);
    sceneRef.current.add(planeRef.current);
 };

 const resize = () => {
    if (!containerRef.current) return; // Ensure the containerRef is defined
    rendererRef.current.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    cameraRef.current.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
    cameraRef.current.updateProjectionMatrix();
 };

 const setupResize = () => {
    window.addEventListener("resize", resize);
 };

 const render = () => {
    if (!isPlaying) return;
    setTime(time => time + 0.05);
    planeRef.current.material.uniforms.time.value = time;
    requestAnimationFrame(render);
    rendererRef.current.render(sceneRef.current, cameraRef.current);
 };

 const stop = () => {
    setIsPlaying(false);
 };

 const play = () => {
    if (!isPlaying) {
      render();
      setIsPlaying(true);
    }
 };

 return (
   <div ref={containerRef} id="container" className='w-full h-full flex justify-center items-center'>
      <Canvas ref={containerRef} id="container" className='w-full h-full flex justify-center items-center'>
         <ambientLight intensity={2}/>
      </Canvas>
   </div>
 );
};

export default Sketch;