const mongoose = require('mongoose')

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to Mongo DB: ${conn.connection.host}`.cyan.underline)  //van de conn variable is er een object "connection" en een "host" object
    } catch (error) {
        console.log(error);
        process.exit(1) //exit the process
    }
}

module.exports = connectDB