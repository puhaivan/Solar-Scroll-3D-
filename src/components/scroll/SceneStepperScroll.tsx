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

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const totalScenes = planets.length;
    const totalScroll = window.innerHeight * (totalScenes - 1); // ✅ scroll space

    gsap.set(container, { x: 0 });
    panelRefs.current.forEach((panel, i) =>
      gsap.set(panel, { opacity: i === 0 ? 1 : 0 })
    );

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: `+=${totalScroll}`,
      scrub: 0,
      pin: true,
      onUpdate: (self) => {
        const sceneIndex = Math.floor(self.progress * (totalScenes - 0.001));

        gsap.to(container, {
          x: -sceneIndex * SCENE_WIDTH,
          duration: 0.3,
          ease: "power2.out",
        });

        panelRefs.current.forEach((panel, i) => {
          gsap.to(panel, {
            opacity: i === sceneIndex ? 1 : 0,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      },
    });

    ScrollTrigger.refresh();
    return () => trigger.kill();
  }, [planets.length]);

  return (
    <div style={{ height: `${planets.length * 100}vh` }}> {/* ✅ fake scroll */}
      <div
        ref={wrapperRef}
        className="relative bg-black h-screen"
      >
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
