const mongoose = require('mongoose')
require('dotenv').config();

//define the mongoDB connection to URL

const mongoURL = process.env.LOCAL_URL //local server

// const mongoURL = process.env.DB_URL //connect online
//set up MongoDB connecetion
mongoose.connect(mongoURL,{
    // useNewUrlParser : true,
    // useUnifiedTopology : true
})


//get the default connecetion'
//mongo maintains a default connection obhject representing the MongoDB connecetion

const db = mongoose.connection; //db  helps to establish bridge./connection between mongoDB and nodeJS


//define event listener for database connectuion
db.on('connected',()=>{
    console.log('Connected to MongoDB server');
});

db.on('error',()=>{
    console.log('MongoDB connection server');
});

db.on('disconnected',()=>{
    console.log('MongoDB disconnected');
});

//connected , error and disconnected are event listener keyword which mongoDB understand


//export the db connection to server file to run 
module.exports = db;
//db is representing here mongoDB connection