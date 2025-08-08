import { useRef, useEffect } from 'react'
import type { MutableRefObject } from 'react'

type LandingSectionProps = {
  panelRefs: MutableRefObject<HTMLDivElement[]>
}

export default function HeroSection({ panelRefs }: LandingSectionProps) {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (sectionRef.current) {
      panelRefs.current[0] = sectionRef.current
    }
  }, [panelRefs])

  return (
    <section
    id="hero"
      ref={sectionRef}
      className="flex-shrink-0 flex flex-col items-center justify-center text-white text-center px-6 relative overflow-hidden panel"
      style={{
        backgroundImage: 'url("/images/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-stars opacity-30 z-0" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      <div className="z-10 max-w-3xl px-6 py-10 border-2 border-indigo-500 rounded-2xl bg-black/30 backdrop-blur-md shadow-xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] flex items-center justify-center">
          
          Planets Awaken
        </h1>

        <p className="text-lg md:text-2xl text-indigo-300 font-light mb-10 leading-relaxed drop-shadow-sm">
          Discover the <span className="text-pink-400 font-semibold">beauty</span> of our solar system.<br />
          Each scroll takes you <span className="text-blue-400 font-semibold">deeper into space</span>.
        </p>

        <div className="flex flex-col items-center">
          <span className="text-white font-semibold text-sm tracking-widest uppercase mb-1 opacity-90">
            Scroll Down
          </span>
          <div className="w-6 h-6 animate-bounce opacity-90">
            <svg
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
