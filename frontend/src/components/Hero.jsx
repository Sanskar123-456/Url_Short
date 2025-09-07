import { useState } from "react";

function Hero({ onGenerate }) {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    if (!longUrl.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8001/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }),
      });

      const data = await res.json();

      if (data.id) {
        onGenerate?.(data.id);
        setLongUrl("");
      }
    } catch (err) {
      console.error("Error generating short URL:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Title */}
      <section className="w-full flex justify-center items-center py-10 sm:py-14 md:py-18 px-4 text-center">
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight 
          text-transparent bg-clip-text bg-gradient-to-r 
          from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg"
        >
          URL SHORTENER
        </h1>
      </section>

      {/* Input Box */}
      <section className="w-full flex justify-center items-center px-4">
        <div
          className="w-full sm:w-3/4 md:w-2/4 bg-white dark:bg-gray-900 shadow-2xl 
          rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 flex flex-col justify-center"
        >
          <label
            htmlFor="originalUrl"
            className="block text-base sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 mx-1.5 text-left"
          >
            Enter your original URL
          </label>
          <input
            type="text"
            id="originalUrl"
            placeholder="https://example.com/your-long-url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border 
              ${
                error
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } 
              dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
              text-gray-800 dark:text-white text-sm sm:text-base`}
          />
          {error && (
            <p className="text-red-500 text-xs sm:text-sm mt-2 ml-1">
              Required field
            </p>
          )}
        </div>
      </section>

      {/* Button */}
      <section className="w-full flex justify-center items-center py-6 px-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-xl 
            bg-gradient-to-r from-blue-600 to-purple-600 
            text-white font-semibold text-base sm:text-lg shadow-lg 
            transform transition duration-300 
            hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-pink-600"
        >
          {loading ? "Generating..." : "Generate Short URL"}
        </button>
      </section>
    </>
  );
}

export default Hero;
