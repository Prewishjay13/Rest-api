const express = require('express')
const dotenv = require('dotenv').config() //env file with config variables acces
const colors = require('colors')
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000 //to link and use PORT variable in .env file


connectDB() //write this to connect to the db after importin the variables/functions
const app = express();

//these lines should be added to get body data and to be displayed
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/posts', require('./routes/mainRoutes.js'))

app.use(errorHandler)

app.listen(port, () => console.log(`server test ${port}`))
