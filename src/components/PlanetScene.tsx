import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

function Planet() {
  const planetRef = useRef<Mesh>(null);

  // Rotate planet
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={planetRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function PlanetScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      {/* Starry background */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade />

      {/* Test planet */}
      <Planet />

      {/* Orbit controls for testing */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
