import { backend_dev } from "../../../service";

export const GetRecommendationHistories = async () => {
  const url = backend_dev.user + `/recommend`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const result = await response.json();
  console.log(await result);
  return await result;
};

export const PutRecommendationToHistories = async (id: string) => {
  const url = backend_dev.recommend + `/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const result = await response.json();
  console.log("PutRecommendationToHistories Result", result);
  return response.status === 200;
};

export const UpdateRecommendationNote = async (
  id: string,
  note: string | undefined
) => {
  if (!note) {
    return;
  }
  const url = backend_dev.user + `/recommend/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      note: note,
    }),
  });
  const result = await response.json();
  console.log("UpdateRecommendationNote Result", result);
  return response.status === 200;
};
