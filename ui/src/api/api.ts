import axios from "axios";

export const getSprite = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

export const getGenerationOnePokedex = async (): Promise<object> => {
  const response = await axios.get("https://pokeapi.co/api/v2/generation/1");
  return response.data;
};
