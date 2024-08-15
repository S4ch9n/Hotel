const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
//define the Person scheam
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ["chief", "waiter", "manager"],
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
  },
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

//this operation will trigger when we are going to save
personSchema.pre("save", async function (next) {
  //next will be call after the completion of this operation.
  const person = this; // this represnting here personSchema and storing it in person variable.

  //hash the password only if it has been modified (or is new)
  if (!person.isModified("password")) return next(); //isModified , method is provided by mongoose , and returns true if the specific field has been modified . Return false if the field hasn't been modified . If the password has been modified , the function immediately returns , skipping the rest of the middleware .
  try {
    //hashed password generation
    const salt = await bcrypt.genSalt(10);

    //hash password
    const hashedPassword = await bcrypt.hash(person.password, salt); //hash is inbuit function which take two parameters , password and salt will combine to make hash password

    //replacing or oveririding th plain password with the hashed one
    person.password = hashedPassword;
    next();
  } catch (error) {
    return next(err);
  }
});

personSchema.methods.comparePassword = async function (candidatePassword) { //The comparePassword method is part of the personSchema in your Mongoose model. It is designed to compare a plaintext password provided by a user with the hashed password stored in the database.
  try {
    // Use bcrypt to compare the provided with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password); // The method uses bcrypt.compare(), which compares the plaintext password with the hashed password (this.password refers to the password field of the current user document).
    return isMatch;
  } catch (error) {
    throw error;
  }
};



//create a Person model
const Person = mongoose.model("Person", personSchema);
//meaning the mongoose.model is used to create a model , and Person is name that will represent our data and personSchema define what our model should look like

module.exports = Person;
//this line export Perosn model , so it can be used in other file also . Using module.exports , is a way to share the code between file in NodeJS
