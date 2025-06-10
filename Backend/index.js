const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
require("dotenv").config();
const path = require("path");
const AuthRouter = require("./routes/AuthRouter.js");
const todoRouter = require('./routes/TodoRouter');
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api/auth", AuthRouter); // Make sure this is correctly set up
app.use('/api/todos', todoRouter);
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
