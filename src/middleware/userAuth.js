const User = require('../models/usermodel')
const jwt = require('jsonwebtoken')

const userAuth = async(req, res, next)=>{
     try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({
                message: "No token, unauthorized"
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const { _id } = decoded

        const user = await User.findOne({ _id })
        if (!user) {
            throw new Error('User not exist')
        }

        req.user = user
        next()
     } catch (error) {
        res.status(404).json({
            message:error.message
        })
     }

}

module.exports = userAuth