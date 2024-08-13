const mongoose = require('mongoose')

//define the Person scheam
const personSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    age :{
        type : Number
    },
    work : {
        type : String,
        enum : ["chief" , "waiter" ,"manager"],
        required : true
    },
    mobile : {
        type : String,
        required  : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    address : {
        type : String, 
    },
    salary : {
        type : Number,
        required : true
    }
})

//create a Person model
const Person = mongoose.model("Person" , personSchema)
//meaning the mongoose.model is used to create a model , and Person is name that will represent our data and personSchema define what our model should look like

module.exports = Person                 
//this line export Perosn model , so it can be used in other file also . Using module.exports , is a way to share the code between file in NodeJS