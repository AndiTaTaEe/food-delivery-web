import express, { request } from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

//app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors())


// API endpoints
app.use("/api/food",foodRouter)
app.use("/images", express.static("uploads"))

app.get("/",(req,res)=>{
    res.send("API Working")
});

if (process.env.NODE_ENV !== 'test') {
    connectDB();

    app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port} in ${process.env.NODE_ENV} mode`);
    });
}

export default app;




