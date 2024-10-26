import express from "express";
import session from "express-session";
import passport from "./config/passport";
import connection from "./db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

connection();

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get("/health", (req, res) => {
  res.json({ msg: "I am healthy" });
});

// Error handling middleware should be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
