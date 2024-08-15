import { PokemonStats } from "../assets/helpers";

interface PokemonHoverCardProps {
  stats: PokemonStats[];
}

export const PokemonHoverCard: React.FC<PokemonHoverCardProps> = ({
  stats,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        position: "absolute",
        width: "40%",
        padding: "4px",
        borderRadius: "3px",
        border: "1px solid blue",
      }}
    >
      {[...stats].map((s) => (
        <div>{s.stat.name + " " + s.base_stat}</div>
      ))}
    </div>
  );
};

export default PokemonHoverCard;
