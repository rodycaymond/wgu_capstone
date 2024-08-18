import { extractStats, POKE_TYPES, TYPE_MATRIX } from "./helpers";

export const predictSuccessOutcome = (
  selectedPokemon: object,
  targetPokemon: object
): number => {
  const percentageGreaterMap: { [key: string]: number } = {};
  const selectStats = extractStats(
    selectedPokemon["stats" as keyof typeof selectedPokemon]
  );
  const targetStats = extractStats(
    targetPokemon["stats" as keyof typeof targetPokemon]
  );

  Object.keys(selectStats).forEach((s) => {
    const percentDifference =
      +selectStats[s as keyof typeof selectStats] /
      +targetStats[s as keyof typeof targetStats];
    percentageGreaterMap[s as keyof typeof percentageGreaterMap] =
      percentDifference;
  });
  console.log(percentageGreaterMap);
  return 0;
};
