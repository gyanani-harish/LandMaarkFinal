import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Township", path: "/Township" },
    { name: "About", path: "/About" },
    { name: "Contact", path: "/contactUs" },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
          ${scrolled
            ? "bg-black/80 backdrop-blur-md py-2 shadow-lg"
            : "bg-black/80 backdrop-blur-md py-3"
          }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo / Page Title for Mobile */}
            <div className="flex items-center">
              <Link
                to="/"
                className={`flex items-center gap-2 flex-shrink-0 transition-transform duration-300 hover:scale-105 ${location.pathname.toLowerCase() === '/township' ? 'hidden md:flex' : ''}`}
              >
                <img
                  src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=scale-down,q=100/YNqMEWZ1PXT9OR5G/untitled-removebg-preview---edited-ad0zeWFJjhv7eqm2.png"
                  alt="Real Estate"
                  className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain w-auto"
                />

              </Link>
              {location.pathname.toLowerCase() === '/township' && (
                <span className="text-white text-xl md:text-2xl font-bold md:ml-4">
                  Our Townships
                </span>
              )}
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base font-medium tracking-wide pb-2 group
                    ${location.pathname === link.path ? "text-yellow-400" : ""}`}
                >
                  {link.name}
                  {/* Animated underline */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-yellow-400 transition-all duration-300 ${location.pathname === link.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button - Yellow Background */}
            <button
              className="md:hidden relative z-50 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-black shadow-lg"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay + Panel — only rendered when open */}
      {isOpen && (
        <>
          <div
            className="md:hidden"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
            }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="md:hidden"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: '280px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.98))',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              zIndex: 9999,
            }}
          >
            {/* Mobile Menu Header with Yellow Accent */}
            <div className="flex justify-between items-center px-6 h-20 border-b border-yellow-500/30">
              <span className="text-lg font-semibold text-white tracking-wide">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded-lg p-1"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col p-6 gap-5">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`relative text-gray-300 hover:text-yellow-400 text-lg font-medium transition-all duration-300 py-2 group
                    ${location.pathname === link.path ? "text-yellow-400" : ""}`}
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.07}s forwards`,
                    opacity: 0,
                    transform: "translateX(20px)",
                  }}
                >
                  {link.name}
                  {/* Animated underline for mobile */}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-400 transition-all duration-300 ${location.pathname === link.path ? "w-8" : "w-0 group-hover:w-8"
                      }`}
                  />
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .menu-button-animation {
          animation: pulse 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;