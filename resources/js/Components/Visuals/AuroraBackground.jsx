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

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float noise = sin(uv.x * 10.0 + iTime) * cos(uv.y * 10.0 + iTime) * 0.5 + 0.5;
    
    vec3 color1 = vec4(0.02, 0.05, 0.15, 1.0).rgb; // Deep Blue
    vec3 color2 = vec4(0.05, 0.15, 0.3, 1.0).rgb;  // Mid Blue
    vec3 color3 = vec4(0.0, 0.8, 0.9, 1.0).rgb;    // Cyan Pulse

    float t = iTime * 0.2;
    vec2 p = uv * 2.0 - 1.0;
    
    float pulse = sin(p.x * 2.0 + t) * cos(p.y * 2.0 - t);
    vec3 finalColor = mix(color1, color2, uv.y);
    finalColor = mix(finalColor, color3, pulse * 0.1);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function Plasma() {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({
    iTime: { value: 0 }
  }), []);

  useFrame((state) => {
    uniforms.iTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Plasma />
      </Canvas>
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}
