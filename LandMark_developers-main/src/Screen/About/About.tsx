 
 import React from "react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    // <div className="bg-white max-w-7xl mx-auto -mt-8 min-h-screen">
<div className="bg-white pt-24 min-h-screen">
  <section className="relative h-[80vh] flex items-center justify-center text-center text-white">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-light mb-6">
            About <span className="font-bold">LANDMAARK DEVELOPERS</span>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            Building Trust. Creating Landmaarks. Delivering Excellence in Real Estate.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-28 px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .6 }}
          >
            <span className="text-sm tracking-widest text-gray-800 block mb-3">
              ESTABLISHED
            </span>

            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Who <span className="font-bold">We Are</span>
            </h2>

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              LaandMark Developers was founded with a vision to transform
              property aspirations into reality. We specialize in premium
              residential and commercial developments designed to deliver
              long-term value and modern living experiences.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              With a strong commitment to quality construction, transparency,
              and customer satisfaction, we help clients confidently invest,
              buy, and build their future.
            </p>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .6 }}
            className="relative group"
          >
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
              className="rounded-xl shadow-2xl w-full h-[420px] object-cover"
            />

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition rounded-xl"></div>
          </motion.div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 bg-gray-50 px-6 md:px-20">

        <div className="text-center mb-20">
          <span className="text-sm tracking-widest text-gray-400 block mb-3">
            OUR ADVANTAGE
          </span>

          <h2 className="text-4xl md:text-5xl font-light mb-6">
            What Makes Us <span className="font-bold">Different</span>
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            In a competitive real estate market, we stand out through strategic planning,
            premium quality, and long-term client relationships.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">

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
            <div
              key={i}
              className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-black"
            >
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
<section className="py-28 text-center bg-[#f5f2ec] text-black px-6">
        <h2 className="text-4xl md:text-5xl font-light mb-6">
          Ready to Find Your <span className="font-bold">Dream Property?</span>
        </h2>

<p className="max-w-2xl mx-auto mb-10 text-gray-900">          Let us help you invest in a property that offers comfort,
          growth, and long-term value.
        </p>

        <button className="px-12 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
          Contact Us Today
        </button>

      </section>

    </div>
  );
};

export default About;