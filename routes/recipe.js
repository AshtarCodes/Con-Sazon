const express = require('express')
const Router = express.Router()
const recipeController = require('../controllers/recipe')

Router.use('/', recipeController.getAll)

module.exports = Router;
