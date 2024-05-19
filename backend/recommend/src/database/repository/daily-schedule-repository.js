


const { DailySchedule, Attraction } = require('../models');
const mongoose = require('mongoose');
const COST_GAP_RATE = 0.2;
class DailyScheduleRepository {



    // if best price, system will seelct from  0 -> initialCost
    async createLandscapeScheduleByDays(province, numOfDays, initialCost, bestPrice = false) {

        var dailySchedules = [];
        var usedAttractions = new Set();
        if (bestPrice) {

            for (let i = 0; i < numOfDays; i++) {
                let schedule = await DailySchedule
                    .findOne({ province: province, 'morning': { $nin: [...usedAttractions] }, 'afternoon': { $nin: [...usedAttractions] } })
                    .sort({ initialPrice: -1 }) // Sort by price in descending order
                    .populate('morning')
                    .populate('afternoon')
                    .exec();

                if (schedule) {
                    dailySchedules.push(schedule);
                    usedAttractions.add(schedule.morning._id);
                    usedAttractions.add(schedule.afternoon._id);
                } else {
                    break; // Break if no available schedule matches the criteria
                }
            }
        } else {
            // If bestPrice is false, select randomly within cost constraints
            for (let i = 0; i < numOfDays; i++) {
                let maxPriceQuery = initialCost * (1 + COST_GAP_RATE) / numOfDays;
                let schedule = await DailySchedule.aggregate([
                    { $match: { province: province, initialPrice: { $gte: 0, $lte: maxPriceQuery }, 'morning': { $nin: [...usedAttractions] }, 'afternoon': { $nin: [...usedAttractions] }, generator: 1 } },
                    { $sample: { size: 1 } }, // Select one document randomly
                    { $lookup: { from: "attractions", localField: "morning", foreignField: "_id", as: "morning" } },
                    { $lookup: { from: "attractions", localField: "afternoon", foreignField: "_id", as: "afternoon" } }
                ]).exec();
            
                if (schedule.length === 0) {
                    // If no schedule with generator = 1, try with generator = 0
                    schedule = await DailySchedule.aggregate([
                        { $match: { province: province, initialPrice: { $gte: 0, $lte: maxPriceQuery }, 'morning': { $nin: [...usedAttractions] }, 'afternoon': { $nin: [...usedAttractions] }, generator: 0 } },
                        { $sample: { size: 1 } }, // Select one document randomly
                        { $lookup: { from: "attractions", localField: "morning", foreignField: "_id", as: "morning" } },
                        { $lookup: { from: "attractions", localField: "afternoon", foreignField: "_id", as: "afternoon" } }
                    ]).exec();
                }
            
                if (schedule.length > 0) {
                    schedule = schedule[0];
                    schedule.morning = schedule.morning[0];
                    schedule.afternoon = schedule.afternoon[0];
                    dailySchedules.push(schedule);
                    usedAttractions.add(schedule.morning._id);
                    usedAttractions.add(schedule.afternoon._id);
                } else {
                    break; // Break if no available schedule matches the criteria
                }
            }
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
        const attractions = await Attraction.find({
            province: province,
            lat: { $exists: true, $ne: null },
            long: { $exists: true, $ne: null }
        }).exec();
        // get 2 acctraction distance less than 10km is a DailySchedule
        let dailySchedules = [];
        for (let i = 0; i < attractions.length; i++) {
            for (let j = i + 1; j < attractions.length; j++) {
                let distance = this.calculateDistance(attractions[i].lat, attractions[i].long, attractions[j].lat, attractions[j].long);
                if (distance <= 10) {
                    dailySchedules.push({
                        updateOne: {
                            filter: {
                                province: province,
                                "morning": attractions[i]._id,
                                "afternoon": attractions[j]._id
                            },
                            update: {
                                $setOnInsert: {
                                    province: province,
                                    morning: attractions[i],
                                    afternoon: attractions[j],
                                    initialPrice: attractions[i].price + attractions[j].price,
                                    generator: 0
                                }
                            },
                            upsert: true
                        }
                    });
                }
            }
        }

       
        return DailySchedule.bulkWrite(dailySchedules);
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