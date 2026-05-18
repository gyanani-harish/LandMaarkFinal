import React from "react";
import "./Home.css";
import SectionCard from "../../Components/HomePage/sectionCard3";
import { sectionData } from "../../store/HomePage/section";
import Section3Card from "../../Components/HomePage/Section2Card";
import { Section3Data } from "../../store/HomePage/Section3";


import Section5Card from "../../Components/HomePage/Section5Card";
import { Section5Card as Section5Data } from "../../store/HomePage/Section5Card";
import Section6Card from "../../Components/HomePage/Section6Card";
import { Section6Data } from "../../store/HomePage/Section6Card";
import useCarousel from "../../hooks/useCarousel";

import Section7Card from "../../Components/HomePage/Section7Card";
import { Section7Data } from "../../store/HomePage/section7Card";

import Section8Card from "../../Components/HomePage/Section8Card";
import { Section8Data } from "../../store/HomePage/section8Card";
import Section9Card from "../../Components/HomePage/section9Card";
import { Section9Data } from "../../store/HomePage/section9Card";

import AIPrompt from "../AIPrompt/AIPrompt";
// Temporary form submission handler


const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Form Submitted");
};


const Home: React.FC = () => {
  const currentIndex = useCarousel(Section6Data.length, 5000);


  return (

    <div className="home-container">


      {/* Desktop / Laptop UI */}
      <section className="hero-desktop">

        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075"
            alt="Luxury Dubai Property"
            className="hero-bg-img"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-brand-top">
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-text-container">
            <h1 className="hero-title">
              LEGACY OF EXCELLENCE IN
            </h1>

            <h1 className="hero-title">
              LUXURY REAL ESTATE
            </h1>

            <p className="hero-subtitle">
              CHOOSE FROM A RANGE OF APARTMENTS,
              <br />
              VILLAS AND TOWNHOUSES
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
          FIND YOUR PERFECT HOME
        </h2>


        <div className="section-2-grid">
          {Section3Data.map((item) => (
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
              WHY LandMaark PROPERTIES?
            </h2>

            <p className="section-3-subtitle">
              Renowned for iconic developments and exceptional craftsmanship,
              LandMaark Properties blends elegance, innovation, and world-class
              amenities.
            </p>
          </div>

          <div className="section-3-grid">
            {sectionData.map((item, index) => (
              <SectionCard
                key={index}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

        </div>
      </section>

      <section className="home-section-5">
        <div className="section-5-inner">
          <h2 className="section-5-title">
            EXPLORE OUR ICONIC PROPERTIES
          </h2>

          <p className="section-5-subtitle">
            LandMaark Properties is known for creating exceptional living spaces that combine luxury,
            comfort, and timeless design. From elegant residential towers to thoughtfully planned communities,
            every LandMaark development reflects a commitment to quality craftsmanship and modern living.
            Each property is designed to offer residents a refined lifestyle with outstanding amenities
            and a sense of lasting value.
          </p>

          <div className="section-5-grid">
            {Section5Data.map((item) => (
              <Section5Card key={item.id} property={item} />
            ))}
          </div>
          <p className="section-5-footer-text">
            Explore LandMaark premier residential townhouses, exquisite luxury villas, and
            cutting-edge off-plan projects in Ajmer that redefine modern living. With flexible payment
            plans and prime locations across Ajmer, investing in premium real estate with LandMaark Developers
            has never been more accessible.
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


      <section className="home-section-6">
        <div className="section-6-inner">
          <h2 className="section-6-title">
            A WORLD OF LUXURY
          </h2>

          <p className="section-6-subtitle">
            Discover the finest in DAMAC Properties Dubai from expansive master
            communities to exclusive designer branded residences through the
            LandMaark Properties official website and experience extraordinary
            living, effortlessly within your reach.
          </p>

          <div className="section-6-carousel-container">
            {Section6Data.map((item, index) => (
              <Section6Card
                key={item.id}
                item={item}
                isActive={index === currentIndex}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="home-section-7">
        <div className="section-7-inner">
          <h2 className="section-7-title">
            CURATED COLLABORATIONS
          </h2>

          <p className="section-7-subtitle">
            LandMaark Properties brings new and exciting living concepts to life,
            with superior designs and details, by working with the finest
            designers and partnering with some of the most prestigious fashion
            and lifestyle brands.
          </p>
          <div className="section-7-grid">
            {Section7Data.map((item) => (
              <Section7Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="home-section-8">
        <div className="section-8-inner">
          <h2 className="section-8-title">
            EMPOWERING COMMUNITIES, BUILDING FUTURES
          </h2>

          <p className="section-8-subtitle">
            The LandMaark Properties Foundation is a testament to our commitment
            to creating a positive impact. From supporting the One Million Arab
            Coders Initiative to our sustainability efforts, we believe in
            building a better tomorrow. Discover how we’re making a difference,
            one initiative at a time.
          </p>

          <div className="section-8-grid-wrapper">
            <div className="section-8-cards-grid">
              {Section8Data.map((item) => (
                <Section8Card key={item.id} item={item} />
              ))}
            </div>

            <div className="section-8-video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="LandMaark Properties"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <section className="home-section-9">
        <div className="section-9-inner">
          <h2 className="section-9-title">
            WHY INVEST IN US?
          </h2>

          <div className="section-9-grid">
            {Section9Data.map((item) => (
              <Section9Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
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
    </div>
  );
};

export default Home;
