import "../App.css";
import { ResponsiveBar } from "@nivo/bar";
import { extractStats, StatsAndPokemonName } from "../assets/helpers";
import { getSprite } from "../api/api";

interface TargetPokemonProps {
  pokemon: object;
  compareStats: StatsAndPokemonName[];
}

export const TargetPokemonBlock: React.FC<TargetPokemonProps> = ({
  pokemon,
  compareStats,
}) => {
  if (!pokemon) {
    return <></>;
  }

  return (
    <>
      <div className="target-container">
        <div className="sprite-container">
          <img
            src={getSprite(pokemon["id" as keyof typeof pokemon])}
            height="250"
            width="250"
          />
        </div>
        <div className="description-container">
          <div>{pokemon["name" as keyof typeof pokemon]}</div>
          <div>
            Types:{" "}
            {(pokemon["types" as keyof typeof pokemon] as Array<object>)
              .map((t) => t["type" as keyof typeof t]["name"])
              .join(", ")}
          </div>
          <div>Weight: {pokemon["weight" as keyof typeof pokemon]}</div>
          <div>Height: {pokemon["height" as keyof typeof pokemon]}</div>
        </div>
      </div>
      {compareStats.length ? (
        <div className="graph-block">
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TargetPokemonBlock;
