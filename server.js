const connectDB = require('./src/config/db')
const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const colors = require('colors')
const cors = require('cors')


const profileRouter = require('./src/Routes/profile')
const requestRouter = require('./src/Routes/request')
const authRouter = require('./src/Routes/authRoute')
const errorHandler = require('./src/middleware/errorHandler')
const userRouter = require('./src/Routes/user')


//MiddleWare
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Added common Vite port too
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


//  Routes
app.use("/auth",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter) 
app.use("/user",userRouter) 




// testing
app.use("/",(req,res)=>{
    res.send("api is running")
})



// Error Hnadler ]
app.use(errorHandler)

connectDB()
.then(()=>{
    console.log("DB successfully connected".bgGreen);
    app.listen(process.env.PORT,()=>{
        console.log('server is running on 5000'.bgBlue)
})
})
.catch((err)=>{
    console.log(err.message)
})

