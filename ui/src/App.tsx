import { Route, Routes } from "react-router-dom";
import "./App.css";
import { WelcomePage } from "./pages/WelcomePage";
import { Redirect } from "./pages/Redirect";
import { SideNav } from "./navigation/SideNav";
import { useEffect, useState } from "react";
import Compare from "./pages/Compare";

function App() {
  // Single Page Application (SPA) feel
  const [height, setHeight] = useState<number>(0);

  const setViewPort = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", setViewPort);

    // useEffect return will cleanup/remove the event listener when this component unmounts from the DOM
    return () => window.removeEventListener("resize", setViewPort);
  }, []);

  const routes = (
    <Routes>
      <Route path="*" element={<Redirect />} />
      <Route path="/" element={<WelcomePage />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  );
  return (
    <div style={{ height: height, maxHeight: height, width: "100%" }}>
      <SideNav />
      {routes}
    </div>
  );
}

export default App;
