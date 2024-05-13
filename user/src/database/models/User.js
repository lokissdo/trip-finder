const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    name : String,
    password: String,
    salt: String,
    phone: String,
    role : String,
    hobbies:{
        type:Object,
    },  
   
    histories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Recommend',
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
