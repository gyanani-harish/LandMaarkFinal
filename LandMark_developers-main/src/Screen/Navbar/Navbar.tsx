import React, { useState, useEffect } from "react";
import { AlignRight, X, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

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
      <header className={`navbar-header ${scrolled ? "scrolled" : "not-scrolled"}`}>
        <div className="navbar-container">
          <div className="navbar-flex">
            {/* Left Slot: Back navigation button or Home brand link */}
            <div className="nav-left-slot">
              {location.pathname !== "/" ? (
                <button
                  onClick={() => window.history.back()}
                  className="nav-back-btn"
                  aria-label="Go Back"
                >
                  <ArrowLeft size={16} strokeWidth={1.5} className="back-icon-svg" />
                </button>
              ) : (
                <Link to="/" className="logo-text-link">
                  Home
                </Link>
              )}
            </div>

            {/* Center Slot: Brand / Page Title */}
            <div className="nav-center-slot">
              {location.pathname !== "/" && (
                <span className="page-title">
                  {location.pathname.toLowerCase() === "/township" && "Our Townships"}
                  {location.pathname.toLowerCase() === "/about" && "About Us"}
                  {location.pathname.toLowerCase() === "/contactus" && "Contact Us"}
                  {!["/township", "/about", "/contactus"].includes(location.pathname.toLowerCase()) && "LandMaarkdeveloper"}
                </span>
              )}
            </div>

            {/* Right Slot: Desktop Nav & Mobile Hamburger Toggle */}
            <div className="nav-right-slot">
              {/* Desktop Menu */}
              <nav className="desktop-nav">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                  >
                    {link.name}
                    <span className="nav-underline" />
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <div className={`hamburger-pill-icon ${isOpen ? 'open' : ''}`}>
                  <span className="hamburger-line line-1" />
                  <span className="hamburger-line line-2" />
                  <span className="hamburger-line line-3" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay + Panel */}
      {isOpen && (
        <>
          <div
            className="mobile-overlay"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="mobile-drawer">
            {/* Mobile Menu Header */}
            <div className="drawer-header">
              <span className="drawer-title">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="drawer-close-btn"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="drawer-nav">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`drawer-link drawer-link-animated ${location.pathname === link.path ? "active" : ""}`}
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  {link.name}
                  <span className="drawer-underline" />
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;