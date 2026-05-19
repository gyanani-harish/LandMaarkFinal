import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import "./Footer.css";
import { fetchHomepageData, FooterDetails } from "../../services/HomeService";

const initialFooterDetails: FooterDetails = {
  logoText: "LandMaark",
  locations: [
    {
      city: "Ajmer LandMaark Properties",
      address: "Pushkar Bypass Rd, opp. AIT College, Panchsheel Nagar, Ajmer, Rajasthan 305004",
      phone: "CALL NOW",
    },
  ],
  socialLinks: [
    { platform: "Facebook", href: "https://facebook.com/damacproperties" },
    { platform: "Twitter", href: "https://twitter.com/damacproperties" },
    { platform: "Instagram", href: "https://instagram.com/damacproperties" },
    { platform: "YouTube", href: "https://youtube.com/damacproperties" },
    { platform: "LinkedIn", href: "https://linkedin.com/company/damac-properties" }
  ],
  websiteUrl: "www.LandMaarkproperties.com",
  websiteHref: "https://damacproperties.com",
  copyrightPattern: "© {year} LandMaark Properties. All rights reserved."
};

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return Facebook;
    case "twitter":
      return Twitter;
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    case "linkedin":
      return Linkedin;
    default:
      return Globe;
  }
};

const Footer: React.FC = () => {
  const [footerDetails, setFooterDetails] = useState<FooterDetails>(initialFooterDetails);

  useEffect(() => {
    const loadFooter = async () => {
      const data = await fetchHomepageData();
      if (data && data.footer) {
        setFooterDetails(data.footer);
      }
    };
    loadFooter();
  }, []);

  const copyrightText = footerDetails.copyrightPattern.replace(
    "{year}",
    new Date().getFullYear().toString()
  );

  return (
    <footer className="footer-container">
      <div className="footer-max-width">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <h1 className="footer-title">
            {footerDetails.logoText}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="footer-divider">
          <div className="footer-grid">
            {/* Locations */}
            <div className="footer-locations">
              <div className="locations-grid">
                {footerDetails.locations.map((location, index) => (
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
                {footerDetails.socialLinks.map((social, index) => {
                  const IconComponent = getSocialIcon(social.platform);
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon-link"
                      aria-label={social.platform}
                    >
                      <IconComponent size={24} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-flex">
            <div className="contact-links">
              <a
                href={footerDetails.websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-item"
              >
                <Globe className="location-icon" />
                {footerDetails.websiteUrl}
              </a>
            </div>

            {/* Copyright */}
            <div className="copyright-text">
              <p>{copyrightText}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
