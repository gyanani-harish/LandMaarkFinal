import { Routes, Route } from "react-router-dom";
import Navbar from "./Screen/Navbar/Navbar";
import Home from "./Screen/Home/Home";
import About from "./Screen/About/About";
import "./App.css";
import Footer from "./Screen/Footer/Footer";
import ContactUs from "./Screen/Contact_Us/ContactUs";
import Properties from "./Screen/Properties/Properties";
import Wishlist from "./Screen/Wishlist/Wishlist";
import TownShip from "./Screen/TownShip/TownShip";
import PropertySearch from "./Screen/Seaching/PropertySearch";
import PropertyDetailPage from "./Screen/PropertyPageDetails/PropertyDetailPage";
import PropertySearch2 from "./Screen/Searching2/PropertySearch2";
import PropertyListings from "./Components/property/CardsDetails/PropertyListings";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/townShip" element={<TownShip />} />
        <Route path="/search" element={<PropertySearch />} />
        <Route path="/search2/:id" element={<PropertySearch2 />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/property-listings" element={<PropertyListings />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;

