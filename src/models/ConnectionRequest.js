const { default: mongoose } = require("mongoose");
const User = require('./usermodel')

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum :{
            values:["interested","ignored","accepted","rejected"],
            message: `{VALUE} is incorect type`
        }
    },
    fromUser:{
        type: String,
    },
    toUser:{
        type: String,
    }
},
{
    timestamps:true
})


ConnectionRequestSchema.index({fromUserId:1,toUserId:1})



ConnectionRequestSchema.pre("save",function(){
 
 if(this.fromUserId.equals(this.toUserId)){
     throw new Error("cannot send request to our self")
 }
})



module.exports = mongoose.model('ConnectionRequest',ConnectionRequestSchema)