import { ArrowRight, Star, Target, Users } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function SelectionPage() {
  const firstName = useSelector((state) => state.user.firstName);

  // Assessment steps data
  const assessmentSteps = [
    {
      id: "LeadershipAssessment",
      title: "Leadership Assessment",
      icon: <Star className="h-5 w-5 text-white" />,
      description:
        "Evaluate your leadership style, strengths, and areas for development through a comprehensive assessment.",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      id: "RoleInformationForm",
      title: "Role Information",
      icon: <Target className="h-5 w-5 text-white" />,
      description:
        "Share details about your current role, responsibilities, and professional context to better understand your needs.",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      id: "PsychographicProfile",
      title: "Psychographic Profile",
      icon: <Users className="h-5 w-5 text-white" />,
      description:
        "Explore your work preferences, motivations, and behavioral tendencies to create your unique profile.",
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100/40">
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

      {/* Main Content Section */}
      <div className="relative w-full flex-1 py-8">
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
          {/* Page Header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="mb-4 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-xl font-black tracking-tight text-transparent">
              Begin Your Growth Journey
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 font-medium">
              Complete these three assessments to unlock personalized insights
              and recommendations tailored specifically for your growth.
            </p>
          </motion.div>

          {/* Assessment Steps */}
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {assessmentSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white/90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-gray-100 hover:shadow-2xl">
                  {/* Subtle gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-3 pointer-events-none`} />
                  
                  {/* Step Header */}
                  <div className="mb-3 flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.iconBg} shadow-xl`}>
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  {/* Step Content */}
                  <p className="flex-grow leading-relaxed text-gray-600 font-medium">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-4 rounded-2xl border border-white bg-white/90 p-6 shadow-lg backdrop-blur-md"
          >
            {/* Information Header */}
            <div className="mb-3 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-inner border border-blue-100">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                What to Expect
              </h3>
            </div>

            {/* Information Content */}
            <div className="flex-1">
              <ul className="space-y-2.5 text-gray-700">
                <li className="flex items-center">
                  <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--primary-color)] shadow-sm" />
                  <span className="font-medium">Your responses are completely confidential and secure</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--primary-color)] shadow-sm" />
                  <span className="font-medium">Results available immediately after completion</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--primary-color)] shadow-sm" />
                  <span className="font-medium">Insights will personalize your learning journey</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="sticky bottom-0 z-10 w-full border-t border-gray-100/80 bg-white/95 shadow-2xl backdrop-blur-lg"
      >
        <div className="mx-auto max-w-4xl px-6 py-5">
          <Link
            to="/personalize"
            className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_15%)] px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:brightness-105 active:scale-[0.99]"
          >
            <span className="tracking-tight">Begin Growth Journey</span>
            <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}