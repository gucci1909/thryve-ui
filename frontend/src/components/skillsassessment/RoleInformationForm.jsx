"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";
import { ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import { Listbox } from "@headlessui/react";

const RoleInformationForm = ({ initialData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    role: initialData?.role || "",
    teamSize: initialData?.teamSize || "",
    industry: initialData?.industry || "",
    challenges: initialData?.challenges || "",
  });

  const [selectedRole, setSelectedRole] = useState(formData.role || "");
  const [selectedTeamSize, setSelectedTeamSize] = useState(
    formData.teamSize || "",
  );
  const [selectedIndustry, setSelectedIndustry] = useState(
    formData.industry || "",
  );

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleTeamSizeChange = (value) => {
    setSelectedTeamSize(value);
    setFormData((prev) => ({ ...prev, teamSize: value }));
  };

  const handleIndustryChange = (value) => {
    setSelectedIndustry(value);
    setFormData((prev) => ({ ...prev, industry: value }));
  };

  const [errors, setErrors] = useState({
    challenges: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    "Team Lead",
    "Manager",
    "Director",
    "Head of Department",
    "VP",
  ];
  const teamSizes = ["1-5", "6-20", "20-50", "50+"];
  const industries = ["Banking", "Finance", "Health Care", "Retail", "Technology", "Professional Services"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const challengeCount = formData.challenges
      .split("\n")
      .filter((line) => line.trim().length > 0).length;

    setTimeout(() => {
      onNext({
        roleInfo: formData,
      });
    }, 800);
  };

  const CustomSelect = ({ value, onChange, options, label, placeholder }) => (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
          </Listbox.Label>
          <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-left shadow-sm transition-all duration-200 focus:border-[#0029ff] focus:ring-2 focus:ring-[#0029ff] focus:outline-none">
            <span
              className={`block truncate ${!value ? "text-gray-400" : "text-gray-900"}`}
            >
              {value || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180 transform" : ""}`}
              />
            </span>
          </Listbox.Button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-gray-200 focus:outline-none sm:text-sm">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option}
                      value={option}
                      className={({ active }) =>
                        cn(
                          "relative cursor-default py-2 pr-4 pl-10 select-none",
                          active
                            ? "bg-[#f0f4ff] text-[#0029ff]"
                            : "text-gray-900",
                        )
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={cn(
                              "block truncate",
                              selected ? "font-medium" : "font-normal",
                            )}
                          >
                            {option}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#0029ff]">
                              <Check className="h-5 w-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  );

  return (
    <>
      <div className="relative w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl sm:p-6">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="#0029ff"
          colorTo="#3b82f6"
          className="rounded-xl"
        />

        {/* Header */}
        <div className="mb-6">
          <motion.h2
            className="text-lg font-bold text-gray-900 sm:text-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Role Information
          </motion.h2>
          <motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Tell us about your current role and challenges
          </motion.p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Role Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CustomSelect
                value={selectedRole}
                onChange={handleRoleChange}
                options={roles}
                label="Your Role"
                placeholder="Select your role"
              />
            </motion.div>

            {/* Team Size Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <CustomSelect
                value={selectedTeamSize}
                onChange={handleTeamSizeChange}
                options={teamSizes}
                label="Team Size"
                placeholder="Select team size"
              />
            </motion.div>

            {/* Industry Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <CustomSelect
                value={selectedIndustry}
                onChange={handleIndustryChange}
                options={industries}
                label="Industry"
                placeholder="Select industry"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <label
                htmlFor="challenges"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Top Challenges
              </label>
              <div className="relative">
                <motion.textarea
                  id="challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  placeholder="Write at least 2 problem areas that you are facing at your current role (one per line)"
                  rows={4}
                  className={`w-full rounded-lg border px-4 py-3 text-gray-700 placeholder-gray-400 ${"border-[#d6e0ff] bg-white focus:border-[#0029ff] focus:ring-[#0029ff]/50"} shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none`}
                  required
                  whileFocus={{
                    scale: 1.005,
                    boxShadow: "0px 2px 8px rgba(0, 41, 255, 0.1)",
                  }}
                  whileHover={{
                    borderColor: "#93c5fd",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          {/* <motion.div
          className="mt-8 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <RippleButton
            type="button"
            onClick={onBack}
            rippleColor="rgba(0, 41, 255, 0.15)"
            className="flex w-[90px] flex-row items-center gap-1 border-[#0029ff] text-[#0029ff] hover:bg-[#f5f8ff]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </RippleButton>

          <RippleButton
            type="submit"
            disabled={isSubmitting}
            onClick={() => {}}
            rippleColor="rgba(0, 41, 255, 0.3)"
            className={cn(
              "flex w-[120px] items-center gap-1 bg-[#0029ff] text-white hover:bg-[#001fcc]",
              isSubmitting ? "cursor-not-allowed opacity-80" : "",
            )}
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </RippleButton>
        </motion.div> */}
        </form>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center rounded-xl border border-[#d6e0ff] bg-white px-8 py-6 shadow-lg"
              >
                <div className="relative mb-4 h-12 w-12">
                  <motion.div
                    className="absolute inset-0 rounded-full border-[3px] border-[#0029ff] border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
                <motion.p
                  className="mb-6 text-sm font-medium text-gray-700"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Processing your information...
                </motion.p>

                <div className="flex w-full gap-4">
                  <RippleButton
                    onClick={onBack}
                    rippleColor="rgba(0, 41, 255, 0.15)"
                    className="flex-1 rounded-lg border border-[#0029ff] py-2 font-medium text-[#0029ff] transition-all duration-200 hover:bg-[#f5f8ff]"
                  >
                    Cancel
                  </RippleButton>

                  <RippleButton
                    disabled={true}
                    className="flex-1 cursor-not-allowed rounded-lg bg-[#0029ff] py-2 font-medium text-white opacity-80"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Processing...
                      </motion.span>
                    </div>
                  </RippleButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <div className="relative min-h-auto pb-24">
          <motion.div
            className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mx-auto flex max-w-3xl justify-between">
              <RippleButton
                type="button"
                onClick={onBack}
                rippleColor="rgba(0, 41, 255, 0.15)"
                className={cn(
                  "flex w-[90px] flex-row items-center justify-center gap-1 border border-[#0029ff] text-[#0029ff] hover:bg-[#f5f8ff]",
                  isSubmitting ? "cursor-not-allowed opacity-80" : "",
                )}
                whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </RippleButton>

              <RippleButton
                type="submit"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e)}
                rippleColor="rgba(0, 41, 255, 0.3)"
                className={cn(
                  "flex w-[120px] items-center justify-center gap-1 bg-[#0029ff] text-white hover:bg-[#001fcc]",
                  isSubmitting ? "cursor-not-allowed opacity-80" : "",
                )}
                whileHover={{
                  scale: isSubmitting ? 1 : 1.03,
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 2px 8px rgba(0, 41, 255, 0.2)",
                }}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </RippleButton>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RoleInformationForm;
