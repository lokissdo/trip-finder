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

    async indexWholeData() {
        await this.createIndexMapping();
        const vehicles = await Vehicle.find();

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

    async getVehicleByType({ type, start, end, date, departure, arrival, brand, sort, page = 1, pageSize = 20 }) {
        const mustQueries = [];
        if (type) {
            mustQueries.push({
                term: {
                    type: type
                }
            });
        }

        if (brand) {
            mustQueries.push({
                match: {
                    brand: {
                        query: brand,
                        fuzziness: "AUTO"
                    }
                }
            });
        }

        if (start && end) {
            mustQueries.push({
                range: {
                    price: {
                        gte: start,
                        lte: end
                    }
                }
            });
        }

        if (departure) {
            mustQueries.push({
                match: {
                    departure: {
                        query: departure,
                        fuzziness: "AUTO"
                    }
                }
            });
        }
    
        if (arrival) {
            mustQueries.push({
                match: {
                    arrival: {
                        query: arrival,
                        fuzziness: "AUTO"
                    }
                }
            });
        }
    
        if (date) {
            mustQueries.push({
                term: {
                    date: date // Exact checkinDate
                }
            });
        }
        const query = {
            bool: {
                must: mustQueries
            }
        };
        let sortOption ;
        // Sorting logic
        if (sort) {
            sortOption = sort.split(',').map(field => {
                const [key, order] = field.split(':');
                return { [key]: { order } };
              });

        }

       

        const from = (page - 1) * pageSize;
        try {
            const response = await this.esClient.search({
                index: VEHICLE_INDEX_NAME,
                body: {
                    query,
                    from,
                    size: pageSize,
                    ...(sort ? { sort: sortOption } : {})
                }
            });
            const hits = response.hits.hits;
            console.log('Hits:', hits[1]);
    
            const vehicleIds = hits.map(hit => mongoose.Types.ObjectId(hit._id));
    

            let sortMongo = {}

            if (sort) {
                sortMongo = sort.split(',').reduce((acc, field) => {
                    const [key, order] = field.split(':');
                    acc[key] = order === 'asc' ? 1 : -1;
                    return acc;
                }, {});
            }
            // Fetching hotel documents from MongoDB using the retrieved IDs
            const vehiclesFromMongo = await Vehicle.find({
                '_id': { $in: vehicleIds}
            }).sort(sortMongo)

            return vehiclesFromMongo.map(vehicle => ({
                ...vehicle.toObject(), // Converting mongoose document to plain JavaScript object
                id: vehicle._id // Adding the ID field
            }));
        } catch (error) {
            console.error('Error searching vehicles:', error);
            return [];
        }
    }
}

module.exports = VehicleRepository;
