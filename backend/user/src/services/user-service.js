const { UserRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

// All Business logic will be here
class UserService {

    constructor() {
        this.repository = new UserRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;

        const existingUser = await this.repository.FindUser({ email });

        if (existingUser) {
            const validPassword = await ValidatePassword(password, existingUser.password, existingUser.salt);
            if (validPassword) {
                const token = await GenerateSignature({ email: existingUser.email, _id: existingUser._id, name: existingUser.name, role: existingUser.role });
                return FormateData({ id: existingUser._id, token });
            }
        }

        return FormateData(null);
    }

    async SignUp(userInputs) {

        const { email, password, phone, name } = userInputs;

        // create salt
        let salt = await GenerateSalt();

        let userPassword = await GeneratePassword(password, salt);

        const existingUser = await this.repository.CreateUser({ email, password: userPassword, phone, salt, name });

        const token = await GenerateSignature({ email: email, _id: existingUser._id });
        return FormateData({ id: existingUser._id, token });

    }

    async GetProfile(id) {

        const existingUser = await this.repository.FindUserById({ id });
        return FormateData(existingUser);
    }

    async GetRecommendationHistories(userId) {
        const histories = await this.repository.GetRecommendationHistories(userId);
        return FormateData(histories);
    }



    async AddHobby(userId, hobby) {
        const hobbies = await this.repository.AddHobby(userId, hobby);
        return FormateData(hobbies);
    }

    async SetHobbies(userId, hobbies) {
        const res = await this.repository.SetHobbies(userId, hobbies);
        return FormateData(res);
    }
    async AddRecommendationToUser(userId, recommendId) {
        const recommends = await this.repository.AddRecommendationToUser(userId, recommendId);
        return FormateData(recommends);
    }


    async SubscribeEvents(payload) {
        try {
            console.log('Triggering.... User Events')

            const { event, data } = payload;

            console.log("data received", data)
            switch (event) {
                case 'SET_HOBBIES':
                    this.SetHobbies(data.userId, data.hobbies)
                    break;
                case 'ADD_HOBBY':
                    this.AddHobby(data.userId, data.hobby);
                    break;
                case 'ADD_RECOMMENDATION_TO_USER':
                    this.AddRecommendationToUser( data.userId,data.recommendId);
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    async ProcessRPC(payload) {

        console.log('Triggering.... RPC Call User')

        payload = await JSON.parse(payload)

        const { event, data } = payload;

        console.log("event received", event)
        console.log("data received", data)

        switch (event) {
            case 'GET_PROFILE':
                return await this.GetProfile(data.userId)
            case 'GET_HOBBY':
                return await this.GetHobby(data.userId)
            case 'ADD_HOBBY':
                return await this.AddHobby(data.userId, data.hobby)
            case 'SET_HOBBIES':
                return await this.SetHobbies(data.userId, data.hobbies)
            case 'ADD_ITINERARY_TO_USER':
                return await this.AddRecommendToUser(data.userId, data.recommendId);
            case 'CREATE_ITINERARY':
                return await this.CreateRecommend(data.recommend);

        }
    }
}

module.exports = UserService;
