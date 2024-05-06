const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    name : String,
    password: String,
    salt: String,
    phone: String,
    role : String,
    hobbies:[
        {
            name: { type: String },
        }
    ],  
    itineraries: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Itinerary'
        }
    ],
    histories: [
        {
            type: { type: String},
            date: {type: Date, default: Date.now()},
            amount: { type: String},
        }
    ],
},{
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
        }
    },
    timestamps: true
});

module.exports =  mongoose.model('User', UserSchema);
