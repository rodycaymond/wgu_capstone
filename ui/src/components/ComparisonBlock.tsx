import { useState } from "react";
import { getSprite } from "../api/api";
import "../App.css";
import PokemonHoverCard from "./PokemonHoverCard";
import { calcBackgroundColor } from "../assets/helpers";

interface ComparisonBlockProps {
  pokemon: object;
  successRate: number | null;
}

export const ComparisonBlock: React.FC<ComparisonBlockProps> = ({
  pokemon,
  successRate,
}) => {
  const [displayStats, setDisplayStats] = useState<boolean>(false);

  return (
    <>
      <div className="compare-block">
        {displayStats && (
          <PokemonHoverCard
            types={(
              pokemon["types" as keyof typeof pokemon] as object[]
            ).reduce<string>((acc: string, curr: object) => {
              if (acc.length) {
                return acc + ", " + curr["type" as keyof typeof curr]["name"];
              }
              return curr["type" as keyof typeof curr]["name"];
            }, "")}
          />
        )}
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
            <div
              className="percent"
              style={
                successRate
                  ? {
                      width: `${successRate || 100}%`,
                      backgroundColor: calcBackgroundColor(successRate),
                    }
                  : {}
              }
            />
          </div>
          <div>{`${successRate || 0}%`}</div>
        </div>
      </div>
    </>
  );
};

export default ComparisonBlock;
