const express = require("express");

const router = express.Router();


const passport = require('../auth')
const localAuthenticationMiddleware = passport.authenticate('local', { session: false });

//imporitng the jwt 
const {jwtAuthMiddleware ,generateToken} = require("../jwt")


//import the module from models/perosn.
const Person = require("../models/person");


//routes define
//post route to add a person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //assume the user is sending the data , so that data are being stored in the req.body

    //create a newPerson document using the Mongoose model.
    const newPerson = new Person(data); 
    //creates a new instance of person model which represents new documents , which we will populate with the data , and save to mongoDB collection.
    // This instance, newPerson, is essentially a new document that we intend to insert into the MongoDB collection associated with the Person model.
    //By passing data into the Person constructor, we are setting the fields of the new document according to the data from req.body.
    //Mongoose automatically validates the data against the schema defined for the Person model. If data does not match the schema, Mongoose will throw an error.

    //save the newPerson to the database
    const response = await newPerson.save();
    console.log("data saved");
    const payload = {
      id : response.id, //_id
      username : response.username 
    }
    console.log(JSON.stringify(payload));

    const token = generateToken(payload)  
    console.log("token is :" , token);

    res.status(200).json({
      response : response,
      token :  token 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server error",
    });
  }
});


//login route
router.post('/login' , async(req , res)=>{
  try {
    //extract username and password from request body
    const {username , password} = req.body;

    //find the user by username
    const user = await Person.findOne({username : username});
  
    //if user does not exist or password does not match , return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({
        error : 'Invalid username or password'
      })
    }
    //if user is 
    //generate token
    const payload = {
      id : user.id,
      username : user.username
    }
    const token = generateToken(payload)

    //return token as a respone 
    res.json({token})
  } catch (error) {
    res.status(500).json({
      error : 'Internal Server error'
    })
  }
})

//get method, to get information
router.get("/",jwtAuthMiddleware ,async (req, res) => {
  try {
    const data = await Person.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errror: "Internal server error",
    });
  }
});

//profile route 
router.get('/profile' , jwtAuthMiddleware , async (req , res)=>{
  try {
    const userData = req.user;
    console.log("user data : " ,userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json({user})
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errror: "Internal server error",
    });
  }
})


//get the data of specific user
router.get("/:workType",localAuthenticationMiddleware, async (req, res) => {
  //workType is parameter of person here , we will give paramater after the person in the url  to get the data of specific pereson
  try {
    const workType = req.params.workType; //Extract the work type parameter from the request
    if (workType == "chief" || workType == "manager" || workType == "waiter") {
      const personData = await Person.find({
        work: workType, // work is defined  in the person schema
      });
      res.status(200).json(personData);
    } else {
      res.staus(200).json({
        error: "Invalid work type",
      });
    }
  } catch (error) {
    res.status(500).json({
      errror: "Internal server error",
    });
  }
});

//update method
//to update the data we use put method
router.put('/:id',localAuthenticationMiddleware,async(req,res)=>{
  try {
  const personId = req.params.id //extract the personid's from url parameter
  const updatedPersonData = req.body //update data for the person
  const respone = await Person.findByIdAndUpdate(personId , updatedPersonData ,{
    new : true, //return the updated document
    runValidators : true //run mongoose validation , means check data updated according to defined schema
  })
  if(!respone){
    return res.status(404).json({
      error : "Person not found"
    })
  }
  console.log('Data updated');
  res.status(500).json(respone)
  } catch (error) {
    res.staus(500).json({
      error : "Invalid server error"
    })
  }
})

//delete method
router.delete('/:id',localAuthenticationMiddleware,async (req, res) => {
  try {
    const personId = req.params.id //extract person id's from url parameter
    const response = await Person.findByIdAndDelete(personId)
    if(!response){
      return res.status(404).json({
        error : "Person not found"    
       })
    }
    console.log('data delete');
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({
      error : "Invalid server error"
    })
  }

});

//exporting the router
module.exports = router;

// When you create a new instance of a Mongoose model using new Person(data), Mongoose does the following:

// Schema Validation: Mongoose validates the data against the schema defined for the Person model. The schema specifies the structure and data types of the document fields. For example, if your schema requires a name field and the data provided does not include it, Mongoose will identify this as an issue.

// Default Values: If the schema defines default values for certain fields and those fields are missing from the data provided, Mongoose will automatically use the default values specified in the schema.

// Type Checking: Mongoose ensures that the types of the data match the types defined in the schema. For instance, if the schema defines age as a Number and the provided data includes age as a string, Mongoose will throw a validation error.

// Required Fields: If the schema marks certain fields as required and those fields are missing in the data, Mongoose will throw a validation error when you try to save the document.
