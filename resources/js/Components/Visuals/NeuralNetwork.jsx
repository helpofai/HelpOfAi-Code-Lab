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
import { Points, PointMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

function DataMesh() {
    const pointsRef = useRef();
    const lineRef = useRef();
    
    const count = 500;
    const [positions, lineGeometry] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const lineIndices = [];
        
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 12;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
            
            // Connect to nearby points
            if (i > 0 && i % 5 === 0) {
                lineIndices.push(pos[i*3], pos[i*3+1], pos[i*3+2]);
                lineIndices.push(pos[(i-1)*3], pos[(i-1)*3+1], pos[(i-1)*3+2]);
            }
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(lineIndices, 3));
        
        return [pos, geometry];
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = t * 0.03;
        lineRef.current.rotation.y = t * 0.03;
        
        // Pulse scaling
        const s = 1 + Math.sin(t * 0.5) * 0.1;
        pointsRef.current.scale.setScalar(s);
        lineRef.current.scale.setScalar(s);
    });

    return (
        <group>
            <Points ref={pointsRef} positions={positions} stride={3}>
                <PointMaterial
                    transparent
                    color="#22d3ee"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            
            <lineSegments ref={lineRef} geometry={lineGeometry}>
                <lineBasicMaterial 
                    color="#0891b2" 
                    transparent 
                    opacity={0.15} 
                    blending={THREE.AdditiveBlending} 
                />
            </lineSegments>
        </group>
    );
}

export default function NeuralNetwork() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <color attach="background" args={['#000']} />
                <ambientLight intensity={0.5} />
                
                <DataMesh />

                <EffectComposer>
                    <Bloom luminanceThreshold={0.1} intensity={1.5} mipmapBlur radius={0.6} />
                    <ChromaticAberration offset={[0.001, 0.001]} />
                    <Noise opacity={0.05} />
                    <Vignette darkness={1.2} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}