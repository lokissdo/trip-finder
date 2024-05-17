

const cron = require('node-cron');
const recommendTaskScheduler = require('./recommend');
const generatorTaskScheduler = require('./generator');
const indexingTaskScheduler = require('./indexing');




// Schedule the task to run every day at 12:00 AM
const runAllTasks = async () => {
    cron.schedule('0 0 0 */1 * *', async () => {
        await recommendTaskScheduler.getTopRecommendations()
        await generatorTaskScheduler.generatorDailySchedules()
        await indexingTaskScheduler.removeOldData()
        await indexingTaskScheduler.indexDataForUpdate()

    });

    // cron.schedule('*/1 * * * * *', async () => {
    //     await recommendTaskScheduler.getTopRecommendations()
    // });

    //    return await recommendTaskScheduler.getTopRecommendations();

}
module.exports = runAllTasks
