import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser); // user registration
userRouter.post("/login", loginUser); //user login

export default userRouter;