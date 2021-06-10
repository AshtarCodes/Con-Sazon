const mongoose = require('mongoose')
const Recipe = require('../models/Recipe')
const cloudinary = require('../middleware/cloudinary')
const { fixedEncodeURIComponent } = require('../middleware/customFunctions')
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

              const recipeData = req.body;

              let recipePath = recipeData.recipeName.toLowerCase().trim().split(' ').join('-')
              recipePath = fixedEncodeURIComponent(recipePath)

              // splits strings by new lines and returns an array of strings
              const ingredients = recipeData.ingredients.split(/\r\n|\n\r|\n|\r/)
              const instructions = recipeData.instructions.split(/\r\n|\n\r|\n|\r/)
              
             

                // api call to zestful & some error checking. Consider storing this is another function. 
                const result = await parseIngredients(ingredients)                  
                console.log(result);
                if(!result){
                    req.flash('errors', "Something went wrong. Please try again later.")
                    res.redirect('/recipes/custom-recipes')

                } else if (result.error && result.error.includes('insufficient quota')){    
                    console.log('Zestful error: ',result.error);                
                    req.flash('errors', "Recipe Quota reached for today. Please try again in 24 hours or upgrade to a paid membership")
                    
                } else if (Array.isArray(result.results)){
                    // if the result is what we expect it to be, create the recipe document with this data
                    let parsedIngredients = result.results
                    console.log(parsedIngredients);

                      const recipe = await Recipe.create({
                        recipeName: recipeData.recipeName,
                        path: recipePath,
                        author: recipeData.author,
                        image: image.secure_url,
                        cloudinaryId: image.public_id,
                        cuisine: recipeData.cuisine,
                        recipeType: recipeData.recipeType,
                        specialDiet: recipeData.specialDiet,
                        allergens: recipeData.allergens,
                        ingredients: parsedIngredients,
                        instructions: instructions,
                        linkToSource: recipeData.linkToSource,
                        nameInSpanish: recipeData.recipeNameSpanish
                      })

                    req.flash('success', `Success! Your recipe has been uploaded!`)
                } else {
                    req.flash('errors', "Recipe Quota reached for today. Please try again in 24 hours or upgrade to a paid membership")
                }
                res.redirect('/recipes/custom-recipes')           
              
        } catch (err) {
            console.error(err)
        }
    },

}

module.exports = recipeController