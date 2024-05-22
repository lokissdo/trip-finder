import React, { useEffect, useState } from "react";
// import recommends from "./fakerData"

import { getTopRecommend } from "./hooks/getTopRecommend";
import RecommendItem from "../RecommendItem";

const TopRecommendations: React.FC = () => {
  const [recommends, setRecommends] = useState<any>([]);

  useEffect(() => {
    getTopRecommend().then((response) => {
      setRecommends(response);
      console.log(response);
    });
  }, []);
  return (
    <>
      <div className="center w-full">
        <div className="text-3xl font-customCardTitle text-gray-500 font-semibold">
          Top destination for your trip
        </div>
      </div>
      {recommends.length >= 4 && (
        <div className="w-4/5 center flex flex-col m-auto mt-7">
          <div className="w-100 flex basis-2">
            <RecommendItem recommend={recommends[0]} />
            <RecommendItem recommend={recommends[1]} />
          </div>
          <div className="w-100 flex basis-2">
            <RecommendItem recommend={recommends[2]} />
            <RecommendItem recommend={recommends[3]} />
          </div>
        </div>
      )}
    </>
  );
};

export default TopRecommendations;
