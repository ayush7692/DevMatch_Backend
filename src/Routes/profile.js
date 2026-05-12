const express = require('express')
const userAuth = require('../middleware/userAuth')
const { validatedUserEditData } = require('../utils/authValidator')




const profileRouter = express.Router()
// Get Profile 

profileRouter.get('/profile/view',userAuth, async (req, res) => {
    try {
       const user = req.user
       
        res.status(200).send(user)

    } catch (error) {
        res.status(403).send(error.message)
    }
})

// Profile edit 

profileRouter.patch('/profile/edit',userAuth, async (req, res) => {
    try {
       const loginUser = req.user // validate user with token 

       const isEditAllowed = validatedUserEditData(req) // validate allowed field 

       if(!isEditAllowed){
            return res.status(401).json({
                message : "User Not allowed to update These Field"
            })
       }
       
       Object.keys(req.body).forEach((key)=>{ loginUser[key] = req.body[key]  }) // muted original values 

       await loginUser.save()

       res.json({
        message : `${loginUser.firstName}, profile has successfully update`,
        data : loginUser
       })

    } catch (error) {
        res.status(403).send(error.message)
    }
})






module.exports = profileRouter