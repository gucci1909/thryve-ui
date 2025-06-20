import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { AuroraText } from "../components/magicui/aurora-text";
import { AnimatedCircularProgressBar } from "../components/magicui/animated-circular-progress-bar";
import LeadershipAssessment from "../components/skillsassessment/LeadershipAssessment";
import RoleInformationForm from "../components/skillsassessment/RoleInformationForm";
import PsychographicProfile from "../components/skillsassessment/PsychographicProfile";
import Feedback from "../components/skillsassessment/Feedback";
import { useSelector } from "react-redux";

function Personalize() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [allDataPayload, setAllDataPayload] = useState({});
  const [progressPercentage, setProgressPercentage] = useState(0);
  const firstName = useSelector((state) => state.user.firstName);
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: "Leadership", component: LeadershipAssessment },
    { id: 2, name: "Role Info", component: RoleInformationForm },
    { id: 3, name: "Profile", component: PsychographicProfile },
    { id: 4, name: "feedback", component: Feedback },
  ];

  const handleNext = (data) => {
    let payloadData;
    let fullData;

    if (currentStep === 1) {
      payloadData = { leadership: data?.leadership };
      fullData = { leadershipInfo: data?.leadershipInfo };
    } else if (currentStep === 2) {
      payloadData = { roleInfo: data?.roleInfo };
      fullData = { roleInfo: data?.roleInfo };
    } else if (currentStep === 3) {
      payloadData = { psychographic: data?.psychographic };
      fullData = { psychographicInfo: data?.psychographicInfo };
    }
    setAllDataPayload((prev) => ({ ...prev, ...fullData }));
    setFormData((prev) => ({ ...prev, ...payloadData }));
    const newPercentage = (currentStep / steps.length) * 100;
    setProgressPercentage(newPercentage);

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const normalizedFormData = {
        ...formData,
        roleInfo: {
          ...formData.roleInfo,
          challenges: Array.isArray(formData?.roleInfo?.challenges)
            ? formData?.roleInfo?.challenges
            : formData?.roleInfo?.challenges
                ?.split(",")
                .map((item) => item.trim())
                .filter(Boolean),
        },
      };

      setTimeout(() => {
        navigate("/waiting", {
          state: {
            formData: {
              meta: {
                include: ["leadership", "roleInfo", "psychographic"],
              },
              sections: {
                leadership: normalizedFormData.leadership,
                roleInfo: normalizedFormData.roleInfo,
                psychographic: normalizedFormData.psychographic,
              },
            },
            fullReport: {
              ...allDataPayload,
            },
          },
        });
      }, 1000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      const newPercentage = ((currentStep - 2) / steps.length) * 100;
      setProgressPercentage(newPercentage);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      {/* V-Shaped Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-50"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 60%)" }}
        />
        <div
          className="absolute inset-0 bg-[var(--primary-color)]"
          style={{ clipPath: "polygon(0 60%, 100% 40%, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Header Bar - More Compact */}
      {/* Ultra-Compact Header Bar */}
      <div className="w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] px-3 py-1.5">
        <div className="relative z-10 mx-auto flex h-10 max-w-4xl flex-row items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-8 w-8 drop-shadow-sm"
            />
            <h1 className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
              thryve
            </h1>
          </motion.div>

          <motion.h2
            className="cursor-default text-lg text-white hover:cursor-[url('/pointer.cur'),_pointer]"
            style={{
              fontWeight: 900,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Welcome, {firstName}
          </motion.h2>
        </div>
      </div>

      {/* Tightly Spaced Main Content */}
      <div className="flex w-full max-w-4xl flex-1 flex-col px-3 py-2">
        {/* Combined Progress and Header - Even More Compact */}
        <div className="mb-2 flex w-full gap-4 py-2">
          {/* Compact Progress Circle */}
          <div className="flex items-center">
            <div className="relative">
              <AnimatedCircularProgressBar
                value={progressPercentage}
                max={100}
                min={0}
                gaugePrimaryColor="var(--primary-color)"
                gaugeSecondaryColor="rgba(0, 41, 255, 0.1)"
                className="h-14 w-14"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-md font-bold text-[var(--primary-color)]">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>

          {/* Condensed Header */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AuroraText
              className="text-md leading-tight font-bold"
              colors={["#0029ff", "#3b82f6"]}
              speed={1.5}
            >
              Personalize Your Experience
            </AuroraText>
            <p className="text-md mt-0.5 text-gray-600">
              Step {currentStep} of {steps.length}
            </p>
          </motion.div>
        </div>

        {/* Minimalist Step Indicators */}
        <div className="mb-3 flex justify-center gap-1.5">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-1 w-3 rounded-full ${currentStep >= step.id ? "bg-[var(--primary-color)]" : "bg-gray-200"}`}
            />
          ))}
        </div>

        {/* Desktop Step Indicators - Below */}
        <div className="mb-4 hidden w-full md:block">
          <div className="relative flex">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${currentStep >= step.id ? "bg-[var(--primary-color)] text-white" : "border border-gray-300"}`}
                  >
                    {currentStep > step.id ? <FiCheck size={12} /> : step.id}
                  </div>
                  <span
                    className={`mt-1 text-xs ${currentStep >= step.id ? "font-medium text-[var(--primary-color)]" : "text-gray-500"}`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-3 left-[calc(50%+12px)] h-0.5 w-[calc(100%-24px)] ${currentStep > step.id ? "bg-[var(--primary-color)]" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content - Better Spacing */}
        <div className="w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: currentStep > 1 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentStep > 1 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentStep === 1 && (
                <LeadershipAssessment
                  initialData={formData.leadership}
                  onNext={handleNext}
                  setProgressPercentage={setProgressPercentage}
                />
              )}
              {currentStep === 2 && (
                <RoleInformationForm
                  initialData={formData.roleInfo}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <PsychographicProfile
                  initialData={formData.psychographic}
                  onNext={handleNext}
                  onBack={handleBack}
                  setProgressPercentage={setProgressPercentage}
                />
              )}
              {currentStep === 4 && (
                <Feedback
                  initialData={formData.psychographic}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Personalize;
