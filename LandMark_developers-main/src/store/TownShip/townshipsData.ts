export interface Property {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface Township {
  id?: number;
  township_id?: number;
  city?: string;
  name?: string;
  image?: string | null;
  images?: string[];
  properties?: Property[];
  description?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  total_area_acres?: string;
  created_at?: string;
  property_count?: number;
}

// export const townshipData: Township[] = [
//   {
//     id: 1,
//     city: "Ajmer",
//     image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
//     description:
//           "A beautifully designed modern villa located in Ajmer.",
//     properties: [
//       {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
//         title: "Modern Villa Ajmer",
//         description:
//           "A beautifully designed modern villa.",
//       },
//       {
//         id: 2,
//         image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
//         title: "Luxury House Ajmer",
//         description:
//           "Luxury independent house in Ajmer.",
//       },
//       {
//         id: 3,
//         image: "https://cdn.britannica.com/05/157305-004-53D5D212.jpg",
//         title: "Ajmer Township House",
//         description:
//           "Modern township home in Ajmer.",
//       },
//     ],
//   },

//   {
//     id: 2,
//     city: "Jaipur",
//     image: "https://images.unsplash.com/photo-1599423300746-b62533397364",
//      description:
//           "A beautifully designed modern villa located in Ajmer with spacious rooms.",
//     properties: [
//       {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
//         title: "Jaipur Pink Villa",
//         description:
//           "Premium villa in Jaipur.",
//       },
//       {
//         id: 2,
//         image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126",
//         title: "Jaipur Modern Home",
//         description:
//           "A stylish modern home located in jaipur.",
//       },
//       {
//         id: 3,
//         image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
//         title: "Jaipur Bungalow",
//         description:
//           "Spacious bungalow in Jaipur with elegant design.",
//       },
//     ],
//   },

//   {
//     id: 3,
//     city: "Udaipur",
//     image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
//      description:
//           "A beautifully designed modern villa located in Ajmer with spacious rooms, garden area.",
//     properties: [
//       {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1560448075-bb485b067938",
//         title: "Lake View Villa",
//         description:
//           "Luxury lake-facing villa in Udaipur.",
//       },
//       {
//         id: 2,
//         image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
//         title: "Udaipur Luxury Home",
//         description:
//           "Premium luxury home in Udaipur.",
//       },
//       {
//         id: 3,
//         image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
//         title: "Udaipur Royal House",
//         description:
//           "Royal-style house in Udaipur .",
//       },
//     ],
//   },

//   {
//     id: 4,
//     city: "Kota",
//     image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
//      description:
//           "A beautifully designed modern villa located and premium interior finishes.",
//     properties: [
//       {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1560184897-ae75f418493e",
//         title: "Kota Modern House",
//         description:
//           "Modern residential house in Kota.",
//       },
//       {
//         id: 2,
//         image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
//         title: "Kota Family Villa",
//         description:
//           "Family-friendly villa in Kota with rooms.",
//       },
//       {
//         id: 3,
//         image: "https://images.unsplash.com/photo-1600566752227-8f0b0e62fce6",
//         title: "Kota Smart Home",
//         description:
//           "Smart home in Kota equipped with technology.",
//       },
//     ],
//   },
// ];