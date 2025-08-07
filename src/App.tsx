import SceneStepperScroll from "./components/scroll/SceneStepperScroll";
import {useState} from "react";
import Header from "./components/Header";
import type { PlanetName } from "./utils/constants";


export default function App() {
  const [currentPlanet, setCurrentPlanet] = useState<PlanetName>('default')
  return (
    <div className="w-screen min-h-screen bg-black">
      <Header currentPlanet={currentPlanet} />
      <SceneStepperScroll currentPlanet={currentPlanet} setCurrentPlanet={setCurrentPlanet} />
    </div>
  );
}
