const Vehicle = require('../models/Vehicle'); // Import Vehicle model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');
const mongoose = require('mongoose');
const VEHICLE_INDEX_NAME = 'vehicles';

class VehicleRepository {
    constructor() {
        this.esClient = new elasticsearch.Client({
            host: ELASTICSEARCH_URL // Replace with your Elasticsearch connection details
        });
    }

    async createIndexMapping() {
        const indexExists = await this.esClient.indices.exists({ index: VEHICLE_INDEX_NAME });
        if (!indexExists) {
            await this.esClient.indices.create({
                index: VEHICLE_INDEX_NAME,
                body: {
                    mappings: {
                        properties: {
                            type: { type: 'keyword' }, // Vehicle type as enum
                            brand: { type: 'text' },
                            date: { type: 'keyword' },
                            departure: { type: 'text' },
                            arrival: { type: 'text' },
                            rating: { type: 'float' },
                            price: { type: 'float' },
                        }
                    }
                }
            });
        }
    }

    async indexDataWithinDateRange(startDate, endDate) {
        await this.createIndexMapping();
        const vehicles = await Vehicle.find({
            updatedAt: { $gte: startDate, $lte: endDate }
        });

        const body = [];
        vehicles.forEach(vehicle => {
            body.push({
                index: {
                    _index: VEHICLE_INDEX_NAME,
                    _id: vehicle.id
                }
            });
            body.push({
                type: vehicle.type,
                brand: vehicle.brand,
                date: (new Date(vehicle.date)).toISOString().split('T')[0],
                departure: vehicle.departure,
                arrival: vehicle.arrival,
                rating: vehicle.rating,
                price: vehicle.price,
            });
        });

        const response = await this.esClient.bulk({ refresh: true, body });
        console.log('Indexed vehicles:', response);
        if (response.errors) {
            const erroredDocuments = [];
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        vehicle: vehicles[i],
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred:', erroredDocuments);
        }
    }

    async removeIndexBeforeDate(beforeDate) {
        const vehicles = await Vehicle.find({
            updatedAt: { $lt: beforeDate }
        });
        const body = [];
        vehicles.forEach(vehicle => {
            body.push({ delete: { _index: VEHICLE_INDEX_NAME, _id: vehicle._id } });
        });

        const response = await this.esClient.bulk({ refresh: true, body });
        console.log('Deleted vehicles:', response);
        if (response.errors) {
            const erroredDocuments = [];
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        vehicle: vehicles[i],
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred:', erroredDocuments);
        }
    }
   
}

module.exports = VehicleRepository;
