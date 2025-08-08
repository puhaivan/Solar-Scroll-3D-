import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { PlanetHandle } from "../components/Planet";
import type { PlanetName } from "../utils/constants";

gsap.registerPlugin(ScrollTrigger);

export function useScrollTimeline({
  wrapperRef,
  containerRef,
  panelRefs,
  planetRefs,
  sceneWidth,
  planets,
  scrollMultiplier,
  setCurrentPlanet,
}: {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  panelRefs: React.MutableRefObject<HTMLDivElement[]>;
  planetRefs: React.RefObject<PlanetHandle | null>[];
  sceneWidth: number;
  planets: readonly string[];
  scrollMultiplier: number;
  setCurrentPlanet: React.Dispatch<React.SetStateAction<PlanetName>>;
}) {
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
        end: `+=${window.innerHeight * totalScenes * scrollMultiplier}`,
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * totalScenes);
          if (index === 0) {
            setCurrentPlanet("default" as PlanetName);
          } else {
            setCurrentPlanet(planets[index - 1] as PlanetName);
          }
        },
      },
    });

    for (let i = 0; i < totalScenes; i++) {
      tl.to(container, {
        x: -i * sceneWidth,
        duration: 1.2,
        ease: "power2.inOut",
      });

      if (i > 0) {
        const planetObj = { scale: 0.5 };
        tl.to(
          planetObj,
          {
            scale: sceneWidth < 768 ? 0.8 : 1,
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
      if (i > 0) {
        tl.to(panelRefs.current[i - 1], { autoAlpha: 0, duration: 0.8 }, "<");
      }
    }

    return () => tl.scrollTrigger?.kill();
  }, [planetRefs, sceneWidth, setCurrentPlanet, containerRef, panelRefs, planets, scrollMultiplier, wrapperRef]);
}
