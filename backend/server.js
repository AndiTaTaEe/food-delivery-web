import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import mongoose from "mongoose"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 4000;
//app config
export const app = express()


//middleware
app.use(express.json())
app.use(cors())


// API endpoints
app.use("/api/food",foodRouter)
app.use("/images", express.static("uploads"))
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);


app.get("/",(req,res)=>{
    res.send("API Working")
});

const setupDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await connectDB();
            console.log(`MongoDB connected in ${process.env.NODE_ENV} mode`);
        } catch (error) {
            console.error(`Database connection error: ${error.message}`);

            if(process.env.NODE_ENV === 'production'){
                process.exit(1);
            }
            
        }
    }
};

if (process.env.NODE_ENV !== 'test') {
    setupDatabase();

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port} in ${process.env.NODE_ENV} mode`);
    });
} else {
    setupDatabase();
}



export default app;




