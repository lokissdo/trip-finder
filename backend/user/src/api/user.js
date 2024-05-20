const UserService = require('../services/user-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage, FormateData } = require('../utils');
const { RPCObserver } = require('../utils/rpc');
const { USER_SERVICE } = require('../config');




module.exports = (app, channel) => {

    const service = new UserService();

    // To listen
    SubscribeMessage(channel, service, USER_SERVICE);

    RPCObserver(USER_SERVICE, service);
    app.post('/signup', async (req, res, next) => {
        try {
            const { email, password, phone, name } = req.body;
            const { data } = await service.SignUp({ email, password, phone, name });
            res.json(data);
        } catch (err) {
            console.log(err);
            if (err.code === 11000) {
                return res.status(400).json({ msg: 'Email already exists' });
            }
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });

    app.post('/login', async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const { data } = await service.SignIn({ email, password });

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });

    app.get('/profile', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { data } = await service.GetProfile({ _id });
        res.json(data);
    });

    app.post('/add-hobby', UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { hobby } = req.body;
        const { data } = await service.AddHobby(_id, hobby);
        res.json(data);
    });

    app.post('/set-hobbies', UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { hobbies } = req.body;

        // const payload = {
        //     event : 'SET_HOBBIES',
        //     data: { userId: _id, hobbies }
        // }
        // PublishMessage(channel,USER_SERVICE,JSON.stringify(FormateData(payload)));
        await service.SetHobbies(_id, hobbies);
        res.json({ msg: 'Hobbies are set' });
    }
    );


    


    app.get('/whoami', (req, res, next) => {
        return res.status(200).json({ msg: '/user : I am User Service' })
    })

    app.get('/recommend', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetRecommendationHistories(_id);
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }

    })

    app.patch('/recommend/:recommendId', UserAuth, async (req, res, next) => {
        try {
            const { recommendId } = req.params;
            const { _id } = req.user;
            const { data } = await service.UpdateRecommendationNote(_id, recommendId, req.body.note);
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });
}
