import axios from "axios";
import { ApiConstants } from "../constants/ApiConstants";
import { ApiEndPoints } from "../constants/ApiEndpoints";
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
  logoText?: string;
  locations?: Array<{
    city: string;
    address: string;
    phone: string;
  }>;
  socialLinks?: Array<{
    platform: string;
    href: string;
  }>;
  websiteUrl?: string;
  websiteHref?: string;
  copyrightPattern?: string;
}

let homepageDataPromise: Promise<HomepageData> | null = null;

export const fetchHomepageData = (): Promise<HomepageData> => {
  if (homepageDataPromise) {
    return homepageDataPromise;
  }

  homepageDataPromise = (async () => {
    // Try fetching from live backend API first
    try {
      const response = await axios.get(
        `${ApiConstants.API_BASE_URL}${ApiEndPoints.HomePageData}`,
        { headers: ApiConstants.HEADERS }
      );
      if (response.data) {
        const data = response.data.data || response.data;
        if (data.footer) {
          if (data.websiteUrl && !data.footer.websiteUrl) {
            data.footer.websiteUrl = data.websiteUrl;
          }
          if (data.websiteHref && !data.footer.websiteHref) {
            data.footer.websiteHref = data.websiteHref;
          }
        }
        return data;
      }
    } catch (error) {
      console.error("Backend /api/home unavailable:", error);
    }

    // Return clean, minimal structure if API is down
    return {
      showEnquiryForm: false,
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
        copyrightPattern: "© {year} LandMaark Properties. All rights reserved."
      }
    };
  })();

  return homepageDataPromise;
};
