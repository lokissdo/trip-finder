import { Carousel, Image } from "antd";
import { Link } from "react-router-dom";
import { carouselListImage } from "../../../assets/carouselListImage";
import InformationInput from "../../../components/InfomationInput";

const SignUp: React.FC = () => {
  document.title = "SignUp";
  return (
    <>
      <div className="h-screen flex flex-row justify-center items-center gap-8 bg-white">
        <div className="max-w-lg min-w-80">
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
          <h2 className="text-2xl font-bold text-start">Sign Up</h2>
          <p className="text-start">Let's sign up and explore TripFinder</p>
          <div className="my-2 flex flex-col gap-4">
            <InformationInput labelName="Email" />
            <InformationInput labelName="First Name" />
            <InformationInput labelName="Last Name" />
            <InformationInput labelName="Phone number" />
            <InformationInput labelName="Password" isPassword={true} />
            <InformationInput
              labelName="Reconfirm Password"
              isPassword={true}
            />
            <button className="bg-green-400 rounded-lg text-xl p-2 border-none focus:outline-none hover:border-none text-white font-bold">
              Create Account
            </button>
            <div className="text-black">
              Already have an account ?{" "}
              <Link
                to={"/login"}
                className="text-green-400 hover:text-green-600 font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
