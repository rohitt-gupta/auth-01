import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as OutlookStrategy } from "passport-outlook2";
import User, { IUser } from '../models/users';
import dotenv from "dotenv";
import { Express } from 'express';

dotenv.config();

// console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
// console.log("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET);
// Ensure environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          password: 'password',
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  },

));

// Add Outlook Strategy
if (!process.env.OUTLOOK_CLIENT_ID || !process.env.OUTLOOK_CLIENT_SECRET) {
  throw new Error('Missing Outlook OAuth credentials');
}

passport.use(new OutlookStrategy({
  clientID: process.env.OUTLOOK_CLIENT_ID,
  clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/outlook/callback"
},
  async (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
    try {
      let user = await User.findOne({ outlookId: profile.id });
      if (!user) {
        user = await User.create({
          outlookId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'password', // You might want to generate a random password here
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: Express.User, done) => {
  console.log("Serializing user:", user);
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id: string, done) => {
  console.log("Deserializing user with id:", id);
  try {
    const user = await User.findById(id);
    console.log("Deserialized user:", user);
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error);
  }
});

export default passport;
