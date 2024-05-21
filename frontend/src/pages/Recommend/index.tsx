import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { useLocation, useSearchParams } from "react-router-dom";
import RecommendItem from "../../components/RecommendItem";
import { ensureArray } from "../../utils/object";
import { toast, ToastContainer } from "react-toastify";
import { getRecommend } from "../../components/Search/hooks/getRecommend";
import { Collapse, DatePicker, Divider, GetProps, Slider, Spin } from "antd";
import dayjs from "dayjs";
import Select from 'react-select';
import { options } from "../../assets/locationSelecion";
import CheckboxGroup from "../../components/Search/checkbox";
import { checkboxes } from "../../assets/userOption";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};
import { costRateOptions } from "../../assets/costOptions";
import { UserOptions, defaultUserOptions } from "../../components/Search/UserOption";
import { caculateCost } from "./hooks/caculateCost";
import { generateRecommend } from "../../components/Search/hooks/generteRecommend";
import { existInRecommendArray } from "./hooks/normalizeData";



const { RangePicker } = DatePicker;
const Recommend: React.FC = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([] as any[]);

  const from = searchParams.get("departure") ?? "";
  const to = searchParams.get("arrival") ?? "";
  const startDateStr = searchParams.get("startDate") ?? "";
  const endDateStr = searchParams.get("endDate") ?? "";

  const [startDate, setStartDate] = useState<string>(startDateStr);
  const [endDate, setEndDate] = useState<string>(endDateStr);
  const [departure, setDeparture] = useState<string>(from);
  const [arrival, setArrival] = useState<string>(to);
  const [costOption, setCostOption] = useState<any>(costRateOptions[0].value);

  let priceStr = searchParams.get("price") ?? "";
  // label is string, value is number
  const [price, setPrice] = useState<number>(parseInt(priceStr) || 0);



  const checkboxGroupRef = useRef<{ getValues: () => { [key: string]: boolean } }>(null);


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);
  const [enableGenerate, setEnableGenerate] = useState<boolean>(true);

  useEffect(() => {

    const fetchRecommendations = async () => {

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
      <ToastContainer />
      {data.length > 0 ? (
        <div className="mx-auto w-5/6 mt-4">
          <div className="flex flex-row gap-5">
            <div className="basis-1/3 h-screen sticky top-10 px-4">
              <div className="font-customCardTitle text-xl font-bold">
                Filter for Recommendations
              </div>
              <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
                Province
              </div>
              <div className="flex flex-row gap-2">
                <Select
                  isClearable
                  isSearchable
                  defaultValue={{ label: from, value: from }}
                  options={options}
                  onChange={(value) => {
                    console.log("From", value);
                    let valueStr = value!.label;
                    setDeparture(valueStr);
                  }}
                  placeholder="From"
                  className="min-w-44 h-10"
                />
                <Select
                  isClearable
                  isSearchable
                  defaultValue={{ label: to, value: to }}
                  options={JSON.parse(JSON.stringify(options))}
                  placeholder="To"
                  onChange={(value) => {
                    console.log("From", value);
                    let valueStr = value!.label;
                    setArrival(valueStr);
                  }}
                  className="min-w-44 h-10"
                />
              </div>
              <Divider />
              <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
                Date
              </div>
              <div className="flex-2 flex flex-col gap-1">
                <div className="flex flex-row gap-1">
                </div>
                <RangePicker
                  style={{ height: 38 }}
                  disabledDate={disabledDate}
                  defaultValue={[dayjs(startDate), dayjs(endDate)]}
                  onChange={(value, dateString) => {
                    console.log("Selected Time: ", value);
                    console.log("Formatted Selected Time: ", dateString);
                    setStartDate(dateString[0]);
                    setEndDate(dateString[1]);
                  }}
                  placement="bottomLeft"
                  size="large"
                />
              </div>
              <Divider />





              <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
                Interest In
              </div>
              <Select
                options={costRateOptions}
                isClearable
                defaultValue={costRateOptions[0]}
                onChange={(value) => {
                  setCostOption(value!.value);

                }}
                isSearchable
                placeholder="Sort by price"
              />
              <Divider />

              <Collapse
                items={[{
                  key: '1', label: <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
                    More
                  </div>, children: <CheckboxGroup ref={checkboxGroupRef} checkboxes={checkboxes} />
                }]}
              />

              <Divider />
              <div className="text-start font-customDetail text-lg text-gray-600 font-semibold">
                Price (unit : VND)
              </div>
              <Slider
                max={10000000}
                step={100000}
                defaultValue={price}
                tooltip={{ open: true, placement: 'bottom' }}
                onChangeComplete={(e) => {
                  console.log("Price changed", e);
                  setPrice(e);
                }}
              />


              {isFilterLoading ? <Spin className="mt-10" size="large" /> : (<button

                className="mt-10 mb-10 bg-green-400 text-white text-xl font-bold py-2 px-6 rounded-lg"
                onClick={async () => {
                  if (isFilterLoading)
                    return;
                  let userOptionsQuery: UserOptions = defaultUserOptions;
                  if (checkboxGroupRef.current) {
                    userOptionsQuery = checkboxGroupRef.current.getValues() as unknown as UserOptions;
                    if (userOptionsQuery.vehicleType) {
                      userOptionsQuery.vehicleType = "Máy Bay"
                    } else {
                      userOptionsQuery.vehicleType = "Xe Khách"
                    }
                  }
                  console.log("Filtering with", departure, arrival, startDate, endDate, price);
                  console.log("costOption", costOption)

                  if (!departure || !arrival || !startDate || !endDate || !price) {
                    toast.error("Please fill in all the fields");
                    return;
                  }
                  setIsFilterLoading(true);
                  let costOptionQuery = caculateCost(price, costOption);
                  let newData = await getRecommend(departure, arrival, startDate, endDate, price, costOptionQuery, userOptionsQuery);
                  if (newData) {
                    newData = ensureArray(newData);
                    setEnableGenerate(true);
                    setData(newData);
                  } else {
                    // Handle error or no data
                    toast.error("No journey found for your criteria");
                  }
                  setIsFilterLoading(false);

                }}
              >
                Filter
              </button>)}

            </div>
            <div className="basis-1/2 center flex flex-col m-auto mt-7">
              <div className="w-100 flex flex-col basis-2">
                {data.map((item: any, index: number) => (
                  <RecommendItem key={index} recommend={item} />
                ))}
                <div>

                  {enableGenerate && <div className="relative inline-flex  group">
                    <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#a5fcdc] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                    </div>



                    {isLoading ? <Spin size="large" /> : (<div
                      onClick={
                        async () => {
                          if (isFilterLoading)
                            return;


                          let userOptionsQuery: UserOptions = defaultUserOptions;
                          if (checkboxGroupRef.current) {
                            userOptionsQuery = checkboxGroupRef.current.getValues() as unknown as UserOptions;
                            if (userOptionsQuery.vehicleType) {
                              userOptionsQuery.vehicleType = "Máy Bay"
                            } else {
                              userOptionsQuery.vehicleType = "Xe Khách"
                            }
                          }
                          console.log("Filtering with", departure, arrival, startDate, endDate, price, userOptionsQuery);

                          let costOptionQuery = caculateCost(price, costOption);
                          if (!departure || !arrival || !startDate || !endDate || !price) {
                            toast.error("Please fill in all the fields");
                            return;
                          }
                          setIsLoading(true);

                          let res = await generateRecommend(departure, arrival, startDate, endDate, price, costOptionQuery, userOptionsQuery);
                          console.log("Reponse from generating", res);
                          if (!res || res.error || !res.result) {
                            console.log("Error", res.error, res.result)
                            let err: string = "No journey found for your criteria"
                            if (res.error && res.result.error) {
                              err = res.result.error;

                            }
                            toast.error(err);
                            setIsLoading(false);
                            return;
                          }

                          if (res.result && existInRecommendArray(res.result, data)) {
                            setEnableGenerate(false);
                          }
                          setData([...data, res.result]);

                          setIsLoading(false);
                        }}
                      className=" bg-white  items-center justify-center px-2 py-3 text-sm font-bold leading-6 capitalize duration-100 transform border-2 cursor-pointer border-green-300 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none sm:w-auto sm:px-6 border-text  hover:shadow-lg hover:-translate-y-1 rounded-2xl">
                      Generate more


                    </div>)}



                  </div>}

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
