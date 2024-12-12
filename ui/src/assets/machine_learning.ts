/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMove } from "../api/api";
import { SelectOption } from "../pages/Compare";
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
  if (moveUsed["damage_class" as keyof typeof moveUsed]["name"] === "status")
    return 0;
  const calcCrit: number = Math.floor(Math.random() * 2) + 1;

  let attack: number = +extractStats(
    attacker["stats" as keyof typeof attacker]
  )[
    moveUsed["damage_class" as keyof typeof moveUsed]["name"] === "physical"
      ? "attack"
      : "special-attack"
  ];

  let defense: number = +extractStats(
    defender["stats" as keyof typeof defender]
  )[
    moveUsed["damage_class" as keyof typeof moveUsed]["name"] === "physical"
      ? "defense"
      : "special-defense"
  ];

  if (attack > 255 || defense > 255) {
    attack = Math.floor(attack / 4);
    defense = Math.floor(defense / 4);
  }
  const stab: number = [...attacker["types" as keyof typeof attacker]]
    .map((t: object) => t["type" as keyof typeof t]["name"])
    .includes(moveUsed["type" as keyof typeof moveUsed]["name"])
    ? 1.5
    : 1;

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

  const damage =
    ((((2 * POKE_LEVEL * calcCrit) / 5 + 2) *
      (moveUsed["power" as keyof typeof moveUsed] || 0) *
      (attack / defense)) /
      50 +
      2) *
    stab *
    type1Effectiveness *
    type2Effectiveness;

  if (damage <= 0) {
    return damage;
  }
  return Math.floor(damage * ((Math.floor(Math.random() * 39) + 217) / 255));
};

export const prepareDefenderMoves = async (targetPokemon: object) => {
  const dMoves = new Array(4)
    .fill(0)
    .map(() =>
      Math.floor(
        Math.random() *
          (
            targetPokemon[
              "moves" as keyof typeof targetPokemon
            ] as Array<object>
          ).length
      )
    );
  return await Promise.all([
    getMove(
      targetPokemon["moves" as keyof typeof targetPokemon][dMoves[0]]["move"][
        "url"
      ]
    ),
    getMove(
      targetPokemon["moves" as keyof typeof targetPokemon][dMoves[1]]["move"][
        "url"
      ]
    ),
    getMove(
      targetPokemon["moves" as keyof typeof targetPokemon][dMoves[2]]["move"][
        "url"
      ]
    ),
    getMove(
      targetPokemon["moves" as keyof typeof targetPokemon][dMoves[3]]["move"][
        "url"
      ]
    ),
  ]);
};

const mostAccurate = (moves: object[]): object => {
  let accuracy: { [key: string]: any } = { accuracy: 0 };
  moves.forEach((move) => {
    if (move["accuracy" as keyof typeof move] >= accuracy["accuracy"]) {
      accuracy = move;
    }
  });
  return accuracy;
};

const mostPowerful = (moves: object[]): object => {
  let power: { [key: string]: any } = { power: 0 };
  moves.forEach((move) => {
    if (move["power" as keyof typeof move] >= power["power"]) {
      power = move;
    }
  });
  return power;
};

const decisionTree = (
  selectedMoves: object[],
  targetPokemon: object,
  defending: boolean
): object => {
  // First Decision, do I have a type advantage?
  if (
    selectedMoves.some(
      (move) =>
        TYPE_MATRIX[
          POKE_TYPES[
            move["type" as keyof typeof move]["name"] as keyof typeof POKE_TYPES
          ]
        ][
          POKE_TYPES[
            targetPokemon["types" as keyof typeof targetPokemon][0][
              "name"
            ] as keyof typeof POKE_TYPES
          ]
        ] === 2
    )
  ) {
    const typeAdvantageMoves = selectedMoves.filter(
      (move) =>
        move["type" as keyof typeof move] ===
        targetPokemon["types" as keyof typeof targetPokemon][0]["name"]
    );
    // Second Decision, am I defending? Use the most accurate attack
    if (defending) {
      return mostAccurate(typeAdvantageMoves);
      // Else, use the most powerful attack
    } else {
      return mostPowerful(typeAdvantageMoves);
    }
    // No type advantage, branch
  } else {
    // Second decision, am I defending? Use the most accurate attack
    if (defending) {
      return mostAccurate(selectedMoves);
      // Not defending, use most powerful move
    } else {
      return mostPowerful(selectedMoves);
    }
  }
};

export const predictSuccessOutcome = async (
  selectedPokemon: object,
  selectedMoves: SelectOption[],
  targetPokemon: object,
  targetPokemonMoves: object[]
): Promise<number | null> => {
  const aMoves = [...selectedMoves].map((m) => m.value);
  const attackerMoves = await Promise.all(aMoves.map((m) => getMove(m))).catch(
    () => null
  );

  const defenderMoves = [...targetPokemonMoves];

  if (!attackerMoves || !defenderMoves)
    throw new Error("unable to determine move sets");

  // Begin simulations //
  // To start, we will run 100 battle simulations //
  let wins = 0;
  for (let i = 0; i < 100; i++) {
    const attacker = { ...selectedPokemon };
    const attackerStats = extractStats(
      attacker["stats" as keyof typeof attacker]
    );
    const defender = { ...targetPokemon };
    const defenderStats = extractStats(
      defender["stats" as keyof typeof defender]
    );
    while (+attackerStats["hp"] > 0 && +defenderStats["hp"] > 0) {
      if (+attackerStats["speed"] > +defenderStats["speed"]) {
        defenderStats["hp"] = `${
          +defenderStats["hp"] -
          calculateDamage(
            decisionTree(attackerMoves, defender, false),
            attacker,
            defender
          )
        }`;
        if (+defenderStats["hp"] <= 0) {
          wins += 1;
          break;
        }
        attackerStats["hp"] = `${
          +attackerStats["hp"] -
          calculateDamage(
            defenderMoves[Math.floor(Math.random() * defenderMoves.length)],
            defender,
            attacker
          )
        }`;
        if (+attackerStats["hp"] <= 0) {
          break;
        }
      } else {
        attackerStats["hp"] = `${
          +attackerStats["hp"] -
          calculateDamage(
            defenderMoves[Math.floor(Math.random() * defenderMoves.length)],
            defender,
            attacker
          )
        }`;
        if (+attackerStats["hp"] <= 0) {
          break;
        }
        defenderStats["hp"] = `${
          +defenderStats["hp"] -
          calculateDamage(
            decisionTree(attackerMoves, defender, false),
            attacker,
            defender
          )
        }`;
        if (+defenderStats["hp"] <= 0) {
          wins += 1;
          break;
        }
      }
    }
  }
  return wins;
};
