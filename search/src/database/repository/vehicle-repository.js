const Vehicle = require('../models/Vehicle'); // Import Vehicle model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');

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
                            date: { type: 'date' },
                            departureTime: { type: 'text' },
                            duration: { type: 'text' },
                            departure: { type: 'text' },
                            arrival: { type: 'text' },
                            rating: { type: 'float' },
                            price: { type: 'float' },
                            image_url: { type: 'text' }
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
                date: vehicle.date,
                departureTime: vehicle.departureTime,
                duration: vehicle.duration,
                departure: vehicle.departure,
                arrival: vehicle.arrival,
                rating: vehicle.rating,
                price: vehicle.price,
                image_url: vehicle.image_url
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

    async getVehicleByType({ type, start, end, brand, sort, page = 1, pageSize = 20 }) {
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

        const query = {
            bool: {
                must: mustQueries
            }
        };

        if (sort) {
            query.sort = sort.split(',').reduce((acc, field) => {
                const [key, order] = field.split(':');
                acc[key] = { order: order };
                return acc;
            }, {});
        }

        const from = (page - 1) * pageSize;
        try {
            const response = await this.esClient.search({
                index: VEHICLE_INDEX_NAME,
                body: {
                    query,
                    from,
                    size: pageSize,
                    ...(sort ? { sort: query.sort } : {})
                }
            });
            const hits = response.hits.hits;
            return hits.map(hit => ({ ...hit._source, id: hit._id }));
        } catch (error) {
            console.error('Error searching vehicles:', error);
            return [];
        }
    }
}

module.exports = VehicleRepository;
