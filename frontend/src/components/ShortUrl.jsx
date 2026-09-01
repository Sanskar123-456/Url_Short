import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Copy, Check, ExternalLink, ArrowRight, Sparkles } from "lucide-react";

function ShortUrl({ shortUrl }) {
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!shortUrl) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4 text-center w-full max-w-xl">
      {/* Success Notification */}
      <div className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
        <Sparkles size={18} />
        <span>Your shortened link is ready!</span>
      </div>

      {/* Short URL Box */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-xl w-full">
        {/* Clickable Link */}
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline truncate text-sm sm:text-base flex items-center gap-1.5 text-left"
        >
          <span className="truncate">{shortUrl}</span>
          <ExternalLink size={14} className="shrink-0 text-gray-400" />
        </a>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
            copied
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
          title="Copy short link"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Auth Context Follow-up */}
      <div className="mt-4">
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            <span>View link analytics in Dashboard</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Want to track clicks and view history?{" "}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Create an account
            </Link>{" "}
            or{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default ShortUrl;
