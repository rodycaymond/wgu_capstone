import "../App.css";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveRadar } from "@nivo/radar";
import {
  convertToRadarData,
  extractStats,
  StatsAndPokemonName,
} from "../assets/helpers";
import { getSprite } from "../api/api";
import { useState } from "react";

interface TargetPokemonProps {
  pokemon: object;
  compareStats: StatsAndPokemonName[];
  selectedMoves: object[];
}

export const TargetPokemonBlock: React.FC<TargetPokemonProps> = ({
  pokemon,
  compareStats,
  selectedMoves,
}) => {
  const [toggled, setToggled] = useState<boolean>(false);
  if (!pokemon) {
    return <></>;
  }

  return (
    <>
      <div className="target-container">
        <div className="sprite-container">
          <img
            src={getSprite(pokemon["id" as keyof typeof pokemon])}
            height="150"
            width="150"
          />
        </div>
        <div className="description-container">
          <div style={{ textDecoration: "underline", fontSize: 18 }}>
            {(
              pokemon["name" as keyof typeof pokemon][0] as string
            ).toUpperCase() +
              (pokemon["name" as keyof typeof pokemon] as string).substring(1)}
          </div>
          <div style={{ fontSize: 18 }}>
            Types:{" "}
            {(pokemon["types" as keyof typeof pokemon] as Array<object>)
              .map((t) => t["type" as keyof typeof t]["name"])
              .join(", ")}
          </div>
          {[...selectedMoves].map((m, i) => (
            <div key={i + 1}>
              Move {i + 1}: {m["name" as keyof typeof m]}
            </div>
          ))}
          <div
            className={`toggle-container ${toggled ? "toggled" : ""}`}
            onClick={() => setToggled((prev) => !prev)}
          >
            <div
              className={`toggle-button ${toggled ? "toggle-transform" : ""}`}
            />
          </div>
        </div>
      </div>
      {compareStats.length ? (
        <div className="graph-block">
          {!toggled ? (
            <ResponsiveBar
              data={[
                ...compareStats,
                {
                  pokemon: pokemon["name" as keyof typeof pokemon],
                  stats: extractStats(
                    pokemon["stats" as keyof typeof pokemon] || []
                  ),
                },
              ].map((s) => {
                return { ...s.stats, name: s.pokemon };
              })}
              keys={Object.keys(compareStats[0]?.stats || {})}
              indexBy="name"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "pokemon",
                legendPosition: "middle",
                legendOffset: 32,
                truncateTickAt: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "stats",
                legendPosition: "middle",
                legendOffset: -40,
                truncateTickAt: 0,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              role="application"
            />
          ) : (
            <ResponsiveRadar
              data={convertToRadarData([
                ...compareStats,
                {
                  pokemon: pokemon["name" as keyof typeof pokemon],
                  stats: extractStats(
                    pokemon["stats" as keyof typeof pokemon] || []
                  ),
                },
              ] as StatsAndPokemonName[])}
              keys={[
                ...compareStats,
                {
                  pokemon: pokemon["name" as keyof typeof pokemon],
                  ...extractStats(
                    pokemon["stats" as keyof typeof pokemon] || []
                  ),
                },
              ].map((p) => p["pokemon"])}
              indexBy="attribute"
              valueFormat=">-.2f"
              margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
              borderColor={{ from: "color" }}
              gridLabelOffset={36}
              dotSize={10}
              dotColor={{ theme: "background" }}
              dotBorderWidth={2}
              colors={{ scheme: "nivo" }}
              blendMode="multiply"
              motionConfig="wobbly"
              legends={[
                {
                  anchor: "top-left",
                  direction: "column",
                  translateX: -50,
                  translateY: -40,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemTextColor: "#999",
                  symbolSize: 12,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: "#000",
                      },
                    },
                  ],
                },
              ]}
            />
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TargetPokemonBlock;
