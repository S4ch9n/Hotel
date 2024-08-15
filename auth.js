const passport = require("passport");
const localStrategy = require("passport-local").Strategy; //means we are using username and password to authenticate user

const Person = require("./models/person");

//define the local strategy
passport.use(
  new localStrategy(async (username, password, done) => {
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
