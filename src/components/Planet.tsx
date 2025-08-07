import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export interface PlanetHandle {
  setScale: (scale: number) => void;
}

interface PlanetProps {
  texturePath: string;
  autoBlowUp?: boolean;
}

const Planet = forwardRef<PlanetHandle, PlanetProps>(({ texturePath }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Smooth scaling
  const currentScale = useRef(0.5); // start smaller
  const targetScale = useRef(1);    // default target

  // Animate rotation + smooth scaling
  useFrame(() => {
    if (meshRef.current) {
      // slow rotation
      meshRef.current.rotation.y += 0.0015;

      // smooth interpolation toward target scale
      currentScale.current += (targetScale.current - currentScale.current) * 0.07;
      meshRef.current.scale.setScalar(currentScale.current);
    }
  });

  // Expose API for external triggers
  useImperativeHandle(ref, () => ({
    setScale: (scale: number) => {
      targetScale.current = scale;
    },
  }));

  const texture = useLoader(THREE.TextureLoader, texturePath);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
});

export default Planet;
