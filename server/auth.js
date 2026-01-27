const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const { User }  = require("./db/index.js")
require("dotenv/config");

const passport = require('passport')

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/google/callback",
  },
  //This is what happens when someone is successfully logged in.
  async (accessToken, refreshToken, profile, cb) => {
    //Either create a user in the db if they haven't logged in before
    let newUser =  {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.familyName,
      lastName: profile.name.givenName,
      image: profile.photos[0].value
    }
    //Or find the user if they have logged in
    try {
      //Look for the user where googleId = profile.id (to see if that user exist)
      let user = await User.findOne({googleId: profile.id});
      //if user exist
      if(user){
        //invoke cb and pass in user
        cb(null, user)
      }else{
        //if not create the user
        user = await User.create(newUser)
        cb(null, user)
      }
    } catch (err) {
      console.log(err)

    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);//only store user id
});

passport.deserializeUser(async (id, cb) => {
try {
  const user = await User.findById(id)
  cb(null, user);
} catch (err) {
  cb(err)
}

});

