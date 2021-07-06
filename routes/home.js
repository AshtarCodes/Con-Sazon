const express = require('express');

const Router = express.Router();
const { ensureGuest, ensureAuth } = require('../middleware/auth');
const homeController = require('../controllers/home');

// @desc Dashboard page
// @route GET /dashboard
Router.get('/', ensureAuth, homeController.getDashboard);

// @desc Meal Plan All Recipes page
// @route GET /dashboard/meal-plan
Router.get('/meal-plan', ensureAuth, homeController.getMealPlan);

// @desc Meal Plan All Recipes page - create meal plan
// @route POST /dashboard/meal-plan
Router.post('/meal-plan/create', ensureAuth, homeController.createMealPlan);

// @desc Meal Plan Single Recipe page
// @route GET /dashboard/meal-plan/:recipeId
Router.get(
  '/meal-plan/:recipeId',
  ensureAuth,
  homeController.getActiveSingleRecipe
);

// @desc Add to Meal Plan request
// @route PATCH /dashboard/meal-plan/:recipe-id/add
Router.patch(
  '/meal-plan/:recipeId/add',
  ensureAuth,
  homeController.addToMealPlan
);

// @desc Remove from Meal Plan request
// @route PATCH /dashboard/meal-plan/:recipe-id/add
Router.patch(
  '/meal-plan/:recipeId/remove',
  ensureAuth,
  homeController.removeFromMealPlan
);

// @desc Confirm Meal Plan request
// @route PATCH /dashboard/meal-plan/:recipe-id/add
Router.patch(
  '/meal-plan/:mealPlanId/confirm',
  ensureAuth,
  homeController.confirmMealPlan
);

// @desc Meal Plan confirmed view page
// @route GET /dashboard/meal-plan/:mealPlanId/view
Router.get(
  '/meal-plan/:mealPlanId/view',
  ensureAuth,
  homeController.viewConfirmedMealPlan
);

module.exports = Router;
