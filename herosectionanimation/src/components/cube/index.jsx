'use client';
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import Script from 'next/script'
import Sketch from '../../boilerplate/js/Uvmap';

export default function index() {
    return (
        <div className="h-screen w-screen">
            <Canvas>
                {/*<ambientLight intensity={2}/>*/}
                <Sketch/>
             </Canvas>

        </div>
    )
}

function Cube() {

    const mesh = useRef(null);
    useFrame( (state, delta) => {
            mesh.current.rotation.x += delta * 0.1;
            mesh.current.rotation.y += delta * 0.1;
            mesh.current.rotation.z += delta * 0.1;
    })

    return (
        <mesh ref={mesh}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}