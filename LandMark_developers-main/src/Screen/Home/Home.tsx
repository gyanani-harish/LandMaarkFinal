import React, { useState, useEffect } from "react";
import "./Home.css";
import SectionCard from "../../Components/HomePage/sectionCard3";
import Section3Card from "../../Components/HomePage/Section2Card";
import Section5Card from "../../Components/HomePage/Section5Card";
import Section6Card from "../../Components/HomePage/Section6Card";
import useCarousel from "../../hooks/useCarousel";
import Section7Card from "../../Components/HomePage/Section7Card";
import Section8Card from "../../Components/HomePage/Section8Card";
import Section9Card from "../../Components/HomePage/section9Card";

// Mock data imports commented out as requested:
/*
import { sectionData as initialSectionData } from "../../store/HomePage/section";
import { Section3Data as initialSection3Data } from "../../store/HomePage/Section3";
import { Section5Card as initialSection5Data } from "../../store/HomePage/Section5Card";
import { Section6Data as initialSection6Data } from "../../store/HomePage/Section6Card";
import { Section7Data as initialSection7Data } from "../../store/HomePage/section7Card";
import { Section8Data as initialSection8Data } from "../../store/HomePage/section8Card";
import { Section9Data as initialSection9Data } from "../../store/HomePage/section9Card";
*/

// Interfaces are still needed for typing state variables:
import { SectionItem } from "../../store/HomePage/section";
import { Section3Item } from "../../store/HomePage/Section3";
import { Cards as Section5Item } from "../../store/HomePage/Section5Card";
import { Section6Type as Section6Item } from "../../store/HomePage/Section6Card";
import { Section7Type as Section7Item } from "../../store/HomePage/section7Card";
import { Section8Type as Section8Item } from "../../store/HomePage/section8Card";
import { Section9Type as Section9Item } from "../../store/HomePage/section9Card";

import AIPrompt from "../AIPrompt/AIPrompt";
import { fetchHomepageData, HeroSlide } from "../../services/HomeService";

// Temporary form submission handler
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Form Submitted");
};

// Mock data initial slides commented out as requested
/*
const initialHeroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075",
    title: "LEGACY OF EXCELLENCE IN",
    titleHighlight: "LUXURY REAL ESTATE",
    subtitle: "CHOOSE FROM A RANGE OF APARTMENTS, VILLAS AND TOWNHOUSES"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2075",
    title: "ARCHITECTURAL SPLENDOR IN",
    titleHighlight: "PREMIER TOWNSHIPS",
    subtitle: "EXPERIENCE EXTRAORDINARY LIVING, EFFORTLESSLY WITHIN YOUR REACH"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2075",
    title: "YOUR DREAM HOME IN",
    titleHighlight: "PRIME LOCATIONS",
    subtitle: "SOPHISTICATED HOMES BLENDING MODERN INNOVATION & TIMELESS COMFORT"
  }
];
*/

const Home: React.FC = () => {
  // Hero slide states - initialized empty (will load from API)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroTitle, setHeroTitle] = useState<string>("");

  // Section 2 (FIND YOUR PERFECT HOME)
  const [section3Title, setSection3Title] = useState<string>("");
  const [section3Data, setSection3Data] = useState<Section3Item[]>([]);

  // Section 3 (WHY LandMaark PROPERTIES?)
  const [secTitle, setSecTitle] = useState<string>("");
  const [secSubtitle, setSecSubtitle] = useState<string>("");
  const [secData, setSecData] = useState<SectionItem[]>([]);

  // Section 5 (EXPLORE OUR ICONIC PROPERTIES)
  const [section5Title, setSection5Title] = useState<string>("");
  const [section5Subtitle, setSection5Subtitle] = useState<string>("");
  const [section5FooterText, setSection5FooterText] = useState<string>("");
  const [section5Data, setSection5Data] = useState<Section5Item[]>([]);

  // Section 6 (A WORLD OF LUXURY)
  const [section6Title, setSection6Title] = useState<string>("");
  const [section6Subtitle, setSection6Subtitle] = useState<string>("");
  const [section6Data, setSection6Data] = useState<Section6Item[]>([]);

  // Section 7 (CURATED COLLABORATIONS)
  const [section7Title, setSection7Title] = useState<string>("");
  const [section7Subtitle, setSection7Subtitle] = useState<string>("");
  const [section7Data, setSection7Data] = useState<Section7Item[]>([]);

  // Section 8 (EMPOWERING COMMUNITIES, BUILDING FUTURES)
  const [section8Title, setSection8Title] = useState<string>("");
  const [section8Subtitle, setSection8Subtitle] = useState<string>("");
  const [section8VideoUrl, setSection8VideoUrl] = useState<string>("");
  const [section8Data, setSection8Data] = useState<Section8Item[]>([]);

  // Section 9 (WHY INVEST IN US?)
  const [section9Title, setSection9Title] = useState<string>("");
  const [section9Data, setSection9Data] = useState<Section9Item[]>([]);

  // Form toggle
  const [showEnquiryForm, setShowEnquiryForm] = useState<boolean>(true);

  // Carousels
  const heroIndex = useCarousel(heroSlides.length, 6000);
  const currentIndex = useCarousel(section6Data.length, 5000);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHomepageData();
        if (data) {
          if (typeof data.showEnquiryForm === "boolean") {
            setShowEnquiryForm(data.showEnquiryForm);
          }
          if (data.hero) {
            if (data.hero.title) setHeroTitle(data.hero.title);
            if (data.hero.slides) setHeroSlides(data.hero.slides);
          }
          if (data.section3) {
            if (data.section3.title) setSection3Title(data.section3.title);
            if (data.section3.items) setSection3Data(data.section3.items);
          }
          if (data.section) {
            if (data.section.title) setSecTitle(data.section.title);
            if (data.section.subtitle) setSecSubtitle(data.section.subtitle);
            if (data.section.items) setSecData(data.section.items);
          }
          if (data.section5) {
            if (data.section5.title) setSection5Title(data.section5.title);
            if (data.section5.subtitle) setSection5Subtitle(data.section5.subtitle);
            if (data.section5.footerText) setSection5FooterText(data.section5.footerText);
            if (data.section5.items) setSection5Data(data.section5.items);
          }
          if (data.section6) {
            if (data.section6.title) setSection6Title(data.section6.title);
            if (data.section6.subtitle) setSection6Subtitle(data.section6.subtitle);
            if (data.section6.items) setSection6Data(data.section6.items);
          }
          if (data.section7) {
            if (data.section7.title) setSection7Title(data.section7.title);
            if (data.section7.subtitle) setSection7Subtitle(data.section7.subtitle);
            if (data.section7.items) setSection7Data(data.section7.items);
          }
          if (data.section8) {
            if (data.section8.title) setSection8Title(data.section8.title);
            if (data.section8.subtitle) setSection8Subtitle(data.section8.subtitle);
            if (data.section8.videoUrl) setSection8VideoUrl(data.section8.videoUrl);
            if (data.section8.items) setSection8Data(data.section8.items);
          }
          if (data.section9) {
            if (data.section9.title) setSection9Title(data.section9.title);
            if (data.section9.items) setSection9Data(data.section9.items);
          }
        }
      } catch (error) {
        console.error("Error loading dynamic homepage data from API:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="home-container">
      {/* First Section - Hero Carousel Slider */}
      <section className="hero-desktop">
        <div className="hero-image-wrapper">
          {heroSlides.map((slide, idx) => (
            <img
              key={slide.id || idx}
              src={slide.image}
              alt={slide.title}
              className="hero-bg-img"
              style={{
                opacity: idx === heroIndex ? 1 : 0,
                zIndex: idx === heroIndex ? 1 : 0,
              }}
            />
          ))}
          <div className="hero-overlay" style={{ zIndex: 2 }}></div>
        </div>

        <div className="hero-brand-top"></div>

        <div className="hero-content-wrapper" style={{ zIndex: 3 }}>
          <div className="hero-text-container">
            <h1 className="hero-title">
              {heroSlides[heroIndex]?.title || "LEGACY OF EXCELLENCE IN"}
            </h1>

            <h1 className="hero-title">
              {heroSlides[heroIndex]?.titleHighlight || "LUXURY REAL ESTATE"}
            </h1>

            <p className="hero-subtitle">
              {heroSlides[heroIndex]?.subtitle || "CHOOSE FROM A RANGE OF APARTMENTS, VILLAS AND TOWNHOUSES"}
            </p>

            <div className="hero-btn-container">
              <button
                onClick={() =>
                  document
                    .getElementById("enquiry-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-btn"
              >
                ENQUIRE NOW
              </button>
            </div>
          </div>

          <AIPrompt />
        </div>
      </section>

      {/* Second Section */}
      <section className="home-section-2">
        <h2 className="section-2-title">
          {section3Title}
        </h2>

        <div className="section-2-grid">
          {section3Data.map((item) => (
            <Section3Card
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              price={item.price}
            />
          ))}
        </div>

        <div className="section-2-btn-wrapper">
          <button className="rounded-btn section-2-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 2a.5.5 0 0 1 .5.5V6h1V3.5a.5.5 0 0 1 1 0V6h1V4.5a.5.5 0 0 1 1 0V6h.5a2 2 0 0 1 2 2v1.5c0 2.5-2 4.5-4.5 4.5S4 12 4 9.5V6.5a.5.5 0 0 1 1 0V9a1 1 0 0 0 2 0V2.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            VIEW MORE
          </button>
        </div>
      </section>

      {/* Third Section */}
      <section className="home-section-3">
        <div className="section-3-inner">
          <div className="section-3-header">
            <h2 className="section-3-title">
              {secTitle}
            </h2>

            <p className="section-3-subtitle">
              {secSubtitle}
            </p>
          </div>

          <div className="section-3-grid">
            {secData.map((item, index) => (
              <SectionCard
                key={index}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section className="home-section-5">
        <div className="section-5-inner">
          <h2 className="section-5-title">
            {section5Title}
          </h2>

          <p className="section-5-subtitle">
            {section5Subtitle}
          </p>

          <div className="section-5-grid">
            {section5Data.map((item) => (
              <Section5Card key={item.id} property={item} />
            ))}
          </div>
          <p className="section-5-footer-text">
            {section5FooterText}
          </p>
          <div className="section-5-btn-wrapper">
            <button
              onClick={() =>
                document
                  .getElementById("properties")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-btn text-sm sm:text-base"
            >
              ENQUIRE NOW
            </button>
          </div>
        </div>
      </section>

      {/* Section 6 */}
      <section className="home-section-6">
        <div className="section-6-inner">
          <h2 className="section-6-title">
            {section6Title}
          </h2>

          <p className="section-6-subtitle">
            {section6Subtitle}
          </p>

          <div className="section-6-carousel-container">
            {section6Data.map((item, index) => (
              <Section6Card
                key={item.id}
                item={item}
                isActive={index === currentIndex}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 */}
      <section className="home-section-7">
        <div className="section-7-inner">
          <h2 className="section-7-title">
            {section7Title}
          </h2>

          <p className="section-7-subtitle">
            {section7Subtitle}
          </p>
          <div className="section-7-grid">
            {section7Data.map((item) => (
              <Section7Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 */}
      <section className="home-section-8">
        <div className="section-8-inner">
          <h2 className="section-8-title">
            {section8Title}
          </h2>

          <p className="section-8-subtitle">
            {section8Subtitle}
          </p>

          <div className="section-8-grid-wrapper">
            <div className="section-8-cards-grid">
              {section8Data.map((item) => (
                <Section8Card key={item.id} item={item} />
              ))}
            </div>

            <div className="section-8-video-wrapper">
              <iframe
                src={section8VideoUrl}
                title="LandMaark Properties"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9 */}
      <section className="home-section-9">
        <div className="section-9-inner">
          <h2 className="section-9-title">
            {section9Title}
          </h2>

          <div className="section-9-grid">
            {section9Data.map((item) => (
              <Section9Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      {showEnquiryForm && (
        <>
          <section id="enquiry-form" className="enquiry-section-desktop">
            <div className="enquiry-grid-desktop">
              {/* Left Text */}
              <div className="enquiry-left-desktop">
                <h2 className="enquiry-left-title-desktop">
                  Where Luxury Meets Legacy
                </h2>

                <p className="enquiry-left-desc-desktop">
                  Discover the perfect blend of luxury and legacy at LandMaark Properties.
                </p>
              </div>

              {/* Form */}
              <div className="enquiry-right-desktop">
                <h3 className="enquiry-right-title-desktop">
                  DISCOVER YOUR NEXT ADDRESS
                </h3>

                <p className="enquiry-mandatory-text">
                  *All fields are compulsory
                </p>

                <form className="enquiry-form-wrapper" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="First Name *"
                    required
                    className="enquiry-input"
                  />

                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    className="enquiry-input"
                  />

                  <input
                    type="tel"
                    placeholder="+91 Phone *"
                    required
                    className="enquiry-input"
                  />

                  <textarea
                    rows={4}
                    placeholder="Write your comments..."
                    className="enquiry-textarea"
                  />

                  <button className="rounded-btn text-sm">
                    Get a call back!
                  </button>
                </form>
              </div>
            </div>

            <div className="enquiry-footer-desktop">
              <h2 className="enquiry-footer-title-desktop">
                Live the luxury
              </h2>
            </div>
          </section>

          <section className="enquiry-section-mobile">
            <h2 className="enquiry-title-mobile">
              Where Luxury Meets Legacy
            </h2>

            <p className="enquiry-desc-mobile">
              Discover the perfect blend of luxury and legacy at LandMaark Properties.
            </p>

            <div className="enquiry-form-card-mobile">
              <h3 className="enquiry-form-title-mobile">
                DISCOVER YOUR NEXT ADDRESS
              </h3>

              <p className="enquiry-mandatory-text">
                *All fields are compulsory
              </p>

              <form className="enquiry-form-mobile" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="First Name *"
                  required
                  className="enquiry-input-mobile"
                />

                <input
                  type="email"
                  placeholder="Email *"
                  required
                  className="enquiry-input-mobile"
                />

                <input
                  type="tel"
                  placeholder="+91 Phone *"
                  required
                  className="enquiry-input-mobile"
                />

                <textarea
                  rows={4}
                  placeholder="Write your comments..."
                  className="enquiry-textarea-mobile"
                />

                <button className="rounded-btn enquiry-btn-mobile">
                  Get a call back!
                </button>
              </form>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
