// import React from "react";
// import "./Home.css";
// import SectionCard from "../../Components/HomePage/sectionCard3";
// import { sectionData } from "../../store/HomePage/section";
// import Section3Card from "../../Components/HomePage/Section2Card";
// import { Section3Data } from "../../store/HomePage/Section3";


// import Section5Card from "../../Components/HomePage/Section5Card";
// import { Section5Card as Section5Data } from "../../store/HomePage/Section5Card";
// import Section6Card from "../../Components/HomePage/Section6Card";
// import { Section6Data } from "../../store/HomePage/Section6Card";
// import useCarousel from "../../Hooks/useCarousel";

// import Section7Card from "../../Components/HomePage/Section7Card";
// import { Section7Data } from "../../store/HomePage/section7Card";
 
// import Section8Card from "../../Components/HomePage/Section8Card";
// import { Section8Data } from "../../store/HomePage/section8Card";
// import Section9Card from "../../Components/HomePage/section9Card";
// import { Section9Data } from "../../store/HomePage/section9Card";
 
// import AIPrompt from "../AIPrompt/AIPrompt";
// // Temporary form submission handler


// const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   console.log("Form Submitted");
// };

 
// const Home: React.FC = () => {
//   const currentIndex = useCarousel(Section6Data.length, 5000);

  
//   return (
     
//     <div className="-m-8">
    
      
//   {/* Desktop / Laptop UI */}
//   <section className="hidden md:block relative w-screen h-screen overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">

//     <div className="absolute inset-0">
//       <img
//         src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075"
//         alt="Luxury Dubai Property"
//         className="w-full h-full object-cover"
//       />
//       <div className="absolute inset-0 bg-black/40"></div>
//     </div>

//     <div className="absolute top-27 right-15 z-20 text-right">
//       <h2 className="text-2xl font-bold tracking-widest text-white">
//         LANDMAARK
//       </h2>
//     </div>

//     <div className="relative z-10 h-full flex items-center pl-10">
//       <div className="max-w-4xl text-left">
//         <h1 className="text-4xl font-bold leading-tight tracking-wide text-white">
//           LEGACY OF EXCELLENCE IN
//         </h1>

//         <h1 className="text-4xl font-bold leading-tight tracking-wide text-white">
//           LUXURY REAL ESTATE
//         </h1>

//         <p className="text-xs tracking-wide text-gray-200 mt-4">
//           CHOOSE FROM A RANGE OF APARTMENTS,
//           <br />
//           VILLAS AND TOWNHOUSES
//         </p>

//         <div className="mt-10">
//           <button
//             onClick={() =>
//               document
//                 .getElementById("enquiry-form")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//             className="rounded-btn"
//           >
//             ENQUIRE NOW
//           </button>
//         </div>
//       </div>

//       <AIPrompt />
//     </div>
//   </section>

//   {/* Mobile Hero Section */}
//   <section className="md:hidden relative w-full min-h-screen pt-12 overflow-hidden">
//     <div className="absolute inset-0">
//       <img
//         src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800"
//         alt="Luxury Dubai Property"
//         className="w-full h-full object-cover"
//       />
//       <div className="absolute inset-0 bg-black/50"></div>
//     </div>

//     <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center py-10">
//       <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-white mb-8 drop-shadow-lg">
//         LANDMAARK
//       </h2>
//       <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-wide text-white mb-4 drop-shadow-lg">
//         LEGACY OF EXCELLENCE IN LUXURY REAL ESTATE
//       </h1>

//       <p className="text-xs sm:text-sm tracking-wide text-gray-200 mb-8 drop-shadow-lg">
//         CHOOSE FROM A RANGE OF APARTMENTS, VILLAS AND TOWNHOUSES
//       </p>

//       <button
//         onClick={() =>
//           document
//             .getElementById("enquiry-form")
//             ?.scrollIntoView({ behavior: "smooth" })
//         }
//         className="rounded-btn text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3 mb-8 inline-flex"
//       >
//         ENQUIRE NOW
//       </button>

//       <div className="w-full max-w-sm mt-8">
//         <AIPrompt />
//       </div>
//     </div>
//   </section>

 
 

//      {/* Second Section */}
//       <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-gray-100 py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-32">
        
//         <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[3px] sm:tracking-[6px] font-serif text-teal-950 mb-8 md:mb-10">
//           FIND YOUR PERFECT HOME
//         </h2>

         
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
//           {Section3Data.map((item) => (
//             <Section3Card
//               key={item.id}
//               id={item.id}
//               image={item.image}
//               title={item.title}
//               price={item.price}
//             />
//           ))}
//         </div>

   
//         <div className="mt-12 md:mt-20">
//           <button className="rounded-btn text-sm sm:text-base">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="20"
//               height="20"
//               fill="currentColor"
//               viewBox="0 0 16 16"
//             >
//               <path d="M6.5 2a.5.5 0 0 1 .5.5V6h1V3.5a.5.5 0 0 1 1 0V6h1V4.5a.5.5 0 0 1 1 0V6h.5a2 2 0 0 1 2 2v1.5c0 2.5-2 4.5-4.5 4.5S4 12 4 9.5V6.5a.5.5 0 0 1 1 0V9a1 1 0 0 0 2 0V2.5a.5.5 0 0 1 .5-.5z" />
//             </svg>
//             VIEW MORE
//           </button>
//         </div>
//       </section>
//       {/* Third Section */}
        
//       <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#f5f2ec] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-32">
//         <div className="w-full px-2 sm:px-4 lg:px-20">
//           <div className="text-center mb-8 md:mb-10">
//             <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-teal-900 font-light">
//               WHY LandMaark PROPERTIES?
//             </h2>

//             <p className="mt-4 text-gray-700 max-w-5xl mx-auto leading-relaxed text-sm sm:text-base lg:text-lg">
//               Renowned for iconic developments and exceptional craftsmanship,
//               LandMaark Properties blends elegance, innovation, and world-class
//               amenities.
//             </p>
//           </div>

//            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
//             {sectionData.map((item, index) => (
//               <SectionCard
//                 key={index}
//                 title={item.title}
//                 description={item.description}
//               />
//             ))}
//           </div>

//          </div>
//       </section>

//       <section className="bg-[#f4f4f2] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-32">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-[2px] md:tracking-[3px] font-semibold text-[#1c3b2a] mb-6 md:mb-8">
//             EXPLORE OUR ICONIC PROPERTIES
//           </h2>

//           <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed mb-10 md:mb-16 text-xs sm:text-sm md:text-base">
//          LandMaark Properties is known for creating exceptional living spaces that combine luxury,
//           comfort, and timeless design. From elegant residential towers to thoughtfully planned communities, 
//           every LandMaark development reflects a commitment to quality craftsmanship and modern living.
//            Each property is designed to offer residents a refined lifestyle with outstanding amenities
//             and a sense of lasting value.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
//             {Section5Data.map((item) => (
//               <Section5Card key={item.id} property={item} />
//             ))}
//           </div>
//           <p className="mt-8 md:mt-10 text-xs sm:text-sm text-gray-600">
//             Explore LandMaark townhouses in Dubai, exquisite DAMAC villas, and
//             off-plan projects that redefine modern luxury. With flexible DAMAC
//             payment plans and prime locations, investing in DAMAC real estate
//             has never been more accessible.
//           </p>
//           <div className="mt-8 md:mt-10">
//              <button
//             onClick={() =>
//               document
//                 .getElementById("properties")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//             className="rounded-btn text-sm sm:text-base"
//           >
//             ENQUIRE NOW
//           </button>
//           </div>
//         </div>
//       </section>
      
       
//       <section className="bg-[#f6f3ee] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-32">
//         <div className="max-w-6xl mx-auto text-center">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[2px] md:tracking-[3px] font-semibold text-[#1c3b2a] mb-6 md:mb-8">
//             A WORLD OF LUXURY
//           </h2>

//           <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed mb-8 md:mb-10 text-xs sm:text-sm md:text-base">
//             Discover the finest in DAMAC Properties Dubai from expansive master
//             communities to exclusive designer branded residences through the
//             LandMaark Properties official website and experience extraordinary
//             living, effortlessly within your reach.
//           </p>

//           <div className="relative w-full h-80 sm:h-96 md:h-150 overflow-hidden">
//             {Section6Data.map((item, index) => (
//               <Section6Card
//                 key={item.id}
//                 item={item}
//                 isActive={index === currentIndex}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//       <section className="bg-white relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-32">
//         <div className="max-w-7xl mx-auto mb-8 md:mb-10 mt-1 text-center">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[4px] md:tracking-[6px] font-semibold text-[#1c3b2a] mb-6 md:mb-8">
//             CURATED COLLABORATIONS
//           </h2>

//           <p className="max-w-4xl mx-auto text-gray-600 text-xs sm:text-sm md:text-lg leading-relaxed mb-10 md:mb-16">
//             LandMaark Properties brings new and exciting living concepts to life,
//             with superior designs and details, by working with the finest
//             designers and partnering with some of the most prestigious fashion
//             and lifestyle brands.
//           </p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             {Section7Data.map((item) => (
//               <Section7Card key={item.id} item={item} />
//             ))}
//           </div>
//         </div>
//       </section>
//       <section className="bg-[#f4f1ea] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen  py-5 px-4 md:px-32">
//         <div className="max-w-8xl mx-auto text-center">
//           <h2 className="text-4xl md:text-5xl tracking-[6px] font-semibold text-[#0d2c24] mb-8">
//             EMPOWERING COMMUNITIES, BUILDING FUTURES
//           </h2>

//           <p className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed mb-16">
//             The LandMaark Properties Foundation is a testament to our commitment
//             to creating a positive impact. From supporting the One Million Arab
//             Coders Initiative to our sustainability efforts, we believe in
//             building a better tomorrow. Discover how we’re making a difference,
//             one initiative at a time.
//           </p>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 items-center">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//               {Section8Data.map((item) => (
//                 <Section8Card key={item.id} item={item} />
//               ))}
//             </div>

//             <div className="aspect-video  overflow-hidden shadow-lg">
//               <iframe
//                 className="w-full h-full"
//                 src="https://www.youtube.com/embed/dQw4w9WgXcQ"
//                 title="LandMaark Properties"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="bg-white relative py-8 sm:py-10 md:py-20 px-4 sm:px-6 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-center text-3xl sm:text-4xl md:text-5xl tracking-[4px] md:tracking-[6px] font-semibold text-[#0d2c24] mb-10 md:mb-16">
//             WHY INVEST IN US?
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
//             {Section9Data.map((item) => (
//               <Section9Card key={item.id} item={item} />
//             ))}
//           </div>
//         </div>
//       </section>
//  <> 
//       <section id="enquiry-form" className="hidden md:block w-full bg-[#f4f1ec]">

//   <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 -mt-10">

//     {/* Left Text */}
//     <div className="px-6 sm:px-12 md:px-16 py-12 md:py-20 flex flex-col justify-center">
//       <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-wide text-[#0d2c24] leading-snug mb-8 md:mb-12">
//         Where Luxury Meets Legacy
//       </h2>

//       <p className="max-w-xl text-gray-600 text-sm md:text-base leading-relaxed">
//         Discover the perfect blend of luxury and legacy at LandMaark Properties.
//       </p>
//     </div>

//     {/* Form */}
//     <div className="bg-[#dedede] px-6 sm:px-12 md:px-16 py-12 md:py-20">

//       <h3 className="text-2xl sm:text-3xl text-left tracking-wide text-[#2f3e46] border-b-2 border-[#2f3e46] inline-block mb-4">
//         DISCOVER YOUR NEXT ADDRESS
//       </h3>

//       <p className="text-xs sm:text-sm text-gray-600 mb-6 md:mb-10">
//         *All fields are compulsory
//       </p>

//       <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>

//         <input
//           type="text"
//           placeholder="First Name *"
//           required
//           className="w-full bg-transparent border-b border-gray-500 py-2 text-sm focus:outline-none"
//         />

//         <input
//           type="email"
//           placeholder="Email *"
//           required
//           className="w-full bg-transparent border-b border-gray-500 py-2 text-sm focus:outline-none"
//         />

//         <input
//           type="tel"
//           placeholder="+91 Phone *"
//           required
//           className="w-full bg-transparent border-b border-gray-500 py-2 text-sm focus:outline-none"
//         />

//         <textarea
//           rows={4}
//           placeholder="Write your comments..."
//           className="w-full border border-gray-400 rounded-lg p-3 text-sm focus:outline-none"
//         />

//         <button className="rounded-btn text-sm">
//           Get a call back!
//         </button>

//       </form>
//     </div>

//   </div>

//   <div className="bg-[#e6e6e6] py-8 md:py-10">
//     <h2 className="text-4xl md:text-6xl text-gray-500 px-6 md:px-20 font-light">
//       Live the luxury
//     </h2>
//   </div>

// </section>
//   <section className="md:hidden w-full bg-[#f4f1ec] px-4 sm:px-6 py-12 sm:py-16">

//   <h2 className="text-2xl font-serif text-[#0d2c24] mb-4">
//     Where Luxury Meets Legacy
//   </h2>

//   <p className="text-gray-600 text-xs sm:text-sm mb-8">
//     Discover the perfect blend of luxury and legacy at LandMaark Properties.
//   </p>

//   <div className="bg-[#dedede] p-4 sm:p-6 rounded-lg">

//     <h3 className="text-lg sm:text-xl text-[#2f3e46] border-b border-[#2f3e46] inline-block mb-4">
//       DISCOVER YOUR NEXT ADDRESS
//     </h3>

//     <p className="text-xs text-gray-600 mb-6">
//       *All fields are compulsory
//     </p>

//     <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>

//       <input
//         type="text"
//         placeholder="First Name *"
//         required
//         className="w-full bg-transparent border-b border-gray-500 py-2 text-xs focus:outline-none"
//       />

//       <input
//         type="email"
//         placeholder="Email *"
//         required
//         className="w-full bg-transparent border-b border-gray-500 py-2 text-xs focus:outline-none"
//       />

//       <input
//         type="tel"
//         placeholder="+91 Phone *"
//         required
//         className="w-full bg-transparent border-b border-gray-500 py-2 text-xs focus:outline-none"
//       />

//       <textarea
//         rows={4}
//         placeholder="Write your comments..."
//         className="w-full border border-gray-400 rounded-lg p-3 text-xs focus:outline-none"
//       />

//       <button className="rounded-btn w-full text-xs sm:text-sm">
//         Get a call back!
//       </button>

//     </form>
//   </div>

//   <div className="bg-[#e6e6e6] py-6 sm:py-8 mt-8">
//     <h2 className="text-2xl sm:text-3xl text-gray-500 font-light px-4">
//       Live the luxury
//     </h2>
//   </div>

// </section>
// </>
//     </div>
//   );
// };

// export default Home;






 
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
import useCarousel from "../../Hooks/useCarousel";

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
     
    <div className="w-full">
    
      
  {/* Desktop / Laptop UI */}
  <section className="hidden md:block relative w-full h-screen overflow-hidden">

    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075"
        alt="Luxury Dubai Property"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
    </div>

    <div className="absolute top-27 right-15 z-20 text-right">
      <h2 className="text-2xl font-bold tracking-widest text-white">
        LANDMAARK
      </h2>
    </div>

    <div className="relative z-10 h-full flex items-center pl-10">
      <div className="max-w-4xl text-left">
        <h1 className="text-4xl font-bold leading-tight tracking-wide text-white">
          LEGACY OF EXCELLENCE IN
        </h1>

        <h1 className="text-4xl font-bold leading-tight tracking-wide text-white">
          LUXURY REAL ESTATE
        </h1>

        <p className="text-xs tracking-wide text-gray-200 mt-4">
          CHOOSE FROM A RANGE OF APARTMENTS,
          <br />
          VILLAS AND TOWNHOUSES
        </p>

        <div className="mt-10">
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

  {/* Mobile Hero Section */}
  <section className="md:hidden relative w-full min-h-screen pt-12 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800"
        alt="Luxury Dubai Property"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50"></div>
    </div>

    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center py-10">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-white mb-8 drop-shadow-lg">
        LANDMAARK
      </h2>
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-wide text-white mb-4 drop-shadow-lg">
        LEGACY OF EXCELLENCE IN LUXURY REAL ESTATE
      </h1>

      <p className="text-xs sm:text-sm tracking-wide text-gray-200 mb-8 drop-shadow-lg">
        CHOOSE FROM A RANGE OF APARTMENTS, VILLAS AND TOWNHOUSES
      </p>

      <button
        onClick={() =>
          document
            .getElementById("enquiry-form")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="rounded-btn text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3 mb-8 inline-flex"
      >
        ENQUIRE NOW
      </button>

      <div className="w-full max-w-sm mt-8">
        <AIPrompt />
      </div>
    </div>
  </section>

 
 

     {/* Second Section */}
      <section className="relative w-full bg-gray-100 py-12 md:py-20 px-6 md:px-12 lg:px-24">
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[3px] sm:tracking-[6px] font-serif text-teal-950 mb-8 md:mb-10">
          FIND YOUR PERFECT HOME
        </h2>

         
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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

   
        <div className="mt-12 md:mt-20">
          <button className="rounded-btn text-sm sm:text-base">
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
        
      <section className="relative w-full bg-[#f5f2ec] py-12 md:py-20 px-6 md:px-12 lg:px-24">
        <div className="w-full px-2 sm:px-4 lg:px-20">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-teal-900 font-light">
              WHY LandMaark PROPERTIES?
            </h2>

            <p className="mt-4 text-gray-700 max-w-5xl mx-auto leading-relaxed text-sm sm:text-base lg:text-lg">
              Renowned for iconic developments and exceptional craftsmanship,
              LandMaark Properties blends elegance, innovation, and world-class
              amenities.
            </p>
          </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
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

      <section className="bg-[#f4f4f2] relative w-full py-12 md:py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-[2px] md:tracking-[3px] font-semibold text-[#1c3b2a] mb-6 md:mb-8">
            EXPLORE OUR ICONIC PROPERTIES
          </h2>

          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed mb-10 md:mb-16 text-xs sm:text-sm md:text-base">
         LandMaark Properties is known for creating exceptional living spaces that combine luxury,
          comfort, and timeless design. From elegant residential towers to thoughtfully planned communities, 
          every LandMaark development reflects a commitment to quality craftsmanship and modern living.
           Each property is designed to offer residents a refined lifestyle with outstanding amenities
            and a sense of lasting value.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
            {Section5Data.map((item) => (
              <Section5Card key={item.id} property={item} />
            ))}
          </div>
          <p className="mt-8 md:mt-10 text-xs sm:text-sm text-gray-600">
            Explore LandMaark townhouses in Dubai, exquisite DAMAC villas, and
            off-plan projects that redefine modern luxury. With flexible DAMAC
            payment plans and prime locations, investing in DAMAC real estate
            has never been more accessible.
          </p>
          <div className="mt-8 md:mt-10">
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
      
       
      <section className="bg-[#f6f3ee] relative w-full py-12 md:py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[2px] md:tracking-[3px] font-semibold text-[#1c3b2a] mb-6 md:mb-8">
            A WORLD OF LUXURY
          </h2>

          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed mb-8 md:mb-10 text-xs sm:text-sm md:text-base">
            Discover the finest in DAMAC Properties Dubai from expansive master
            communities to exclusive designer branded residences through the
            LandMaark Properties official website and experience extraordinary
            living, effortlessly within your reach.
          </p>

          <div className="relative w-full h-80 sm:h-96 md:h-150 overflow-hidden">
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
      <section className="bg-white relative w-full py-12 md:py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto mb-8 md:mb-10 mt-1 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-[4px] md:tracking-[6px] font-semibold text-[#1c3b2a] mb-6 md:mb-8">
            CURATED COLLABORATIONS
          </h2>

          <p className="max-w-4xl mx-auto text-gray-600 text-xs sm:text-sm md:text-lg leading-relaxed mb-10 md:mb-16">
            LandMaark Properties brings new and exciting living concepts to life,
            with superior designs and details, by working with the finest
            designers and partnering with some of the most prestigious fashion
            and lifestyle brands.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Section7Data.map((item) => (
              <Section7Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f4f1ea] relative w-full py-12 md:py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-8xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl tracking-[6px] font-semibold text-[#0d2c24] mb-8">
            EMPOWERING COMMUNITIES, BUILDING FUTURES
          </h2>

          <p className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed mb-16">
            The LandMaark Properties Foundation is a testament to our commitment
            to creating a positive impact. From supporting the One Million Arab
            Coders Initiative to our sustainability efforts, we believe in
            building a better tomorrow. Discover how we’re making a difference,
            one initiative at a time.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Section8Data.map((item) => (
                <Section8Card key={item.id} item={item} />
              ))}
            </div>

            <div className="aspect-video  overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="LandMaark Properties"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white relative py-8 sm:py-10 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl tracking-[4px] md:tracking-[6px] font-semibold text-[#0d2c24] mb-10 md:mb-16">
            WHY INVEST IN US?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {Section9Data.map((item) => (
              <Section9Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
 <> 
      <section id="enquiry-form" className="hidden md:block w-full bg-[#f4f1ec]">

  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 -mt-10">

    {/* Left Text */}
    <div className="px-6 sm:px-12 md:px-16 py-12 md:py-20 flex flex-col justify-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-wide text-[#0d2c24] leading-snug mb-8 md:mb-12">
        Where Luxury Meets Legacy
      </h2>

      <p className="max-w-xl text-gray-600 text-sm md:text-base leading-relaxed">
        Discover the perfect blend of luxury and legacy at LandMaark Properties.
      </p>
    </div>

    {/* Form */}
    <div className="bg-[#dedede] px-6 sm:px-12 md:px-16 py-12 md:py-20">

      <h3 className="text-2xl sm:text-3xl text-left tracking-wide text-[#2f3e46] border-b-2 border-[#2f3e46] inline-block mb-4">
        DISCOVER YOUR NEXT ADDRESS
      </h3>

      <p className="text-xs sm:text-sm text-gray-600 mb-6 md:mb-10">
        *All fields are compulsory
      </p>

      <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="First Name *"
          required
          className="w-full bg-transparent border-b border-gray-500 py-2 text-sm focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email *"
          required
          className="w-full bg-transparent border-b border-gray-500 py-2 text-sm focus:outline-none"
        />

        <input
          type="tel"
          placeholder="+91 Phone *"
          required
          className="w-full bg-transparent border-b border-gray-500 py-2 text-sm focus:outline-none"
        />

        <textarea
          rows={4}
          placeholder="Write your comments..."
          className="w-full border border-gray-400 rounded-lg p-3 text-sm focus:outline-none"
        />

        <button className="rounded-btn text-sm">
          Get a call back!
        </button>

      </form>
    </div>

  </div>

  <div className="bg-[#e6e6e6] py-8 md:py-10">
    <h2 className="text-4xl md:text-6xl text-gray-500 px-6 md:px-20 font-light">
      Live the luxury
    </h2>
  </div>

</section>
  <section className="md:hidden w-full bg-[#f4f1ec] px-4 sm:px-6 py-12 sm:py-16">

  <h2 className="text-2xl font-serif text-[#0d2c24] mb-4">
    Where Luxury Meets Legacy
  </h2>

  <p className="text-gray-600 text-xs sm:text-sm mb-8">
    Discover the perfect blend of luxury and legacy at LandMaark Properties.
  </p>

  <div className="bg-[#dedede] p-4 sm:p-6 rounded-lg">

    <h3 className="text-lg sm:text-xl text-[#2f3e46] border-b border-[#2f3e46] inline-block mb-4">
      DISCOVER YOUR NEXT ADDRESS
    </h3>

    <p className="text-xs text-gray-600 mb-6">
      *All fields are compulsory
    </p>

    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="First Name *"
        required
        className="w-full bg-transparent border-b border-gray-500 py-2 text-xs focus:outline-none"
      />

      <input
        type="email"
        placeholder="Email *"
        required
        className="w-full bg-transparent border-b border-gray-500 py-2 text-xs focus:outline-none"
      />

      <input
        type="tel"
        placeholder="+91 Phone *"
        required
        className="w-full bg-transparent border-b border-gray-500 py-2 text-xs focus:outline-none"
      />

      <textarea
        rows={4}
        placeholder="Write your comments..."
        className="w-full border border-gray-400 rounded-lg p-3 text-xs focus:outline-none"
      />

      <button className="rounded-btn w-full text-xs sm:text-sm">
        Get a call back!
      </button>

    </form>
  </div>

  <div className="bg-[#e6e6e6] py-6 sm:py-8 mt-8">
    <h2 className="text-2xl sm:text-3xl text-gray-500 font-light px-4">
      Live the luxury
    </h2>
  </div>

</section>
</>
    </div>
  );
};

export default Home;






 