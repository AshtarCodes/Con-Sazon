const express = require('express')
const app = express()
const mongoose = require("mongoose");
const dotenv = require('dotenv')
const connectDB = require("./config/database");
const morgan = require('morgan')
// const homeRoute = require('./routes/home')
const recipeRoute = require('./routes/recipe')


// Load env variables into app
dotenv.config({path: './config/.env'})

// connect to database
connectDB()

// Logging
if(process.env.NODE_ENV = 'development'){
    app.use(morgan('dev'))
}

// express middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// routes
// app.use('/', homeRoute)
app.use('/', recipeRoute)

app.post('/recipes', (req,res) => {

})




const PORT = process.env.PORT || 3000; 

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))