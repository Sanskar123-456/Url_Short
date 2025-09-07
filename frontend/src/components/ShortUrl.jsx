import { Copy } from "lucide-react";

function ShortUrl({ shortUrl }) {
  if (!shortUrl) return null;

  return (
    <div className="flex flex-col items-center mt-8 px-4 text-center">
      {/* Congratulations Message */}
      <p className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
        🎉 Congratulations! Your Short URL is ready
      </p>

      {/* Short URL Box */}
      <div
        className="flex items-center justify-between gap-3 bg-white dark:bg-gray-800 
        border border-gray-300 dark:border-gray-600 px-4 py-3 
        rounded-xl shadow-lg w-full max-w-md"
      >
        {/* Clickable Link */}
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline truncate max-w-[200px] sm:max-w-xs"
        >
          {shortUrl}
        </a>

        {/* Copy Button */}
        <button
          onClick={() => navigator.clipboard.writeText(shortUrl)}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
          title="Copy to clipboard"
        >
          <Copy size={20} />
        </button>
      </div>
    </div>
  );
}

export default ShortUrl;
