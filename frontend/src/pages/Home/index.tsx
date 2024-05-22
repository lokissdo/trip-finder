import React from "react";
import Navbar from "../../components/Navbar";
import SearchBar from "../../components/Search";
import TopRecommendations from "../../components/TopRecommendations";
import ImageUploader from "../../components/ImageAi/ImageUploader"; 

const Home: React.FC = () => {
  document.title = "TripFinder";
  return (
    <div>
      <div className="relative">
        <div style={{ height: 550 }} className="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1605036687969-9c2878c7395b" alt="Background" />
        </div>
        <div className="absolute top-0 w-full px-12 py-8">
          <Navbar />
        </div>
        <div className="absolute m-auto left-0 right-0 bottom-10 border rounded-lg w-3/4 bg-white shadow-lg">
          <SearchBar />
        </div>
      </div>
      <div className="mt-5 w-full">
        <TopRecommendations />
      </div>
      <ImageUploader /> {/* Add the ImageUploader component here */}
    </div>
  );
};

export default Home;
