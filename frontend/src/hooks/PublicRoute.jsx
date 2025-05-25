import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);
  const personalize = useSelector((state) => state.user.personalize);
  const location = useLocation();

  console.log({ d: location.pathname });

  if (
    token &&
    (location.pathname === "/selection-page" ||
      location.pathname === "/personalize" ||
      location.pathname === "/waiting" ||
      location.pathname === "/leadership-swot-analysis")
  ) {
    return children;
  }

  if (token && location.pathname === "/signup") {
    return <Navigate to="/selection-page" />;
  }

  if (token) {
    if (personalize) {
      return <Navigate to="/personalize-home" />;
    } else {
      return <Navigate to="/home" />;
    }
  } else {
    return children;
  }
};

export default PublicRoute;
