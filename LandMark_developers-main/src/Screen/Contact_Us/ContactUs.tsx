import React from "react";
import "./ContactUs.css";

const ContactUs: React.FC = () => {
  const mapUrl = `https://www.google.com/maps?q=26.5395603,74.662056&output=embed`;

  return (
    <div className="cu-page">
      {/* Ambient Glow */}
      <div className="cu-glow-top" />
      <div className="cu-glow-bottom" />

      {/* MAP SECTION */}
      <div className="cu-map-section">
        <div className="cu-map-container">
          <iframe
            title="Google Map of Location"
            src={mapUrl}
            className="cu-map-iframe"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="cu-main">
        {/* LEFT TEXT */}
        <div>
          <h2 className="cu-heading">
            Let's Build Your
            <span className="cu-heading-highlight">Luxury Future</span>
          </h2>
          <div className="cu-divider" />
          <p className="cu-description">
            Speak with our private advisors and gain exclusive access to Dubai's
            most prestigious real estate developments and off-market
            opportunities.
          </p>
        </div>

        {/* CONTACT FORM */}
        <div className="cu-form-card">
          <form className="cu-form">
            {[
              { label: "Full Name", type: "text", placeholder: "Rahul" },
              { label: "Email", type: "email", placeholder: "rahul@gmail.com" },
              { label: "Phone", type: "tel", placeholder: "+91 4343422332" },
            ].map((field, index) => (
              <div key={index} className="cu-field">
                <label className="cu-label">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="cu-input"
                />
              </div>
            ))}
            <div className="cu-field">
              <label className="cu-label">Investment in Ajmer</label>
              <select className="cu-select">
                <option>PanchSheel</option>
                <option>Gulab Bari</option>
                <option>Gandhi Nagar</option>
                <option>Vashali Nagar</option>
              </select>
            </div>
            <button type="submit" className="cu-submit-btn">
              Request Private Call
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;