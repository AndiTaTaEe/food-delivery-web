import express from 'express';
import {addToCart, removeFromCart, getCart} from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart); // add item to cart
cartRouter.post("/remove", authMiddleware, removeFromCart); //remove item from cart
cartRouter.post("/get", authMiddleware, getCart); //get cart items

export default cartRouter;