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
    blinkOffset?: number;
    blinkSpeed?: number;
    isBlinking?: boolean;
  }

  function Model({ modelPath, scrollY }: ModelProps) {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef<THREE.Group>(null);
    const [blinkingMaterials, setBlinkingMaterials] = useState<EmissiveMaterial[]>([]);

    useEffect(() => {
      // Define uniform window color
      const uniformWindowColor = new THREE.Color(0xFFE135); // Warm yellow/orange
      const uniformEmissiveIntensity = 5.0;
      
      // Find all window materials
      const windowMeshes: THREE.Mesh[] = [];
      const blinkingMeshes: THREE.Mesh[] = [];
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Check if this is a window (you might need to adjust this condition)
          if (child.name.includes('window') || child.name.includes('light')) {
            windowMeshes.push(child);
            
            // Clone the material
            const material = child.material as EmissiveMaterial;
            const clonedMaterial = material.clone() as EmissiveMaterial;
            
            // Set uniform color and emissive properties
            clonedMaterial.emissive.copy(uniformWindowColor);
            clonedMaterial.emissiveIntensity = uniformEmissiveIntensity;
            
            // Randomly decide if this window should blink (about 30% of windows)
            if (Math.random() < 0.3) {
              clonedMaterial.originalEmissive = uniformWindowColor.clone();
              clonedMaterial.originalEmissiveIntensity = uniformEmissiveIntensity;
              clonedMaterial.blinkOffset = Math.random() * Math.PI * 2;
              clonedMaterial.blinkSpeed = 2.5 + Math.random() * 3; // Medium speed
              clonedMaterial.isBlinking = true;
              
              blinkingMeshes.push(child);
            }
            
            child.material = clonedMaterial;
          }
        }
      });
      
      // Set up blinking materials array
      const blinkingMaterials = blinkingMeshes.map(mesh => mesh.material as EmissiveMaterial);
      setBlinkingMaterials(blinkingMaterials);
      
      console.log(`Set up ${windowMeshes.length} windows (${blinkingMaterials.length} with blinking)`);
    }, [scene]);

    useFrame((state) => {
      if (modelRef.current) {
        modelRef.current.rotation.y = scrollY * 0.001;
      }

      const time = state.clock.getElapsedTime();

      // Apply blinking to only the random windows that were selected
      blinkingMaterials.forEach((material) => {
        if (material.isBlinking && material.originalEmissive && material.originalEmissiveIntensity !== undefined) {
          const minIntensity = material.originalEmissiveIntensity;
          const maxIntensity = 30.0;
          
          // Simple sine wave blinking pattern
          const blinkIntensity = (Math.sin(time * material.blinkSpeed! + material.blinkOffset!) + 1) / 2;
          const currentIntensity = minIntensity + (maxIntensity - minIntensity) * blinkIntensity;
          
          // Apply the blinking effect
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
            <ambientLight intensity={0.4} />
            <directionalLight position={[1, 10, 1]} intensity={0.8} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            <Model modelPath={modelPath} scrollY={scrollY} />
          </Canvas>
        </div>
      </div>
    );
  }