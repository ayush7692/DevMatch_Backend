const express = require('express')
const { Signup } = require('../Controllers/authController')
const { signupValidation } = require('../utils/authValidator')
const User = require('../models/usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const userAuth = require('../middleware/userAuth')
require('dotenv').config()




const authRouter = express.Router()


authRouter.post('/signup', async (req, res) => {
    try {
        signupValidation(req) //  data validation 

        const { firstName, lastName, emailId, password, age } = req.body

        const oldUser = await User.findOne({ emailId: emailId })
        if (oldUser) {
            throw new Error('This Email is already in Use')
        }



        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            emailId,
            age,
            password: passwordHash
        }) //saving to db
        await user.save()

        res.status(200).send("User add successfullly")

    } catch (error) {
        res.status(400).send(error.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        

        const user = await User.findOne({ emailId: emailId }) // find Email
        if (!user) {
            return res.status(404).json({
                message: "invalid credential"
            })
        }

        const isPasswordValid = await user.validatePaswaord(password) //compare password come from schema Method

        const data = {_id:user._id,firstName:user.firstName,lastName:user.lastName,age:user.age,emailId:user.emailId,createdAt:user.createdAt}

        if (isPasswordValid) {

            // const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' }) token

            const token = await user.getJWT()

            res.cookie("token",token)
            res.status(200).json({
                message : "Login Successfully",
                data
            })
        } else (res.json({
            message: "invalid credential"
        }))


    } catch (error) {
        res.status(404).send(error.message)
    }
})



module.exports = authRouter