import React, { useState, useEffect, useCallback } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "./Home.css";
import "../PropertyPageDetails/PropertyDetailPage.css";
import { fetchHomepageData, HomepageData } from "../../services/HomeService";
import { useTranslation } from "../../hooks/useTranslation";
import {
  HeroSection,
  PerfectHomeSection,
  WhyPropertiesSection,
  IconicPropertiesSection,
  LuxuryWorldSection,
  CollaborationsSection,
  CommunitiesSection,
  InvestSection,
  EnquiryFormSection,
} from "./components";

const LOTTIE_SRC = "https://assets-v2.lottiefiles.com/a/358e0c5e-1176-11ee-8663-8f76e1809294/JmwXG8XzU7.lottie";

const EMPTY_DATA: HomepageData = {
  showEnquiryForm: true,
  hero: { title: "", slides: [] },
  section3: { title: "", items: [] },
  section: { title: "", subtitle: "", items: [] },
  section5: { title: "", subtitle: "", footerText: "", items: [] },
  section6: { title: "", subtitle: "", items: [] },
  section7: { title: "", subtitle: "", items: [] },
  section8: { title: "", subtitle: "", videoUrl: "", items: [] },
  section9: { title: "", items: [] },
  footer: {
    logoText: "",
    locations: [],
    socialLinks: [],
    websiteUrl: "",
    websiteHref: "",
    copyrightPattern: "",
  },
};

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [homepageData, setHomepageData] = useState<HomepageData>(EMPTY_DATA);

  const loadData = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const data = await fetchHomepageData();
      if (data) {
        setHomepageData(data);
      }
    } catch (error) {
      console.error("Error loading dynamic homepage data from API:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="error-wrapper-premium">
        <div className="error-content-premium">
          <div className="lottie-container-premium">
            <div className="lottie-player-premium">
              <DotLottieReact src={LOTTIE_SRC} loop autoplay />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="error-wrapper-premium">
        <div className="error-content-premium">
          <div className="lottie-container-premium">
            <div className="lottie-player-premium">
              <DotLottieReact src={LOTTIE_SRC} loop autoplay />
            </div>
          </div>
          <h1 className="error-title-premium">{t("errors.failedToLoadHome")}</h1>
          <p className="error-subtitle-premium">
            {t("errors.serverUnavailable")}
          </p>
          <button onClick={loadData} className="error-back-btn-premium">
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <HeroSection hero={homepageData.hero} />
      <PerfectHomeSection section3={homepageData.section3} />
      <WhyPropertiesSection section={homepageData.section} />
      <IconicPropertiesSection section5={homepageData.section5} />
      <LuxuryWorldSection section6={homepageData.section6} />
      <CollaborationsSection section7={homepageData.section7} />
      <CommunitiesSection section8={homepageData.section8} />
      <InvestSection section9={homepageData.section9} />
      {homepageData.showEnquiryForm && <EnquiryFormSection />}
    </div>
  );
};

export default Home;
