const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: 
    {
        type: String,
        required: true,
    },
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
            _id: false,
            note : String,
            date: Date,
            recommend: {
                type: Schema.Types.ObjectId,
                ref: 'Recommend',
            }
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

UserSchema.index({ email: 1 }, { unique: true });
module.exports =  mongoose.model('User', UserSchema);
