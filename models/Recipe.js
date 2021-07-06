const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: true,
      unique: true,
    },
    recipeNameSpanish: {
      type: String,
    },
    path: String,
    author: {
      type: String,
      required: true,
    },
    linkToSource: {
      type: String,
      default: null,
    },
    image: String,
    cloudinaryId: String,
    ingredients: [mongoose.Schema.Types.Mixed],
    instructions: [
      {
        type: String,
      },
    ],
    cuisine: String,
    specialDiet: String,
    allergens: String,
    recipeType: String,
    cookTime: String,
    prepTime: String,
    totalTime: String,
    description: String,
    servings: String,
  },
  { timestamps: true }
);

let collection;
if (process.env.NODE_ENV === 'development') {
  collection = 'devRecipes';
} else {
  collection = 'Recipes';
}

module.exports = mongoose.model('Recipe', RecipeSchema, collection);
