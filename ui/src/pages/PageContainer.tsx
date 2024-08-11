import { useContext } from "react";
import "../App.css";
import { GlobalContext } from "../CapstoneContext";

interface PageContainerProps {
  children: React.ReactElement | React.ReactElement[];
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const { appHeight } = useContext(GlobalContext);
  return (
    <div
      className="page-container"
      style={{ height: appHeight, maxHeight: appHeight }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
