const mongoose = require('mongoose');
const { UserModel } = require('../models');

//Dealing with data base operations
class UserRepository {

    async CreateUser({ email, password, name, phone, salt }){

        const User = new UserModel({
            email,
            password,
            salt,
            name,
            phone,
            hobbies: [],

        })
        const UserResult = await User.save();
        return UserResult;
    }
    

    async FindUser({ email }){
        const existingUser = await UserModel.findOne({ email: email });
        return existingUser;
    }

    async FindUserById({ id }){

        const existingUser = await UserModel.findById(id).populate('itineraries','hobbies');
        return existingUser;
    }

    async GetHobby(UserId){

        const profile = await UserModel.findById(UserId).populate('hobbies');
       
        return profile.hobbies;
    }
    // Give me add hobby and itineraries
    async AddHobby(UserId, hobby){
        const profile = await UserModel.findById(UserId);
        profile.hobbies.push({ name: hobby });
        await profile.save();
        return profile.hobbies;
    }

    async SetHobbies(UserId, hobbies){
        const profile = await UserModel.findById(UserId);
        profile.hobbies = hobbies;
        await profile.save();
        return profile.hobbies;
    }

    async AddItineraryToUser(UserId, itineraryId){
        const profile = await UserModel.findById(UserId);
        profile.itineraries.push(itineraryId);
        await profile.save();
        return profile.itineraries;
    }
}

module.exports = UserRepository;
