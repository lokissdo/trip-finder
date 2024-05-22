import { Carousel, Image, Spin, message } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { carouselListImage } from "../../../assets/carouselListImage";
import InformationInput from "../../../components/InfomationInput";
import { LoginHooks } from "./hooks/login";
import { LoadingOutlined } from "@ant-design/icons";

const Login: React.FC = () => {
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  document.title = "Login";
  // const success = () => {
  //   messageApi.open({
  //     type: "success",
  //     content: "Login successfully",
  //   });
  // };
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Incorrect email or password, try again",
    });
  };
  const noInput = () => {
    messageApi.open({
      type: "error",
      content: "Please type email and password",
    });
  };
  return (
    <>
      {contextHolder}
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
          <p className="text-start font-customDetail">
            Login to access your account
          </p>
          <div className="my-2 flex flex-col gap-5">
            <InformationInput labelName="Email" ref={emailRef} />
            <InformationInput
              labelName="Password"
              isPassword={true}
              ref={passwordRef}
            />
            <button
              onClick={async () => {
                setIsLoading(true);
                const email = emailRef.current?.value;
                const password = passwordRef.current?.value;
                if (!email || !password) {
                  noInput();
                }
                if (email && password) {
                  LoginHooks({
                    email,
                    password,
                  }).then((res) => {
                    if (res.token) {
                      localStorage.setItem("token", res.token);
                      navigate("/");
                      setIsLoading(false);
                    } else {
                      error();
                      setIsLoading(false);
                    }
                  });
                }
              }}
              className="bg-green-400 text-xl rounded-lg p-2 w-full border-none focus:outline-none hover:border-none text-white font-bold"
            >
              Login{" "}
              {isLoading && (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: "white" }}
                      spin
                    />
                  }
                />
              )}
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
