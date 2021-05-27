const mongoose = require('mongoose')
const Recipe = require('../models/Recipe')
const cloudinary = require('../middleware/cloudinary')
const { groupByProperty } = require('../middleware/customFunctions')


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
            res.render('recipes/add-recipe.ejs', { msg: null })           
        } catch (err) {
            console.error(err)
        }
    },
    postAddRecipe: async (req, res) => {
       
        try {
            const image = await cloudinary.uploader.upload(
                req.file.path,
                {
                  transformation: [
                    {
                      crop: "scale",
                      width: "850",
                      quality: "auto",
                      format: "auto",
                    },
                  ],
                },
                (err, data) => console.log(data, err)
              );

              const recipeData = await req.body;
            
                const ingredients = groupByProperty(recipeData, 'ingredient')
                const instructions = groupByProperty(recipeData, 'instruction')

              console.log(`MY INGREDIENTS! : `, ingredients)
              console.log(`MY INSTRUCTIONS! : `, instructions)

              const recipe = await Recipe.create({
                recipeName: recipeData.recipeName,
                author: recipeData.author,
                image: image.public_id,
                cuisine: recipeData.cuisine,
                recipeType: recipeData.recipeType,
                specialDiet: recipeData.specialDiet,
                allergens: recipeData.allergens,
                ingredients: ingredients,
                instructions: instructions,
            })
            res.render('recipes/add-recipe.ejs', { msg: `Success! Your recipe has been uploaded!`})           
        } catch (err) {
            console.error(err)
        }
    },

}

module.exports = recipeController