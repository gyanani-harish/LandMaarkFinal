 
 
import React from "react";
import Navbar from "../Navbar/Navbar";

 const ContactUs: React.FC = () => {
  const mapUrl = `https://www.google.com/maps?q=26.5395603,74.662056&output=embed`;
  return (
    <>
      <div
        className="w-full min-h-screen pt-24 sm:pt-28 md:pt-32
        bg-[radial-gradient(circle_at_top,_#1e293b,_#0f172a_40%,_#020617_100%)]
        text-white overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl" />

        {/* MAP SECTION */}
        <div className="relative w-full md:w-screen h-56 sm:h-72 md:h-[450px] right-0 md:right-10 overflow-hidden rounded-2xl md:rounded-2xl">
        <iframe
          title="Google Map of Location"
          src={mapUrl}
          className="absolute top-0 left-0 md:left-[20%] w-full md:w-250 h-full"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

        {/* MAIN CONTENT */}
        <main className="w-full px-4 sm:px-6 md:px-6 md:px-16 lg:px-32 py-12 sm:py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-20 items-start">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Let's Build Your
            <span className="block font-semibold text-amber-400">
              Luxury Future
            </span>
          </h2>

          <div className="mt-6 sm:mt-7 md:mt-8 h-[2px] w-20 sm:w-22 md:w-24 bg-gradient-to-r from-amber-400 to-transparent" />

          <p className="text-white/60 text-sm sm:text-base md:text-lg mt-6 sm:mt-7 md:mt-8 leading-relaxed max-w-xl">
            Speak with our private advisors and gain exclusive access to Dubai’s
            most prestigious real estate developments and off-market
            opportunities.
          </p>
        </div>

        {/* CONTACT FORM */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-7 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
          <form className="space-y-6 sm:space-y-7 md:space-y-8">

            {[
              {
                label: "Full Name",
                type: "text",
                placeholder: "Rahul",
              },
              {
                label: "Email",
                type: "email",
                placeholder: "rahul@gmail.com",
              },
              {
                label: "Phone",
                type: "tel",
                placeholder: "+91 4343422332",
              },
            ].map((field, index) => (
              <div key={index} className="space-y-3">
                <label className="text-xs tracking-[0.3em] uppercase text-amber-400">
                  {field.label}
                </label>

                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full text-xs sm:text-sm md:text-base bg-black/40 border border-white/10 rounded-2xl px-4 sm:px-4 md:px-5 py-3 sm:py-3 md:py-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 placeholder:text-white/40"
                />
              </div>
            ))}

            <div className="space-y-3">
              <label className="text-xs tracking-[0.3em] uppercase text-amber-400">
                Investment in Ajmer
              </label>



              <select className="w-full text-xs sm:text-sm md:text-base bg-black/40 border border-white/10 rounded-2xl px-4 sm:px-4 md:px-5 py-3 sm:py-3 md:py-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300">
                <option>PanchSheel</option>
                <option>Gulab Bari</option>
                <option>Gandhi Nagar</option>
                <option>Vashali Nagar</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-semibold py-2 sm:py-3 md:py-5 rounded-2xl tracking-[0.35em] uppercase text-xs md:text-xs shadow-[0_25px_60px_-10px_rgba(251,191,36,0.7)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
            >
              Request Private Call
            </button>

          </form>
        </div>

      </main>
      </div>
    </>
  );
};

export default ContactUs;
  