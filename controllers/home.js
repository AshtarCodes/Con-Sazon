const mongoose = require('mongoose')
const User = require('../models/User')

const homeController = {
    getLogin: (req, res) => {
        res.render('auth/login')
    },
    getSignUp: (req, res) => {
        res.render('auth/sign-up.ejs')
    },
    getDashboard: (req, res) => {
        res.send('Dashboard')
    },

}

module.exports = homeController;