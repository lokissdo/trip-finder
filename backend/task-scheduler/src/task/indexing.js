const IndexingService = require('../services/indexing-service');
class IndexingTaskScheduler {
    constructor() {
        this.indexingService = new IndexingService();
    }

    async indexDataForUpdate() {
        console.log('Running task to index data for update...');
        try {
            await this.indexingService.indexDataForUpdate();
        } catch (error) {
            console.error('Error indexing data for update:', error);
        }
    }

    async removeOldData() {
        console.log('Running task to remove old data...');
        try {
            await this.indexingService.removeOldData();
        } catch (error) {
            console.error('Error removing old data:', error);
        }
    }
}

module.exports = new IndexingTaskScheduler();