import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PrivateRouteHome = () => {
  const { personalize, token } = useSelector((state) => state.user);

  if (!token) {
    return <Navigate to="/" />;
  }

  if (!personalize) {
    return <Navigate to="/personalize" />;
  }

  if (personalize) {
    return <Navigate to="/personalize-home" />;
  }
};

export default PrivateRouteHome;
