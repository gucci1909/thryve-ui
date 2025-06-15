import { motion } from "framer-motion";
import { FiCheck, FiClock, FiRepeat, FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ChatFeedback = ({ 
  isVisible, 
  chatType, 
  sessionId, 
  userId,
  onContinue,
  token 
}) => {
  const navigate = useNavigate();

  const handleFeedbackSelection = async (decision) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat-box/save-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          // sessionId,
          chatType,
          decision,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save feedback");
      }

      if (decision === "NO_CONTINUE_NOW") {
        onContinue();
      } else {
        navigate("/personalize-home");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  if (!isVisible) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-6 max-w-[85%] rounded-xl border border-[#0029ff]/10 bg-white p-4 shadow-lg"
    >
      <motion.div 
        className="mb-4 flex items-center gap-2 text-[#0029ff]"
        variants={itemVariants}
      >
        <FiMessageCircle className="h-8 w-8" />
        <p className="text-sm font-medium">
          How is the {chatType === 'coaching' ? 'Coaching' : 'Roleplay'} going? Do you feel ready?
        </p>
      </motion.div>

      <div className="space-y-3">
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFeedbackSelection("YES_READY")}
          className="flex w-full items-center gap-3 rounded-sm bg-gradient-to-r from-[#0029ff] to-[#0029ff]/90 px-2 py-2 text-left text-white transition-all hover:shadow-md"
        >
          <FiCheck />
          <p className="text-sm">Yes, I am ready</p>
        </motion.button>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFeedbackSelection("NO_CONTINUE_NOW")}
          className="flex w-full items-center gap-3 rounded-sm border border-[#0029ff] bg-white px-2 py-2 text-left text-[#0029ff] transition-all hover:bg-[#0029ff]/5"
        >
          <FiRepeat />
          <p className="text-sm">No, continue with the {chatType === 'coaching' ? 'Coaching' : 'Roleplay'}</p>
        </motion.button>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFeedbackSelection("NO_REVISIT_LATER")}
          className="flex w-full items-center gap-3 rounded-sm border border-[#0029ff]/20 bg-gray-50 px-2 py-2 text-left text-gray-600 transition-all hover:bg-gray-100"
        >
          <FiClock />
          <p className="text-sm">No, I will revisit the {chatType === 'coaching' ? 'Coaching' : 'Roleplay'} later</p>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatFeedback; 