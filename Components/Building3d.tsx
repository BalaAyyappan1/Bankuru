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
  blinkPattern?: number;
  nextBlinkTime?: number;
  isBlinkingOn?: boolean;
  blinkDuration?: number;
}

function Model({ modelPath, scrollY }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const [blinkingMaterials, setBlinkingMaterials] = useState<EmissiveMaterial[]>([]);

  useEffect(() => {
    // Define uniform window color
    const uniformWindowColor = new THREE.Color(0xFFE135); // Warm yellow/orange
    const uniformEmissiveIntensity = 5.0;
    
    // Find all window materials and set them to the same color
    const windowMeshes: THREE.Mesh[] = [];
    const blinkingMeshes: THREE.Mesh[] = [];
    
    scene.traverse((child) => {
      // Handle both glowing and non-glowing lights as windows
      if (child.name === 'glowing-light' || child.name === 'non-glowing-light') {
        child.traverse((meshChild) => {
          if (meshChild instanceof THREE.Mesh && meshChild.material) {
            windowMeshes.push(meshChild);
            
            // Clone the material to avoid affecting other instances
            const material = meshChild.material as EmissiveMaterial;
            const clonedMaterial = material.clone() as EmissiveMaterial;
            
            // Set uniform color and emissive properties
            clonedMaterial.emissive.copy(uniformWindowColor);
            clonedMaterial.emissiveIntensity = uniformEmissiveIntensity;
            
            // If it's a non-glowing light, set it up for blinking
            if (child.name === 'non-glowing-light') {
              // Store original properties for blinking
              clonedMaterial.originalEmissive = uniformWindowColor.clone();
              clonedMaterial.originalEmissiveIntensity = uniformEmissiveIntensity;
              
              // Add random blinking properties
              clonedMaterial.blinkOffset = Math.random() * Math.PI * 2;
              clonedMaterial.blinkSpeed = 0.3 + Math.random() * 0.4;
              clonedMaterial.blinkPattern = Math.random();
              clonedMaterial.nextBlinkTime = Math.random() * 3;
              clonedMaterial.isBlinkingOn = Math.random() > 0.5;
              clonedMaterial.blinkDuration = 1 + Math.random() * 2;
              
              blinkingMeshes.push(meshChild);
            }
            
            meshChild.material = clonedMaterial;
            console.log(`Set uniform window color for: ${meshChild.name || child.name}`);
          }
        });
      }
    });
    
    // Set up blinking materials array
    const blinkingMaterials = blinkingMeshes.map(mesh => mesh.material as EmissiveMaterial);
    setBlinkingMaterials(blinkingMaterials);
    
    console.log(`Set uniform color for ${windowMeshes.length} windows (${blinkingMaterials.length} with blinking)`);
  }, [scene]);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollY * 0.001;
    }

    const time = state.clock.getElapsedTime();

    // Apply individual random blinking patterns to each material
    blinkingMaterials.forEach((material) => {
      if (material.originalEmissive && material.originalEmissiveIntensity !== undefined) {
        const minIntensity = material.originalEmissiveIntensity;
        const maxIntensity = 20.0;
        
        // Multiple blinking patterns based on material properties
        let currentIntensity = minIntensity;
        
        if (material.blinkPattern! < 0.4) {
          // Pattern 1: Slow smooth sine wave blinking
          const sineWave = Math.sin(time * material.blinkSpeed! + material.blinkOffset!);
          const blinkIntensity = (sineWave + 1) / 2;
          currentIntensity = minIntensity + (maxIntensity - minIntensity) * blinkIntensity;
          
        } else if (material.blinkPattern! < 0.7) {
          // Pattern 2: Slow random on/off blinking
          if (time >= material.nextBlinkTime!) {
            material.isBlinkingOn = !material.isBlinkingOn;
            material.nextBlinkTime = time + 2 + Math.random() * 4;
          }
          currentIntensity = material.isBlinkingOn ? maxIntensity : minIntensity;
          
        } else {
          // Pattern 3: Slow gentle pulsing
          const pulseSpeed = material.blinkSpeed! * 0.5;
          const pulse = Math.sin(time * pulseSpeed + material.blinkOffset!);
          
          const breathingIntensity = (pulse + 1) / 2;
          const smoothedIntensity = Math.pow(breathingIntensity, 2);
          
          currentIntensity = minIntensity + (maxIntensity - minIntensity) * smoothedIntensity;
        }
        
        // Apply the calculated intensity while maintaining uniform color
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
          <ambientLight intensity={0.4} />
          <directionalLight position={[1, 10, 1]} intensity={0.8} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {/* Model with scroll-based rotation */}
          <Model modelPath={modelPath} scrollY={scrollY} />
        </Canvas>
      </div>
    </div>
  );
}