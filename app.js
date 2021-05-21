const express = require('express')
const app = express()
const mongoose = require("mongoose");

const dotenv = require('dotenv')
const connectDB = require("./config/database");

// Load env variables into app
dotenv.config({path: './config/.env'})

connectDB()





const PORT = process.env.PORT || 3000; 

app.listen(PORT, (err) => console.log(err))