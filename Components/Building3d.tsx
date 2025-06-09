'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';

interface ModelProps {
  modelPath: string;
  scrollY: number;
}

interface EmissiveMaterial extends THREE.MeshStandardMaterial {
  originalEmissive?: THREE.Color;
  originalEmissiveIntensity?: number;
}

function Model({ modelPath, scrollY }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const [blinkingMaterials, setBlinkingMaterials] = useState<EmissiveMaterial[]>([]);

  useEffect(() => {
    // Find only non-glowing lights that should blink
    const meshesToBlink: THREE.Mesh[] = [];
    
    scene.traverse((child) => {
      // Only target "non-glowing-light" nodes - keep others unchanged
      if (child.name === 'non-glowing-light') {
        child.traverse((meshChild) => {
          if (meshChild instanceof THREE.Mesh && meshChild.material) {
            meshesToBlink.push(meshChild);
            console.log('Found non-glowing light to blink:', meshChild.name || child.name);
          }
        });
      }
    });
    
    // Set up blinking only for non-glowing lights
    const blinkingMaterials = meshesToBlink.map(mesh => {
      const material = mesh.material as EmissiveMaterial;
      const clonedMaterial = material.clone() as EmissiveMaterial;
      
      // Store original emissive properties from Material.207
      clonedMaterial.originalEmissive = material.emissive.clone();
      clonedMaterial.originalEmissiveIntensity = material.emissiveIntensity || 3.0; // Default from your glTF
      
      mesh.material = clonedMaterial;
      return clonedMaterial;
    });
    
    setBlinkingMaterials(blinkingMaterials);
    console.log(`Set up ${blinkingMaterials.length} non-glowing lights to blink. Glowing lights remain static.`);
  }, [scene]);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollY * 0.001;
    }

    // Create smooth blinking pattern only for non-glowing lights
    const time = state.clock.getElapsedTime();
    const blinkCycle = Math.sin(time * 5); // Smooth blinking speed
    
    // Convert to 0-1 range for smooth intensity transition
    const blinkIntensity = (blinkCycle + 1) / 2;

    // Apply blinking only to non-glowing materials (Material.207)
    blinkingMaterials.forEach((material) => {
      if (material.originalEmissive && material.originalEmissiveIntensity !== undefined) {
        // Blink between original intensity (3.0) and higher intensity (15.0)
        const minIntensity = material.originalEmissiveIntensity; // 3.0 from glTF
        const maxIntensity = 20.0; // Brighter but not as bright as glowing lights
        
        // Smooth interpolation between intensities
        const currentIntensity = minIntensity + (maxIntensity - minIntensity) * blinkIntensity;
        
        // Keep original color (yellow-green) but change intensity
        material.emissive.copy(material.originalEmissive);
        material.emissiveIntensity = currentIntensity;
        material.needsUpdate = true;
      }
    });
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
    <div className="flex justify-center items-center w-full">
      <div className="w-100 xl:h-[650px] lg:h-[500px] md:h-[500px] h-[400px] xl:mt-80 mt-10">
        <Canvas
          shadows
          gl={{ antialias: true }}
          camera={{ position: [20, 10, 15], fov: 65 }}
        >
          {/* Optimized lighting for better model visibility */}
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