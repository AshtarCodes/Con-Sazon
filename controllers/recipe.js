const mongoose = require('mongoose')
const Recipe = require('../models/recipe')


const recipeController = {
    getAll: async (req, res) => {
        try {
            const recipes = await Recipe.find({});
            console.log(recipes);
            if (Array.isArray(recipes)) {
                res.render('Recipes/allRecipes.ejs', { recipes })
            } else {
                res.send('Sorry, no recipes found.')
            }
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = recipeController