import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Loader = lazy(() => import("../components/common/Loader.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const DiscoverPage = lazy(() => import("../pages/DiscoverPage.jsx"));
const AssessmentPage = lazy(() => import("../pages/Assessment.jsx"));
const Personalize = lazy(() => import("../pages/Personalize.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const SignUp = lazy(() => import("../pages/SignUp.jsx"));
const SelectionPage = lazy(() => import("../pages/SelectionPage.jsx"));
const WaitingScreen = lazy(() => import("../pages/WaitingScreen.jsx"));

function AllRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/personalize" element={<Personalize />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/selection-page" element={<SelectionPage />} />
          <Route path="/assessment-page" element={<AssessmentPage />} />
          <Route path="/waiting" element={<WaitingScreen />} />
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/*" element={<DiscoverPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
