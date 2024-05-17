const DailyScheduleRepository = require("./daily-schedule-repository");
const WeatherRepository = require("./weather-repository");
const { SEARCH_SERVICE } = require("../../config")
const { RPCRequest } = require("../../utils/rpc");
const Recommend = require("../models/Recommend");


const COST_HOTEL_GAP_RATE = 0.4;
const COST_VEHICLE_GAP_RATE = 0.5;
const COST_RESTAURANT_GAP_RATE = 0.5;


class RecommendRepository {
    constructor() {
        this.dailyScheduleRepository = new DailyScheduleRepository();

        this.weatherRepository = new WeatherRepository();

    }

    async GetRecommendationsByParameters({ costOptions, startDate, endDate, departure, destination, userOptions }) {

        // Get the number of days between the start and end date
        // console.log(endDate, startDate)

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        userOptions = userOptions ?? {};
        // console.log(startDateObj, endDateObj);
        // Check if the dates are valid
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            throw new Error("Invalid date format. Please use 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM:SSZ'");
        }

        const numOfDays = Math.floor(((new Date(endDate)) - (new Date(startDate))) / (1000 * 60 * 60 * 24));

        var hotel = null, vehicles = null,dailySchedules = [];

        if (!costOptions.itinerary) {
            throw new Error("Itinerary cost option is required");
        }
        dailySchedules = await this.dailyScheduleRepository.createLandscapeScheduleByDays(destination, numOfDays, costOptions.itinerary, userOptions.cheapestItinerary ? true : false);

        if (dailySchedules === -1) {
            throw new Error("Not enough suitable landscapes in the database");
        }
        console.log("DailySchedles generated:", dailySchedules[0].morning);

        //throw new Error("Test");
        const { lat, long } = await this.getMiddlePointOfItinerary(dailySchedules);

        if (costOptions.hotel) {
            const pricePerDay = costOptions.hotel / numOfDays;
            const hotelRequest = {
                event: 'GET_RANDOM_HOTEL_BY_PARAMETERS',
                data: {
                    startPrice: pricePerDay * (1 - COST_HOTEL_GAP_RATE),
                    endPrice: pricePerDay * (1 + COST_HOTEL_GAP_RATE),
                    bestPrice: userOptions.cheapestHotel ? true : false,
                    checkinDate: startDate,
                    province: destination,
                    location: {
                        lat: lat,
                        long: long
                    },
                    // get closest hotel to the middle point of the itinerary
                }
            };
            const hotelResponse = await RPCRequest(SEARCH_SERVICE, hotelRequest);
            if (hotelResponse.error) {
                //throw new Error(hotelResponse.error);
            }
            hotel = hotelResponse.data;

            console.log("Hotel:", hotel);
        }

        console.log("Recommend - User options", userOptions)

        if (costOptions.vehicle && departure !== destination) {
            let vehicleType = userOptions.vehicleType ?? 'Xe Khách';
            const vehicleRequest = {
                event: 'GET_RANDOM_VEHICLE_BY_PARAMETERS',
                data: {
                    type: vehicleType,
                    startDate: startDate,
                    endDate: endDate,
                    departure,
                    destination,
                    startPrice: costOptions.vehicle * (1 - COST_VEHICLE_GAP_RATE),
                    endPrice: costOptions.vehicle * (1 + COST_VEHICLE_GAP_RATE),
                    bestPrice: userOptions.cheapestVehicle ? true : false,
                }
            };
            console.log("Vehicle request:", vehicleRequest);
            const vehicleResponse = await RPCRequest(SEARCH_SERVICE, vehicleRequest);
            if (vehicleResponse.error) {
                //throw new Error(vehicleResponse.error);
            }
            vehicles = vehicleResponse.data;
        }



        if (costOptions.restaurant) {
            let maxPriceQuery = costOptions.restaurant * (1 + COST_RESTAURANT_GAP_RATE) / (2 * numOfDays); // for midday and afternoon
            for (let i = 0; i < dailySchedules.length; i++) {
                const schedule = dailySchedules[i];
                const restaurantRequest = {
                    event: 'GET_RANDOM_RESTAURANT_BY_PARAMETERS',
                    data: {
                        startPrice: maxPriceQuery * (1 - COST_RESTAURANT_GAP_RATE),
                        endPrice: maxPriceQuery * (1 + COST_RESTAURANT_GAP_RATE),
                        bestPrice: userOptions.cheapestRestaurant ? true : false,
                        province: destination,
                        location: {
                            lat: schedule.morning.lat,
                            long: schedule.morning.long
                        },
                        // closest restaurant to the morning landscape
                    }
                };
                const midDayRestaurantResponse = await RPCRequest(SEARCH_SERVICE, restaurantRequest);
                if (midDayRestaurantResponse.error) {
                    //throw new Error(midDayRestaurantResponse.error);
                }
               const midDayRestaurant = midDayRestaurantResponse.data;
                restaurantRequest.data.location = {
                    lat: schedule.afternoon.lat,
                    long: schedule.afternoon.long
                };
                const afternoonRestaurantResponse = await RPCRequest(SEARCH_SERVICE, restaurantRequest);
                if (afternoonRestaurantResponse.error) {
                  //  throw new Error(afternoonRestaurantResponse.error);
                }
                const afternoonRestaurant = afternoonRestaurantResponse.data;
                dailySchedules[i] = {schedule, midDayRestaurant, afternoonRestaurant};

            }

        }
        let weatherData = await this.weatherRepository.getWeather(destination, startDate);
       // let weatherData = null
        console.log("Recommendation data:", weatherData)
        const recommend = new Recommend();
        Recommend.create({
            _id : recommend._id,
            destination,
            departure,
            startDate,
            endDate,
            costOptions,
            userOptions,
            output:{
                hotel,
                vehicles,
                dailySchedules,
                weather: weatherData._id
            }
            
        });
        return {
            _id : recommend._id,
            weather: weatherData,
            hotel,
            vehicles,
            dailySchedules
        };

    }


    async incrementRecommendationCount(recommendId) {
        try {
            // Find the recommendation by its ID
            const recommendation = await Recommend.findById(recommendId);
            if (!recommendation) {
                throw new Error("Recommendation not found");
            }
    
            // Increment the recommendation count
            recommendation.recommendationCount = (recommendation.recommendationCount || 0) + 1;
    
            // Save the updated recommendation back to the database
            await recommendation.save();
    
            console.log(`Recommendation count for ID ${recommendId} incremented successfully`);
        } catch (error) {
            console.error(`Error incrementing recommendation count: ${error.message}`);
            throw new Error("Failed to increment recommendation count");
        }
    }
    
    
    async getMiddlePointOfItinerary(dailySchedules) {

        let lat = 0;
        let long = 0;
        dailySchedules.forEach(schedule => {
            if (schedule.evening) {
                lat += (schedule.morning.lat + schedule.afternoon.lat + schedule.evening.lat) / 3
                long += (schedule.morning.long + schedule.afternoon.long + schedule.evening.long) / 3
            }
            else {
                lat += (schedule.morning.lat + schedule.afternoon.lat) / 2
                long += (schedule.morning.long + schedule.afternoon.long) / 2
            }


        });
        return {
            lat: lat / dailySchedules.length,
            long: long / dailySchedules.length
        };
    }

}

module.exports = RecommendRepository;