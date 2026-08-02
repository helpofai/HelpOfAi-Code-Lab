/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

function Core() {
    const mainRef = useRef();
    const shellRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mainRef.current.rotation.y = t * 0.4;
        mainRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
        shellRef.current.rotation.z = t * 0.2;
        shellRef.current.rotation.x = t * 0.1;
    });

    return (
        <group>
            {/* Pulsing Core */}
            <Sphere ref={mainRef} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color="#06b6d4"
                    speed={3}
                    distort={0.5}
                    radius={1}
                    emissive="#22d3ee"
                    emissiveIntensity={10}
                    roughness={0}
                />
            </Sphere>

            {/* Geometry Shell */}
            <mesh ref={shellRef}>
                <octahedronGeometry args={[1.8, 2]} />
                <meshStandardMaterial 
                    wireframe 
                    color="#22d3ee" 
                    transparent 
                    opacity={0.1}
                    emissive="#22d3ee"
                    emissiveIntensity={2}
                />
            </mesh>

            <Sparkles count={100} scale={4} size={2} speed={0.4} color="#22d3ee" />
        </group>
    );
}

export default function NeuralCore() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <color attach="background" args={['#000']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={5} color="#06b6d4" />
                
                <Float speed={3} rotationIntensity={2} floatIntensity={2}>
                    <Core />
                </Float>

                {/* Advanced Post-Processing */}
                <EffectComposer disableNormalPass>
                    <Bloom 
                        luminanceThreshold={0.2} 
                        mipmapBlur 
                        intensity={1.5} 
                        radius={0.4} 
                    />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}