import { SetStateAction, useState } from "react";
import { getSprite } from "../api/api";
import "../App.css";
import PokemonHoverCard from "./PokemonHoverCard";
import { calcBackgroundColor } from "../assets/helpers";
import { SelectOption } from "../pages/Compare";
import Select from "react-select";

interface ComparisonBlockProps {
  pokemon: object;
  successRate: number | null;
  selectedMoves: SelectOption[];
  setSelectedMoves: React.Dispatch<SetStateAction<SelectOption[]>>;
}

export const ComparisonBlock: React.FC<ComparisonBlockProps> = ({
  pokemon,
  successRate,
  selectedMoves,
  setSelectedMoves,
}) => {
  const [displayStats, setDisplayStats] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<SelectOption | undefined>(
    undefined
  );

  return (
    <>
      <div className="compare-block">
        {displayStats && (
          <PokemonHoverCard
            types={(
              pokemon["types" as keyof typeof pokemon] as object[]
            ).reduce<string>((acc: string, curr: object) => {
              if (acc.length) {
                return acc + ", " + curr["type" as keyof typeof curr]["name"];
              }
              return curr["type" as keyof typeof curr]["name"];
            }, "")}
          />
        )}
        <img
          src={getSprite(pokemon["id" as keyof typeof pokemon])}
          height="150"
          width="150"
          onMouseOver={() => setDisplayStats(true)}
          onMouseOut={() => setDisplayStats(false)}
        />
        <div>{pokemon["name" as keyof typeof pokemon]}</div>
        <div className="percentage-container">
          <div className="percentage">
            <div
              className="percent"
              style={
                successRate
                  ? {
                      width: `${successRate || 100}%`,
                      backgroundColor: calcBackgroundColor(successRate),
                    }
                  : {}
              }
            />
          </div>
          <div>{`${successRate || 0}%`}</div>
        </div>
      </div>
      <div className="move-list">
        <div className="compare-left-title">Move Selection</div>
        <div className="add-container">
          {selectedMoves.length < 4 && (
            <div
              className="add-button"
              onClick={() => {
                if (!selectValue || selectedMoves.length === 4) return;
                setSelectedMoves((prev) => [...prev, selectValue]);
              }}
            >
              Add +
            </div>
          )}
          <div
            className="reset-button"
            onClick={() => {
              setSelectedMoves([]);
              setSelectValue(undefined);
            }}
          >
            Reset
          </div>
          <div className="search-container">
            <Select
              options={(
                pokemon["moves" as keyof typeof pokemon] as object[]
              ).map((m) => ({
                label: m["move" as keyof typeof m]["name" as keyof typeof m],
                value: m["move" as keyof typeof m]["url" as keyof typeof m],
              }))}
              value={selectValue}
              onChange={(o) => (o ? setSelectValue(o) : null)}
              styles={{
                container: (styles) => ({ ...styles, cursor: "pointer" }),
                valueContainer: (styles) => ({
                  ...styles,
                  cursor: "pointer",
                }),
              }}
            />
          </div>
        </div>
        {selectedMoves.map((m, i) => (
          <div key={i} className="move-block">
            Move {i + 1}: {m.label}
          </div>
        ))}
      </div>
    </>
  );
};

export default ComparisonBlock;
