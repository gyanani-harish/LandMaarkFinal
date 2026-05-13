

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

const Footer = () => {
  const locations = [

    {
      city: "Ajmer- LandMaark Properties",
      address: "676H+2G2 -  Street New Salata, Doha, Qatar",
      phone: "CALL NOW",
    },

  ];

  const agencies = [
    ""
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
    <footer className="bg-black text-white w-full pt-4 pb-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className=" text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-white">
            LandMaark
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="border-t border-gray-900">
          <div className="flex flex-col lg:flex-row justify-between items-center md:items-start gap-12 text-center md:text-left">

            {/* Locations */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center md:items-start border-t border-gray-800 pt-6 hover:border-yellow-400 transition-colors duration-300"
                  >
                    <h3 className="text-base font-semibold mb-3 text-gray-200 flex items-center md:items-start">
                      <MapPin className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                      <span>{location.city}</span>
                    </h3>

                    <p className="text-sm text-gray-400 mb-4 leading-relaxed max-w-xs">
                      {location.address}
                    </p>

                    <div className="flex items-center text-sm text-gray-300">
                      <Phone className="w-4 h-4 mr-2 text-yellow-400" />
                      <span className="hover:text-yellow-400 cursor-pointer transition-colors font-medium">
                        {location.phone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold mb-6 text-gray-100 uppercase tracking-widest relative inline-block">
                Follow Us
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-0.5 bg-yellow-400"></div>
              </h3>

              <div className="flex items-center space-x-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-800 ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-sm text-gray-400">
              <a
                href="mailto:info@damacproperties.com"
                className="flex items-center hover:text-yellow-400 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2 text-yellow-400" />
                info@damacproperties.com
              </a>
              <a
                href="https://damacproperties.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-yellow-400 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2 text-yellow-400" />
                www.LandMaarkproperties.com
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500 text-center md:text-right">
              <p className="tracking-wide">
                © {new Date().getFullYear()} LandMaark Properties. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

