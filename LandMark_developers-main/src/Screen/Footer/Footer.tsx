import React from "react";
import {
  Phone,
  MapPin,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const locations = [
    {
      city: "Ajmer LandMaark Properties",
      address: "Pushkar Bypass Rd, opp. AIT College, Panchsheel Nagar, Ajmer, Rajasthan 305004",
      phone: "CALL NOW",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/damacproperties",
      label: "Facebook",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/damacproperties",
      label: "Twitter",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/damacproperties",
      label: "Instagram",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/damacproperties",
      label: "YouTube",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/damac-properties",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-max-width">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <h1 className="footer-title">
            LandMaark
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="footer-divider">
          <div className="footer-grid">
            {/* Locations */}
            <div className="footer-locations">
              <div className="locations-grid">
                {locations.map((location, index) => (
                  <div key={index} className="location-item">
                    <h3 className="location-title">
                      <MapPin className="location-icon" />
                      <span>{location.city}</span>
                    </h3>
                    <p className="location-address">
                      {location.address}
                    </p>
                    <div className="location-contact">
                      <Phone className="location-icon" />
                      <span className="contact-phone-label">
                        {location.phone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="footer-social-section">
              <h3 className="social-heading">
                Follow Us
                <div className="social-heading-underline"></div>
              </h3>

              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-flex">
            <div className="contact-links">

              <a
                href="https://damacproperties.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-item"
              >
                <Globe className="location-icon" />
                www.LandMaarkproperties.com
              </a>
            </div>

            {/* Copyright */}
            <div className="copyright-text">
              <p>© {new Date().getFullYear()} LandMaark Properties. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
