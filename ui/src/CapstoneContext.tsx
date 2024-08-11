import { createContext, useState } from "react";
import { getGenerationOnePokedex } from "./api/api";
import React from "react";

interface ContextValues {
  pokedexData: object[];
  appHeight: number;
  setAppHeight: React.Dispatch<React.SetStateAction<number>>;
}
export const GlobalContext = createContext({
  pokedexData: [],
  appHeight: 0,
  setAppHeight: () => {},
} as ContextValues);

interface CapstoneContextProps {
  children: React.ReactElement | React.ReactElement[];
}
export const CapstoneContext: React.FC<CapstoneContextProps> = ({
  children,
}) => {
  const [pokedexData, setPokedexData] = useState<object[]>([]);
  const [appHeight, setAppHeight] = useState<number>(0);

  if (!pokedexData.length) {
    getGenerationOnePokedex()
      .then((data) =>
        setPokedexData(data["pokemon_species" as keyof typeof data])
      )
      .catch(() => console.log("failed to fetch pokedex data"));
  }
  return (
    <GlobalContext.Provider
      value={{
        pokedexData: pokedexData,
        appHeight: appHeight,
        setAppHeight: setAppHeight,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
