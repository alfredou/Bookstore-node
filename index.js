require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const verifyToken = require('./middlewares/verifyToken')
const cookieParser = require('cookie-parser')
const {sendMail} = require('./Routes/email')
//app.use(express.json())
//añadido de comentario útil del video
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

app.use(cors({ origin: 'http://localhost:3000'}))
app.use(cookieParser())
//app.use(cors())
app.use(
    express.json({
        limit: "5mb",
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    })
);

const userRouter = require('./Routes/user')
const router = require('./Routes/auth')
const stripe = require('./Routes/stripe')
const commentRouter = require('./Routes/comment')

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('connected to mongodb')
    } catch (error) {
        throw error
    }
}
mongoose.connection.on("disconected", () => {
    console.log("mongodb disconected")
})
mongoose.connection.on("connected", () => {
    console.log("mongodb connected")
})

app.get("/", (req, res) => {
    res.send("hello world")
    sendMail('alfredouiop@gmail.com')
})
app.get('/logout', verifyToken, async (req, res) => {
    try{
        res.clearCookie('access_token', { httpOnly: true });
        res.send('Sesión cerrada');
    }catch(e){
        res.send({message: e})
    }
    });
app.use("/api/comment", commentRouter)
app.use("/api/user", verifyToken, userRouter)  
app.use("/api/auth", router)
app.use("/api/stripe", stripe)
app.get("/item", verifyToken, (req, res)=>{
    res.send("<h1>Tienes acceso</h1>")
})
app.use((err, req, res, next) => {

    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack //explica el error con mas detalle
    })
})
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    connect()
    console.log(`Server running on port ${process.env.PORT}`)
})