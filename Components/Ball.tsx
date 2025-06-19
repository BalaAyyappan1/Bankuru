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
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current.querySelector('canvas');
      if (canvasElement) {
        canvasElement.style.touchAction = 'none';
      }
    }
  }, []);

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
    }
  }, []);

  const modelScale = isMobile ? 1.4 : 2.2;

  return (
    <group ref={modelRef} scale={modelScale} rotation={[0.4, 0, 0]} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function StaticModel({ modelPath = '/bakballfinal2025e.glb' }) {
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
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        touchAction: 'auto'
      }}
    >
      <Canvas
        style={{
          pointerEvents: 'none',
          touchAction: 'auto'
        }}
        shadows
        gl={{ antialias: true }}
        camera={{ position: [-5.5, 1, 5], fov: 50 }}
      >
        {/* Lights */}
        <ambientLight intensity={7.5} />
        <directionalLight position={[20, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-21, 10.6, 21.82]} intensity={1} castShadow />
        <directionalLight position={[10, 1.6, 2.82]} intensity={1} castShadow />
        <directionalLight position={[90, 20.6, 56.82]} intensity={1} castShadow />

        {/* Orbit Controls - completely disabling touch interactions */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotateSpeed={3}
          autoRotate={true}
        />

        <Model modelPath={modelPath} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}