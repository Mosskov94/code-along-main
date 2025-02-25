import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, redirectTo = "/login", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }

  // I dette tilfælde /backoffice
  return children;
};

export default ProtectedRoute;
