import { Dispatch, SetStateAction } from "react";

export const fetchPageImage = async (
  setImageList: Dispatch<SetStateAction<string[]>>,
  location: string
) => {
  console.log(location);
  const key = import.meta.env.VITE_UNSPLASH_KEY;
  const standardLocation = location.replace(" ", "+");
  const response = await fetch(
    `https://api.unsplash.com/search/photos/?query=${standardLocation}&orientation=landscape&client_id=${key}`
  );
  const result = await response.json();
  console.log(await result);
  const image1 = result.results[0].urls.full;
  const image2 = result.results[1].urls.full;
  const image3 = result.results[2].urls.full;
  setImageList([image1, image2, image3]);
  return result.urls.full;
};
