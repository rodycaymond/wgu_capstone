import { useContext, useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import Select from "react-select";
import { GlobalContext } from "../CapstoneContext";
import ComparisonBlock from "../components/ComparisonBlock";

type SelectOption = {
  label: string;
  value: string;
};

export const Compare: React.FC = () => {
  const { pokedexData } = useContext(GlobalContext);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [comparisons, setComparisons] = useState<string[]>([]);

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

  return (
    <PageContainer>
      <div className="compare-page">
        <div className="compare-page-content-section">
          <div className="left-content">
            <div className="compare-left-title">Chance of Success</div>
            <div className="comparison-container">
              {[...comparisons].map((c) => (
                <ComparisonBlock url={c} />
              ))}
            </div>
            <div className="add-container">
              <div
                className="add-button"
                onClick={() =>
                  setComparisons([
                    "https://pokeapi.co/api/v2/pokemon-species/1/",
                  ])
                }
              >
                Add +
              </div>
              <div className="search-container">
                <Select options={options} />
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="compare-page-content-section"></div>
      </div>
    </PageContainer>
  );
};

export default Compare;
