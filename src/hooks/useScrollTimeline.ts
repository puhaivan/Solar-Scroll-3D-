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

    // Label progress positions [0..1]
    const labels = Object.entries(tl.labels)
      .sort((a, b) => a[1] - b[1])
      .map(([, time]) => time / tl.duration()); // [0 ... 1], last is 1.0

    // -------------------------------
    // 1) Animation ScrollTrigger (NO SNAP)
    // -------------------------------
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

    // -------------------------------
    // 2) Separate Snap ScrollTrigger
    //    Early forward snap for ALL scenes before Saturn.
    //    Saturn + Neptune = free/no-snap.
    // -------------------------------

    // indices in labels[]: ... , Saturn, Neptune(=1)
    const saturnIndex = Math.max(1, labels.length - 2);
    const lastIndex = labels.length - 1; // Neptune/end

    // thresholds relative to *actual* segment length between consecutive labels
    const FWD_T = 0.18; // snap forward once you're 18% into the *current* segment
    const BACK_T = 0.08; // only snap back if you're within the first 8%
    const firstSpan = Math.max(1e-6, labels[1] - labels[0]);
    const TOP_ALLOW_0_ABS = firstSpan * 0.9; // near top → allow snap-to-0
    const prevToSaturnSpan = Math.max(
      1e-6,
      labels[saturnIndex] - labels[saturnIndex - 1]
    );
    const SATURN_BUFFER_ABS = prevToSaturnSpan * 0.06; // tiny buffer before Saturn to avoid boundary jitter

    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${window.innerHeight * totalScenes * scrollMultiplier}`,
      // IMPORTANT: no scrub here — let the snap tween run
      snap: {
        snapTo: (raw: number): number => {
          const v = gsap.utils.clamp(0, 1, raw);

          // 🚫 Disable snapping from (Saturn - buffer) onward (i.e., Saturn + Neptune are free)
          if (v >= labels[saturnIndex] - SATURN_BUFFER_ABS) return v;

          // Near the very top → allow snap to 0
          if (v <= TOP_ALLOW_0_ABS) return 0;

          // Find current segment i s.t. labels[i] <= v < labels[i+1], clamped before Saturn
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
          const t = (v - start) / span; // local progress in this segment [0..1]

          const prevLabel = labels[i];
          const nextLabel = labels[i + 1];

          // ⚡ Early forward snap once past FWD_T of the current segment
          if (t >= FWD_T) return nextLabel;

          // ⬅️ Only snap back if you're very close to the start
          if (t <= BACK_T) return prevLabel;

          // Otherwise, bias forward
          return nextLabel;
        },
        duration: { min: 0.08, max: 0.16 }, // quick & decisive
        ease: 'power2.out',
        inertia: true, // respect flick momentum
        delay: 0,
        directional: true, // bias to scroll direction
      },
    });

    // Measure after paint (align pin spacing & ranges)
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
