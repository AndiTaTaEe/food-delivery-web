import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Ardeleanu:megastudent@cluster0.4blu9nd.mongodb.net/food-del').then(()=>console.log("DB Connected"));

}