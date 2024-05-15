import { useState } from "react";
import ChipButton from "./ChipButton";
import Vehicle from "./Vehicle";
import Attraction from "./Attraction";
import Restaurant from "./Restaurant";
import Hotel from "./Hotel";

const MultiSelection: React.FC = () => {
  const items = ["Vehicle", "Attraction", "Restaurant", "Hotel"];
  const [choosen, setChoosen] = useState(items[0]);
  return (
    <div>
      <div className="justify-center flex flex-row gap-4 p-2">
        {items.map((item: string) => {
          return (
            <ChipButton
              key={item}
              labelName={item}
              choosen={choosen}
              setChoosen={setChoosen}
            />
          );
        })}
      </div>
      {choosen === items[0] ? <Vehicle /> : <></>}
      {choosen === items[1] ? <Attraction /> : <></>}
      {choosen === items[2] ? <Restaurant /> : <></>}
      {choosen === items[3] ? <Hotel /> : <></>}
    </div>
  );
};

export default MultiSelection;
