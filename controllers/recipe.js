const mongoose = require('mongoose')
const Recipe = require('../models/Recipe')
const cloudinary = require('../middleware/cloudinary')
const { groupByProperty } = require('../middleware/customFunctions')
const {parseIngredients} = require('../middleware/zestful')


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

        let requestedRecipe =  req.params.recipe_name.toLowerCase()
        try {
            const recipes = await Recipe.find({ path: requestedRecipe });
            
            let [singleRecipe] = recipes 

            res.render('recipes/single-recipe.ejs', { singleRecipe })           
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
       /* refactoring to include an ingredient parser API
       *  1. Get ingredients and instructions as a string, and split by newlines
       *  2. send array of ingredients to api endpoint and get a mixed object back (note to change model)
       *  3. save this object in the database
       *  4. use it to display in recipe views, and in shopping list
       * 
       * Things to update
       * add-recipe form - done
       * recipe model
       * postAddRecipe controller
       * single-recipe views
       * confirmedMealPlan view
       * - try the format quantity for the front end, and use Math.js in the backend to add ingredient quantities. 
       */
        try {
            const image = await cloudinary.uploader.upload(
                req.file.path,
                {
                  folder: 'con_sazon_app',
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

              // returns a list of nested objects with data grouped by the property. e.g for ingredient, returns [ {name, quantity, optional, notes} ]
              const ingredients = parseIngredients(recipeData.ingredients.split(/\r\n|\n\r|\n|\r/))
              const instructions = recipeData.instructions
              await ingredients
            
              console.log('ingredients: ', ingredients)
            
              
              const recipePath = recipeData.recipeName.toLowerCase().trim().split(' ').join('-')

            //   const recipe = await Recipe.create({
            //     recipeName: recipeData.recipeName,
            //     path: recipePath,
            //     author: recipeData.author,
            //     image: image.secure_url,
            //     cloudinaryId: image.public_id,
            //     cuisine: recipeData.cuisine,
            //     recipeType: recipeData.recipeType,
            //     specialDiet: recipeData.specialDiet,
            //     allergens: recipeData.allergens,
            //     ingredients: ingredients,
            //     instructions: instructions,
            // })
            res.render('recipes/add-recipe.ejs', { msg: `Success! Your recipe has been uploaded!`})           
        } catch (err) {
            console.error(err)
        }
    },

}

module.exports = recipeController