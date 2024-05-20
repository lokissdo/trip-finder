import { backend_dev } from "../../../service";

export const getTopRecommend = async () => {
  const response = await fetch(backend_dev.recommend + `/top`);
  const result = await response.json();
  return await result;
};
