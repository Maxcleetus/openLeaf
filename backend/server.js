import e from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./mongo.js";
import {connectCloudinary} from "./coludinary.js";
import adminRoute from "./common.js";
import discussionRoutes from './discussionRoutes.js'

dotenv.config();
const app = e();

// Configure CORS with specific origins
const corsOptions = {
  origin: [
    'https://read-me-max.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(e.json({ limit: '500mb' }));
app.use(e.urlencoded({ limit: '500mb', extended: true }));
app.use('/api/common', adminRoute);
app.use('/api/discussions', discussionRoutes);

// Add OPTIONS preflight handling
app.options('*', cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to the ReadMe API");
});

connectDB();
connectCloudinary();

export default app;