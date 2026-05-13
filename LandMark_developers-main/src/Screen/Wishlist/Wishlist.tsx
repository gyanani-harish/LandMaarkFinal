 
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";

// import WishlistHeader from "../../Components/Wishlist/WishlistHeader";
// import WishlistCard from "../../Components/Wishlist/WishlistCard";
// import { propertiesData } from "../../store/Properties/propertiesData"

// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState<number[]>([]);
//   const [hoveredId, setHoveredId] = useState<number | null>(null);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   useEffect(() => {
//     const saved = Cookies.get("wishlist");
//     if (saved) setWishlist(JSON.parse(saved));
//   }, []);

//   const selectedProperties = propertiesData.filter((p) =>
//     wishlist.includes(p.id),
//   );

//   const removeFromWishlist = (id: number) => {
//     const updated = wishlist.filter((item) => item !== id);
//     setWishlist(updated);
//     Cookies.set("wishlist", JSON.stringify(updated), { expires: 7 });
//   };

//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
//     );
//   };

//   const selectAll = () => {
//     if (selectedIds.length === selectedProperties.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(selectedProperties.map((p) => p.id));
//     }
//   };

//   const clearWishlist = () => {
//     setWishlist([]);
//     Cookies.set("wishlist", JSON.stringify([]), { expires: 7 });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 mt-16 via-white to-amber-50/30">
//       <WishlistHeader
//         total={selectedProperties.length}
//         selectedCount={selectedIds.length}
//         onSelectAll={selectAll}
//         onClear={clearWishlist}
//       />

//       <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {selectedProperties.map((property) => (
//           <WishlistCard
//             key={property.id}
//             property={property}
//             selected={selectedIds.includes(property.id)}
//             hovered={hoveredId === property.id}
//             onHover={() => setHoveredId(property.id)}
//             onLeave={() => setHoveredId(null)}
//             onSelect={() => toggleSelect(property.id)}
//             onRemove={() => removeFromWishlist(property.id)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;

// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { fetchProperties, CityProperty } from "../../services/services";
// import WishlistCard from "../../Components/Wishlist/WishlistCard";
// import WishlistHeader from "../../Components/Wishlist/WishlistHeader";
// import { Heart } from "lucide-react";
// const Wishlist = () => {
//   const navigate = useNavigate();
//   const [allProperties, setAllProperties] = useState<CityProperty[]>([]);
//   const [wishlistIds, setWishlistIds] = useState<number[]>([]);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [hoveredId, setHoveredId] = useState<number | null>(null);

//   // Fetch all properties from API
//   useEffect(() => {
//     const loadProperties = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchProperties();
//         setAllProperties(data || []);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching properties:', err);
//         setError('Failed to load properties');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProperties();
//   }, []);

//   // Load wishlist from cookies
//   useEffect(() => {
//     const saved = Cookies.get("wishlist");
//     if (saved) {
//       const wishlistArray = JSON.parse(saved);
//       setWishlistIds(wishlistArray);
//     }
//   }, []);

//   // Get wishlist properties
//   const wishlistProperties = allProperties.filter(property => 
//     wishlistIds.includes(property.id)
//   );

//   const handleSelect = (id: number) => {
//     setSelectedIds(prev => 
//       prev.includes(id) 
//         ? prev.filter(selectedId => selectedId !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedIds.length === wishlistProperties.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(wishlistProperties.map(p => p.id));
//     }
//   };

//   const handleRemove = (id: number) => {
//     const updatedWishlist = wishlistIds.filter(wishlistId => wishlistId !== id);
//     setWishlistIds(updatedWishlist);
//     Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
    
//     // Also remove from selected if it was selected
//     setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
//   };

//   const handleClearAll = () => {
//     setWishlistIds([]);
//     setSelectedIds([]);
//     Cookies.set("wishlist", JSON.stringify([]), { expires: 7 });
//   };

//   const handleCardClick = (id: number) => {
//     navigate(`/property/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
//           <p className="mt-4 text-amber-600">Loading your wishlist...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-amber-50/30">
//       <WishlistHeader 
//         total={wishlistProperties.length}
//         selectedCount={selectedIds.length}
//         onSelectAll={handleSelectAll}
//         onClear={handleClearAll}
//       />

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {wishlistProperties.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 rounded-full mb-6">
//               <Heart className="w-12 h-12 text-amber-400" />
//             </div>
//             <h2 className="text-2xl font-light text-amber-800 mb-2">
//               Your wishlist is empty
//             </h2>
//             <p className="text-amber-600 mb-6">
//               Start adding properties you love by clicking the heart icon
//             </p>
//             <button
//               onClick={() => navigate('/properties')}
//               className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
//             >
//               Browse Properties
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {wishlistProperties.map((property) => (
//               <WishlistCard
//                 key={property.id}
//                 property={property}
//                 selected={selectedIds.includes(property.id)}
//                 hovered={hoveredId === property.id}
//                 onHover={() => setHoveredId(property.id)}
//                 onLeave={() => setHoveredId(null)}
//                 onSelect={() => handleSelect(property.id)}
//                 onRemove={() => handleRemove(property.id)}
//                 onClick={() => handleCardClick(property.id)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;


import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { fetchProperties, CityProperty } from "../../services/services";
import WishlistCard from "../../Components/Wishlist/WishlistCard";
import WishlistHeader from "../../Components/Wishlist/WishlistHeader";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState<CityProperty[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Fetch all properties from API
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const data = await fetchProperties();
        setAllProperties(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Load wishlist from cookies
  useEffect(() => {
    const saved = Cookies.get("wishlist");
    if (saved) {
      const wishlistArray = JSON.parse(saved);
      setWishlistIds(wishlistArray);
    }
  }, []);

  // Get wishlist properties
  const wishlistProperties = allProperties.filter(property => 
    wishlistIds.includes(property.id)
  );

  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === wishlistProperties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(wishlistProperties.map(p => p.id));
    }
  };

  const handleRemove = (id: number) => {
    const updatedWishlist = wishlistIds.filter(wishlistId => wishlistId !== id);
    setWishlistIds(updatedWishlist);
    Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
    
    // Also remove from selected if it was selected
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const handleClearAll = () => {
    setWishlistIds([]);
    setSelectedIds([]);
    Cookies.set("wishlist", JSON.stringify([]), { expires: 7 });
  };

  const handleCardClick = (id: number) => {
    navigate(`/property/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-12 bg-amber-50/30 text-black overflow-hidden">
      <WishlistHeader 
        total={wishlistProperties.length}
        selectedCount={selectedIds.length}
        onSelectAll={handleSelectAll}
        onClear={handleClearAll}
      />

      {wishlistProperties.length === 0 ? (
        <div className="flex-1 flex relative  left-1/2 -m-8  right-1/2 -ml-[50vw] -mr-[50vw] w-screen min-h-screen
      text-white overflow-hidden items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 rounded-full mb-6">
              <Heart className="w-12 h-12 text-amber-400" />
            </div>
            <h2 className="text-2xl font-light text-amber-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-amber-600 mb-6">
              Start adding properties you love by clicking the heart icon
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-amber-600 text-amber-800 font-semibold rounded-lg hover:bg-amber-700 transition"
            >
              Browse Properties
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProperties.map((property) => (
              <WishlistCard
                key={property.id}
                property={property}
                selected={selectedIds.includes(property.id)}
                hovered={hoveredId === property.id}
                onHover={() => setHoveredId(property.id)}
                onLeave={() => setHoveredId(null)}
                onSelect={() => handleSelect(property.id)}
                onRemove={() => handleRemove(property.id)}
                onClick={() => handleCardClick(property.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;