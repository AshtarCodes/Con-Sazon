const mongoose = require('mongoose')
const User = require('../models/User')

const homeController = {
    getDashboard: (req, res) => {
        console.log(req.user)
        res.render('dashboard', { user: req.user })
    },
    postToMealPlan: async (req, res) => {
        
    }

}

module.exports = homeController;