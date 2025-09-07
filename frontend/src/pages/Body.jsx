import { useState } from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import ShortUrl from "../components/ShortUrl";

function Body() {
  const [shortUrl, setShortUrl] = useState("");

  return (
    <div
      className="min-h-screen bg-gray-200 sm:bg-gray-500 md:bg-gray-700 lg:bg-gray-800 
        dark:bg-gray-900 dark:sm:bg-gray-800 dark:md:bg-gray-950 
        text-black dark:text-white flex flex-col"
    >
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <Hero onGenerate={(id) => setShortUrl(`http://localhost:8001/${id}`)} />
        <ShortUrl shortUrl={shortUrl} />
      </main>
    </div>
  );
}

export default Body;
