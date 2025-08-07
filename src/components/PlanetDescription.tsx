import   type {
  PlanetName,
  PlanetNameWithoutDefault,
} from "../utils/constants";
import PLANET_DESCRIPTION from "../utils/constants";

type Props = {
  planet: PlanetName;
};

export default function PlanetDescription({ planet }: Props) {
  if (planet === "default") return null;

  const data = PLANET_DESCRIPTION[planet as PlanetNameWithoutDefault];

  return (
    <div className="w-full max-w-xs mt-20 md:max-w-md mx-auto p-2 md:p-6 bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-black/60 backdrop-blur-lg rounded-xl md:rounded-2xl text-white shadow-2xl border border-white/10 space-y-3 md:space-y-4 pointer-events-auto scale-[0.85] md:scale-100">
  <p className="text-xs md:text-base text-gray-200 text-center leading-snug md:leading-normal">
    {data.description}
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-left text-white/90">
    <div>
      <span className="text-indigo-400 font-medium">Diameter:</span> {data.diametr} km
    </div>
    <div>
      <span className="text-indigo-400 font-medium">Moons:</span> {data.moons}
    </div>
    <div>
      <span className="text-indigo-400 font-medium">Temperature:</span> {data.temperature}°C
    </div>
    <div>
      <span className="text-indigo-400 font-medium">Atmosphere:</span> {data.atmosphere}
    </div>
  </div>

  <p className="italic text-xs md:text-sm text-indigo-300 border-l-4 border-indigo-500 pl-2 md:pl-3 break-words">
    "{data.trivia}"
  </p>

  <div className="text-center">
    <a
  href={`https://en.wikipedia.org/wiki/${planet}`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-2 w-full md:w-auto cursor-pointer px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs md:text-sm font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg inline-block text-center"
>
  Learn More
</a>
  </div>
</div>



  )
}
