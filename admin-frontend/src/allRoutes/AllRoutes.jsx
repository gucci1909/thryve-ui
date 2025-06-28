import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Loader = lazy(() => import("../components/common/Loader.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));

function AllRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
