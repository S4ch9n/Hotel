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

//hashed password
// This operation triggers before saving a document to the database. 
// We use the .pre middleware to execute a function before the save operation.
personSchema.pre("save", async function (next) {
  // next will be called after the completion of this operation.
  const person = this; // 'this' refers to the current document being saved, here the personSchema document, and we store it in the 'person' variable.

  // Hash the password only if it has been modified (or if the document is new).
  // 'isModified' is a method provided by Mongoose that returns true if the specified field (e.g., 'password') has been modified.
  // If the password has not been modified, the middleware skips the hashing process and immediately proceeds to the next middleware.
  if (!person.isModified("password")) return next();

  // This block will execute if the password has been modified or if the document is new.
  try {
    // Generate a salt with a cost factor of 10.
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt.

    // 'bcrypt.hash' takes two parameters: the plain text password and the salt, and returns the hashed password.
    const hashedPassword = await bcrypt.hash(person.password, salt); //saved hash password in hashedPassword variable
    // Bcrypt doesn't just store the hash in the database. The salt used in the hashing process is actually stored as part of the hashed password string itself. The format of the stored hash includes information about the hashing algorithm, the cost factor, the salt, and the resulting hash.

    // Replace the plain text password with the hashed one.
    person.password = hashedPassword;
    
    // Proceed to the next middleware or save the document if there are no other middlewares.
    next();
  } catch (error) {
    // If an error occurs, pass the error to the next middleware.
    return next(error);
  }
});


// The comparePassword method is part of the personSchema in your Mongoose model. 
// It is designed to compare a plaintext password provided by a user with the hashed password stored in the database.
personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Use bcrypt to compare the provided plaintext password with the hashed password stored in the database.
    // 'candidatePassword' is the plaintext password entered by the user during login.
    // 'this.password' is the hashed password stored in the user's document in the database.

    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    // During the comparison process, bcrypt extracts the salt from the stored hashed password in the database
    // and uses it to hash the plain text password that the user provides during authentication.
    
    // If the resulting hash matches the stored hash, bcrypt returns true, indicating the passwords match.
    // Otherwise, it returns false.
    
    // Return true if the passwords match, otherwise return false.
    return isMatch;
  } catch (error) {
    // If an error occurs during comparison, throw the error.
    throw error;
  }
};




//create a Person model
const Person = mongoose.model("Person", personSchema);
//meaning the mongoose.model is used to create a model , and Person is name that will represent our data and personSchema define what our model should look like

module.exports = Person;
//this line export Perosn model , so it can be used in other file also . Using module.exports , is a way to share the code between file in NodeJS
