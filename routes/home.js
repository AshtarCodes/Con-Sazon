const express = require('express')
const Router = express.Router()
const {ensureGuest, ensureAuth} = require('../middleware/auth')
const homeController = require('../controllers/home')


// @desc Dashboard page
// @route GET /dashboard
Router.get('/dashboard', ensureAuth, homeController.getDashboard)

module.exports = Router;