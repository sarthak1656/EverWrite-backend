import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./db/index.js";
import userRouter from "./routes/user.route.js"; 
import notesRouter from "./routes/notes.route.js"; 

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

// 🔥 Allow only your frontend in CORS
app.use(
  cors({
    origin: "https://ever-write-frontend.vercel.app", // ✅ Allow only your frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Start Server
const startServer = async () => {
  try {
    await connectDb();
    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server is running on port: ${process.env.PORT || 8001}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed!", error);
    process.exit(1);
  }
};

// Routes
app.use("/api/users", userRouter);
app.use("/api/notes", notesRouter);

startServer();
