import { useState } from "react";
import PlanetScene from "./PlanetScene";
import PlanetDescription from "./PlanetDescription";
import type { PlanetHandle } from "./Planet";
import type { PlanetName } from "../utils/constants";
import type { RefObject } from "react";

interface PlanetSectionProps {
  planet: string;
  index: number;
  currentPlanet: PlanetName;
  panelRef: (el: HTMLDivElement | null) => void;
  planetRef: RefObject<PlanetHandle | null>;
  sceneWidth: number;
}

export default function PlanetSection({
  planet,
  currentPlanet,
  panelRef,
  planetRef,
  sceneWidth,
}: PlanetSectionProps) {
  const [isNight, setIsNight] = useState(false);

  

  return (
    <section
      key={planet}
      ref={panelRef}
      className="flex-shrink-0 flex flex-col md:flex-row items-center justify-center opacity-0"
      style={{
        width: `${sceneWidth}px`,
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      <div className="w-full md:w-1/2 flex justify-center items-center h-full pt-24 md:pt-0">
        {currentPlanet !== "default" && (
          <PlanetDescription
            planet={currentPlanet}
            isNight={isNight}
            setIsNight={setIsNight}
          />
        )}
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center h-full">
        <PlanetScene
          width={sceneWidth}
          planet={planet}
          planetRef={planetRef}
          
          isNight={isNight}
        />
      </div>
    </section>
  );
}
