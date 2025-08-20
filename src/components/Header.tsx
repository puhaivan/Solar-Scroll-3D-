import clsx from 'clsx';

const planetStyles: { [key: string]: string } = {
  default:
    'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-pink-400 hover:to-blue-300',
  mercury: 'text-yellow-300 hover:text-yellow-400',
  venus: 'text-pink-300 hover:text-pink-400',
  earth: 'text-blue-400 hover:text-blue-500',
  mars: 'text-red-400 hover:text-red-500',
  jupiter: 'text-orange-400 hover:text-orange-500',
  saturn: 'text-yellow-200 hover:text-yellow-300',
  uranus: 'text-teal-300 hover:text-teal-400',
  neptune: 'text-indigo-400 hover:text-indigo-500',
};

interface HeaderProps {
  currentPlanet: string;
}

export default function Header({ currentPlanet }: HeaderProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <img
        src="/images/solar-logo.png"
        alt="Solar Logo"
        className="
    fixed top-7 left-6 z-50 cursor-pointer pointer-events-auto
    w-50 h-30
    hover:scale-110 transition-transform duration-300
    max-[994px]:w-[20vw] max-[994px]:h-[12vh]
  "
        onClick={scrollToTop}
      />

      <header className="fixed top-0 left-0 w-full z-40 flex justify-center pointer-events-none">
        <div className="mt-8 px-6 py-4 rounded-2xl backdrop-blur-md bg-black/40 shadow-lg border border-indigo-500/40 max-w-xl w-full text-center pointer-events-auto">
          <h1
            className={clsx(
              'text-3xl md:text-5xl font-bold tracking-wide transition-all duration-300 drop-shadow hover:scale-105',
              planetStyles[currentPlanet] || 'text-white'
            )}
          >
            {currentPlanet === 'default'
              ? '3D Solar Scroll'
              : currentPlanet.toUpperCase()}
          </h1>
        </div>
      </header>
    </>
  );
}
