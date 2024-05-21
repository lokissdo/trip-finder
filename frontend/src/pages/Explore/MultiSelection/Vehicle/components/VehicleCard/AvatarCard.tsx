import React from "react";
import {
  BambooAirway,
  VietJet,
  VietnamAirline,
  VietravelAirline,
} from "../../../../../../assets/Flight";

const AvatarCard: React.FC<{ brand: string }> = ({ brand }) => {
  return (
    <>
      {brand === "Vietravel Airlines" ? (
        <img src={VietravelAirline} className="mt-2" width={100} height={100} />
      ) : brand === "VietJet Air" ? (
        <img src={VietJet} className="mt-2" width={100} height={100} />
      ) : brand === "Bamboo Airways" ? (
        <img src={BambooAirway} className="mt-2" width={100} height={100} />
      ) : brand === "Vietnam Airlines" ? (
        <img src={VietnamAirline} className="mt-2" width={100} height={100} />
      ) : (
        <div className="font-semibold mt-2 text-gray-600">{brand}</div>
      )}
    </>
  );
};

export default AvatarCard;
