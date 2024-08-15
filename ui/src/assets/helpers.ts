export interface PokemonStats {
  base_stat: string;
  effort: string;
  stat: {
    name: string;
    url: string;
  };
}

export interface StatsAndPokemonName {
  pokemon: string;
  stats: StatsOnly;
}

export interface StatsOnly {
  hp: string;
  attack: string;
  defense: string;
  "special-attack": string;
  "special-defense": string;
  speed: string;
}

export const extractStats = (stats: PokemonStats[]): StatsOnly => {
  const so: StatsOnly = {
    hp: "0",
    attack: "0",
    defense: "0",
    "special-attack": "0",
    "special-defense": "0",
    speed: "0",
  };

  if (!stats.length) return so;

  for (let i = 0; i < stats.length; i++) {
    so[stats[i].stat.name as keyof typeof so] = stats[i].base_stat;
  }

  return so;
};
