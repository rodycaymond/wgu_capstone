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

export const predictSuccessOutcome = async (
  selectedPokemon: object,
  targetPokemon: object
): Promise<number | null> => {
  const aMoves = new Array(4)
    .fill(0)
    .map(() =>
      Math.floor(
        Math.random() *
          (
            selectedPokemon[
              "moves" as keyof typeof selectedPokemon
            ] as Array<object>
          ).length
      )
    );
  const attackerMoves = await Promise.all([
    getMove(
      selectedPokemon["moves" as keyof typeof selectedPokemon][aMoves[0]][
        "move"
      ]["url"]
    ),
    getMove(
      selectedPokemon["moves" as keyof typeof selectedPokemon][aMoves[1]][
        "move"
      ]["url"]
    ),
    getMove(
      selectedPokemon["moves" as keyof typeof selectedPokemon][aMoves[2]][
        "move"
      ]["url"]
    ),
    getMove(
      selectedPokemon["moves" as keyof typeof selectedPokemon][aMoves[3]][
        "move"
      ]["url"]
    ),
  ]).catch(() => null);

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
  const defenderMoves = await Promise.all([
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
  ]).catch(() => null);

  if (!attackerMoves || !defenderMoves) return null;

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
            attackerMoves[Math.floor(Math.random() * attackerMoves.length)],
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
            attackerMoves[Math.floor(Math.random() * attackerMoves.length)],
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
