const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true,
        unique: true,
    },
    recipeNameSpanish: {
        type: String,
        default: null
    },
    path: String,
    author: {
        type: String,
        required: true
    },
    linkToSource: {
        type: String,
        default: null
    } ,
    image: String,
    cloudinaryId: String,
    ingredients: [{any: mongoose.Schema.Types.Mixed}],
    instructions: [{
        type: String,
    }],
    cuisine: String,
    specialDiet: String,
    allergens: String,
    recipeType: String,
    cookTime: String,
    prepTime: String,
    totalTime: String,
    description: String,
    servings: String,    
},{ timestamps: true})


module.exports = mongoose.model('Recipe', RecipeSchema, 'Recipes')