const express = require('express')
const userAuth = require('../middleware/userAuth')
const ConnectionRequest = require('../models/ConnectionRequest')
const User = require('../models/usermodel')


const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName age gender skills "

// get all the request that is pending or already send to logged in  user

userRouter.get("/request/received",userAuth,async(req,res)=>{
    try {
        
   const loggedInUser = req.user

   const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"

   }).populate("fromUserId",USER_SAFE_DATA)

   res.status(200).json({
    message: "data fetch succesfully",
    connectionRequests
   })

        
    } catch (error) {
        res.send("Error :",error.message)
    }
})


// Looking for match 
userRouter.get('/connections',userAuth,async(req,res)=>{
 try {
       const loggedInUser = req.user 
    
    const connection = await ConnectionRequest.find({
        $or:[ 
            {fromUserId:loggedInUser,status: "accepted"}, // ayu => b = accepted   [bcos someone already send me connection i cant send him again]
            {toUserId:loggedInUser,status: "accepted"}, // c => ayu  = accepted
        ]
    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

      const data = connection.map((field)=> {
        if(field.fromUserId.toString()=== loggedInUser._id.toString()){
            return field.toUserId
        }return field.fromUserId
      })

    
      res.status(200).json({
        message : "Its a Match",
        data
      })
 } catch (error) {
        res.status(409).send(error.message)
 }
})





// ALL Feeds 
userRouter.get("/feed",userAuth,async(req,res)=>{

    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        limit>50 ? 50 : limit ;

        const skip = (page-1)*10

        const connection = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }] // find all connection where i sent them or recevied 
        }).select("fromUserId toUserId")

        const hideUser = new Set()                                          // create set for unique value
        connection.forEach((row) => {
            hideUser.add(row.fromUserId.toString())
            hideUser.add(row.toUserId.toString())
        })

        const user = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUser) }},
                {_id: { $ne: loggedInUser._id }}
            ]
        }).select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit)

        res.send(user)

    }
    catch (error) {
        res.status(409).send(error.message)
    }


})


module.exports = userRouter