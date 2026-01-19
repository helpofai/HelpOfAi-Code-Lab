import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

function Particles(props) {
  const ref = useRef();
  const materialRef = useRef();
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);
  
  const colors = useMemo(() => [
    new THREE.Color('#22d3ee'), new THREE.Color('#8b5cf6'), 
    new THREE.Color('#ec4899'), new THREE.Color('#10b981')
  ], []);

  useFrame((state, delta) => {
    // Increased base rotation
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Stronger mouse follow
    const targetX = state.mouse.x * 0.25;
    const targetY = state.mouse.y * 0.25;
    ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.1;
    ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.1;

    // Pulse effect
    const s = 1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
    ref.current.scale.set(s, s, s);

    // Color Cycling
    const time = state.clock.getElapsedTime() * 0.5;
    const index = Math.floor(time) % colors.length;
    const nextIndex = (index + 1) % colors.length;
    const weight = time % 1;
    
    if (materialRef.current) {
      materialRef.current.color.lerpColors(colors[index], colors[nextIndex], weight);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          ref={materialRef}
          transparent
          color="#22d3ee"
          size={0.009}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <Particles />
      </Canvas>
    </div>
  );
}
