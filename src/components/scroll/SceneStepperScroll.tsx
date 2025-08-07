import { useLayoutEffect, useRef, useMemo, createRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import PlanetScene from "../PlanetScene";
import HeroSection from "../LandingSection";
import Header from "../Header";
import type { PlanetHandle } from "../Planet";
import useWindowSize from "../../hooks/useWindowSize";

gsap.registerPlugin(ScrollTrigger);

const planets = [
  "mercury", "venus", "earth", "mars",
  "jupiter", "saturn", "uranus", "neptune"
];

export default function SceneStepperScroll() {
  const [currentPlanet, setCurrentPlanet] = useState('default')
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);

  const { width } = useWindowSize()
const SCENE_WIDTH = width
  const SCROLL_MULTIPLIER = 2;

  const planetRefs = useMemo(
    () => planets.map(() => createRef<PlanetHandle>()),
    []
  );

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const totalScenes = planets.length + 1; 
    gsap.set(container, { x: 0 });
    panelRefs.current.forEach((panel, i) =>
      gsap.set(panel, { opacity: i === 0 ? 1 : 0 })
    );

    const tl = gsap.timeline({
  scrollTrigger: {
    trigger: wrapper,
    start: "top top",
    end: `+=${window.innerHeight * totalScenes * SCROLL_MULTIPLIER}`,
    scrub: true,
    pin: true,
    onUpdate: (self) => {
      const progress = self.progress
      const index = Math.floor(progress * (planets.length + 1))
      if (index === 0) {
        setCurrentPlanet('default')
      } else {
        setCurrentPlanet(planets[index - 1])
    }}}
    });

    for (let i = 0; i < totalScenes; i++) {
      tl.to(container, {
        x: -i * SCENE_WIDTH,
        duration: 1.2,
        ease: "power2.inOut",
      });

      if (i > 0) {
        const planetObj = { scale: 0.5 }
tl.to(
  planetObj,
  {
    scale: SCENE_WIDTH < 768 ? 0.5 : 1,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: () => {
      const ref = planetRefs[i - 1].current;
      if (ref) ref.setScale(planetObj.scale);
    },
    onReverseComplete: () => {
      const ref = planetRefs[i - 1].current;
      if (ref) ref.setScale(0.5);
    },
  },
  "<"
);
      }

      tl.to(panelRefs.current[i], { autoAlpha: 1, duration: 0.8 }, "<");
      if (i > 0)
        tl.to(panelRefs.current[i - 1], { autoAlpha: 0, duration: 0.8 }, "<");
    }

    return () => tl.scrollTrigger?.kill();
  }, [planetRefs, SCENE_WIDTH]);

  return (
    <>
    <Header currentPlanet={currentPlanet} />

    <div style={{ height: `${(planets.length + 1) * SCROLL_MULTIPLIER * 100}vh` }}>
      <div ref={wrapperRef} className="relative bg-black h-screen">
        <div
          ref={containerRef}
          className="flex h-screen"
          style={{ width: `${(planets.length + 1) * SCENE_WIDTH}px` }}
        >
          <HeroSection panelRefs={panelRefs} />
          {planets.map((planet, i) => (
            <section
              key={planet}
              ref={(el) => {
                if (el) panelRefs.current[i + 1] = el as HTMLDivElement;
              }}
              className="flex-shrink-0 flex items-center justify-center opacity-0"
              style={{
                width: `${SCENE_WIDTH}px`,
                height: "100vh",
                backgroundColor: "black",
              }}
            >
              <PlanetScene width={SCENE_WIDTH} planet={planet} planetRef={planetRefs[i]} />
            </section>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
