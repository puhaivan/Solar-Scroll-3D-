import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface PlanetHandle {
  setScale: (scale: number) => void;
}

interface PlanetProps {
  texturePath: string;
  autoBlowUp?: boolean;
  width: number;
  planetName?: string;
  isNight?: boolean;
}

const Planet = forwardRef<PlanetHandle, PlanetProps>(
  ({ texturePath, width, planetName, isNight }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    const currentScale = useRef(0.5);
    const targetScale = useRef(width < 768 ? 0.8 : 1);

    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.0015;
        currentScale.current +=
          (targetScale.current - currentScale.current) * 0.07;
        meshRef.current.scale.setScalar(currentScale.current);
      }

      if (ringRef.current) {
        ringRef.current.rotation.z += 0.0015;
      }
    });

    useImperativeHandle(ref, () => ({
      setScale: (scale: number) => {
        targetScale.current = scale;
      },
    }));

    const texture = useTexture(
      planetName === 'earth' && isNight
        ? '/textures/earth-night.jpg'
        : texturePath
    );

    const ringTexture = useTexture('/textures/saturn-ring.png');

    return (
      <group key={planetName}>
        {/* 🌍 Main Planet */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* 🪐 Saturn Ring */}
        {planetName === 'saturn' && (
          <mesh
            ref={ringRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
          >
            <ringGeometry args={[1.35, 2.6, 64]} />
            <meshBasicMaterial
              map={ringTexture}
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
    );
  }
);

export default Planet;
