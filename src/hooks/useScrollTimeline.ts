import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { PlanetHandle } from '../components/Planet';
import type { PlanetName } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

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

    // -------------------------------
    // Build timeline (NO snap here)
    // -------------------------------
    const tl = gsap.timeline();
    for (let i = 0; i < totalScenes; i++) {
      tl.addLabel(`scene-${i}`);
      tl.to(container, {
        x: -i * sceneWidth,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      if (i > 0) {
        const planetObj = { scale: 0.5 };
        tl.to(
          planetObj,
          {
            scale: sceneWidth < 768 ? 0.8 : 1,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              const ref = planetRefs[i - 1].current;
              if (ref) ref.setScale(planetObj.scale);
            },
            onReverseComplete: () => {
              const ref = planetRefs[i - 1].current;
              if (ref) ref.setScale(0.5);
            },
          },
          '<'
        );
      }

      tl.to(panelRefs.current[i], { autoAlpha: 1, duration: 0.8 }, '<');
      if (i > 0)
        tl.to(panelRefs.current[i - 1], { autoAlpha: 0, duration: 0.8 }, '<');
    }

    const labels = Object.entries(tl.labels)
      .sort((a, b) => a[1] - b[1])
      .map(([, time]) => time / tl.duration());

    const stAnim = ScrollTrigger.create({
      animation: tl,
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${window.innerHeight * totalScenes * scrollMultiplier}`,
      scrub: true,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const prog = Math.min(0.999999, Math.max(0, self.progress));
        const index = Math.floor(prog * totalScenes);
        setCurrentPlanet(
          index === 0
            ? ('default' as PlanetName)
            : (planets[index - 1] as PlanetName)
        );
      },
    });

    const saturnIndex = Math.max(1, labels.length - 2);

    const FWD_T = 0.18;
    const BACK_T = 0.08;
    const firstSpan = Math.max(1e-6, labels[1] - labels[0]);
    const TOP_ALLOW_0_ABS = firstSpan * 0.9;
    const prevToSaturnSpan = Math.max(
      1e-6,
      labels[saturnIndex] - labels[saturnIndex - 1]
    );
    const SATURN_BUFFER_ABS = prevToSaturnSpan * 0.06;

    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${window.innerHeight * totalScenes * scrollMultiplier}`,

      snap: {
        snapTo: (raw: number): number => {
          const v = gsap.utils.clamp(0, 1, raw);

          if (v >= labels[saturnIndex] - SATURN_BUFFER_ABS) return v;

          if (v <= TOP_ALLOW_0_ABS) return 0;

          let i = 0;
          for (let k = 0; k < saturnIndex; k++) {
            if (v >= labels[k] && v < labels[k + 1]) {
              i = k;
              break;
            }
          }

          const start = labels[i];
          const end = labels[i + 1];
          const span = Math.max(1e-6, end - start);
          const t = (v - start) / span;

          const prevLabel = labels[i];
          const nextLabel = labels[i + 1];

          if (t >= FWD_T) return nextLabel;

          if (t <= BACK_T) return prevLabel;

          return nextLabel;
        },
        duration: { min: 0.08, max: 0.16 },
        ease: 'power2.out',
        inertia: true,
        delay: 0,
        directional: true,
      },
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    const initial = setTimeout(() => ScrollTrigger.refresh(), 0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    const onOrientation = () => setTimeout(refresh, 250);
    window.addEventListener('orientationchange', onOrientation);

    return () => {
      clearTimeout(initial);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', onOrientation);

      stAnim.kill();
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
