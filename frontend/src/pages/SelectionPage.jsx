import { Marquee } from "../components/magicui/marquee";
import { ArrowRight, Stars, Wand2 } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Product Manager",
    quote:
      "Thryve transformed how I develop new skills. The personalized approach is unmatched.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Williams",
    role: "Engineering Lead",
    quote:
      "Our team's productivity increased by 40% after using Thryve's learning paths.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    role: "UX Designer",
    quote:
      "Finally a platform that understands my learning style and adapts accordingly.",
    img: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    quote:
      "The AI recommendations are scarily accurate. It knows what I need before I do.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Kim",
    role: "CTO",
    quote:
      "We've rolled out Thryve across our entire organization with phenomenal results.",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const TestimonialCard = ({ name, role, quote, img }) => {
  return (
    <div className="w-80 shrink-0 rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <img className="h-10 w-10 rounded-full" src={img} alt={name} />
        <div>
          <h4 className="font-medium text-blue-900">{name}</h4>
          <p className="text-sm text-blue-700">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-blue-800">"{quote}"</p>
    </div>
  );
};

export default function SelectionPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      {/* Header Section with Blue Gradient */}
      <div className="relative w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] px-4 py-2">
        <div className="relative z-10 mx-auto flex h-20 max-w-4xl flex-row items-center justify-between">
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
            Welcome, Sunil
          </motion.h2>
        </div>
      </div>

      {/* Testimonials Section with Light Background */}

      {/* Main Content Section with Blue Gradient */}
      <div className="relative w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] py-4">
        <div className="relative z-10 mx-auto w-full max-w-2xl px-4">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white/90">
              To personalize your learning experience, complete the self
              assessment
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personalize Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <Link
                to="/personalize"
                className="group flex h-full flex-col rounded-lg border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20">
                    <Wand2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="mb-2 text-lg font-semibold text-white">
                      Personalize Your Experience
                    </h2>
                    <p className="text-sm text-white/80">
                      Complete a quick self-assessment to get tailored
                      recommendations designed just for you.
                    </p>

                    <div className="mt-auto flex items-center pt-6 text-sm font-medium text-white">
                      <span>Get Started Now</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Secondary option as a link at the bottom */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 border-t border-white/10 pt-4"
                >
                  <Link
                    to="/home"
                    className="group flex items-center justify-center text-sm font-medium text-white underline decoration-white underline-offset-2 transition-colors duration-300 hover:text-white hover:decoration-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                  >
                    <span>I'll personalize later</span>
                  </Link>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative w-full bg-gray-50 py-6">
        <div className="mx-auto max-w-4xl px-4">
          <h3 className="mb-6 text-center text-sm font-medium tracking-wider text-gray-500 uppercase">
            Trusted by professionals worldwide
          </h3>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-2">
            <Marquee pauseOnHover className="[--duration:25s]">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="mx-3">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
}
