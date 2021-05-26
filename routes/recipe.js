const express = require('express')
const Router = express.Router()
const recipeController = require('../controllers/recipe')
const { ensureGuest, ensureAuth } = require('../middleware/auth')

// @desc All Recipes
// @route GET /recipes (will be changed to /recipes)
Router.get('/', recipeController.getAll)

// @desc Add Recipe Page
// @route GET /recipes/custom-recipes
Router.get('/custom-recipes', ensureAuth, recipeController.getAddRecipe)

// @desc Single Recipe Page
// @route GET /recipes/:recipe_name
Router.get('/:recipe_name', recipeController.getSingle)


module.exports = Router;
