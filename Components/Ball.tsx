'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

interface ModelProps {
  modelPath: string;
}

function Model({ modelPath }: ModelProps) {
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

  return (
    <group ref={modelRef} scale={1.5}>
      <primitive object={scene} />
    </group>
  );  
}

export default function StaticModel({ modelPath = '/blexprtmodel.glb' }) {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={3} />
        <directionalLight 
          position={[10, 90, 5]} 
          intensity={1} 
          castShadow
        />
        <pointLight position={[0, -10, 0]} intensity={1.5} />

        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate={true}
          autoRotateSpeed={1.5} // Adjust speed as needed (default is 1)
        />

        {/* model */}
        <Model modelPath={modelPath} />
      </Canvas>
    </div>
  );
}