import { useRef, useMemo, useEffect, createRef } from "react";
import { useScrollTimeline } from "../../hooks/useScrollTimeline";
import useWindowSize from "../../hooks/useWindowSize";
import PlanetSection from "../PlanetSection";
import HeroSection from "../LandingSection";
import type { PlanetHandle } from "../Planet";
import type { PlanetName } from "../../utils/constants";

import { planets } from "../../utils/constants";

interface SceneStepperScrollProps {
  setCurrentPlanet: React.Dispatch<React.SetStateAction<PlanetName>>;
  currentPlanet: PlanetName;
}

export default function SceneStepperScroll({
  setCurrentPlanet,
  currentPlanet,
}: SceneStepperScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const planetRefs = useMemo(() => planets.map(() => createRef<PlanetHandle>()), []);
  const { width: SCENE_WIDTH } = useWindowSize();
  const SCROLL_MULTIPLIER = 3.5;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevPlanet = useRef(currentPlanet);

  useEffect(() => {
    if (prevPlanet.current !== currentPlanet) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay blocked or failed:", err);
        });
      }
      prevPlanet.current = currentPlanet;
    }
  }, [currentPlanet]);

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
    <>
      
      <audio ref={audioRef} src="/sounds/switch.mp3" preload="auto" />

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
            <div
  className="flex-shrink-0 flex flex-col items-center justify-center text-white px-6"
  style={{
    width: `${SCENE_WIDTH}px`,
    height: "100vh",
    backgroundColor: "black",
  }}
>
  <div className="max-w-md text-center space-y-4">
    <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-indigo-400">
      Thank you for exploring
    </h2>
    <p className="text-sm md:text-base text-white/80 leading-relaxed">
      We hope you enjoyed this journey through our Solar System.
      Scroll up to revisit any planet or return to the beginning.
    </p>
    <a
      href="#landing"
      className="mt-4 inline-block px-5 py-2 text-sm md:text-base font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition shadow-lg"
    >
      Back to Start
    </a>
  </div>
</div>

          </div>
        </div>
      </div>
    </>
  );
}
