import { motion } from "framer-motion";
import {
  Zap,
  BarChart3,
  ShieldCheck,
  FolderSync,
  Share2,
  MessageSquare,
  TrendingUp,
  QrCode,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function FeaturesAndUseCases() {
  const features = [
    {
      icon: <Zap className="text-amber-500" size={26} />,
      title: "Instant Smart Shortening",
      description:
        "Transform lengthy, complex web addresses into clean, memorable, and lightning-fast short links in milliseconds.",
      gradient: "from-amber-500/10 to-orange-500/10",
      border: "hover:border-amber-400 dark:hover:border-amber-600",
    },
    {
      icon: <BarChart3 className="text-blue-500" size={26} />,
      title: "Real-Time Click Analytics",
      description:
        "Track engagement, total visitor clicks, and traffic performance in real-time with an intuitive personal dashboard.",
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "hover:border-blue-400 dark:hover:border-blue-600",
    },
    {
      icon: <ShieldCheck className="text-emerald-500" size={26} />,
      title: "Safe & Reliable Redirection",
      description:
        "Built with secure cloud infrastructure guaranteeing fast, uninterrupted redirects and protected link routing.",
      gradient: "from-emerald-500/10 to-teal-500/10",
      border: "hover:border-emerald-400 dark:hover:border-emerald-600",
    },
    {
      icon: <FolderSync className="text-purple-500" size={26} />,
      title: "Centralized Link Management",
      description:
        "Easily organize, search, copy, and delete all your shortened URLs anytime from a single unified hub.",
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "hover:border-purple-400 dark:hover:border-purple-600",
    },
  ];

  const useCases = [
    {
      icon: <Share2 className="text-pink-500" size={24} />,
      title: "Social Media & Bio Links",
      description:
        "Perfect for Instagram bios, Twitter/X posts, TikTok, YouTube descriptions, and LinkedIn posts with neat, clickable links.",
      tag: "Social Media",
    },
    {
      icon: <MessageSquare className="text-indigo-500" size={24} />,
      title: "SMS & Messaging Campaigns",
      description:
        "Save character limits in SMS, WhatsApp, and Telegram marketing campaigns while maintaining professional branding.",
      tag: "Messaging",
    },
    {
      icon: <TrendingUp className="text-cyan-500" size={24} />,
      title: "Digital Marketing & Affiliates",
      description:
        "Measure marketing campaign ROI, optimize conversion funnels, and cleanly disguise complex affiliate tracking URLs.",
      tag: "Marketing",
    },
    {
      icon: <QrCode className="text-emerald-500" size={24} />,
      title: "Print Media & Presentations",
      description:
        "Generate short, memorable URLs that audiences can effortlessly type from presentation slides, flyers, and brochures.",
      tag: "Print & Media",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="w-full max-w-6xl mx-auto mt-16 sm:mt-24 px-4 space-y-16 sm:space-y-20 pb-16">
      {/* Features Grid Section with Scroll Animations */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles size={14} /> Powerful Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Why Choose Our URL Shortener?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2.5">
            Everything you need to shrink, share, and track your links with high performance.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.25 },
              }}
              className={`p-6 rounded-2xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 ${f.border} shadow-md hover:shadow-2xl transition-colors duration-300 flex flex-col justify-between cursor-pointer`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700/60 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Use Cases Section with Staggered Scroll Animation */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
            <CheckCircle2 size={14} /> Versatile Applications
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Popular Use Cases
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2.5">
            Discover how professionals and businesses utilize short links every day.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {useCases.map((u, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.25 },
              }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 shadow-md hover:shadow-2xl transition-colors duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700/60 shadow-sm">
                    {u.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60">
                    {u.tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {u.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {u.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesAndUseCases;
