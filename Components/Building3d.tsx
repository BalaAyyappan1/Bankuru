'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';

interface ModelProps {
  modelPath: string;
  scrollY: number;
}

function Model({ modelPath, scrollY }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollY * 0.001 ;
    }
  });

  return (
    <group ref={modelRef} scale={[3, 3, 3]}>
      <primitive object={scene} />
    </group>
  );
}

export default function StaticModel({ modelPath = '/building.glb' }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex  justify-center items-center  w-full">
      <div className="w-100 xl:h-[650px] lg:h-[500px] md:h-[500px] h-[400px] xl:mt-80  mt-10">
        <Canvas
          shadows
          gl={{ antialias: true }}
          camera={{ position: [20, 10, 15], fov: 65 }}
        >
          {/* Lighting optimized for better model visibility */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[1, 10, 1]} intensity={0.8} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {/* Model with scroll-based rotation */}
          <Model modelPath={modelPath} scrollY={scrollY} />
        </Canvas>
      </div>
    </div>
  );
}