import { useContext, useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import Select from "react-select";
import { GlobalContext } from "../CapstoneContext";
import ComparisonBlock from "../components/ComparisonBlock";
import "../App.css";
import TargetPokemonBlock from "../components/TargetPokemonBlock";
import { extractStats } from "../assets/helpers";
import { getPokemon } from "../api/api";
import {
  predictSuccessOutcome,
  prepareDefenderMoves,
} from "../assets/machine_learning";

export type SelectOption = {
  label: string;
  value: string;
};

export const Compare: React.FC = () => {
  const { pokedexData } = useContext(GlobalContext);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [comparisons, setComparisons] = useState<object[]>([]);
  const [selectValue, setSelectValue] = useState<SelectOption | undefined>(
    undefined
  );
  const [targetSelectValue, setTargetSelectValue] = useState<
    SelectOption | undefined
  >(undefined);
  const [targetPokemon, setTargetPokemon] = useState<object | undefined>(
    undefined
  );
  const [selectedMoves, setSelectedMoves] = useState<SelectOption[]>([]);
  const [targetPokemonMoves, setTargetPokemonMoves] = useState<object[]>([]);

  useEffect(() => {
    setOptions(
      [...pokedexData].map((d) => {
        return {
          label: d["name" as keyof typeof d],
          value: d["url" as keyof typeof d],
        };
      })
    );
  }, [pokedexData]);

  useEffect(() => {
    if (
      targetPokemon &&
      comparisons.length > 0 &&
      selectedMoves.length > 0 &&
      targetPokemonMoves.length > 0
    ) {
      comparisons.forEach((c, i) => {
        predictSuccessOutcome(
          c["pokemon" as keyof typeof c],
          selectedMoves,
          targetPokemon,
          targetPokemonMoves
        )
          .then((data) => {
            const copyComparisons = [...comparisons];
            copyComparisons[i] = { ...c, success: data };
            setComparisons(copyComparisons);
          })
          .catch((e) => {
            console.log("Error: ", e);
            alert(
              "unable to determine success chance for " +
                c["pokemon" as keyof typeof c]["name"]
            );
          });
      });
    } else {
      setComparisons((prev) => prev.map((c) => ({ ...c, success: null })));
    }
  }, [
    JSON.stringify(comparisons.map((c) => c["pokemon" as keyof typeof c])),
    JSON.stringify(targetPokemon),
    JSON.stringify(selectedMoves),
  ]);

  const updateComparisons = () => {
    if (selectValue) {
      getPokemon(selectValue.value)
        .then((data) => {
          setComparisons([...comparisons, { pokemon: data, success: null }]);
          setSelectValue(undefined);
        })
        .catch(() => alert("unable to get poke-data. Try Refreshing."));
    }
  };

  const updateTarget = () => {
    if (targetSelectValue) {
      getPokemon(targetSelectValue.value)
        .then(async (data) => {
          const moves = await prepareDefenderMoves(data);
          setTargetPokemonMoves(moves);
          setTargetPokemon(data);
          setTargetSelectValue(undefined);
        })
        .catch(() => alert("unable to get poke-data. Try Refreshing."));
    }
  };

  return (
    <PageContainer>
      <div className="compare-page">
        <div className="compare-page-content-section">
          <div className="left-content">
            <div className="compare-left-title">Chance of Success</div>
            <div className="add-container">
              {comparisons.length === 0 && (
                <div className="add-button" onClick={updateComparisons}>
                  Add +
                </div>
              )}
              <div
                className="reset-button"
                onClick={() => {
                  setSelectedMoves([]);
                  setComparisons([]);
                  setSelectValue(undefined);
                }}
              >
                Reset
              </div>
              <div className="search-container">
                <Select
                  options={options}
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
            <div className="comparison-container">
              {[...comparisons].map((c, i) => (
                <ComparisonBlock
                  key={i}
                  pokemon={c["pokemon" as keyof typeof c]}
                  successRate={c["success" as keyof typeof c]}
                  selectedMoves={selectedMoves}
                  setSelectedMoves={setSelectedMoves}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="compare-page-content-section">
          <div className="right-content">
            <div className="compare-right-title">Target Pokemon</div>
            <div className="add-container">
              {!targetPokemon && (
                <div className="add-button" onClick={updateTarget}>
                  Add +
                </div>
              )}
              <div
                className="reset-button"
                onClick={() => {
                  setTargetPokemonMoves([]);
                  setTargetPokemon(undefined);
                  setTargetSelectValue(undefined);
                }}
              >
                Reset
              </div>
              {!targetPokemon && (
                <div className="search-container">
                  <Select
                    options={options}
                    value={targetSelectValue || null}
                    onChange={(o) => (o ? setTargetSelectValue(o) : null)}
                    styles={{
                      container: (styles) => ({ ...styles, cursor: "pointer" }),
                      valueContainer: (styles) => ({
                        ...styles,
                        cursor: "pointer",
                      }),
                    }}
                  />
                </div>
              )}
            </div>
            {targetPokemon && (
              <div className="target-pokemon-block">
                <TargetPokemonBlock
                  pokemon={targetPokemon}
                  compareStats={[...comparisons].map((s) => ({
                    pokemon: s["pokemon" as keyof typeof s]["name"],
                    stats: extractStats(
                      s["pokemon" as keyof typeof s]["stats"]
                    ),
                  }))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Compare;
