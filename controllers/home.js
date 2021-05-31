const mongoose = require('mongoose')
const User = require('../models/User')
const MealPlan = require('../models/MealPlan')
const Recipe = require('../models/Recipe')
const moment = require('moment')
const { ObjectId } = require('bson')

const homeController = {
    getDashboard: (req, res) => {
        console.log(req.user)
        res.render('dashboard', { user: req.user })
    },
    getMealPlan: async (req, res) => {
        try {
            // Find all recipes
            const recipes = await Recipe.find({})

            // Find the logged in user
            const {user} = req.user;

            // Is there a recent UNCONFIRMED meal plan? Yes, then retrieve it. Else, create a new one. 
           // TODO: let user know they must either confirm previous meal plan, or delete it, in order to create a new one. 
           let threeDaysAgo = moment().subtract(3,'d').format('YYYY-MM-DD')
           const hasMealPlan = await MealPlan.find({
            userId: req.user._id,
            confirmDate: {$type: 10}, 
        })
        .sort({ createdAt: -1});

           let mealPlan

           if (hasMealPlan[0]){
            mealPlan = hasMealPlan[0];
           await mealPlan.populate('week').execPopulate();
            console.log(`POPULATED: `, mealPlan);
           } else {
                mealPlan = await MealPlan.create({
                    userId: req.user._id,
                    week: [],
                })
                console.log(`created: `, mealPlan);
            }
            console.log(mealPlan.populated('week'));
            res.render('mealPlanActive/all-recipes', { recipes, mealPlan, user, msg: null})

        } catch (error) {
            console.error(error);
        }
    },
    createMealPlan: async (req, res) => {
       
        // alternate: push each recipe id ref to an array on week. 
       try {
           // Find all recipes
           const recipes = await Recipe.find({})
           
           // Find the logged in user
           const {user} = req.user;

           // Is there a recent meal plan (within last 3 days)? Yes, then retrieve it. Else, create a new one. 
           // TODO: let user know they must either confirm previous meal plan, or delete it, in order to create a new one. 
            let threeDaysAgo = moment().subtract(3,'d').format('YYYY-MM-DD')
            const hasMealPlan = await MealPlan.find({
                userId: req.user._id,
                confirmDate: {$type: 10}, 
            })
            .sort({ createdAt: -1}).exec();

           console.log(hasMealPlan);
           

            // console.log(`is there a meal plan?? :`,hasMealPlan);

            let mealPlan;
            // check for an existing meal plan, otherwise create one. 
            if (hasMealPlan[0]){
                mealPlan = hasMealPlan[0];
            } else {
                mealPlan = await MealPlan.create({
                    userId: req.user._id,
                    week: [],
                })
            }
            console.log(`MEALPLAN: `, mealPlan);

            res.render('mealPlanActive/all-recipes', {recipes, user, mealPlan, msg: null} )
    } catch (err) {
        console.error(err);
    }
    },
    addToMealPlan: async (req, res) => {

       try { 
           // extract recipe ObjectId from req params
           const recipeId = ObjectId(req.params.recipeId)             
           
           // find selected recipe
           const recipe = await Recipe.findById(recipeId)
            console.log(`RETRIEVED RECIPE`, recipe)

            // retrieve array of existing meal plans sorted by most recently created
            const hasMealPlan = await MealPlan.findOneAndUpdate({
                userId: req.user._id,
                confirmDate: {$type: 10}, 
            }, {
                $addToSet: {week: recipeId},
                $currentDate: {updatedAt: true}
            }, {
                sort: { createdAt: -1},
                new: true,
                runValidators: true,
            });
            
            console.log(hasMealPlan)
            
            res.send('updated!')
            // res.redirect("back")
        } catch (err){
            console.error(err);
        }        
    },
};

module.exports = homeController;