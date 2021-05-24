const express = require('express')
const Router = express.Router()
const recipeController = require('../controllers/recipe')

// @desc All Recipes
// @route GET /recipes (will be changed to /recipes)
Router.get('/', recipeController.getAll)

// @desc Single Recipe Page
// @route GET /recipes/:recipe_name
Router.get('/:recipe_name', recipeController.getSingle)

module.exports = Router;
