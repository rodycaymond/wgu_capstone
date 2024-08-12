import { useEffect, useState } from "react";
import { getPokemon, getSprite } from "../api/api";
import "../App.css";

interface ComparisonBlockProps {
  url: string;
}

export const ComparisonBlock: React.FC<ComparisonBlockProps> = ({ url }) => {
  const [pokemon, setPokemon] = useState<object>({});
  useEffect(() => {
    getPokemon(url).then((data) => {
      setPokemon(data);
    });
  });
  return (
    <div className="compare-block">
      <img
        src={getSprite(pokemon["id" as keyof typeof pokemon])}
        height="150"
        width="150"
      />
      <div>{pokemon["name" as keyof typeof pokemon]}</div>
      <div className="percentage-container">
        <div className="percentage">
          <div className="percent" />
        </div>
        <div>75%</div>
      </div>
    </div>
  );
};

export default ComparisonBlock;
