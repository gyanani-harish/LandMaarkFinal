import React, { useCallback } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

export const EnquiryFormSection: React.FC = () => {
  const { t } = useTranslation();

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.warn("Form Submitted");
  }, []);

  return (
    <>
      <section id="enquiry-form" className="enquiry-section-desktop">
        <div className="enquiry-grid-desktop">
          {/* Left Text */}
          <div className="enquiry-left-desktop">
            <div className="enquiry-left-title-desktop">
              {t("home.luxuryMeetsLegacy")}
            </div>

            <p className="enquiry-left-desc-desktop">
              {t("home.luxuryMeetsLegacyDesc")}
            </p>
          </div>

          {/* Form */}
          <div className="enquiry-right-desktop">
            <div className="enquiry-right-title-desktop">
              {t("home.discoverNextAddress")}
            </div>

            <p className="enquiry-mandatory-text">
              {t("home.fieldsCompulsory")}
            </p>

            <form className="enquiry-form-wrapper" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={t("home.firstNamePlaceholder")}
                required
                className="enquiry-input"
              />

              <input
                type="email"
                placeholder={t("home.emailPlaceholder")}
                required
                className="enquiry-input"
              />

              <input
                type="tel"
                placeholder={t("home.phonePlaceholder")}
                required
                className="enquiry-input"
              />

              <textarea
                rows={4}
                placeholder={t("home.commentsPlaceholder")}
                className="enquiry-textarea"
              />

              <button className="rounded-btn text-sm">
                {t("home.getCallback")}
              </button>
            </form>
          </div>
        </div>

        <div className="enquiry-footer-desktop">
          <div className="enquiry-footer-title-desktop">
            {t("home.liveTheLuxury")}
          </div>
        </div>
      </section>

      <section className="enquiry-section-mobile">
        <div className="enquiry-title-mobile">
          {t("home.luxuryMeetsLegacy")}
        </div>

        <p className="enquiry-desc-mobile">
          {t("home.luxuryMeetsLegacyDesc")}
        </p>

        <div className="enquiry-form-card-mobile">
          <div className="enquiry-form-title-mobile">
            {t("home.discoverNextAddress")}
          </div>

          <p className="enquiry-mandatory-text">
            {t("home.fieldsCompulsory")}
          </p>

          <form className="enquiry-form-mobile" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t("home.firstNamePlaceholder")}
              required
              className="enquiry-input-mobile"
            />

            <input
              type="email"
              placeholder={t("home.emailPlaceholder")}
              required
              className="enquiry-input-mobile"
            />

            <input
              type="tel"
              placeholder={t("home.phonePlaceholder")}
              required
              className="enquiry-input-mobile"
            />

            <textarea
              rows={4}
              placeholder={t("home.commentsPlaceholder")}
              className="enquiry-textarea-mobile"
            />

            <button className="rounded-btn enquiry-btn-mobile">
              {t("home.getCallback")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
