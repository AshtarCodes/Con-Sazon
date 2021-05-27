const express = require('express')
const Router = express.Router()
const upload = require("../middleware/multer");
const recipeController = require('../controllers/recipe')
const { ensureGuest, ensureAuth } = require('../middleware/auth')

// @desc All Recipes
// @route GET /recipes (will be changed to /recipes)
Router.get('/', recipeController.getAll)

// @desc Add Recipe Page
// @route GET /recipes/custom-recipes
Router.get('/custom-recipes', ensureAuth, recipeController.getAddRecipe)

// @desc Post add Recipe Page
// @route POST /recipes/custom-recipes
Router.post('/custom-recipes', ensureAuth, upload.single("image"), recipeController.postAddRecipe)

// @desc Single Recipe Page
// @route GET /recipes/:recipe_name
Router.get('/:recipe_name', recipeController.getSingle)


module.exports = Router;
