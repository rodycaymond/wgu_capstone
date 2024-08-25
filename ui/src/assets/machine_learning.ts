import { getMove } from "../api/api";
import { extractStats, POKE_TYPES, TYPE_MATRIX } from "./helpers";

const POKE_LEVEL = 1 as const;

/**
 * @param moveUsed as the attacking move from the attacking pokemon
 * @param attacker as a pokemon object
 * @param defense as a pokemon object
 *
 * @returns damage as a number calculated
 */
const calculateDamage = (
  moveUsed: object,
  attacker: object,
  defender: object
): number => {
  const calcCrit: number = Math.floor(Math.random() * 2) + 1;
  console.log("crit: ", calcCrit);
  let attack: number = +extractStats(
    attacker["stats" as keyof typeof attacker]
  )[
    moveUsed["damage_class" as keyof typeof moveUsed] === "physical"
      ? "attack"
      : "special-attack"
  ];
  console.log("attack: ", attack);
  let defense: number = +extractStats(
    defender["stats" as keyof typeof defender]
  )[
    moveUsed["damage_class" as keyof typeof moveUsed] === "physical"
      ? "defense"
      : "special-defense"
  ];
  console.log("defense: ", defense);
  if (attack > 255 || defense > 255) {
    attack = Math.floor(attack / 4);
    defense = Math.floor(defense / 4);
  }
  const stab: number = [...attacker["types" as keyof typeof attacker]]
    .map((t: object) => t["type" as keyof typeof t]["name"])
    .includes(moveUsed["type" as keyof typeof moveUsed]["name"])
    ? 1.5
    : 1;
  console.log("stab: ", stab);
  const type1Effectiveness: number =
    TYPE_MATRIX[
      POKE_TYPES[
        moveUsed["type" as keyof typeof moveUsed][
          "name"
        ] as keyof typeof POKE_TYPES
      ]
    ][
      POKE_TYPES[
        defender["types" as keyof typeof defender][0]["type"][
          "name"
        ] as keyof typeof POKE_TYPES
      ]
    ];
  console.log("type1: ", type1Effectiveness);
  let type2Effectiveness: number = 1;
  if (
    (defender["types" as keyof typeof defender] as Array<object>).length > 1
  ) {
    type2Effectiveness =
      TYPE_MATRIX[
        POKE_TYPES[
          moveUsed["type" as keyof typeof moveUsed][
            "name"
          ] as keyof typeof POKE_TYPES
        ]
      ][
        POKE_TYPES[
          defender["types" as keyof typeof defender][1]["type"][
            "name"
          ] as keyof typeof POKE_TYPES
        ]
      ];
  }
  console.log("type2: ", type2Effectiveness);
  const damage =
    ((((2 * POKE_LEVEL * calcCrit) / 5 + 2) *
      moveUsed["power" as keyof typeof moveUsed] *
      (attack / defense)) /
      50 +
      2) *
    stab *
    type1Effectiveness *
    type2Effectiveness;
  console.log("first damage calc before 0 check: ", damage);
  if (damage <= 0) {
    return damage;
  }
  return Math.floor(damage * ((Math.floor(Math.random() * 39) + 217) / 255));
};

export const predictSuccessOutcome = async (
  selectedPokemon: object,
  targetPokemon: object
): Promise<number> => {
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
  const moveInfo = await getMove(
    selectedPokemon["moves" as keyof typeof selectedPokemon][0]["move"]["url"]
  );
  console.log(percentageGreaterMap);
  console.log("Pokemon 1 attacked pokemon 2");
  console.log(
    "The damage done is as follows: ",
    calculateDamage(moveInfo, selectedPokemon, targetPokemon)
  );
  return 0;
};
