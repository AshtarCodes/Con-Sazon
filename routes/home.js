const express = require('express')
const Router = express.Router()
const {ensureGuest, ensureAuth} = require('../middleware/auth')
const homeController = require('../controllers/home')


// @desc Dashboard page
// @route GET /dashboard
Router.get('/', ensureAuth, homeController.getDashboard)

// @desc Meal Plan page
// @route GET /dashboard/meal-plan
Router.get('/meal-plan', ensureAuth, homeController.getMealPlan)

// @desc Meal Plan page
// @route POST /dashboard/meal-plan
Router.post('/meal-plan', ensureAuth, homeController.createMealPlan)

// @desc Meal Plan page
// @route PUT /dashboard/meal-plan/:recipe-id/add
Router.patch('/meal-plan/:recipeId/add', ensureAuth, homeController.addToMealPlan)

module.exports = Router;