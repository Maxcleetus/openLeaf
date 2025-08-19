import e from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./mongo.js";
import {connectCloudinary} from "./coludinary.js";
import adminRoute from "./common.js";
dotenv.config();

const port = process.env.PORT || 3000;

const app = e();



app.use(cors());
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use('/api/common',adminRoute)

app.get("/", (req, res) => {
  res.send("Welcome to the ReadMe API");
});

connectDB();
 connectCloudinary();


app.listen(port, () => {
  console.log("Server is running on port 3000");
});
