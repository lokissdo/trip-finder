import React from "react";
import Navbar from "../../components/Navbar";
import MultiSelection from "./MultiSelection";

const Explore: React.FC = () => {
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <h3 className="text-4xl font-semibold font-customTitle">
          Let's explore Vietnam with your choice
        </h3>
        <div className="px-40 text-lg">
          Vietnam offers a thrilling mix of historical sites like tunnels and
          mausoleums, alongside stunning natural beauty with islands and
          breathtaking landscapes. Apart from that culinary is another aspect
          that worth considering
        </div>
        <MultiSelection />
        {/* <div className="flex justify-center">
          <img
            className="rounded w-4/5"
            src="https://images.unsplash.com/photo-1606802029835-7dd0570bf864"
          />
        </div>
        <div className="flex justify-center">
          <img
            className="rounded w-4/5"
            src="https://images.unsplash.com/photo-1606802029835-7dd0570bf864"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Explore;
