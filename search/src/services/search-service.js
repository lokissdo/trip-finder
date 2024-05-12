const { HotelRepository, VehicleRepository, RestaurantRepository, AttractionRepository } = require("../database");


const {FormateData} = require('../utils')
class SearchService {
    constructor() {
        this.hotelRepository = new HotelRepository();
        this.vehicleRepository = new VehicleRepository();
        this.restaurantRepository = new RestaurantRepository();
        this.attractionRepository = new AttractionRepository();


    }

    async GetHotelsByParameters({ name, start, end, province, checkinDate, platform, location, sort, page, pageSize }) {
        try {
            const hotels = await this.hotelRepository.getHotelByName({ name, start, end, platform, checkinDate, province, location, sort, page, pageSize });
            return hotels;
        } catch (error) {
            console.error('Error getting hotels by parameters:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeHotelsCreated() {
        try {
            const response = await this.hotelRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing hotels:', error);
            return []; // Return empty array on error
        }
    }


    async GetVehiclesByParameters({ type, start, end, date, departure, platform, arrival, departureTime, brand, sort, page, pageSize }) {
        try {
            const vehicles = await this.vehicleRepository.getVehicleByType({ type, start, end, date, platform, departure, arrival, departureTime, brand, sort, page, pageSize });
            return vehicles;
        } catch (error) {
            console.error('Error getting vehicles by parameters:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeVehiclesCreated() {
        try {
            const response = await this.vehicleRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing vehicles:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeRestaurantsCreated() {
        try {
            const response = await this.restaurantRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing vehicles:', error);
            return []; // Return empty array on error
        }
    }



    async GetRestaurantsByParameters({ name, province, platform, start, end, location, sort, page, pageSize }) {
        try {
            const restaurants = await this.restaurantRepository.searchRestaurants({ name, province, platform, start, end, location, sort, page, pageSize });
            return restaurants;
        } catch (error) {
            console.error('Error getting restaurants by parameters:', error);
            return []; // Return empty array on error
        }
    }


    async GetAttractionsByParameters({ name, province, platform, start, end, location, sort, page, pageSize }) {
        try {
            const attractions = await this.attractionRepository.searchAttractions({ name, province, platform, start, end, location, sort, page, pageSize });
            return attractions;
        } catch (error) {
            console.error('Error getting attractions by parameters:', error);
            return []; // Return empty array on error
        }
    }

    async indexWholeAttractionsCreated() {
        try {
            const response = await this.attractionRepository.indexWholeData();
            return response;
        } catch (error) {
            console.error('Error indexing attractions:', error);
            return []; // Return empty array on error
        }
    }

    async ProcessRPC(payload) {

        console.log('Triggering.... RPC Search')


        const { event, data } = payload;

        switch (event) {
            case 'GET_RANDOM_VEHICLE_BY_PARAMETERS':{
                // data: {
                //     type: vehicleType,
                //     startDate: startDate,
                //     endDate: endDate,
                //     startPrice: costOptions.vehicle * (1 - COST_VEHICLE_GAP_RATE),
                //     endPrice: costOptions.vehicle * (1 + COST_VEHICLE_GAP_RATE),
                //     bestPrice: userOptions.cheapestVehicle ? true : false,
                // }
                console.log("Vehicle data from RPC",data);
                const {type, startDate, endDate, startPrice,departure, destination, endPrice, bestPrice} = data
                const query = {
                    type,
                    
                    date: startDate,
                    departure,
                    arrival: destination,
                    page: 1,
                    pageSize: 10,
                }
                if (bestPrice) {
                    query.sort = 'price:asc'
                } else {
                    query.start = startPrice/2
                    query.end = endPrice/2

                }
                const firstVehicles =  await this.GetVehiclesByParameters(query)
                query.arrival = departure
                query.departure = destination
                query.date = endDate
                const secondVehicles =  await this.GetVehiclesByParameters(query)

                if (firstVehicles.length == 0 || secondVehicles.length == 0) {
                    return  { error: 'Not enough vehicles data' }
                }
                let firstVehicle = null, secondVehicle =null
                if (bestPrice) {
                    firstVehicle =  firstVehicles[0]
                    secondVehicle =  secondVehicles[0]
                } else{
                    firstVehicle =  firstVehicles[Math.floor(Math.random() * firstVehicles.length)]
                    secondVehicle =  secondVehicles[Math.floor(Math.random() * secondVehicles.length)]
                }
                const response = [firstVehicle, secondVehicle]
                console.log("Vehicle reponse from RPC",response);
                return FormateData(response)

            }
            case 'GET_RANDOM_RESTAURANT_BY_PARAMETERS':{
                // startPrice: maxPriceQuery * (1 - COST_RESTAURANT_GAP_RATE),
                // endPrice: maxPriceQuery * (1 + COST_RESTAURANT_GAP_RATE),
                // bestPrice: userOptions.cheapestRestaurant ? true : false,
                // province: destination,
                // location: {
                //     lat: schedule.morning.lat,
                //     long: schedule.morning.long
                // },

                const {startPrice, endPrice, bestPrice, province, location} = data
                const query = {
                   
                    province,
                    location:{
                        latitude: location.lat,
                        longitude: location.long,
                        distanceSearch: "100km"
                    },
                    page: 1,
                    pageSize: 10,
                    sort: 'location:asc'
                }
                if (bestPrice) {
                    query.sort += ',price:asc'
                }else {
                    query.start = startPrice
                    query.end = endPrice
                }
                const restaurants =  await this.GetRestaurantsByParameters(query)
                if (restaurants.length == 0) {
                    return  { error: 'Not enough restaurants data' }
                }
                if (bestPrice) {
                    return FormateData(restaurants[0]) 
                }
                const response =  restaurants[Math.floor(Math.random() * restaurants.length)]
                console.log("Restaurant reponse from RPC",response);
                return FormateData(response)
            }
            case 'GET_RANDOM_HOTEL_BY_PARAMETERS':{
                console.log("Hotel data from RPC",data);
                const {endPrice, startPrice, bestPrice, checkinDate, province, location} = data
                const query = {
                  
                    checkinDate: checkinDate,
                    province,
                    location:{
                        latitude: location.lat,
                        longitude: location.long,
                        distanceSearch: "100km"
                    },
                    page: 1,
                    pageSize: 10,
                    sort: 'location:asc'
                   
                }   
                if (bestPrice) {
                    query.sort += ',price:asc'
                } else {
                    query.start = startPrice
                    query.end = endPrice
                }
                const hotels =  await this.GetHotelsByParameters(query)
                if (hotels.length == 0) {
                    return  { error: 'Not enough hotels data' }
                }
                if (bestPrice) {
                    return FormateData(hotels[0])
                }
                const response =  hotels[Math.floor(Math.random() * hotels.length)]
                console.log("Hotel reponse from RPC",response);
                return FormateData(response)
            }
               
            default:
                // throw error('Invalid Event');
                return { error: 'Invalid Event' }
        }
    }
}

module.exports = SearchService;
