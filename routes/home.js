const express = require('express')
const Router = express.Router()
const {ensureGuest, ensureAuth} = require('../middleware/auth')
const homeController = require('../controllers/home')


// @desc Dashboard page
// @route GET /dashboard
Router.get('/', ensureAuth, homeController.getDashboard)

// @desc Meal Plan page
// @route POST /dashboard/meal-plan
Router.post('/meal-plan', ensureAuth, homeController.createMealPlan)

// @desc Meal Plan page
// @route PUT /dashoard/meal-plan
Router.put('/meal-plan/:recipe-path/add?_method', ensureAuth, homeController.postToMealPlan)

module.exports = Router;