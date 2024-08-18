interface PokemonHoverCardProps {
  types: string;
}

export const PokemonHoverCard: React.FC<PokemonHoverCardProps> = ({
  types,
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
        backgroundColor: "white",
        top: "30%",
      }}
    >
      {"Types: " + types}
    </div>
  );
};

export default PokemonHoverCard;
