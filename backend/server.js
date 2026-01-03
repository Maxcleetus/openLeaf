import e from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./mongo.js";
import {connectCloudinary} from "./coludinary.js";
import adminRoute from "./common.js";
import  discussionRoutes from './discussionRoutes.js'
dotenv.config();

const port = process.env.PORT || 3000;

const app = e();



app.use(cors());
app.use(e.json({ limit: '50mb' }));
app.use(e.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/common',adminRoute)
app.use('/api/discussions',discussionRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the ReadMe API");
});

connectDB();
 connectCloudinary();


// app.listen(port, () => {
//   console.log("Server is running on port 3000");
// });
export default app;