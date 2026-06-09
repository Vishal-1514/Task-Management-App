const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db.js");
connectDB();




const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("task manager Api is running");

});

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/tasks",require("./routes/taskRoutes"))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});