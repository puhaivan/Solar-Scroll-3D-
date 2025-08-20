import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import type { PlanetHandle } from './Planet';

interface PlanetSceneProps {
  planet: string;
  planetRef: React.RefObject<PlanetHandle | null>;
  width: number;
  isNight?: boolean;
}

export default function PlanetScene({
  planet,
  planetRef,
  width,
  isNight,
}: PlanetSceneProps) {
  const texturePath =
    planet === 'earth' && isNight
      ? '/textures/earth-night.jpg'
      : `/textures/${planet}.jpg`;

  return (
    <Canvas
      camera={{ position: [0, 1, 3], fov: 75 }}
      style={{ width: '100%', height: '100%' }}
    >
      {isNight && (
        <>
          <pointLight
            position={[5, 5, 5]}
            intensity={1.5}
            color={'#6699ff'}
            distance={10}
            decay={2}
          />

          <ambientLight intensity={0.2} color="#3366cc" />
        </>
      )}

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Stars radius={100} depth={50} count={3000} factor={4} fade />
      <Planet
        texturePath={texturePath}
        ref={planetRef}
        isNight={isNight}
        width={width}
        planetName={planet}
      />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
