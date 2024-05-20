import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import TopRecommendations from "../../components/TopRecommendations";
import { GetRecommendationHistories, PutRecommendationToHistories, UpdateRecommendationNote } from "./hooks/history";
import RecommendItem from "../../components/RecommendItem";
import { formatDate } from "../../utils/date-formatter";
import { SlCalender } from "react-icons/sl";
import { BsJournalText } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.min.css';
import { toast, ToastContainer } from "react-toastify";
const Profile: React.FC = () => {

  document.title = "TripFinder";
  const [recommendHistories, setRecommendHistories] = useState<any>([]);
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
    GetRecommendationHistories().then((res) => {
      console.log("History", res);
      setRecommendHistories(res)
    });
    // PutRecommendationToHistories().then((res) => {
    //   console.log("PutRecommendationToHistories",res);
    // }
    // );
  }, []);

  useEffect(() => {
    if (editableIndex !== null && textAreaRefs.current[editableIndex]) {
      textAreaRefs.current[editableIndex]?.focus();
    }
  }, [editableIndex]);

  return (
    <div>
      <ToastContainer />
      <div className="relative">
        <div style={{ height: 450 }} className="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1605036687969-9c2878c7395b" />
        </div>
        <div className="absolute top-0 w-full px-12 py-8">
          <Navbar />
        </div>
      </div>

      <div className="w-4/5 center flex flex-col m-auto mt-7 ">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-500 text-5xl font-black">
          Recommendation Histories
        </h1>
      </div>

      <div className="w-4/5 center flex flex-col m-auto mt-7">
        {recommendHistories.map((recommend: any, index: number) => {
          const isEditable = editableIndex === index;

          return (
            <div key={index} className="flex">
              <RecommendItem recommend={recommend.recommend} />

              <div className="shadow w-1/3 flex m-5 rounded-2xl pr-2 transition ease-in-out delay-150 duration-300">
                <div className="m-3 flex w-full flex-col items-start gap-5">
                  <div className="flex w-full justify-start items-center">
                    <div className="font-semibold text-lg flex justify-center items-center gap-2">
                      <SlCalender color="green" /> Ngày chọn:
                    </div>
                    <div className="ml-3">{formatDate(new Date(recommend.date))}</div>
                  </div>

                  <div className="flex flex-1 w-full flex-col justify-center items-center">
                    <div className="w-full font-semibold text-lg flex justify-between items-center gap-1">
                      <div className="flex justify-center items-center gap-2">
                        <BsJournalText color="orange" /> Ghi chú:
                      </div>
                      <FiEdit
                        color="blue"
                        onClick={() => setEditableIndex(isEditable ? null : index)}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="m-2 w-full h-full p-3 flex-1">
                      <div className="relative w-full min-w-[200px] h-full">
                        <textarea
                          ref={(el) => (textAreaRefs.current[index] = el)}
                          className="focus:ring-0 peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder={recommend.note ? "" : "Hãy để lại lời nhắn cho chuyến đi của bạn"}
                          defaultValue={recommend.note}
                          disabled={!isEditable}
                        />
                        <label
                          className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                        >
                          Message
                        </label>
                      </div>
                    </div>
                    {isEditable && (
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={async () => {
                          setEditableIndex(null)
                          if (textAreaRefs.current[index]) {
                            console.log("textAreaRefs.current[index]?.value", textAreaRefs.current[index]?.value)
                            let isSuccess = await UpdateRecommendationNote(recommend.recommend._id, textAreaRefs.current[index]?.value)
                            console.log("isSuccess", isSuccess)
                            if (isSuccess) {
                              toast.success("Update note successfully");

                            }
                            else {
                              toast.error("Update note failed");
                            }

                          }

                        }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
