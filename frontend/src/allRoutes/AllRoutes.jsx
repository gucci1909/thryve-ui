import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Loader = lazy(() => import("../components/common/Loader.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const DiscoverPage = lazy(() => import("../pages/DiscoverPage.jsx"));
const Personalize = lazy(() => import("../pages/Personalize.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const SignUp = lazy(() => import("../pages/SignUp.jsx"));
const SelectionPage = lazy(() => import("../pages/SelectionPage.jsx"));
const WaitingScreen = lazy(() => import("../pages/WaitingScreen.jsx"));
const LearningPlanReadyScreen = lazy(
  () => import("../pages/LearningPlanReady.jsx"),
);
const ChatBox = lazy(() => import("../pages/ChatBox.jsx"));
const PersonalizeHome = lazy(() => import("../pages/PersonalizeHome.jsx"));

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
          <Route path="/waiting" element={<WaitingScreen />} />
          <Route
            path="/learning-plan-ready"
            element={<LearningPlanReadyScreen />}
          />
          <Route path="/chat-box" element={<ChatBox />} />

          <Route path="/personalize-home" element={<PersonalizeHome />} />

          <Route path="/personalize-check-in" element={<PersonalizeHome />} />
          <Route path="/personalize-dashboard" element={<PersonalizeHome />} />
          <Route path="/personalize-profile" element={<PersonalizeHome />} />

          <Route path="/check-in" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<Home />} />

          <Route path="/" element={<DiscoverPage />} />
          <Route path="/*" element={<DiscoverPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
