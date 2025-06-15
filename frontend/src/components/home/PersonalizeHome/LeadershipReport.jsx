import { motion } from "framer-motion";
import { BorderBeam } from "../../magicui/border-beam";

const RecommendationCard = ({ title, icon, color, delay, children }) => {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-xl border border-${color}-100 bg-gradient-to-br from-${color}-50 to-white p-5 shadow-sm transition-all hover:shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-full bg-${color}-100 p-1.5`}>{icon}</span>
          <h3 className={`font-semibold text-${color}-700`}>{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{children}</p>
      </div>
    </motion.div>
  );
};

const LeadershipReport = ({ reportData }) => {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };
  console.log("LeadershipReport Data:", reportData);

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-6 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="#0029ff"
          colorTo="color-mix(in_srgb,#0029ff,white_50%)"
          className="z-0"
        />

        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <motion.h2
                className="bg-gradient-to-r from-[#0029ff] to-blue-400 bg-clip-text text-2xl font-bold text-transparent"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Leadership Action Plan
              </motion.h2>

              <motion.p
                className="mt-3 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your personalized roadmap for leadership excellence.
              </motion.p>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <RecommendationCard
                  title="Continue Doing"
                  color="emerald"
                  delay={0.5}
                  icon={
                    <svg
                      className="h-4 w-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  }
                >
                  {reportData?.assessment.recommendations["do-more"]}
                </RecommendationCard>

                <RecommendationCard
                  title="Start Doing"
                  color="blue"
                  delay={0.6}
                  icon={
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  }
                >
                  {reportData?.assessment?.recommendations.start}
                </RecommendationCard>

                <RecommendationCard
                  title="Do Less"
                  color="amber"
                  delay={0.7}
                  icon={
                    <svg
                      className="h-4 w-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      />
                    </svg>
                  }
                >
                  {reportData?.assessment?.recommendations["do-less"]}
                </RecommendationCard>

                <RecommendationCard
                  title="Stop Doing"
                  color="red"
                  delay={0.8}
                  icon={
                    <svg
                      className="h-4 w-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  }
                >
                  {reportData?.assessment.recommendations.stop}
                </RecommendationCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadershipReport;
