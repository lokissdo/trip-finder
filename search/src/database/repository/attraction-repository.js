const Attraction = require('../models/Attraction'); // Import Attraction model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');
const mongoose = require('mongoose');
const ATTRACTION_INDEX_NAME = 'attractions'

class AttractionRepository {

    constructor() {
        this.esClient = new elasticsearch.Client({
            host: ELASTICSEARCH_URL // Replace with your Elasticsearch connection details
        });
    }

    async createIndexMapping() {
        const indexExists = await this.esClient.indices.exists({ index: ATTRACTION_INDEX_NAME });
        if (!indexExists) {
            await this.esClient.indices.create({
                index: ATTRACTION_INDEX_NAME,
                body: {
                    mappings: {
                        properties: {
                            name: { type: 'text' },
                            province: { type: 'keyword' },
                            location: { type: 'geo_point' }, // Geolocation field
                            price: { type: 'float' },
                            platform: { type: 'text' },
                        }
                    }
                }
            });
        }
    }

    // Index data from MongoDB into Elasticsearch
    async indexWholeData() {

        await this.createIndexMapping();
        const attractions = await Attraction.find();

        // Initialize an array to hold bulk operations
        const body = [];

        // Build the bulk request
        attractions.forEach(attraction => {
            const esDocument = {
                name: attraction.name,
                province: attraction.province,
                price: attraction.price,
                platform: attraction.platform
            };
        
            // Only add location if both lat and long are available
            if (attraction.lat  && attraction.long) {
                esDocument.location = {
                    lat: attraction.lat,
                    lon: attraction.long
                };
            }
        
            body.push({ index: { _index: ATTRACTION_INDEX_NAME, _id: attraction.id } });
            body.push(esDocument);
        });

        // Perform the bulk indexing
        const response = await this.esClient.bulk({ refresh: true, body });

        console.log('Indexed attractions:', response);
        if (response.errors) {
            const erroredDocuments = []
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0]
                if (action[operation].error) {
                    erroredDocuments.push({
                        // Original Attraction object causing the error
                        attraction: attractions[i],
                        // Error causing the failure
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred:', erroredDocuments);
        }
    }


    async searchAttractions({ name, start, end, province, platform, location, sort, page = 1, pageSize = 20 }) {
        const mustQueries = [];
        console.log(province)
        // Fuzzy search for name
        if (name) {
            mustQueries.push({
                match: {
                    name: {
                        query: name,
                        fuzziness: "AUTO"
                    }
                }
            });
        }
        if (platform) {
            mustQueries.push({
                match: {
                    platform: {
                        query: platform,
                        fuzziness: "AUTO"
                    }
                }
            });
        }


       

        if (province) {
            mustQueries.push({
                match_phrase: {
                    province: province
                }
            });
        }

        // Range filter for price
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

        // Geo-distance filter for location
        if (location) {
            console.log('Location:', location)
            mustQueries.push({
                exists: {
                    field: "location" // Ensures the document has a location field
                }
            });
            mustQueries.push({
                geo_distance: {
                    distance: location.distanceSearch,
                    "location": { // Ensure this matches the field name in the mapping
                        lat: location.latitude,
                        lon: location.longitude
                    }
                },
                order: "desc",
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


                if (key == 'location' && location) {
                    return {
                        _geo_distance:
                        {
                            location:
                            {
                                lat: location.latitude, lon: location.longitude

                            }, 
                            order: order, unit: 'km'
                        }
                    }
                }
                return { [key]: { order } };
              });

            console.log('Query:', sortOption)
        }

        // Pagination
        const from = (page - 1) * pageSize;

        try {
            const response = await this.esClient.search({
                index: ATTRACTION_INDEX_NAME,
                body: {
                    query,
                    from,
                    size: pageSize,
                    ...(sort ? { sort:sortOption } : {})
                   
                },
            });
            const hits = response.hits.hits;
            console.log('Hits:', hits[1]);

            const attractionIds = hits.map(hit => mongoose.Types.ObjectId(hit._id));
            let sortMongo = {}

            if (sort) {
                sortMongo = sort.split(',').reduce((acc, field) => {
                    const [key, order] = field.split(':');
                    acc[key] = order === 'asc' ? 1 : -1;
                    return acc;
                }, {});
            }
            // Fetching attraction documents from MongoDB using the retrieved IDs
            const attractionsFromMongo = await Attraction.find({
                '_id': { $in: attractionIds}
            }).sort(sortMongo)


            
            // Returning attractions fetched from MongoDB
            return attractionsFromMongo.map(attraction => ({
                ...attraction.toObject(), // Converting mongoose document to plain JavaScript object
                id: attraction._id // Adding the ID field
            }));
        } catch (error) {
            console.error('Error searching attractions:', error);
            return [];
        }
    }

}

module.exports = AttractionRepository;