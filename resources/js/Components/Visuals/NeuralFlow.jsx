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

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

function FlowField() {
    const pointsRef = useRef();
    const count = 10000; // High density for professional look

    // Create particles in a wide field
    const [positions, phases] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const ph = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
            ph[i] = Math.random() * Math.PI * 2;
        }
        return [pos, ph];
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const array = pointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            // Particles move in a wave-like "flow"
            const x = array[i * 3];
            const p = phases[i];
            
            // Mathematical noise-like movement
            array[i * 3 + 1] += Math.sin(t * 0.5 + x * 0.5 + p) * 0.01;
            array[i * 3 + 2] += Math.cos(t * 0.3 + x * 0.2 + p) * 0.005;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y = t * 0.02;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#22d3ee"
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.4}
            />
        </Points>
    );
}

export default function NeuralFlow() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <color attach="background" args={['#000']} />
                <FlowField />
                <EffectComposer>
                    <Bloom luminanceThreshold={0} intensity={1.5} mipmapBlur radius={0.4} />
                    <Noise opacity={0.05} />
                    <Vignette darkness={1.1} offset={0.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
