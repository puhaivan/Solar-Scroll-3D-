import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import PlanetScene from "../PlanetScene";

gsap.registerPlugin(ScrollTrigger);

export default function SceneStepperScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);

  const planets = [
    "mercury", "venus", "earth", "mars",
    "jupiter", "saturn", "uranus", "neptune"
  ];

  const SCENE_WIDTH = 1400;
  const SCROLL_MULTIPLIER = 2;

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const totalScenes = planets.length;

    // Set initial opacity
    gsap.set(container, { x: 0 });
    panelRefs.current.forEach((panel, i) =>
      gsap.set(panel, { opacity: i === 0 ? 1 : 0 })
    );

    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: `+=${window.innerHeight * totalScenes * 2}`,
        scrub: true,
        pin: true,
      },
    });

    
    for (let i = 0; i < totalScenes; i++) {
      tl.to(container, {
        x: -i * SCENE_WIDTH,
        duration: 1,
        ease: "power2.inOut",
      });

      tl.to(
        panelRefs.current[i],
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<"
      );

      if (i > 0) {
        tl.to(
          panelRefs.current[i - 1],
          {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<" 
        );
      }
    }

    return () => tl.scrollTrigger?.kill();
  }, [planets.length]);

  return (
   <div style={{ height: `${planets.length * 105 * SCROLL_MULTIPLIER}vh` }}>

      <div ref={wrapperRef} className="relative bg-black h-screen">
        <div
          ref={containerRef}
          className="flex h-screen"
          style={{ width: `${planets.length * SCENE_WIDTH}px` }}
        >
          {planets.map((planet, i) => (
            <section
              key={planet}
              ref={(el) => {
                if (el) panelRefs.current[i] = el as HTMLDivElement;
              }}
              className="flex-shrink-0 flex items-center justify-center opacity-0"
              style={{
                width: `${SCENE_WIDTH}px`,
                height: "100vh",
                backgroundColor: "black",
              }}
            >
              <PlanetScene planet={planet} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
