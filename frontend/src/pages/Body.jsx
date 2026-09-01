import { useState } from "react";
import Hero from "../components/Hero";
import ShortUrl from "../components/ShortUrl";
import FeaturesAndUseCases from "../components/FeaturesAndUseCases";

function Body() {
  const [shortUrl, setShortUrl] = useState("");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-start items-center px-4 py-8 sm:py-12 bg-gray-100 dark:bg-gray-950 transition-colors">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center">
        <Hero onGenerate={(url) => setShortUrl(url)} />
        <ShortUrl shortUrl={shortUrl} />
      </div>

      {/* Comprehensive Features & Use Cases Section */}
      <FeaturesAndUseCases />
    </div>
  );
}

export default Body;
