const { UserRepository, ItineraryRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

// All Business logic will be here
class UserService {

    constructor() {
        this.repository = new UserRepository();
        this.itineraryRepository = new ItineraryRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;

        const existingUser = await this.repository.FindUser({ email });

        if (existingUser) {

            const validPassword = await ValidatePassword(password, existingUser.password, existingUser.salt);
            if (validPassword) {
                const token = await GenerateSignature({ email: existingUser.email, _id: existingUser._id, name: existingUser.name });
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



    async AddHobby(userId, hobby) {
        const hobbies = await this.repository.AddHobby(userId, hobby);
        return FormateData(hobbies);
    }

    async SetHobbies(userId, hobbies) {
        const res = await this.repository.SetHobbies(userId, hobbies);
        return FormateData(res);
    }
    async AddItineraryToUser(userId, itineraryId) {
        const itineraries = await this.repository.AddItineraryToUser(userId, itineraryId);
        return FormateData(itineraries);
    }

    async CreateItinerary(itinerary) {
        const itineraryResult = await this.itineraryRepository.CreateItinerary(itinerary);
        return FormateData(itineraryResult);
    }

    async SubscribeEvents(payload) {

        console.log('Triggering.... User Events')

        payload = JSON.parse(payload)

        const { event, data } = payload;

        console.log("data received", data)
        switch (event) {
            case 'SET_HOBBIES':
                this.SetHobbies(data.userId, data.hobbies)
                break;
            case 'ADD_HOBBY':
                this.AddHobby(data.userId, data.hobby);
                break;
            case 'ADD_ITINERARY_TO_USER':
                this.AddItineraryToUser(data.userId, data.itineraryId);
                break;
            case 'CREATE_ITINERARY':
                this.CreateItinerary(data.itinerary);
                break;
            default:
                break;
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
                return await this.AddItineraryToUser(data.userId, data.itineraryId);
            case 'CREATE_ITINERARY':
                return await this.CreateItinerary(data.itinerary);

        }
    }
}

module.exports = UserService;
