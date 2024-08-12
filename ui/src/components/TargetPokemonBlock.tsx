import { useEffect, useState } from "react";
import { getPokemon, getSprite } from "../api/api";
import "../App.css";
import { ResponsiveBar } from "@nivo/bar";
import { bar_data } from "../assets/dummydata";

interface TargetPokemonProps {
  url: string;
}

export const TargetPokemonBlock: React.FC<TargetPokemonProps> = ({ url }) => {
  const [pokemon, setPokemon] = useState<object>({});

  useEffect(() => {
    getPokemon(url).then((data) => {
      setPokemon(data);
    });
  });
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
          <div>Height: {pokemon["height" as keyof typeof pokemon]}</div>
          <div>Weight: {pokemon["weight" as keyof typeof pokemon]}</div>
        </div>
      </div>
      <div className="graph-block">
        <ResponsiveBar
          data={bar_data}
          keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
          indexBy="country"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "fries",
              },
              id: "dots",
            },
            {
              match: {
                id: "sandwich",
              },
              id: "lines",
            },
          ]}
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
            legend: "country",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "food",
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
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) =>
            e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          }
        />
      </div>
    </>
  );
};

export default TargetPokemonBlock;
