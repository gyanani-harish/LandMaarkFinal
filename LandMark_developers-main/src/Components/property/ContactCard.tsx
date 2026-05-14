import React from 'react';
import { Building, Award, Check, User, Phone, Mail } from 'lucide-react';
import './ContactCard.css';

const ContactCard = () => {
  return (
    <div className="contact-card-container">
      <div className="contact-header">
        <div className="contact-icon-wrapper">
          <Building className="contact-main-icon" />
        </div>
        <h3 className="contact-title">Volt Group</h3>
        <p className="expert-badge">
          <Award className="expert-icon" />
          Housing Expert Pro
        </p>
      </div>

      <div className="contact-body">
        <div className="choice-highlight">
          <Check className="choice-icon" />
          <span className="choice-text">Great choice! Nice neighborhood around</span>
        </div>

        <div className="form-section">
          <p className="form-instruction">Please share your contact</p>
          <div className="input-group">
            <div className="input-relative">
              <User className="input-icon" />
              <input 
                type="text" 
                placeholder="Name"
                className="contact-input"
              />
            </div>
            <div className="input-relative">
              <Phone className="input-icon" />
              <input 
                type="tel" 
                placeholder="Phone"
                className="contact-input"
              />
            </div>
            <div className="input-relative">
              <Mail className="input-icon" />
              <input 
                type="email" 
                placeholder="Email"
                className="contact-input"
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" className="contact-checkbox" />
              <span className="checkbox-text">I agree to be contacted by Housing and agents via WhatsApp, SMS, phone, email etc</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" className="contact-checkbox" />
              <span className="checkbox-text">I am interested in Home Loans</span>
            </label>
          </div>

          <button className="submit-button">
            Get Contact Details
          </button>

          <p className="form-disclaimer">
            By proceeding, you consent to receive calls and texts at the number you provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;