import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { AuroraText } from "../components/magicui/aurora-text";
import { AnimatedCircularProgressBar } from "../components/magicui/animated-circular-progress-bar";
import LeadershipAssessment from "../components/skillsassessment/LeadershipAssessment";
import RoleInformationForm from "../components/skillsassessment/RoleInformationForm";
import PsychographicProfile from "../components/skillsassessment/PsychographicProfile";
import ProcessingLoader from "../components/skillsassessment/ProcessingLoader";

function Personalize() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: "Leadership", component: LeadershipAssessment },
    { id: 2, name: "Role Info", component: RoleInformationForm },
    { id: 3, name: "Profile", component: PsychographicProfile },
  ];

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setTimeout(() => navigate("/home"), 8000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const progressPercentage = ((currentStep - 1) / steps.length) * 100;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      {/* V-Shaped Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-50"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)' }}
        />
        <div 
          className="absolute inset-0 bg-[var(--primary-color)]"
          style={{ clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="flex w-full max-w-4xl flex-col items-center p-4">
        {/* Header with Aurora Text */}
        <motion.div
          className="mb-2 mt-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AuroraText
            className="text-md font-bold"
            colors={["#0029ff", "#3b82f6", "#2563eb", "#1d4ed8"]}
            speed={1.5}
          >
            Personalize Your Experience
          </AuroraText>
          <p className="mt-2 text-gray-600">
            Complete {currentStep} of {steps.length} steps
          </p>
        </motion.div>

        {/* Progress Container */}
        <div className="w-full">
          {/* Progress Bar */}
          <div className="mb-8 flex items-center gap-4">
            <AnimatedCircularProgressBar
              value={progressPercentage}
              max={100}
              min={0}
              gaugePrimaryColor="var(--primary-color)"
              gaugeSecondaryColor="rgba(0, 41, 255, 0.1)"
              className="h-14 w-14"
            />

            <div className="flex-1">
              <div className="hidden md:flex">
                {steps.map((step) => (
                  <div key={step.id} className="relative flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= step.id ? "bg-[var(--primary-color)] text-white" : "border-2 border-gray-300"}`}
                      >
                        {currentStep > step.id ? <FiCheck size={16} /> : step.id}
                      </div>
                      <span
                        className={`mt-2 text-xs ${currentStep >= step.id ? "font-medium text-[var(--primary-color)]" : "text-gray-500"}`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {step.id < steps.length && (
                      <div
                        className={`absolute top-4 left-[calc(50%+16px)] h-0.5 w-[calc(100%-32px)] ${currentStep > step.id ? "bg-[var(--primary-color)]" : "bg-gray-200"}`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="mb-6 flex justify-center gap-2 md:hidden">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`h-2 w-8 rounded-full ${currentStep >= step.id ? "bg-[var(--primary-color)]" : "bg-gray-200"}`}
              />
            ))}
          </div>

          {/* Step Content */}
        </div>
        <AnimatePresence>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: currentStep > 1 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentStep > 1 ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {currentStep === 1 && (
              <LeadershipAssessment
                initialData={formData.leadership}
                onNext={handleNext}
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
              />
            )}
            {currentStep === 4 && <ProcessingLoader />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Hint */}
        {currentStep <= steps.length && (
          <motion.div
            className="mt-6 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AuroraText colors={["#0029ff", "#3b82f6"]} speed={2}>
              {currentStep === steps.length ? "Almost there!" : "Keep going!"}
            </AuroraText>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Personalize;