import { Image } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-between bg-transparent">
      <div>
        <div className="flex flex-row items-center gap-1">
          <Image
            src="https://cdn-icons-png.flaticon.com/128/5333/5333676.png"
            width={30}
            height={30}
          />
          <h3 className="font-bold text-3xl">
            Trip<span className="text-green-400">Finder</span>
          </h3>
        </div>
      </div>
      <div className="flex flex-row gap-24">
        <Link to={"/"}>
          <span className="text-xl font-medium">Home</span>
        </Link>
        <Link to={"/explore"}>
          <span className="text-xl font-medium">Explore</span>
        </Link>
        <Link to={"/login"}>
          <span className="text-xl font-bold text-white px-3 py-1.5 rounded-md bg-green-400">
            Login
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
