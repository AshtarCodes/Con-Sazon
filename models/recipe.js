const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: String,
        required: true
    },
    image: String,
    ingredients: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        },
        notes: String,
        optional: {type: String, default: 'no'}
    }],
    instructions: [{
        text: String,
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
})


module.exports = mongoose.model('Recipe', RecipeSchema, 'Recipes')