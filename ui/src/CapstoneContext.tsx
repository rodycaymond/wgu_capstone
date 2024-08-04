import { createContext, useState } from "react";
import { getGenerationOnePokedex } from "./api/api";

interface ContextValues {
  pokedexData: object[];
}
export const GlobalContext = createContext({
  pokedexData: [],
} as ContextValues);

interface CapstoneContextProps {
  children: React.ReactElement | React.ReactElement[];
}
export const CapstoneContext: React.FC<CapstoneContextProps> = ({
  children,
}) => {
  const [pokedexData, setPokedexData] = useState<object[]>([]);

  if (!pokedexData.length) {
    getGenerationOnePokedex()
      .then((data) =>
        setPokedexData(data["pokemon_species" as keyof typeof data])
      )
      .catch(() => console.log("failed to fetch pokedex data"));
  }
  return (
    <GlobalContext.Provider value={{ pokedexData: pokedexData }}>
      {children}
    </GlobalContext.Provider>
  );
};
