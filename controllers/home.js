const mongoose = require('mongoose')
const User = require('../models/User')

const homeController = {
    getDashboard: (req, res) => {
        res.render('dashboard', { user: req.user })
    },

}

module.exports = homeController;