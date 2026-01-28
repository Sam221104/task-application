const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const taskRoutes = require("./routes/tasks");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Task Application API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
