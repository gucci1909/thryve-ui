import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);
  const personalize = useSelector((state) => state.user.personalize);
  const location = useLocation();

  if (
    token &&
    (location.pathname === "/personalize" ||
      location.pathname === "/waiting" ||
      location.pathname === "/leadership-swot-analysis")
  ) {
    return children;
  }

  if (token && location.pathname === "/signup") {
    if (personalize) {
      return <Navigate to="/personalize-home" />;
    } else {
      return <Navigate to="/personalize" />;
    }
  }

  if (token) {
    if (personalize) {
      return <Navigate to="/personalize-home" />;
    } else {
      return <Navigate to="/personalize" />;
    }
  } else {
    return children;
  }
};

export default PublicRoute;
