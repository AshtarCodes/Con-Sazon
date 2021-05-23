const mongoose = require('mongoose')

const RecipeSchema = mongoose.Schema({
    recipeName: {
        type: String,
        required: true
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
        quantity: String,
        notes: String,
        optional: Boolean
    }],
    instructions: [{
        text: String,
        ingredients: [String]
    }],
    cuisine: [String],
    specialDiet: [String],
    allergens: [String],
    recipeType: [String],
    
})


module.exports = mongoose.model('Recipe', RecipeSchema, 'Recipes')