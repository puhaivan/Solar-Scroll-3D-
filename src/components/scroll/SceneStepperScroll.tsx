import { useRef, useMemo, createRef } from "react";
import { useScrollTimeline } from "../../hooks/useScrollTimeline";
import useWindowSize from "../../hooks/useWindowSize";
import PlanetSection from "../PlanetSection";
import HeroSection from "../LandingSection";
import type { PlanetHandle } from "../Planet";
import type { PlanetName } from "../../utils/constants";
import { planets } from "../../utils/constants"; // ✅ correct constant name from your file

interface SceneStepperScrollProps {
  setCurrentPlanet: React.Dispatch<React.SetStateAction<PlanetName>>;
  currentPlanet: PlanetName;
}

export default function SceneStepperScroll({ setCurrentPlanet, currentPlanet }: SceneStepperScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const planetRefs = useMemo(() => planets.map(() => createRef<PlanetHandle>()), []);
  const { width: SCENE_WIDTH } = useWindowSize();
  const SCROLL_MULTIPLIER = 3.5;

  useScrollTimeline({
    wrapperRef,
    containerRef,
    panelRefs,
    planetRefs,
    sceneWidth: SCENE_WIDTH,
    planets,
    scrollMultiplier: SCROLL_MULTIPLIER,
    setCurrentPlanet,
  });

  return (
    <div style={{ height: `${(planets.length + 1) * SCROLL_MULTIPLIER * 100}vh` }}>
      <div ref={wrapperRef} className="relative bg-black h-screen">
        <div
          ref={containerRef}
          className="flex h-screen"
          style={{ width: `${(planets.length + 1) * SCENE_WIDTH}px` }}
        >
          <HeroSection panelRefs={panelRefs} />
          {planets.map((planet, i) => (
            <PlanetSection
              key={planet}
              planet={planet}
              index={i}
              panelRef={(el) => {
                if (el) panelRefs.current[i + 1] = el;
              }}
              planetRef={planetRefs[i]}
              sceneWidth={SCENE_WIDTH}
              currentPlanet={currentPlanet}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
