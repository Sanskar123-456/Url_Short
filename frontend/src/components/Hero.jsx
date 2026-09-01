import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE, safeFetch } from "../utils/api";
import {
  Link2,
  Sparkles,
  AlertCircle,
  Zap,
  BarChart2,
  Shield,
  Smartphone,
  ArrowRight,
  UserCheck,
} from "lucide-react";

function Hero({ onGenerate }) {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { token, isAuthenticated, user } = useAuth();

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!longUrl.trim()) {
      setErrorMessage("Please enter a valid URL to shorten.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const data = await safeFetch(`${API_BASE}/url`, {
        method: "POST",
        headers,
        body: JSON.stringify({ url: longUrl }),
      });

      if (data && data.shortUrl) {
        onGenerate?.(data.shortUrl);
        setLongUrl("");
      }
    } catch (err) {
      console.error("Error generating short URL:", err);
      setErrorMessage(err.message || "Something went wrong while shortening the link.");
    } finally {
      setLoading(false);
    }
  };

  const pillVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.4,
      },
    }),
  };

  return (
    <>
      {/* Title & Description Section */}
      <section className="w-full flex flex-col justify-center items-center pt-8 pb-4 sm:pt-12 sm:pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/60 dark:to-purple-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-5 shadow-sm"
        >
          <Sparkles size={16} className="text-purple-500 animate-pulse" /> Next-Gen Smart Link Platform
        </motion.div>

        {/* 1. Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-sm max-w-4xl leading-tight"
        >
          AI Powered Smart URL Shortener
        </motion.h1>

        {/* 2. Text related to URL shortener features & use cases */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mt-4 sm:mt-5 text-gray-600 dark:text-gray-300 space-y-3 px-2"
        >
          <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            Transform lengthy, complex, and unreadable URLs into powerful, intelligent, and shareable short links in a single click.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Gain complete visibility with <strong className="text-gray-800 dark:text-gray-200">real-time click analytics</strong>, instant redirect speeds, and custom link tracking. Perfect for <span className="text-blue-600 dark:text-blue-400 font-medium">Social Media bios</span>, <span className="text-purple-600 dark:text-purple-400 font-medium">Digital Ad Campaigns</span>, <span className="text-pink-600 dark:text-pink-400 font-medium">SMS & WhatsApp broadcasts</span>, and <span className="text-emerald-600 dark:text-emerald-400 font-medium">Business Marketing</span>.
          </p>
        </motion.div>

        {/* Feature Highlights Pills with Staggered Scroll Animation */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-6 max-w-2xl text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          {[
            { icon: <Zap size={14} className="text-amber-500" />, label: "Instant Shortening" },
            { icon: <BarChart2 size={14} className="text-blue-500" />, label: "Real-Time Click Tracking" },
            { icon: <Shield size={14} className="text-emerald-500" />, label: "Safe & Secure Routing" },
            { icon: <Smartphone size={14} className="text-purple-500" />, label: "Social & Mobile Ready" },
          ].map((pill, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={pillVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm cursor-default"
            >
              {pill.icon} {pill.label}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Input Box Form */}
      <section className="w-full flex justify-center items-center px-4 mt-2">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleGenerate}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 flex flex-col justify-center transition-all"
        >
          <label
            htmlFor="originalUrl"
            className="block text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2"
          >
            Enter your destination URL
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Link2 size={18} />
            </div>
            <input
              type="text"
              id="originalUrl"
              placeholder="https://example.com/very-long-url-path..."
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errorMessage
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 text-gray-800 dark:text-white text-sm sm:text-base transition`}
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-red-500 text-xs sm:text-sm mt-2.5">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-base shadow-lg hover:shadow-xl transform transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Shortening URL...</span>
                </>
              ) : (
                <>
                  <span>Generate Short URL</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </section>

      {/* Unlock More Services Callout Banner */}
      <section className="w-full flex justify-center items-center px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-blue-200/80 dark:border-blue-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shrink-0 hidden sm:flex">
              {isAuthenticated ? <UserCheck size={20} /> : <Sparkles size={20} />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {isAuthenticated
                  ? `Welcome, ${user?.name || "User"}! Your account is active.`
                  : "Login Into Account or Create Account to Unlock More services"}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {isAuthenticated
                  ? "Manage your shortened links, view real-time click stats, and delete links anytime."
                  : "Track real-time click statistics, save your links permanently, and access your personal dashboard."}
              </p>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm font-medium shadow hover:opacity-95 transition"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow transition shrink-0"
            >
              <span>Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </motion.div>
      </section>
    </>
  );
}

export default Hero;
