import { Image } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center justify-between bg-transparent">
      <div>
        <button
          className="flex flex-row items-center gap-1"
          onClick={() => {
            navigate("/");
          }}
        >
          <Image
            src="https://cdn-icons-png.flaticon.com/128/5333/5333676.png"
            width={30}
            height={30}
          />
          <h3 className="font-bold text-3xl">
            Trip<span className="text-green-400">Finder</span>
          </h3>
        </button>
      </div>
      <div className="flex flex-row gap-24">
        <Link to={"/"}>
          <span className="text-xl font-bold">Home</span>
        </Link>
        <Link to={"/explore"}>
          <span className="text-xl font-bold">Explore</span>
        </Link>
        <Link to={"/profile"}>
          <span className="text-xl font-bold">Profile</span>
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
