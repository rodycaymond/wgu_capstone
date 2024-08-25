import axios from "axios";

export const getSprite = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

export const getGenerationOnePokedex = async (): Promise<object> => {
  const response = await axios.get("https://pokeapi.co/api/v2/generation/1");
  return response.data;
};

export const getPokemon = async (url: string): Promise<object> => {
  const response = await axios.get(url.replace("-species", ""));
  return response.data;
};

export const getMove = async (url: string): Promise<object> => {
  const response = await axios.get(url);
  return response.data;
};
