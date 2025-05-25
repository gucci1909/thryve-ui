import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;