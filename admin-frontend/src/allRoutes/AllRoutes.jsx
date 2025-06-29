import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Loader = lazy(() => import("../components/common/Loader.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const AdminDashboard = lazy(
  () => import("../pages/company-admin/Dashboard.jsx"),
);
const SingleManager = lazy(
  () => import("../pages/company-admin/SingleManager.jsx"),
);
const PrivateRoute = lazy(() => import("../hooks/PrivateRoute.jsx"));

function AllRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Home />} />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager/:managerId"
            element={
              <PrivateRoute>
                <SingleManager />
              </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
