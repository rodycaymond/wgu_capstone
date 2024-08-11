import { useEffect, useState } from "react";
import { getPokemon } from "../api/api";

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
  return <div>{pokemon["name" as keyof typeof pokemon]}</div>;
};

export default ComparisonBlock;
