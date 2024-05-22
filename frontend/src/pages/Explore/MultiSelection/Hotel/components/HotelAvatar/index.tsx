import React from "react";
import {
  Traveloka,
  Booking,
  Agoda,
  TripAdvisor,
  Kayak,
  Tripcom,
  MyTour,
  Bluepillow,
  HotelCombined,
} from "../../../../../../assets/WebAvatar";

const HotelAvatar: React.FC<{ platform: string; page_url: string }> = ({
  platform,
  page_url,
}) => {
  return (
    <>
      {platform === "Traveloka.com" ? (
        <img
          src={Traveloka}
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          className="mt-1 cursor-pointer"
          width={100}
          height={80}
        />
      ) : platform === "Booking.com" ? (
        <img
          src={Booking}
          className="mt-1 cursor-pointer"
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          width={100}
          height={80}
        />
      ) : platform === "Agoda" ? (
        <img
          src={Agoda}
          className="mt-1 cursor-pointer"
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          width={90}
          height={70}
        />
      ) : platform === "Hotelscombined.com" ? (
        <img
          src={HotelCombined}
          className="mt-1 cursor-pointer"
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          width={90}
          height={70}
        />
      ) : platform === "Tripadvisor.com.vn" ? (
        <img
          src={TripAdvisor}
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          className="mt-1 cursor-pointer"
          width={100}
          height={80}
        />
      ) : platform === "vn.KAYAK.com" ? (
        <img
          src={Kayak}
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          className="mt-1 cursor-pointer"
          width={100}
          height={80}
        />
      ) : platform === "Trip.com" ? (
        <img
          src={Tripcom}
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          className="mt-1 cursor-pointer"
          width={100}
          height={80}
        />
      ) : platform === "Mytour.vn - Giá đã bao gồm ăn sáng - 24/7" ? (
        <img
          src={MyTour}
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          className="mt-1 cursor-pointer"
          width={100}
          height={80}
        />
      ) : platform === "Bluepillow.com" ? (
        <img
          src={Bluepillow}
          onClick={() => {
            window.open(page_url, "_blank");
          }}
          className="mt-1 cursor-pointer"
          width={100}
          height={80}
        />
      ) : (
        <div
          className="font-semibold text-gray-600 cursor-pointer hover:text-gray-400"
          onClick={() => {
            window.open(page_url, "_blank");
          }}
        >
          More on {platform}
        </div>
      )}
    </>
  );
};

export default HotelAvatar;
