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

    const totalScenes = planets.length + 1; // hero + planets

    gsap.set(container, { x: 0 });
    panelRefs.current.forEach((panel, i) =>
      gsap.set(panel, { opacity: i === 0 ? 1 : 0 })
    );

    const segment = 1 / (totalScenes - 1);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: wrapper,
    start: "top top",
    end: () => `+=${window.innerHeight * totalScenes * scrollMultiplier}`,
    scrub: true,
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,

    // ✨ Keep mid-scene snapping, but make the last scene "sticky"
    snap: {
      snapTo: (value) => {
        const v = gsap.utils.clamp(0, 1, value);
        // If you're in the last half of the final segment, force Neptune (1.0)
        if (v >= 1 - segment * 0.5) return 1;
        // Otherwise normal per-segment snapping
        return gsap.utils.snap(segment)(v);
      },
      duration: { min: 0.2, max: 0.6 },
      ease: "power1.inOut",
      inertia: false,
    },

    onUpdate: (self) => {
      // Clamp to avoid index === totalScenes when progress hits 1
      const prog = Math.min(0.999999, Math.max(0, self.progress));
      const index = Math.floor(prog * totalScenes);
      setCurrentPlanet(
        index === 0
          ? ("default" as PlanetName)
          : (planets[index - 1] as PlanetName)
      );
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
      if (i > 0) tl.to(panelRefs.current[i - 1], { autoAlpha: 0, duration: 0.8 }, "<");
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    const onOrientation = () => setTimeout(refresh, 250);
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", onOrientation);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [
    wrapperRef,
    containerRef,
    panelRefs,
    planetRefs,
    sceneWidth,
    planets,
    scrollMultiplier,
    setCurrentPlanet,
  ]);
}
