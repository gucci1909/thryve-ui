import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/company-admin/Dashboard.jsx";

const Loader = lazy(() => import("../components/common/Loader.jsx"));
// const AdminDashboard = lazy(() => import("../pages/company-admin/Dashboard.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));

function AllRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
