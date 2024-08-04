import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Redirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => navigate("/"));
  return <div>redirecting...</div>;
};
