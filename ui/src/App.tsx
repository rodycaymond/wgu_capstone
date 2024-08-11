import { Route, Routes } from "react-router-dom";
import "./App.css";
import { WelcomePage } from "./pages/WelcomePage";
import { Redirect } from "./pages/Redirect";
import { SideNav } from "./navigation/SideNav";
import { useContext, useEffect } from "react";
import Compare from "./pages/Compare";
import { GlobalContext } from "./CapstoneContext";

function App() {
  // Single Page Application (SPA) feel
  const { appHeight, setAppHeight } = useContext(GlobalContext);

  const setViewPort = () => {
    setAppHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", setViewPort);

    // useEffect return will cleanup/remove the event listener when this component unmounts from the DOM
    return () => window.removeEventListener("resize", setViewPort);
  });

  const routes = (
    <Routes>
      <Route path="*" element={<Redirect />} />
      <Route path="/" element={<WelcomePage />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  );
  return (
    <div
      style={{
        height: appHeight,
        maxHeight: appHeight,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <SideNav />
      {routes}
    </div>
  );
}

export default App;
