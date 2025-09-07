import { useState } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-200 dark:bg-gray-900 text-black dark:text-white shadow-md px-9 py-7">
      <div className="flex justify-between items-center">
        {/* Left Side - Logo / Title (optional) */}
        <h2 className="text-lg font-bold text-blue-600 md:hidden">Menu</h2>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 font-medium justify-start">
          {["HOME", "ABOUT US", "CONTACT US", "FEEDBACK"].map((link, i) => (
            <li
              key={i}
              className="relative cursor-pointer group transition-transform duration-300"
            >
              <span className="group-hover:text-blue-500 group-hover:scale-110 inline-block transition-transform duration-300">
                {link}
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] h-[2px] w-0 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="flex flex-col items-center gap-6 mt-4 md:hidden font-medium">
          {["HOME", "ABOUT US", "CONTACT US", "FEEDBACK"].map((link, i) => (
            <li
              key={i}
              className="relative cursor-pointer group transition-transform duration-300"
            >
              <span className="group-hover:text-blue-500 inline-block transition-transform duration-300">
                {link}
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] h-[2px] w-0 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default NavBar;


