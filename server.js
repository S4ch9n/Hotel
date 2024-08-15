const  express = require('express');
//importing the express module with require function
const app = express()


//db is representing here mongoDB connection
const db = require('./db')


//importing dotenv file
require('dotenv').config();


//importing the auth.js file
const passport = require('./auth')

const PORT = process.env.PORT || 3000;


// body-parser is used as middleware to extract incoming request data, 
// which can be in various formats such as JSON or form data, 
// and store it in req.body for easy access in your application.
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // bodyParser.json() parse the JSON data from the request body and converts into JS object , which is then stored in the req.body



//Middleware function
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
    // req.originalUrl contains the original URL requested by the client. 
    // It’s useful for logging the exact endpoint that received a request.
    next(); // Calls the next middleware or route handler in the stack.
};
// Use the middleware for all incoming requests
app.use(logRequest);
// By using app.use(logRequest), the logRequest middleware is applied globally to all routes and methods in the application. This ensures that every request, regardless of its type or endpoint, gets logged.


//initialize passport
app.use(passport.initialize())
// The line app.use(passport.initialize()) is part of the setup process for integrating Passport.js into an Express.js application. 
// This line adds Passport.js middleware to your Express.js application.
// It initializes Passport, allowing it to be used for handling authentication requests.


const localAuthenticationMiddleware = passport.authenticate('local', { session: false });  //local is the strategy we are using in passport...To use authentaication in difffernt routes.

// In this line, we are creating a middleware using Passport's local strategy, 
// which typically refers to username and password authentication.
// The option { session: false } indicates that no session should be created 
// for the user, meaning the authentication is stateless. This is commonly  used in API token-based authentication, where each request must be independently authenticated.
// By storing the middleware in a variable, our code becomes cleaner and more organized when handling requests, as localAuthenticationMiddleware will be responsible for verifying the username and password on incoming requests.

app.get('/',(req,res)=>{
    res.send("Welcome to our hotel")
})


//importing the personRoute file
const personRoutes = require('./routes/personRoutes')
//import the module from models/menuItem.js
//use the routers
app.use('/person', personRoutes)
//localAuthenticationMiddleware will act as miidleware and will be responsible for verifying the username and password



//importing the menuRoutes file
const menuRoutes = require('./routes/menuRoutes')
//use the routers
app.use('/menu' , menuRoutes)


//server start
app.listen(PORT, (req , res)=>{
    console.log(`Server is running on port : ${PORT}`);
})
