


const DailySchedule = require('../models/DailySchedule'); 
const Attraction = require('../models/Attraction'); 
const mongoose = require('mongoose');
const COST_GAP_RATE = 0.2;
class DailyScheduleRepository {




    async createLandscapeScheduleByDays(province, numOfDays, initialCost, bestPrice = false) {

        var dailySchedules = [];
        if (bestPrice) {
            // populate Attraction

            const sortCriteria = { initialPrice: -1 }; // Sort by price in descending order (1 for ascending, -1 for descending)
            dailySchedules = await DailySchedule
                .find({ province: province }) // Only filter by province
                .sort(sortCriteria)
                .limit(numOfDays)
                .populate('morning')
                .populate('afternoon')
                .exec();
        } else {
            let maxPriceQuery = initialCost* (1 + COST_GAP_RATE) / numOfDays ;
            const aggregationPipeline = [
                { $match: { province: province, initialPrice: { $gte: 0, $lte: maxPriceQuery } } },
                { $sample: { size: numOfDays } }, // Select random numOfDays documents,
                {
                    $lookup: {
                        from: "attractions", // Replace 'morningCollection' with the actual name of the collection
                        localField: "morning", // Field in the documents of the current collection
                        foreignField: "_id", // Field in the documents of the 'morningCollection' that matches 'localField'
                        as: "morning" // Output array in which to place the joined documents
                    }
                },
                {
                    $lookup: {
                        from: "attractions", // Replace 'afternoonCollection' with the actual name of the collection
                        localField: "afternoon", // Field in the documents of the current collection
                        foreignField: "_id", // Field in the documents of the 'afternoonCollection' that matches 'localField'
                        as: "afternoon" // Output array in which to place the joined documents
                    }
                }
            ];


             dailySchedules = await DailySchedule.aggregate(aggregationPipeline).exec();
            //  dailySchedules = dailySchedules.populate('morning').populate('afternoon').exec();
                     
            dailySchedules = dailySchedules.map(schedule => {
                return {
                   ...schedule,
                    morning: schedule.morning[0],
                    afternoon: schedule.afternoon[0],
                
                };
            });
            

        }

        // dailySchedules < numOfDays return -1
        console.log(dailySchedules.length);
        console.log(numOfDays);
        if (dailySchedules.length < numOfDays) {
            return -1;
        }
        return dailySchedules;


    }

    async generateDailySchedules(province) {

        // const randomAttraction = await Attraction.aggregate([
        //     { $match: { 
        //         province: province,
        //         lat: { $exists: true, $ne: null },
        //         long: { $exists: true, $ne: null }
        //     }},
        //     { $sample: { size: 1 } }
        // ]).exec();

        const attractions = await Attraction.find({ province: province,
            lat: { $exists: true, $ne: null },
            long: { $exists: true, $ne: null } }).exec();

        // get 2 acctraction distance less than 10km is a DailySchedule
        let dailySchedules = [];
        for (let i = 0; i < attractions.length; i++) {
            for (let j = i + 1; j < attractions.length; j++) {
                let distance = this.calculateDistance(attractions[i].lat, attractions[i].long, attractions[j].lat, attractions[j].long);
                if (distance <= 10) {
                    dailySchedules.push({
                        province: province,
                        morning: attractions[i],
                        afternoon: attractions[j],
                        initialPrice: attractions[i].price + attractions[j].price,
                        generator: 'system'
                    });
                }
            }
        }

        return DailySchedule.insertMany(dailySchedules);
        //return dailySchedules;


    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres
        return d / 1000; // in km
    }




}

module.exports = DailyScheduleRepository;