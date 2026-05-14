import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
            {/* Logo / Page Title */}
            <div className="navbar-brand">
              {location.pathname === "/" ? (
                <Link to="/" className="logo-link">
                  <img
                    src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=scale-down,q=100/YNqMEWZ1PXT9OR5G/untitled-removebg-preview---edited-ad0zeWFJjhv7eqm2.png"
                    alt="Real Estate"
                    className="logo-img"
                  />
                </Link>
              ) : (
                <span className="page-title">
                  {location.pathname.toLowerCase() === "/township" && "Our Townships"}
                  {location.pathname.toLowerCase() === "/about" && "About Us"}
                  {location.pathname.toLowerCase() === "/contactus" && "Contact Us"}
                  {!["/township", "/about", "/contactus"].includes(location.pathname.toLowerCase()) && "LandMaark"}
                </span>
              )}
            </div>

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
              {isOpen ? <X size={28} color="black" /> : <Menu size={28} color="black" />}
            </button>
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