'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

interface ModelProps {
  modelPath: string;
  isMobile: boolean;
}

function Model({ modelPath, isMobile }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  // Center the model by computing its bounding box
  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
    }
  }, []);

  const modelScale = isMobile ? 0.8 : 1.5;

  return (
    <group ref={modelRef} scale={modelScale}>
      <primitive object={scene} />
    </group>
  );
}

export default function StaticModel({ modelPath = '/ball.glb' }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={7} />
        <directionalLight 
          position={[90, 10, 5]}
          intensity={1}
          castShadow
        />
        <pointLight
  position={[0, 3, 0]}
  intensity={0.8}
  distance={20}
  decay={2}
  color="#fff4e6"
/>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          enableRotate={false}
          autoRotate={true}
          autoRotateSpeed={1.5}
        />

        {/* model */}
        <Model modelPath={modelPath} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}