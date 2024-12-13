/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMove } from "../api/api";
import { SelectOption } from "../pages/Compare";
import { extractStats, POKE_TYPES, TYPE_MATRIX } from "./helpers";
import SPLASH from "./splash";

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
  let accuracy: object = moves[0];
  moves.forEach((move) => {
    if (
      move["accuracy" as keyof typeof move] !== null &&
      move["accuracy" as keyof typeof move] >=
        accuracy["accuracy" as keyof typeof accuracy]
    ) {
      accuracy = move;
    }
  });
  return accuracy;
};

const mostPowerful = (moves: object[]): object => {
  let power: object = moves[0];
  moves.forEach((move) => {
    if (
      move["power" as keyof typeof move] !== null &&
      move["power" as keyof typeof move] >= power["power" as keyof typeof power]
    ) {
      power = move;
    }
  });
  return power;
};

const reducePp = (
  move: object,
  movePpMap: { [key: string]: number }
): { [key: string]: number } => {
  if (movePpMap[move["name" as keyof typeof move]] > 0) {
    movePpMap[move["name" as keyof typeof move]] -= 1;
  }
  return movePpMap;
};

const decisionTree = (
  selectedMoves: object[],
  movePpMap: { [key: string]: number },
  targetPokemon: object,
  defending: boolean
): object => {
  // Do any moves not have PP remaining?
  let finalViableMoveSet = [...selectedMoves].filter((m) => {
    const zeroPPmoves = Object.entries(movePpMap)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => v === 0)
      .map(([k]) => k);
    return !zeroPPmoves.includes(m["name" as keyof typeof m]);
  });

  if (!finalViableMoveSet.length) {
    // Return a move that does no damage (Splash in the original Pokemon games has no effects at all)
    return SPLASH;
  }
  // Is there a type advantage on any move?
  if (
    finalViableMoveSet.some(
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
    finalViableMoveSet = finalViableMoveSet.filter(
      (move) =>
        move["type" as keyof typeof move] ===
        targetPokemon["types" as keyof typeof targetPokemon][0]["name"]
    );
  }
  // Am I defending? Use a more accurate move
  if (defending) {
    return mostAccurate(finalViableMoveSet);
  }

  return mostPowerful(finalViableMoveSet);
};

export const predictSuccessOutcome = async (
  selectedPokemon: object,
  selectedMoves: SelectOption[],
  targetPokemon: object,
  targetPokemonMoves: object[]
): Promise<number> => {
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
    let am = [...attackerMoves].reduce<{
      [key: string]: number;
    }>((acc, curr) => {
      if (!Object.keys(acc).includes(curr["name" as keyof typeof curr])) {
        acc[curr["name" as keyof typeof curr]] =
          curr["pp" as keyof typeof curr];
        return acc;
      }
      return acc;
    }, {});
    let dm = [...defenderMoves].reduce<{
      [key: string]: number;
    }>((acc, curr) => {
      if (!Object.keys(acc).includes(curr["name" as keyof typeof curr])) {
        acc[curr["name" as keyof typeof curr]] =
          curr["pp" as keyof typeof curr];
        return acc;
      }
      return acc;
    }, {});
    const attacker = { ...selectedPokemon };
    const attackerStats = extractStats(
      attacker["stats" as keyof typeof attacker]
    );
    const defender = { ...targetPokemon };
    const defenderStats = extractStats(
      defender["stats" as keyof typeof defender]
    );
    let moveCount = 0;
    while (+attackerStats["hp"] > 0 && +defenderStats["hp"] > 0) {
      if (moveCount > 99) break;
      moveCount++;
      // Attacker is faster, attacker attacks first
      if (+attackerStats["speed"] > +defenderStats["speed"]) {
        const attack = decisionTree(attackerMoves, am, defender, false);
        am = reducePp(attack, am);
        defenderStats["hp"] = `${
          +defenderStats["hp"] - calculateDamage(attack, attacker, defender)
        }`;
        if (+defenderStats["hp"] <= 0) {
          wins += 1;
          break;
        }
        const defense = decisionTree(defenderMoves, dm, attacker, true);
        dm = reducePp(defense, dm);
        attackerStats["hp"] = `${
          +attackerStats["hp"] - calculateDamage(defense, defender, attacker)
        }`;
        if (+attackerStats["hp"] <= 0) {
          break;
        }
      } else {
        // Defender is faster, defender attacks first
        const defense = decisionTree(defenderMoves, dm, attacker, false);
        dm = reducePp(defense, dm);
        attackerStats["hp"] = `${
          +attackerStats["hp"] - calculateDamage(defense, defender, attacker)
        }`;
        if (+attackerStats["hp"] <= 0) {
          break;
        }
        const attack = decisionTree(attackerMoves, am, defender, true);
        am = reducePp(attack, am);
        defenderStats["hp"] = `${
          +defenderStats["hp"] - calculateDamage(attack, attacker, defender)
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
