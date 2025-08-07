export const planets = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune"
] as const;

export type PlanetName = typeof planets[number] | 'default';
export type PlanetNameWithoutDefault = typeof planets[number];

export type PlanetDescription = {
  description: string;
  diametr: number;
  moons: number;
  temperature: number;
  atmosphere: string;
  trivia: string;
};

const PLANET_DESCRIPTION: Record<PlanetNameWithoutDefault, PlanetDescription> = {
  mercury: {
    description: "Mercury is the closest planet to the Sun and the smallest in the solar system.",
    diametr: 4879,
    moons: 0,
    temperature: 167,
    atmosphere: "None (Trace amounts of O, Na, H)",
    trivia: "A year on Mercury is just 88 Earth days."
  },
  venus: {
    description: "Venus has a thick, toxic atmosphere and is the hottest planet in our solar system.",
    diametr: 12104,
    moons: 0,
    temperature: 464,
    atmosphere: "CO₂, N₂",
    trivia: "It spins in the opposite direction to most planets."
  },
  earth: {
    description: "Earth is the only planet known to support life, with diverse ecosystems and climates.",
    diametr: 12742,
    moons: 1,
    temperature: 15,
    atmosphere: "N₂, O₂",
    trivia: "70% of Earth’s surface is covered by water."
  },
  mars: {
    description: "Mars is a dusty, cold desert world with signs of ancient water flows.",
    diametr: 6779,
    moons: 2,
    temperature: -65,
    atmosphere: "CO₂, N₂, Ar",
    trivia: "Mars has the tallest volcano in the solar system, Olympus Mons."
  },
  jupiter: {
    description: "Jupiter is the largest planet, known for its Great Red Spot and many moons.",
    diametr: 139820,
    moons: 79,
    temperature: -110,
    atmosphere: "H₂, He",
    trivia: "Jupiter has the shortest day of all planets."
  },
  saturn: {
    description: "Saturn is famous for its stunning ring system and is the second-largest planet.",
    diametr: 116460,
    moons: 83,
    temperature: -140,
    atmosphere: "H₂, He",
    trivia: "Saturn could float in water due to its low density."
  },
  uranus: {
    description: "Uranus rotates on its side and has a pale blue color due to methane in its atmosphere.",
    diametr: 50724,
    moons: 27,
    temperature: -195,
    atmosphere: "H₂, He, CH₄",
    trivia: "Uranus's tilt causes extreme seasons lasting over 20 years."
  },
  neptune: {
    description: "Neptune is a deep blue planet with supersonic winds and distant, icy conditions.",
    diametr: 49244,
    moons: 14,
    temperature: -200,
    atmosphere: "H₂, He, CH₄",
    trivia: "Neptune has the fastest winds in the solar system."
  }
};

export default PLANET_DESCRIPTION;
