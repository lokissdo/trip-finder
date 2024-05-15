import { Carousel, Image } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { carouselListImage } from "../../../assets/carouselListImage";
import InformationInput from "../../../components/InfomationInput";

const Login: React.FC = () => {
  document.title = "Login";
  return (
    <>
      <div className="h-screen flex flex-row justify-center items-center gap-8 bg-white">
        <div className="w-96">
          <div className="justify-center mb-6 flex flex-row items-center gap-1">
            <Image
              src="https://cdn-icons-png.flaticon.com/128/5333/5333676.png"
              width={30}
              height={30}
            />
            <h3 className="font-bold text-3xl">
              Trip<span className="text-green-400">Finder</span>
            </h3>
          </div>
          <h2 className="text-2xl font-bold text-start">Login</h2>
          <p className="text-start">Login to access your account</p>
          <div className="my-2 flex flex-col gap-5">
            <InformationInput labelName="Email" />
            <InformationInput labelName="Password" isPassword={true} />
            <button className="bg-green-400 text-xl rounded-lg p-2 w-full border-none focus:outline-none hover:border-none text-white font-bold">
              Login
            </button>
            <Link to={"/"}>
              <button className="border-green-400 border rounded-lg text-xl bg-transparent py-2 w-full hover:border-green-400 focus:outline-none text-green-400 font-semibold">
                Continue as guest
              </button>
            </Link>
            <div>
              Don't have an account ?{" "}
              <Link
                to={"/signup"}
                className="text-green-400 hover:text-green-600 font-semibold"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-xl">
          <Carousel autoplay>
            {carouselListImage.map((imageLink: string) => {
              return (
                <Image
                  width={500}
                  height={600}
                  preview={false}
                  className="rounded-lg"
                  src={imageLink}
                />
              );
            })}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default Login;
