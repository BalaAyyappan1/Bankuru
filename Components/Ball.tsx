'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';

interface ModelProps {
  modelPath: string;
}

function Model({ modelPath }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
    modelRef.current.rotation.z += 0.01;
    }
  });


  return (
    <group ref={modelRef} scale={[55,55, 20]}>
      <primitive object={scene} />
    </group>
  );
}

export default function StaticModel({ modelPath = '/ballmodel.glb' }) {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 15], fov: 45 }}
      >
        {/* Lighting */}
        <ambientLight intensity={5} />
        <directionalLight position={[10, 5, 5]} intensity={0.1} />
        <pointLight position={[-100, -10, -60]} intensity={0.1} />

        {/* model */}
        <Model modelPath={modelPath} />

      </Canvas>
    </div>
  );
}
