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
        optional: {type: Boolean, default: false}
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