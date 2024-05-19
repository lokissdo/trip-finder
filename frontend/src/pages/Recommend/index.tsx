import React from "react";
import Navbar from "../../components/Navbar";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/Search";
import Journey from "./components/Journey";

const Recommend: React.FC = () => {
  const { state } = useLocation();
  console.log(state.myObj); // {myOgj: obj}
  const data = state.myObj[0];
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="px-40">
        <SearchBar />
      </div>
      {data && (
        <div className="mx-auto w-5/6">
          <div className="flex flex-row gap-5">
            <div className="basis-1/3">
              <div>Sidebar</div>
              <div>điều chỉnh tiền</div>
              <div>Chọn option ưu tiên</div>
              <div>Chon useroption</div>
            </div>
            <div className="basis-2/3">
              <Journey data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;
