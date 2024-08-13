const  express = require('express');
//importing the express module with require function
const app = express()


//db is representing here mongoDB connection
const db = require('./db')

//importing dotenv file
require('dotenv').config();


const PORT = process.env.PORT || 3000;

//bodyParser.json() parse the JSON data from the request body and converts into JS object , which is then stored in the req.body
const bodyParser = require('body-parser')
app.use(bodyParser.json())



app.get('/',(req,res)=>{
    res.send("Welcome to our hotel")
})

//importing the personRoute file
const personRoutes = require('./routes/personRoutes')
//import the module from models/menuItem.js
//use the routers
app.use('/person' , personRoutes)


//importing the menuRoutes file
const menuRoutes = require('./routes/menuRoutes')
//use the routers
app.use('/menu' , menuRoutes)

//server start
app.listen(PORT, (req , res)=>{
    console.log(`Server is running on port : ${PORT}`);
})
