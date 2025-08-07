import { useEffect, useState } from 'react'
import clsx from 'clsx'

const planetStyles: { [key: string]: string } = {
 default: 'text-white',
  mercury: 'text-gray-300',
  venus: 'text-yellow-300',
  earth: 'text-blue-400',
  mars: 'text-red-400',
  jupiter: 'text-orange-300',
  saturn: 'text-yellow-200',
  uranus: 'text-teal-300',
  neptune: 'text-blue-300',
}


export default function Header({ currentPlanet = 'default' }: { currentPlanet: string }) {
  const [visibleText, setVisibleText] = useState('Planets Awaken — 3D Solar Scroll')

  useEffect(() => {
    if (currentPlanet === 'default') {
      setVisibleText('Planets Awaken — 3D Solar Scroll')
    } else {
      setVisibleText(currentPlanet.charAt(0).toUpperCase() + currentPlanet.slice(1))
    }
  }, [currentPlanet])

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md py-3 px-6">
      <div
        className={clsx(
          'text-2xl font-bold text-center transition-all duration-500',
          planetStyles[currentPlanet] || planetStyles.default
        )}
      >
        {visibleText}
      </div>
    </header>
  )
}
