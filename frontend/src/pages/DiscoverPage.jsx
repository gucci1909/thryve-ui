"use client";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiUsers,
  FiMessageSquare,
  FiZap,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";
import { OrbitingCircles } from "../components/magicui/orbiting-circles";
import FeatureCarousel from "../components/onboarding/FeatureCarousel";

const DiscoverPage = () => {
  const features = [
    {
      title: "AI-Powered Coaching",
      description:
        "Get personalized management advice tailored to your leadership style",
      icon: (
        <FiMessageSquare className="text-[var(--primary-color)]" size={24} />
      ),
    },
    {
      title: "Team Analytics",
      description:
        "Real-time insights into your team's performance and dynamics",
      icon: <FiBarChart2 className="text-[var(--primary-color)]" size={24} />,
    },
    {
      title: "1:1 Meeting Tools",
      description: "AI-generated talking points and follow-up recommendations",
      icon: <FiUsers className="text-[var(--primary-color)]" size={24} />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah K.",
      role: "Engineering Manager",
      quote:
        "Thryve helped me navigate difficult conversations with confidence",
    },
    {
      name: "Michael T.",
      role: "Product Lead",
      quote: "The AI suggestions have transformed our team retrospectives",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_10%)]">
      <section className="relative h-[350px] w-full overflow-hidden py-16">
        {/* Orbiting Circles Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <OrbitingCircles
            className="h-[300px] w-[300px]"
            duration={20}
            delay={10}
            radius={120}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
              <FiMessageSquare className="text-white" size={24} />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
              <FiBarChart2 className="text-white" size={24} />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
              <FiPieChart className="text-white" size={24} />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
              <FiTrendingUp className="text-white" size={24} />
            </div>
          </OrbitingCircles>
        </div>

        {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            className="mb-8 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            >
              <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-white/20 blur-xl" />
              <div className="absolute inset-0 -z-20 scale-75 rounded-full bg-white/10 blur-2xl" />
              <img
                src="/logo-thryve.png"
                alt="Thryve Logo"
                className="h-12 w-auto object-contain drop-shadow-lg"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white"
            >
              thryve
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mb-10 max-w-md px-6 text-center text-lg font-medium text-white/90 md:text-xl"
          >
            AI-powered coaching for modern managers building high-performing
            teams
          </motion.p>
        </div>
      </section>

      <section className="bg-white py-4">
        <FeatureCarousel features={features} />
      </section>

      {/* Dashboard Preview */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-3xl font-bold text-[var(--primary-color)]"
          >
            Your Management Dashboard
          </motion.h2>

          <motion.div
            className="relative h-[500px] overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <FiZap className="text-blue-200" size={120} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50" />

            <div className="absolute top-6 right-6 left-6 flex justify-between">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="text-sm text-blue-800/60">Thryve Dashboard</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-3xl font-bold text-[var(--primary-color)]"
          >
            Trusted by Managers Worldwide
          </motion.h2>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-blue-100 bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] p-8 text-white shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-white/80">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;
