import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslation } from "../../hooks/useTranslation";
import { Township } from "../../store/TownShip/TownshipTypes";
import TownshipCard from "../../Components/TownShip/TownshipCard";
import { useTownships } from "../../hooks/useTownships";
import "./township.css";
import "../../Screen/PropertyPageDetails/PropertyDetailPage.css";

const LOTTIE_SRC =
  "https://assets-v2.lottiefiles.com/a/358e0c5e-1176-11ee-8663-8f76e1809294/JmwXG8XzU7.lottie";

const TownShip: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { townships, loading, error, retry } = useTownships();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openCity = (item: Township) => {
    navigate(`/property/${item.township_id}`);
  };

  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  if (loading) {
    return (
      <div className="error-wrapper-premium">
        <div className="error-content-premium">
          <div className="lottie-container-premium">
            <div className="lottie-player-premium">
              <DotLottieReact src={LOTTIE_SRC} loop autoplay />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-wrapper-premium">
        <div className="error-content-premium">
          <div className="lottie-container-premium">
            <div className="lottie-player-premium">
              <DotLottieReact src={LOTTIE_SRC} loop autoplay />
            </div>
          </div>
          <h1 className="error-title-premium">{t("errors.failedToLoadTownships")}</h1>
          <p className="error-subtitle-premium">
            {t("errors.serverUnavailable")}
          </p>
          <button onClick={retry} className="error-back-btn-premium">
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="townships-page-container">
      <div className="townships-grid-wrapper">
        <div className="townships-grid">
          {townships.map((item) => (
            <TownshipCard
              key={item.township_id || item.id}
              item={item}
              onSelect={openCity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TownShip;