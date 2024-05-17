import { backend_dev } from "../../../service";

export const getRecommend = async (
  from: { value: string; label: string } | null,
  to: { value: string; label: string } | null,
  startDate: string,
  endDate: string,
  price: number
) => {
  console.log(from);
  console.log(to);
  console.log(startDate);
  console.log(endDate);
  console.log(price);
  const standardFrom = from?.label.replace(" ", "+");
  const standardTo = to?.label.replace(" ", "+");
  const cost = {
    itineray: price / 4,
    hotel: price / 4,
    vehicle: price / 4,
    restaurant: price / 4,
  };
  const response = await fetch(
    backend_dev.recommend +
      `?costOptions={"itinerary": ${cost.itineray},"hotel": ${cost.hotel},"vehicle": ${cost.vehicle}, "restaurant": ${cost.restaurant}}&departure=${standardFrom}&destination=${standardTo}&startDate=${startDate}&endDate=${endDate}`
  );
  const result = await response.json();
  return await result;
};