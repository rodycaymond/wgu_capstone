import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export const SideNav: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className={`side-navigation ${open ? "nav-open" : ""}`}>
      <img
        src="https://github.com/PokeAPI/sprites/blob/master/sprites/items/poke-ball.png?raw=true"
        className={`app-icon${open ? "-open" : ""}`}
        onClick={() => {
          navigate("/");
          setOpen(false);
        }}
        style={{ cursor: "pointer" }}
      />
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        <div></div>
        <div></div>
      </div>
      <div className={`nav-content-container ${open ? "" : "hidden"}`}>
        <div
          className="compare-route"
          onClick={() => {
            setOpen(false);
            navigate("/compare");
          }}
        >
          Compare Pokemon
        </div>
        <div className="footer">
          <div>Authored By Cody Raymond</div>
          <div>Powered By Education</div>
        </div>
      </div>
    </div>
  );
};
