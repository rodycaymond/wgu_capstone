import "../App.css";

interface PageContainerProps {
  children: React.ReactElement | React.ReactElement[];
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return <div className="page-container">{children}</div>;
};

export default PageContainer;
