import { useEffect, useState } from "react";
import { getPokemon, getSprite } from "../api/api";
import "../App.css";
import { PokemonStats } from "../assets/helpers";
import PokemonHoverCard from "./PokemonHoverCard";

interface ComparisonBlockProps {
  url: string;
  statsCallback: (stats: PokemonStats[]) => void;
}

export const ComparisonBlock: React.FC<ComparisonBlockProps> = ({
  url,
  statsCallback,
}) => {
  const [pokemon, setPokemon] = useState<object>({});

  const [displayStats, setDisplayStats] = useState<boolean>(false);

  useEffect(() => {
    getPokemon(url).then((data) => {
      setPokemon(data);
      statsCallback(data["stats" as keyof typeof data] as PokemonStats[]);
    });
  }, []);
  return (
    <>
      {displayStats && (
        <PokemonHoverCard stats={pokemon["stats" as keyof typeof pokemon]} />
      )}
      <div className="compare-block">
        <img
          src={getSprite(pokemon["id" as keyof typeof pokemon])}
          height="150"
          width="150"
          onMouseOver={() => setDisplayStats(true)}
          onMouseOut={() => setDisplayStats(false)}
        />
        <div>{pokemon["name" as keyof typeof pokemon]}</div>
        <div className="percentage-container">
          <div className="percentage">
            <div className="percent" />
          </div>
          <div>75%</div>
        </div>
      </div>
    </>
  );
};

export default ComparisonBlock;
