const express = require('express')
const userAuth = require('../middleware/userAuth')
const ConnectionRequest = require('../models/ConnectionRequest')
const User = require('../models/usermodel')



/// Create Pre and Index ar schema 

const requestRouter = express.Router()

    const USER_SAFE_DATA = "firstName lastName age gender skills "

requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try {
        const fromUserId = req.user._id
        const fromUser = req.user.firstName
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedField = ["interested", "ignored"]

        if (!allowedField.includes(status)) {
            return res.status(401).send('request not allowed')
        }

        const ValidtoUser = await User.findById(toUserId) // validate request 
        if (!ValidtoUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }]  // fromUserId = loggedInUser [if iam already send or received request]
        })                                                       // fromUserId -touser = i already send  , touser:fromuser = someone already me 

        if (existingRequest) {
            return res.status(403).send({
                message: "Connection request already exist !"
            })
        }

        const toUser = ValidtoUser.firstName
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
            fromUser,
            toUser
        })

        const data = await connectionRequest.save()

        if (status == "interested") {
            res.status(200).json({
                message: `${req.user.firstName} is ${status} in ${ValidtoUser.firstName}`,
                data
            })
        } else (
            res.status(200).json({
                message: `${req.user.firstName} is ${status} ${ValidtoUser.firstName}`,
                data
            })
        )


    } catch (error) {
        res.status(403).send(error.message)
    }
})


// Connection Request got by Logged in user  API 

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try {
         const loggedInUser = req.user
         const {status,requestId} = req.params
         console.log(req.params)

        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(401).send("status is not allowed")
        }

        const validRequest = await ConnectionRequest.findOne({  // its return all connection of collection
            _id : requestId,
            toUserId: loggedInUser._id,
            status: "interested"

        }).populate("fromUserId",USER_SAFE_DATA)

        if(!validRequest){
            return res.status(404).send({message:"Connection request not found"})
        }

        validRequest.status = status 

        const data = await validRequest.save()

        res.status(200).json({
            message : "Connection request" + status,
            data 
        })

    } catch (error) {
        res.status(403).send(" Error :" ,error.message)
    }
})

requestRouter.get('/request/review',userAuth,async(req,res)=>{

    const userId = req.user


    
   const requests = await ConnectionRequest.find({toUserId:userId}).populate("fromUserId" ,"skills")

   

   res.send(requests)
})


module.exports = requestRouter