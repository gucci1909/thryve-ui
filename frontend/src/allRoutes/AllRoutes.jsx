import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Loader = lazy(() => import("../components/common/Loader.jsx"));
const PrivateRoute = lazy(() => import("../hooks/PrivateRoute.jsx"));
const PrivateRouteHome = lazy(() => import("../hooks/PrivateRouteHome.jsx"));
const PublicRoute = lazy(() => import("../hooks/PublicRoute.jsx"));
const LogOut = lazy(() => import("../hooks/LogOut.jsx"));
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
const PersonalizeHome = lazy(() => import("../pages/PersonalizeHome.jsx"));
const LeaderShipAnalysis = lazy(
  () => import("../pages/LeaderShipAnalysis.jsx"),
);
const EmailVerification = lazy(() => import("../pages/EmailVerification.jsx"));
const OTP = lazy(() => import("../pages/OTP.jsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.jsx"));
const FeedbackAssessment = lazy(
  () => import("../pages/FeedbackAssessment.jsx"),
);
const FeedbackThankYou = lazy(() => import("../pages/FeedbackThankYou.jsx"));

function AllRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence>
        <Routes>
          <Route path="/personalize" element={<Personalize />} />

          <Route path="/feedback-assessment" element={<FeedbackAssessment />} />
          <Route path="/feedback-thank-you" element={<FeedbackThankYou />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <EmailVerification />
              </PublicRoute>
            }
          />

          <Route
            path="/otp-verify"
            element={
              <PublicRoute>
                <OTP />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          {/* <Route path="/selection-page" element={<SelectionPage />} /> */}
          <Route path="/waiting" element={<WaitingScreen />} />
          <Route path="/logout" element={<LogOut />} />
          <Route
            path="/learning-plan-ready"
            element={<LearningPlanReadyScreen />}
          />

          <Route
            path="/personalize-change-password"
            element={
              <PrivateRoute>
                <PersonalizeHome />
              </PrivateRoute>
            }
          />

          <Route
            path="/personalize-saved-post"
            element={
              <PrivateRoute>
                <PersonalizeHome />
              </PrivateRoute>
            }
          />

          <Route
            path="/personalize-home"
            element={
              <PrivateRoute>
                <PersonalizeHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/personalize-check-in"
            element={
              <PrivateRoute>
                <PersonalizeHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/personalize-dashboard"
            element={
              <PrivateRoute>
                <PersonalizeHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/personalize-profile"
            element={
              <PrivateRoute>
                <PersonalizeHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/personalize-chat-box"
            element={
              <PrivateRoute>
                <PersonalizeHome />
              </PrivateRoute>
            }
          />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/check-in"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat-box"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/leadership-swot-analysis"
            element={<LeaderShipAnalysis />}
          />

          <Route
            path="/"
            element={
              <PublicRoute>
                <DiscoverPage />
              </PublicRoute>
            }
          />
          <Route path="/*" element={<PrivateRouteHome />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AllRoutes;
