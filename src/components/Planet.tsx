import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export interface PlanetHandle {
  setScale: (scale: number) => void;
}

interface PlanetProps {
  texturePath: string;
  autoBlowUp?: boolean;
  width: number;
}

const Planet = forwardRef<PlanetHandle, PlanetProps>(({ texturePath, width }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);

 
  const currentScale = useRef(0.5); 
  const targetScale = useRef(width < 768 ? 0.5 : 1)    

  
  useFrame(() => {
    if (meshRef.current) {
      
      meshRef.current.rotation.y += 0.0015;

      
      currentScale.current += (targetScale.current - currentScale.current) * 0.07;
      meshRef.current.scale.setScalar(currentScale.current);
    }
  });

  
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
