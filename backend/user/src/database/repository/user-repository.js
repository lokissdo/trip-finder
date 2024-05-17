const mongoose = require('mongoose');
const { UserModel } = require('../models');
const { populate } = require('../models/Recommend');

//Dealing with data base operations
class UserRepository {

    async CreateUser({ email, password, name, phone, salt }) {

        const User = new UserModel({
            email,
            password,
            salt,
            name,
            phone,
            hobbies: [],
            histories: [],


        })

        const UserResult = await UserModel.create(User);
        return UserResult;
    }


    async FindUser({ email }) {
        const existingUser = await UserModel.findOne({ email: email });
        return existingUser;
    }

    async FindUserById({ id }) {

        const existingUser = await UserModel.findById(id).populate('hobbies');
        return existingUser;
    }

    async GetHobby(UserId) {

        const profile = await UserModel.findById(UserId).populate('hobbies');

        return profile.hobbies;
    }
    // Give me add hobby and itineraries
    async AddHobby(UserId, hobby) {
        const profile = await UserModel.findById(UserId);
        if (!profile.hobbies) {
            profile.hobbies = [];
        }
        profile.hobbies.push({ name: hobby });
        await profile.save();
        return profile.hobbies;
    }

    async SetHobbies(UserId, hobbies) {
        const profile = await UserModel.findById(UserId);

        profile.hobbies = hobbies;
        await profile.save();
        return profile.hobbies;
    }

    async AddRecommendationToUser(UserId, recommendId) {
        const user = await UserModel.findById(UserId);
        if (!user.histories) {
            user.histories = [];
        }
        user.histories.push({
            note: "",
            date: new Date(),
            recommend: mongoose.Types.ObjectId(recommendId)
        }
        );
        await user.save();
        return user.histories;
    }

    async GetRecommendationHistories(UserId) {
        const user = await UserModel.findById(UserId).populate({
            path: 'histories.recommend',
            populate: [
                { path: 'output.hotel' },
                { path: 'output.vehicles' },
                { path: 'output.dailySchedules',
                    populate: [
                        { path: 'schedule' ,
                        populate: [
                            { path: 'morning' },
                            { path: 'afternoon' },
                            { path: 'evening' },
                        ]

                        },
                        { path: 'afternoonRestaurant' 

                        },
                        { path: 'midDayRestaurant' }
                    ]
                 },
                { path: 'output.weather' }
            ]
        })
            .lean();

        if (user && user.histories) {
            user.histories.sort((a, b) => new Date(b.updated_At) - new Date(a.updated_At));
        }
        return user ? user.histories : [];
    }
}

module.exports = UserRepository;
