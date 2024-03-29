const { ObjectId } = require("bson");
const MealPlan = require("../models/MealPlan");
const Recipe = require("../models/Recipe");
const { sumIngredientQuantities } = require("../middleware/math");

/* User flow from Dashboard: 
**   + Btn 1: "View current meal plan" 
            (GET controller.viewConfirmedMealPlan -redirect- /dashboard/meal-plan/:mealPlanId/view) 
**     - check if most recent plan is confirmed  
**       - if plan is confirmed, display it
**       - else, redirect to selections view (/dashboard/meal-plan) where it can be edited and/or confirmed
**         - click Confirm Btn -> PATCH controller.confirmMealPlan -rd-to- /dashboard/meal-plan/:mealPlanId/view) 
**   + Btn 2: "create new plan" requests: POST /dashboard/meal-plan/create -using- controller.createMealPlan 
**     - if existing unconfirmed plan, just redirect to GET /dashboard/meal-plan
**     - else if no unconfirmed plans, then creates new plan + redirects to GET -> /dashboard/meal-plan  
**       - GET -> /dashboard/meal-plan -- only displays most recent unconfirmed meal plan
**         - optionally, allow an option to "Clear all selections" next to confirm selections. Make user confirm submission first.
** 
!        Address edge case: manual GET to dashboard/mealPlan route
**     - add if statement were it tells user to create meal plan with Btn 
*/

const homeController = {
  getDashboard: async (req, res) => {
    try {
      const { user } = req;

      const lastUpdatedMealPlan = await MealPlan.find({
        userId: req.user.id,
      })
        .sort({ updatedAt: -1 })
        .populate("week");

      const mealPlan = lastUpdatedMealPlan[0];

      res.render("dashboard", { user, mealPlan });
    } catch (error) {
      console.error("Get Dashboard");
      console.error(error);
    }
  },
  getMealPlan: async (req, res) => {
    try {
      // Find all recipes
      const recipes = await Recipe.find({});

      // Find the logged in user
      const { user } = req.user;

      // TODO: let user know they must either confirm previous meal plan, or delete it, in order to create a new one.
      /*
       * - Find most recent unconfirmed meal plan
       *   -
       */
      const hasMealPlan = await MealPlan.find({
        userId: req.user._id,
        confirmDate: { $type: 10 },
      }).sort({ createdAt: -1 });

      let mealPlan = hasMealPlan;

      if (hasMealPlan[0]) {
        mealPlan = hasMealPlan[0];

        await mealPlan.populate("week").execPopulate();
      } else {
        // mealPlan = await MealPlan.create({
        //     userId: req.user._id,
        //     week: [],
        // })
        // console.log(`created: `, mealPlan);
      }
      res.render("mealPlanActive/all-recipes", {
        recipes,
        mealPlan,
        user,
        msg: null,
      });
    } catch (error) {
      console.error(error);
    }
  },
  createMealPlan: async (req, res) => {
    try {
      // Find all recipes
      const recipes = await Recipe.find({});

      // Find the logged in user
      const { user } = req.user;

      /*
       * - check for an existing unconfirmed meal plan
       *   - if existing unconfirmed plan, just redirect to GET /dashboard/meal-plan
       *   - else if no unconfirmed plans, then creates new plan + redirects to GET -> /dashboard/meal-plan
       */

      const hasMealPlan = await MealPlan.find({
        userId: req.user._id,
        confirmDate: { $type: 10 },
      })
        .sort({ createdAt: -1 })
        .exec();

      let mealPlan;
      if (hasMealPlan[0]) {
        mealPlan = hasMealPlan[0];
      } else {
        mealPlan = await MealPlan.create({
          userId: req.user._id,
          week: [],
        });
      }

      res.redirect("/dashboard/meal-plan");
    } catch (err) {
      console.error(err);
    }
  },
  addToMealPlan: async (req, res) => {
    // TODO: if recipe already in meal plan, then 'click' unselects and removes from meal plan.
    try {
      // extract recipe ObjectId from req params
      const recipeId = ObjectId(req.params.recipeId);

      // find selected recipe
      const recipe = await Recipe.findById(recipeId);

      // retrieve array of existing meal plans sorted by most recently created
      const hasMealPlan = await MealPlan.findOneAndUpdate(
        {
          userId: req.user._id,
          confirmDate: { $type: 10 },
        },
        {
          $addToSet: { week: recipeId },
          $currentDate: { updatedAt: true },
        },
        {
          sort: { createdAt: -1 },
          new: true,
          runValidators: true,
        }
      );
      // redirect back to meal plan selection
      // res.send('updated!')
      res.redirect("/dashboard/meal-plan");
    } catch (err) {
      console.error(err);
    }
  },
  getActiveSingleRecipe: async (req, res) => {
    try {
      // convert recipeId into MongoDb ObjectId
      const recipeId = ObjectId(req.params.recipeId);

      const singleRecipe = await Recipe.findById(recipeId);

      res.render("mealPlanActive/single-recipe", {
        singleRecipe,
        user: req.user,
      });
    } catch (error) {
      console.error(error);
    }
  },
  removeFromMealPlan: async (req, res) => {
    try {
      // get recipe ObjectId
      const recipeId = ObjectId(req.params.recipeId);

      // delete recipeId from MealPlan instance while MealPlan is not confirmed
      await MealPlan.findOneAndUpdate(
        {
          userId: req.user._id,
          confirmDate: { $type: 10 },
        },
        {
          $pull: { week: recipeId },
          $currentDate: { updatedAt: true },
        },
        {
          sort: { createdAt: -1 },
          new: true,
        }
      );

      res.redirect("/dashboard/meal-plan");
    } catch (error) {
      console.error(error);
    }
  },
  confirmMealPlan: async (req, res) => {
    try {
      // retrieve mealPlanId and convert into ObjectId
      const mealPlanId = ObjectId(req.params.mealPlanId);
      // TODO: refactor into: find mealplan by id, if not confirmed then confirm, else redirect without updating
      const confirmed = await MealPlan.findOneAndUpdate(
        {
          _id: mealPlanId,
        },
        {
          $currentDate: { updatedAt: true },
          $currentDate: { confirmDate: true },
        },
        {
          sort: { createdAt: -1 },
          new: true,
        }
      );

      res.redirect(`/dashboard/meal-plan/${mealPlanId}/view`);
    } catch (error) {
      console.error(error);
    }
  },
  viewConfirmedMealPlan: async (req, res) => {
    try {
      // retrive meal plan id and
      const mealPlanId = await ObjectId(req.params.mealPlanId);

      // retrieve confirmed meal plan by id
      const confirmedMealPlan = await MealPlan.findById(mealPlanId)
        .populate("week")
        .lean();

      /* How to get a sum of all ingredient quantities
             1. map until ingredientParsed array
             2. get product, quantity, and unit as key-value pairs in a list of objects
             the goal is to only have unique products, and to merge all quantities of like products together.
             so add quantities for all instances of plantain and display both side to side
             {product: plaintain, quantity: 5, unit: items}
             [plantain, 5 items] (can concat and parse quantities with Math.js)
            */
      // TODO: Refactor into separate function.
      const groupByIngredientName = confirmedMealPlan.week
        .map((meal) => meal.ingredients)
        .flat()
        .map((item) => item.ingredientParsed)
        .reduce((acc, current, i) => {
          let { quantity, unit, product } = current;

          // these are lowercase strings or null
          unit = unit !== null ? unit.toLowerCase() : unit;
          product = product !== null ? product.toLowerCase() : product;

          // create a key for every defined product
          if (!acc[product] && product !== null) {
            acc[product] = [];
          }

          // if defined unit, then
          if (unit !== null && product !== null) {
            acc[product].push([quantity, unit]);
          } else if (unit === null && quantity !== null) {
            acc[product].push([quantity]);
          }
          return acc;
        }, {});

      const shoppingList = sumIngredientQuantities(groupByIngredientName);

      // If confirmed, continue. else, redirect
      if (confirmedMealPlan.confirmDate) {
        res.render("mealPlanActive/meal-plan", {
          mealPlan: confirmedMealPlan,
          user: req.user,
          shoppingList,
          msg: null,
        });
      } else {
        req.flash(
          "errors",
          "You don't have any confirmed meal plans! Please confirm selections on an existing plan, or create a new one."
        );
        res.redirect("/dashboard/meal-plan");
      }
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = homeController;
