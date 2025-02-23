import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./db/index.js";
import userRouter from "./routes/user.route.js"; 
import notesRouter from "./routes/notes.route.js"; 

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

dotenv.config({
  path: "./.env",
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server is running on port: ${process.env.PORT || 8001}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed!", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

startServer();

//separated route files
app.use("/api/users", userRouter); // Prefix for user routes
app.use("/api/notes", notesRouter); // Prefix for notes routes
