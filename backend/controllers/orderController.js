import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { get } from "mongoose";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontendUrl = "http://localhost:5174";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      discountCode: req.body.discountCode,
      discountAmount: req.body.discountAmount,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const lineItems = req.body.items.map((item) => ({
      price_data: {
        currency: "ron",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 4.5, // convert usd to ron
      },
      quantity: item.quantity,
    }));

    if (!req.body.discountCode || req.body.discountCode !== "FREESHIP") {
      lineItems.push({
        price_data: {
          currency: "ron",
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: 2 * 100 * 4.5,
        },
        quantity: 1,
      });
    }

    let session_params = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`
    };

    if(req.body.discountAmount > 0) {
      let couponName = req.body.discountCode || 'Promo';

      const coupon = await stripe.coupons.create({
        name: couponName,
        amount_off: Math.round(req.body.discountAmount * 100 *4.5),
        currency: "ron",
        duration: "once"
      });

      session_params.discounts = [{coupon: coupon.id}];
    }

    if (req.body.discountCode === "ANDISTEFANFREE") {
      const totalAmount = getTotalProductsAmount(req.body.items) * 4.5;
      const coupon = await stripe.coupons.create({
        name:"ANDISTEFANFREE",
        percent_off: 95,
        duration: "once"
    });

      session_params.discounts = [{coupon: coupon.id}];
  }
    const session = await stripe.checkout.sessions.create(session_params);

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

function getTotalProductsAmount(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({
        success: true,
        message: "Paid",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({
        success: false,
        message: "Not paid",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

//listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
