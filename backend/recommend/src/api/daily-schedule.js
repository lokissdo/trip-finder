const DailyScheduleService = require('../services/daily-schedule');

const UserAuth = require('./middlewares/auth');

module.exports = (app, channel) => {

    const service = new DailyScheduleService();
 
    app.post('/daily-schedule/generator', UserAuth, async (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden' });
        }
        const { province } = req.body;
        console.log(req.body);
        if (!province) {
            res.status(400).send('Province is required');
            return;
        }
        const result = await service.generatorDailySchedules(province);
        res.send(result);
    });

}
