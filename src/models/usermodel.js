const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


const userShema = new mongoose.Schema({

    firstName:{
        type: String,
        required:true,
        trim:true,
        max:20,
        match: [/^[a-z,A-Z]+$/, "provide a valide name" ]
    },
    lastName:{
        type: String,
        required:true,
         trim:true,
         max:20,
         match: /^[a-z,A-Z]+$/
    },
    emailId:{
        type: String,
        required:true,
        unique:true,
        trim : true,
        lowercase:true,
        
    },
    password:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:Number,
        max:11,
        trim : true
    },
    age:{
        type:Number,
        required:true,
        min:18
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    skills:{
        type : [String]
    }

},{
    timestamps:true
})

userShema.methods.getJWT= async function (){

    const user = this ;

    const token = await jwt.sign({_id:user?._id},process.env.SECRET_KEY,{expiresIn:"7d"})
    return token 
}

userShema.methods.validatePaswaord =  async function (inputPassword){
    const user = this ;
    const passwordHash = user.password
    
    const password = await bcrypt.compare(
        inputPassword,
        passwordHash
    )

    return password
}





const User =  mongoose.model("User",userShema)

module.exports = User