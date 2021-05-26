const mongoose = require('mongoose')
const Recipe = require('../models/Recipe')


const recipeController = {
    getAll: async (req, res) => {
        try {
            const recipes = await Recipe.find({});
            console.log(recipes);
            if (Array.isArray(recipes)) {
                res.render('recipes/all-recipes.ejs', { recipes })
            } else {
                res.send('Sorry, no recipes found.')
            }
        } catch (err) {
            console.error(err)
        }
    },
    getSingle: async (req, res) => {        
        
        console.log("RECIPE NAME: ", req.params.recipe_name.toLowerCase())

        let requestedRecipe =  req.params.recipe_name.toLowerCase().split('-').join(' ');
        try {
            const recipes = await Recipe.find({ recipeName: requestedRecipe });
            console.log(`MY RECIPE: `, recipes[0]);
            
            res.render('recipes/single-recipe.ejs', { recipes })           
        } catch (err) {
            console.error(err)
        }
    },
    getAddRecipe: async (req, res) => {
        // let requestedRecipe =  req.params.recipe_name.toLowerCase().split('-').join(' ');
        try {
            res.render('recipes/add-recipe.ejs', { })           
        } catch (err) {
            console.error(err)
        }
    },

}

module.exports = recipeController