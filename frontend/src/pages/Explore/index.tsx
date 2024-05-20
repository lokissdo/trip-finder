import React from "react";
import Navbar from "../../components/Navbar";
import { Variants, motion } from "framer-motion";
import { cardExplore } from "../../assets/cardExplore";
import { Link } from "react-router-dom";
import { FaPlane, FaUtensils, FaHotel, FaLocationDot } from "react-icons/fa6";
const oddVariants: Variants = {
  offscreen: { x: -200 },
  onscreen: { x: 0, transition: { type: "spring", duration: 1.5 } },
};

const evenVariants: Variants = {
  offscreen: { x: 200 },
  onscreen: { x: 0, transition: { type: "spring", duration: 1.5 } },
};
const Explore: React.FC = () => {
  return (
    <div>
      <div className="px-12 py-4 shadow-md">
        <Navbar />
      </div>
      <div className="relative">
        <div style={{ height: 550 }} className="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1504457047772-27faf1c00561" />
          <div className="absolute top-32 m-auto left-0 right-0 flex flex-col">
            <h3 className="text-5xl text-white font-semibold font-customHandWriting">
              Discover
            </h3>
            <div className="text-9xl text-white font-semibold font-customHandWriting mt-2">
              Vietnam
            </div>
            <div className="text-3xl text-white font-semibold font-customHandWriting mt-2">
              by your style
            </div>
          </div>
        </div>
      </div>
      <div className="bg-neutral-50 pt-6 flex flex-col gap-3">
        <div className="px-40 text-lg">
          Vietnam offers a thrilling mix of historical sites like tunnels and
          mausoleums, alongside stunning natural beauty with islands and
          breathtaking landscapes. Apart from that culinary is another aspect
          that worth considering
        </div>
        <div className="mx-20 my-4">
          {cardExplore.map((card, index) => {
            return (
              <motion.div
                className="my-8 hover:shadow-xl"
                initial="offscreen"
                whileInView="onscreen"
                key={card.name}
                viewport={{ once: true, amount: 0.8 }}
                variants={index % 2 === 0 ? oddVariants : evenVariants}
              >
                {index % 2 === 0 ? (
                  <div className="flex flex-row justify-between shadow-md rounded-lg border-gray-100 border-t-2">
                    <div className="flex flex-row">
                      <img
                        src={card.imageList[0]}
                        loading="lazy"
                        className="w-96 h-72 rounded-tl-lg rounded-bl-lg"
                      />
                      <div className="flex flex-col">
                        <img
                          src={card.imageList[1]}
                          loading="lazy"
                          className="w-60 h-36 rounded-tr-lg"
                        />
                        <img
                          src={card.imageList[2]}
                          loading="lazy"
                          className="w-60 h-36 rounded-br-lg"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-10 w-1/2 mr-6">
                      <div className="text-3xl font-customCardTitle text-gray-600 font-semibold">
                        {card.name}
                      </div>
                      <div className="text-md font-customDetail">
                        {card.description}
                      </div>
                      <Link to={card.link} className="flex justify-center">
                        <button className="flex flex-row items-center gap-2 border border-green-400 py-2 px-4 rounded-lg bg-green-400">
                          <span className="text-white text-lg">
                            More {card.name}
                          </span>
                          {card.name === "Transportations" && (
                            <FaPlane size={20} className="text-white" />
                          )}
                          {card.name === "Culinary" && (
                            <FaUtensils size={20} className="text-white" />
                          )}
                          {card.name === "Hotels" && (
                            <FaHotel size={20} className="text-white" />
                          )}
                          {card.name === "Attractions" && (
                            <FaLocationDot size={20} className="text-white" />
                          )}
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-row justify-between shadow-lg rounded-lg border-gray-100 border-t-2"
                    // variants={evenVariants}
                  >
                    <div className="flex flex-col justify-center gap-10 w-1/2 ml-6">
                      <div className="text-3xl font-customCardTitle text-gray-600 font-semibold">
                        {card.name}
                      </div>
                      <div className="text-md font-customDetail">
                        {card.description}
                      </div>
                      <Link to={card.link} className="flex justify-center">
                        <button className="flex flex-row items-center gap-2 border border-green-400 py-2 px-4 rounded-lg bg-green-400">
                          <span className="text-white text-lg">
                            More {card.name}
                          </span>
                          {card.name === "Transportations" && (
                            <FaPlane size={20} className="text-white" />
                          )}
                          {card.name === "Culinary" && (
                            <FaUtensils size={20} className="text-white" />
                          )}
                          {card.name === "Hotels" && (
                            <FaHotel size={20} className="text-white" />
                          )}
                          {card.name === "Attractions" && (
                            <FaLocationDot size={20} className="text-white" />
                          )}
                        </button>
                      </Link>
                    </div>
                    <div className="flex flex-row">
                      <div className="flex flex-col">
                        <img
                          src={card.imageList[0]}
                          loading="lazy"
                          className="w-60 h-36 rounded-tl-lg"
                        />
                        <img
                          src={card.imageList[1]}
                          loading="lazy"
                          className="w-60 h-36 rounded-bl-lg"
                        />
                      </div>
                      <img
                        src={card.imageList[2]}
                        loading="lazy"
                        className="w-96 h-72 rounded-tr-lg rounded-br-lg"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Explore;
