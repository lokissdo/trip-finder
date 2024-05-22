import React from "react";
import {
  Bamboo,
  VNAirline,
  VietJet,
  Vietravel,
} from "../../../../../../assets/FlightBrand";
// import {
//   BambooAirway,
//   VietJet,
//   VietnamAirline,
//   VietravelAirline,
// } from "../../../../../../assets/Flight";

const AvatarCard: React.FC<{ brand: string; imageLink: string }> = ({
  brand,
  imageLink,
}) => {
  const initialImage =
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVzfGVufDB8MHwwfHx8MA%3D%3D";
  return (
    <div className="basis-2/5">
      {brand === "Vietravel Airlines" ? (
        <div className="flex flex-col h-60 justify-center">
          <img src={Vietravel} className="m-auto w-72 h-28 rounded-lg" />
        </div>
      ) : brand === "VietJet Air" ? (
        <div className="flex flex-col h-60 justify-center">
          <img src={VietJet} className="m-auto w-80 h-60 rounded-lg" />
        </div>
      ) : brand === "Bamboo Airways" ? (
        <div className="flex flex-col h-60 justify-center">
          <img src={Bamboo} className="m-auto w-80 h-40 rounded-lg" />
        </div>
      ) : brand === "Vietnam Airlines" ? (
        <img src={VNAirline} className="w-96 h-60 rounded-lg" />
      ) : (
        <img src={imageLink ?? initialImage} className="w-96 h-60 rounded-lg" />
      )}
    </div>
  );
};

export default AvatarCard;
