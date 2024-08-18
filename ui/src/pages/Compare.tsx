import { useContext, useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import Select from "react-select";
import { GlobalContext } from "../CapstoneContext";
import ComparisonBlock from "../components/ComparisonBlock";
import "../App.css";
import TargetPokemonBlock from "../components/TargetPokemonBlock";
import { extractStats } from "../assets/helpers";
import { getPokemon } from "../api/api";
import { predictSuccessOutcome } from "../assets/machine_learning";

type SelectOption = {
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
    if (targetPokemon && comparisons.length > 0) {
      predictSuccessOutcome(comparisons[0], targetPokemon);
    }
  }, [comparisons, targetPokemon]);

  const updateComparisons = () => {
    if (selectValue) {
      getPokemon(selectValue.value)
        .then((data) => {
          setComparisons([...comparisons, data]);
          setSelectValue(undefined);
        })
        .catch(() => alert("unable to get poke-data. Try Refreshing."));
    }
  };

  const updateTarget = () => {
    if (targetSelectValue) {
      getPokemon(targetSelectValue.value)
        .then((data) => {
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
              <div className="add-button" onClick={updateComparisons}>
                Add +
              </div>
              <div
                className="reset-button"
                onClick={() => {
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
              {[...comparisons].map((c) => (
                <ComparisonBlock pokemon={c} />
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
                    pokemon: s["name" as keyof typeof s],
                    stats: extractStats(s["stats" as keyof typeof s]),
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
