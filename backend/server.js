const express = require('express')
const dotenv = require('dotenv').config() //env file with config variables acces
const colors = require('colors')
//const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000 //to link and use PORT variable in .env file

//added
const bodyParser = require('body-parser')

connectDB() //write this to connect to the db after importin the variables/functions
const app = express();

//these lines should be added to get body data and to be displayed
// app.use(express.json());
// app.use(express.urlencoded({extended: false}))

//added
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  if (req.accepts(['application/json', 'application/x-www-form-urlencoded'])) {
      next()
  } else {
      res.status(406).send({
          error: "We only accept application/json & application/x-www-form-urlencoded."
      })
  }
})


const postRouter = require('./routes/mainRoutes')
app.use('/posts', postRouter)

//app.use(errorHandler)

//added
// app.get('/', function(req, res){
//     res.send('welcome to my API')
//   });

app.listen(port, () => console.log(`server test ${port}`))
