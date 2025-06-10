import { motion } from "framer-motion";
import { FaRegCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RippleButton } from "../components/magicui/ripple-button";
import { BorderBeam } from "../components/magicui/border-beam";

function FeedbackThankYou() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f6f9ff] to-[#eef2ff] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8"
      >
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="#0029ff"
          colorTo="#3b82f6"
          className="rounded-2xl"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0029ff]/10"
        >
          <FaRegCheckCircle className="h-10 w-10 text-[#0029ff]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          Thank You for Your Feedback!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 text-gray-600"
        >
          Your insights are valuable and will help improve leadership effectiveness.
          We appreciate your time and thoughtful responses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="rounded-xl bg-[#0029ff]/5 p-4">
            <p className="text-sm text-gray-600">
              Your feedback has been successfully submitted and will be kept
              confidential. The responses will be used to generate insights and
              recommendations for leadership development.
            </p>
          </div>

          <Link to="/">
            <RippleButton
              rippleColor="rgba(255, 255, 255, 0.3)"
              className="w-full bg-gradient-to-r from-[#0029ff] to-[#3b82f6] px-6 py-3 text-white shadow-lg transition-all hover:shadow-xl"
            >
              Return to Home
            </RippleButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default FeedbackThankYou; 