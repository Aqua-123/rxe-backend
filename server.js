import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import notesRoutes from "./routes/notes.js";
import usersRoutes from "./routes/users.js";
import bansRoutes from "./routes/bans.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/notes", notesRoutes);
app.use("/users", usersRoutes);
app.use("/bans", bansRoutes);
app.use(
  cors({
    origin: "*", // Allow all origins, you can specify your frontend URL here
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true, // Allow credentials if needed
  })
);
// test route
app.get("/", (req, res) => {
  res.send("Hello from Homepage");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
