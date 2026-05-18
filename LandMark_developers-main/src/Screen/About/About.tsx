import React from "react";
import { motion } from "framer-motion";
import "./About.css";

const About: React.FC = () => {
  return (
    <div className="ab-page">
      {/* HERO SECTION */}
      <section className="ab-hero">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          className="ab-hero-img"
          alt="Luxury Home"
        />
        <div className="ab-hero-overlay"></div>
        <div className="ab-hero-content">
          <h1 className="ab-hero-title">
            About <span>LANDMAARK DEVELOPERS</span>
          </h1>
          <p className="ab-hero-desc">
            Building Trust. Creating Landmaarks. Delivering Excellence in Real Estate.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="ab-section">
        <div className="ab-grid">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="ab-label">ESTABLISHED</span>
            <h2 className="ab-heading">
              Who <span>We Are</span>
            </h2>
            <p className="ab-text">
              LaandMark Developers was founded with a vision to transform
              property aspirations into reality. We specialize in premium
              residential and commercial developments designed to deliver
              long-term value and modern living experiences.
            </p>
            <p className="ab-text ab-text-muted">
              With a strong commitment to quality construction, transparency,
              and customer satisfaction, we help clients confidently invest,
              buy, and build their future.
            </p>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="ab-image-wrapper"
          >
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
              className="ab-img"
              alt="Our Office"
            />
            <div className="ab-img-overlay"></div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="ab-section ab-section-light">
        <div className="ab-centered">
          <span className="ab-label">OUR ADVANTAGE</span>
          <h2 className="ab-heading">
            What Makes Us <span>Different</span>
          </h2>
          <p className="ab-text" style={{ maxWidth: '48rem' }}>
            In a competitive real estate market, we stand out through strategic planning,
            premium quality, and long-term client relationships.
          </p>
        </div>

        <div className="ab-feature-grid">
          {[
            {
              title: "Prime Locations",
              desc: "Carefully selected locations offering strong growth potential and accessibility.",
            },
            {
              title: "Superior Construction",
              desc: "High-quality materials and modern architectural designs ensure durability.",
            },
            {
              title: "Trusted Partnerships",
              desc: "Transparent dealings and dedicated support build lasting client relationships.",
            },
          ].map((item, i) => (
            <div key={i} className="ab-feature-card">
              <h3 className="ab-feature-title">{item.title}</h3>
              <p className="ab-feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ab-cta">
        <h2 className="ab-heading">
          Ready to Find Your <span>Dream Property?</span>
        </h2>
        <p className="ab-text mx-auto" style={{ maxWidth: '42rem', }}>
          Let us help you invest in a property that offers comfort,
          growth, and long-term value.
        </p>

      </section>
    </div>
  );
};

export default About;