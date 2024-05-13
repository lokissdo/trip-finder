import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SearchBar from "./components/SearchBar";
import { getHotel } from "./hooks/getHotel";
import { StarOutlined } from "@ant-design/icons";

const Home: React.FC = () => {
  const [hotels, setHotels] = useState([]);
  const [location, setLocation] = useState("");
  useEffect(() => {
    const fetchHotel = async (location: string) => {
      // if (hotels.length === 0 && location !== "") {
      console.log("location :", location);
      const result = await getHotel(location);
      // console.log(result);
      setHotels(result);
      // }
      console.log(hotels);
    };
    fetchHotel(location);
  }, [location]);
  return (
    <div>
      <div className="relative">
        <div style={{ height: 450 }} className="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1605036687969-9c2878c7395b" />
        </div>
        <div className="absolute top-0 w-full px-12 py-8">
          <Navbar />
        </div>
        <div className="absolute m-auto left-0 right-0 -bottom-10 border rounded-lg w-3/4 bg-white shadow-lg">
          <div className="flex flex-row divide-x-2 gap-2 p-4">
            <SearchBar setLocation={setLocation} />
          </div>
        </div>
      </div>
      <div className="mt-20 flex flex-col gap-2 justify-center">
        {hotels &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          hotels.map((hotel: any) => {
            return (
              <div className="place-items-center bg-white rounded-lg p-2 w-80 shadow-md border border-gray-100">
                <div className="font-bold">{hotel.name}</div>
                <div>platform : {hotel.platform}</div>
                <div>{hotel.price} VND</div>
                <div>
                  {hotel.rating} <StarOutlined />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
