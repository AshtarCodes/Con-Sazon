const express = require('express')
const Router = express.Router()
const {ensureGuest, ensureAuth} = require('../middleware/auth')
const homeController = require('../controllers/home')


// @desc Dashboard page
// @route GET /dashboard
Router.get('/', ensureAuth, homeController.getDashboard)

// @desc Dashboard page
// @route GET /dashboard
Router.post('/meal-plan', ensureAuth, homeController.postToMealPlan)


module.exports = Router;