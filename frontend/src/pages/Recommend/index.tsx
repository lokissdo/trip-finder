import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/Search";
import RecommendItem from "../../components/RecommendItem";
import { ensureArray } from "../../utils/object";
import { toast } from "react-toastify";
import { getRecommend } from "../../components/Search/hooks/getRecommend";
import { Spin } from "antd";

const Recommend: React.FC = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchRecommendations = async () => {
      const from = searchParams.get("departure") ?? "";
      const to = searchParams.get("arrival") ?? "";
      const startDate = searchParams.get("startDate") ?? "";
      const endDate = searchParams.get("endDate") ?? "";
      let priceStr = searchParams.get("price") ?? "";
      let price = parseInt(priceStr);
      if (!from || !to || !startDate || !endDate || !price) {
        setData([])
        return;
      }

      let response = await getRecommend(from, to, startDate, endDate, price);
      if (response) {
        response = ensureArray(response);
        setData(response);
      } else {
        // Handle error or no data
        toast.error("No journey found for your criteria");
      }
    };

    if (!state?.myObj || !ensureArray(state.myObj).length) {
      fetchRecommendations();
    } else {
      setData(state.myObj);
    }
  }, [state, searchParams]);

  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="px-40">
        <SearchBar />
      </div>
      {data.length > 0 ? (
        <div className="mx-auto w-5/6">
          <div className="flex flex-row gap-5">
            <div className="basis-1/3">
              <div>Sidebar</div>
              <div>điều chỉnh tiền</div>
              <div>Chọn option ưu tiên</div>
              <div>Chọn useroption</div>
            </div>
            <div className="basis-2/3 center flex flex-col m-auto mt-7">
              <div className="w-100 flex flex-col basis-2">
                {data.map((item: any, index: number) => (
                  <RecommendItem key={index} recommend={item} />
                ))}
                <div>


                  <div className="relative inline-flex  group">
                    <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#a5fcdc] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                    </div>



                    {isLoading ? <Spin size="large" /> : (<div
                      onClick={
                        () => {
                          setIsLoading(true);
                        }
                      }
                      className=" bg-white  items-center justify-center px-2 py-3 text-sm font-bold leading-6 capitalize duration-100 transform border-2 cursor-pointer border-green-300 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none sm:w-auto sm:px-6 border-text  hover:shadow-lg hover:-translate-y-1 rounded-2xl">
                      Generate more
                      {isLoading && <Spin size="large" />}

                    </div>)}



                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-auto px-4 py-3 flex flex-row items-center gap-3">
          <span>Please search for more recommedations</span>
        </div>
      )}



    </div>
  );
};

export default Recommend;
