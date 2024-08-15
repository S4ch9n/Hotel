const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
// Passport uses the concept of strategies for handling different authentication methods.
// A strategy is a way to authenticate users. Passport has many built-in strategies,
// and here we are using the passport-local strategy, which handles authentication using a username and password.
//passport LcoalStrategy , by default , expects to extract the username and password from the request body. 
app.use(passport.initialize())

const Person = require("./models/person");

//define the local strategy
//to  verify the username and password , we need to define the function if username and password is correct or not
passport.use(
  new LocalStrategy(async (username, password, done) => {
    // Authentication logic here
    try {
      // Find the user by username
      const user = await Person.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      // Compare the provided password with the stored hash
      const isPasswordMatch = await user.comparePassword(password);
      if (isPasswordMatch) {
        // If passwords match, authentication is successful
        return done(null, user); // Success: pass the user object to done
      } else {
        // If passwords do not match, authentication fails
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (error) {
      return done(error); // Handle any errors that occur
    }
  })
);


module.exports = passport; //export configured passport

