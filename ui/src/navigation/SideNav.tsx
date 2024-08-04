import { useState } from "react";
import "../App.css";

export const SideNav: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={`side-navigation ${open ? "nav-open" : ""}`}
      onClick={() => setOpen(!open)}
    ></div>
  );
};
