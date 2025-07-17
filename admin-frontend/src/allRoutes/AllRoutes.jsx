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
const FounderDashboard = lazy(
  () => import("../pages/founder-admin/Dashboard.jsx"),
);
const FounderSingleManager = lazy(
  () => import("../pages/founder-admin/FounderSingleManager.jsx"),
);
const TokenExcelDownload = lazy(
  () => import("../pages/founder-admin/TokenExcelDownload.jsx"),
);
const AllSecretChats = lazy(
  () => import("../pages/founder-admin/AllSecretChats.jsx"),
);


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
            path="/download-token-excel"
            element={
              <PrivateRoute>
                <TokenExcelDownload />
              </PrivateRoute>
            }
          />

           <Route
            path="/all-chats"
            element={
              <PrivateRoute>
                <AllSecretChats />
              </PrivateRoute>
            }
          />
          <Route
            path="/founder-dashboard"
            element={
              <PrivateRoute>
                <FounderDashboard />
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

          <Route
            path="/founder-manager/:managerId"
            element={
              <PrivateRoute>
                <FounderSingleManager />
              </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
