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

            // CRITICAL: How to handle a confirmed meal plan?
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

           console.log(`FIND array: `, hasMealPlan);
           
           // check for an existing meal plan, otherwise create one. 
           let mealPlan;
           if (hasMealPlan[0]){
               mealPlan = hasMealPlan[0];
               console.log(`FIND DOC: `, mealPlan);
            } else {
                mealPlan = await MealPlan.create({
                    userId: req.user._id,
                    week: [],
                })
                console.log(`CREATE DOC: `, mealPlan);
            }
           
            res.render('mealPlanActive/all-recipes', {recipes, user, mealPlan, msg: null} )
    } catch (err) {
        console.error(err);
    }
    },
    addToMealPlan: async (req, res) => {
        // TODO: if recipe already in meal plan, then 'click' unselects and removes from meal plan. 
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
            // redirect back to meal plan selection 
            // res.send('updated!')
            res.redirect("/dashboard/meal-plan")
        } catch (err){
            console.error(err);
        }        
    },
    getActiveSingleRecipe: async (req, res) => {
        try {
            // convert recipeId into MongoDb ObjectId 
            const recipeId = ObjectId(req.params.recipeId)
    
            const singleRecipe = await Recipe.findById(recipeId)
            
            res.render('mealPlanActive/single-recipe', { singleRecipe })
        } catch (error) {
            console.error(error);
        }
    }, 
    removeFromMealPlan: async (req, res) => {
        try {
            // get recipe ObjectId
            const recipeId = ObjectId(req.params.recipeId)
    
            // delete recipeId from MealPlan instance while MealPlan is not confirmed
            await MealPlan.findOneAndUpdate({
                userId: req.user._id,
                confirmDate: {$type: 10}, 
            }, {
                $pull: {week: recipeId},
                $currentDate: {updatedAt: true}
            }, {
                sort: { createdAt: -1},
                new: true,
            });     
    
            res.redirect("/dashboard/meal-plan")            
        } catch (error) {
            console.error(error);
        }
    },
    confirmMealPlan: async (req, res) => {
        try {
            // retrieve mealPlanId and convert into ObjectId
            const mealPlanId = ObjectId(req.params.mealPlanId);
    
            const confirmed = await MealPlan.findOneAndUpdate({
                _id: mealPlanId,            
            }, {
                $currentDate: {updatedAt: true},
                $currentDate: {confirmDate: true}
            }, {
                sort: { createdAt: -1},
                new: true,
            });
    
            console.log(`CONFIRMED PLAN? `,confirmed);
    
            res.redirect(`/dashboard/meal-plan/${mealPlanId}/view`)            
        } catch (error) {
            console.error(error);
        }
    },
    viewConfirmedMealPlan: async (req, res) => {
        try {
            // retrive meal plan id and 
            const mealPlanId = ObjectId(req.params.mealPlanId);
            
            // retrive confirmed meal plan by id
            const confirmedMealPlan = await MealPlan
            .findById(mealPlanId)
            .populate('week');
            
            console.log(`viewConfirm: `, confirmedMealPlan);
            // res.send('going to confirmed view page')
            if (confirmedMealPlan.confirmDate){
                res.render('mealPlanActive/meal-plan', {mealPlan: confirmedMealPlan, user: req.user, msg: null})
            } else {
                //REQ.FLASH ERROR?
                res.redirect('/dashboard')
            }            
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports = homeController;