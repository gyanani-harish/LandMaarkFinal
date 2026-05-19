import React, { useState, useEffect } from "react";
import "./Home.css";
import { fetchHomepageData, HomepageData } from "../../services/HomeService";
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

const Home: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData>({
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
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHomepageData();
        if (data) {
          setHomepageData(data);
        }
      } catch (error) {
        console.error("Error loading dynamic homepage data from API:", error);
      }
    };
    loadData();
  }, []);

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
