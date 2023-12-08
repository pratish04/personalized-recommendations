const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require('dotenv').config();

const registerRoutes = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const homeRoutes = require("./routes/homeRoutes");
const profileRoutes = require("./routes/profileRoutes");

const query= require("./database/connection");

const app = express();

const PORT =  3001;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/home', homeRoutes);
app.use('/user-profile', profileRoutes);




app.listen(PORT, () => {
  console.log("SERVER LISTENING ON PORT", PORT);
});
