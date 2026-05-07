const validator = require('validator')

const signupValidation = (req)=>{

    const {firstName,lastName,emailId,password,age} = req.body

    const Regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    if(!firstName||!lastName){
        throw new Error("Fill all Detail")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Provide valid email")
    }
    else if(emailId.length<10){
        throw new Error("email is too small")
    }
    else if(!Regex.test(emailId)){
        throw new Error('Provide Valid email')
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please make strong password")
    }
    else if(age<18){
        throw new Error('Your are too small to use this app')
    }
}


const validatedUserEditData = (req)=>{

    const allowedField = ["firstName","lastName","emailId","gender","age","about","skills"]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedField.includes(field) )

    return isEditAllowed
}


module.exports = {signupValidation , validatedUserEditData}