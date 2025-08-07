import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import Planet from "./Planet";
import type { PlanetHandle } from "./Planet";

interface PlanetSceneProps {
  planet: string;
  planetRef: React.RefObject<PlanetHandle | null>;
  width: number
}

export default function PlanetScene({ planet, planetRef, width }: PlanetSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 60 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Stars radius={100} depth={50} count={3000} factor={4} fade />
      <Planet  texturePath={`/textures/${planet}.jpg`} ref={planetRef} width={width}/>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
