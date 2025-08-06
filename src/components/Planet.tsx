import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetProps {
  texturePath: string;
}

export default function Planet({ texturePath }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, texturePath);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015; // slow spin
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
