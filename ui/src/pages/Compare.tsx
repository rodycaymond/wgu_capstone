import { useContext, useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import Select from "react-select";
import { GlobalContext } from "../CapstoneContext";
import ComparisonBlock from "../components/ComparisonBlock";
import "../App.css";
import TargetPokemonBlock from "../components/TargetPokemonBlock";
import {
  extractStats,
  PokemonStats,
  StatsAndPokemonName,
} from "../assets/helpers";

type SelectOption = {
  label: string;
  value: string;
};

type StatMap = {
  id: string;
  stats: StatsAndPokemonName;
};

export const Compare: React.FC = () => {
  const { pokedexData } = useContext(GlobalContext);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [comparisons, setComparisons] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState<SelectOption | undefined>(
    undefined
  );
  const [targetSelectValue, setTargetSelectValue] = useState<
    SelectOption | undefined
  >(undefined);
  const [targetPokemon, setTargetPokemon] = useState<string | undefined>(
    undefined
  );
  const [pokeStats, setPokeStats] = useState<StatMap[]>([]);

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

  const updateComparisons = () => {
    if (selectValue) {
      setComparisons([...comparisons, selectValue.value]);
      setSelectValue(undefined);
    }
  };

  const updateTarget = () => {
    if (targetSelectValue) {
      setTargetPokemon(targetSelectValue.value);
      setTargetSelectValue(undefined);
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
                <ComparisonBlock
                  url={c}
                  statsCallback={(stats: PokemonStats[]) => {
                    const filterStats = pokeStats.filter(
                      (s) => s.id !== c.slice(-2, -1)
                    );
                    filterStats.push({
                      id: c.slice(-2, -1),
                      stats: {
                        pokemon:
                          options.find((o) => o.value === c)?.label || "",
                        stats: extractStats(stats),
                      },
                    });
                    setPokeStats(filterStats);
                  }}
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
            <div className="target-pokemon-block">
              {targetPokemon && (
                <TargetPokemonBlock
                  url={targetPokemon}
                  compareStats={[...pokeStats].map((s) => s.stats)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Compare;
