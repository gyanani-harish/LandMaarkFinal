
import { useState } from "react";
import "./AIPrompt.css";
import { useNavigate } from "react-router-dom";

const AIPrompt = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!query.trim()) {
      alert("Please enter something");
      return;
    }

    setLoading(true);

    try {
      const url = `/api/propSearch/ai?query=${encodeURIComponent(query)}`;
      console.log("🤖 AI Search URL:", url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! ${res.status}`);
      }

      const json = await res.json();
      console.log("🤖 AI Response:", json);

      const result = json?.data || json;

      if (!result || (Array.isArray(result) && result.length === 0)) {
        alert("No results found");
        return;
      }

      const formattedData = (Array.isArray(result) ? result : [result]).map(
        (item: any, index: number) => ({
          property_id: item?.id || item?.property_id || index,
          title: item?.title || item?.name || "No Title",
          image: item?.image || "",
          price: item?.price || item?.budget || "0",
          location: item?.location || item?.city || "Unknown",
          bhk: item?.bhk || 2,
          property_type: item?.property_type || "Apartment",
          construction_status: item?.status || item?.construction_status || "Ready",
          area_sqft: item?.area || item?.area_sqft || 1000,
        })
      );

      console.log("🤖 Formatted AI Results:", formattedData);

      navigate("/search", {
        state: { aiResults: formattedData },
      });

    } catch (error) {
      console.error("❌ Error fetching AI data:", error);
      alert("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-floating-bar" style={{ display: "none" }}>
      <input
        className="ai-input"
        type="text"
        placeholder="I want to buy 2bhk in Ajmer for around 1 crore"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchData()}
      />
      <button
        className="generate-btn"
        onClick={fetchData}
        disabled={loading}
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};

export default AIPrompt;