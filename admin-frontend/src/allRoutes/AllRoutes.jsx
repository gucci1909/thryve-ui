import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/company-admin/Dashboard.jsx";
import SingleManager from "../pages/company-admin/SingleManager.jsx";

const Loader = lazy(() => import("../components/common/Loader.jsx"));
// const AdminDashboard = lazy(() => import("../pages/company-admin/Dashboard.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
// const Login = lazy(() => import("../pages/Login.jsx"));

function AllRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manager/:managerId" element={<SingleManager />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
