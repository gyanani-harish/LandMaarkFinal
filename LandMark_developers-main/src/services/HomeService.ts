import axios from "axios";
import { ApiConstants } from "../constants/ApiConstants";
import { Section3Item } from "../store/HomePage/Section3";
import { SectionItem } from "../store/HomePage/section";
import { Cards as Section5Item } from "../store/HomePage/Section5Card";
import { Section6Type as Section6Item } from "../store/HomePage/Section6Card";
import { Section7Type as Section7Item } from "../store/HomePage/section7Card";
import { Section8Type as Section8Item } from "../store/HomePage/section8Card";
import { Section9Type as Section9Item } from "../store/HomePage/section9Card";

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}

export interface FooterDetails {
  logoText: string;
  locations: Array<{
    city: string;
    address: string;
    phone: string;
  }>;
  socialLinks: Array<{
    platform: string;
    href: string;
  }>;
  websiteUrl: string;
  websiteHref: string;
  copyrightPattern: string;
}

export interface HomepageData {
  showEnquiryForm: boolean;
  hero: {
    title: string;
    slides: HeroSlide[];
  };
  section3: {
    title: string;
    items: Section3Item[];
  };
  section: {
    title: string;
    subtitle: string;
    items: SectionItem[];
  };
  section5: {
    title: string;
    subtitle: string;
    footerText: string;
    items: Section5Item[];
  };
  section6: {
    title: string;
    subtitle: string;
    items: Section6Item[];
  };
  section7: {
    title: string;
    subtitle: string;
    items: Section7Item[];
  };
  section8: {
    title: string;
    subtitle: string;
    videoUrl: string;
    items: Section8Item[];
  };
  section9: {
    title: string;
    items: Section9Item[];
  };
  footer: FooterDetails;
}

export const fetchHomepageData = async (): Promise<HomepageData> => {
  // 1. Try fetching from ngrok base API endpoint first
  try {
    const response = await axios.get(
      `${ApiConstants.API_BASE_URL}api/homepage`,
      { headers: ApiConstants.HEADERS }
    );
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.warn("Backend /api/homepage endpoint unavailable, falling back to static file...");
  }

  // 2. Fallback: Fetch from public static JSON structure
  try {
    const response = await axios.get("/data/homepage.json");
    return response.data;
  } catch (fallbackError) {
    console.error("Error fetching homepage static JSON:", fallbackError);
    
    // Ultimate fallback if network is completely down and static file cannot be resolved
    return {
      showEnquiryForm: true,
      hero: {
        title: "Hero Carousel",
        slides: [
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075",
            title: "LEGACY OF EXCELLENCE IN",
            titleHighlight: "LUXURY REAL ESTATE",
            subtitle: "CHOOSE FROM A RANGE OF APARTMENTS, VILLAS AND TOWNHOUSES"
          }
        ]
      },
      section3: {
        title: "FIND YOUR PERFECT HOME",
        items: []
      },
      section: {
        title: "WHY LandMaark PROPERTIES?",
        subtitle: "",
        items: []
      },
      section5: {
        title: "EXPLORE OUR ICONIC PROPERTIES",
        subtitle: "",
        footerText: "",
        items: []
      },
      section6: {
        title: "A WORLD OF LUXURY",
        subtitle: "",
        items: []
      },
      section7: {
        title: "CURATED COLLABORATIONS",
        subtitle: "",
        items: []
      },
      section8: {
        title: "EMPOWERING COMMUNITIES",
        subtitle: "",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        items: []
      },
      section9: {
        title: "WHY INVEST IN US?",
        items: []
      },
      footer: {
        logoText: "LandMaark",
        locations: [
          {
            city: "Ajmer LandMaark Properties",
            address: "Pushkar Bypass Rd, Ajmer",
            phone: "CALL NOW"
          }
        ],
        socialLinks: [],
        websiteUrl: "www.LandMaarkproperties.com",
        websiteHref: "https://damacproperties.com",
        copyrightPattern: "© {year} LandMaark Properties. All rights reserved."
      }
    };
  }
};
