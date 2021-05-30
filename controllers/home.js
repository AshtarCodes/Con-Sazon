const mongoose = require('mongoose')
const User = require('../models/User')
const MealPlan = require('../models/MealPlan')
const Recipe = require('../models/Recipe')
const moment = require('moment')

const homeController = {
    getDashboard: (req, res) => {
        console.log(req.user)
        res.render('dashboard', { user: req.user })
    },
    createMealPlan: async (req, res) => {
        // pseudocode: have an event listener for all recipes, when btn is clicked that recipe Id is added to an object. if the amount of properties is >=7, then a fetch Post request is made. 
        // alternate: push each recipe id ref to an array on week. 
       try {
           // console.log(`moment: `, lessThan3Days);
           // Is there a recent meal plan (within last 3 days)? Yes, then retrieve it. Else, create a new one. 
            let lessThan3Days = moment().subtract(3,'d').format('YYYY-MM-DD')
            const hasMealPlan = await MealPlan.find({createdAt: { $gt: lessThan3Days}, 
                userId: req.user._id,
            }).exec(); 

            console.log(`is there a meal plan?? :`,hasMealPlan);

            let mealPlan;

            if (hasMealPlan[0]._id){
                mealPlan = hasMealPlan;
            } else {
                mealPlan = await MealPlan.create({
                    userId: req.user._id,
                    week: {
                        day1: null,
                        day2: null,
                        day3: null,
                        day4: null,
                        day5: null,
                        day6: null,
                        day7: null,
                    },
                })
            }
            console.log(`MEALPLAN: `, mealPlan);

            // Find all recipes
            const recipes = await Recipe.find({})

            res.render('mealPlanActive/all-recipes', {recipes, user: req.user, mealPlan, msg: null} )
    } catch (err) {
        console.error(err);
    }
    },
    postToMealPlan: async (req,res) => {

        // retrieve existing meal plan        
        let lessThan3Days = moment().subtract(3,'d').format('YYYY-MM-DD')
        const hasMealPlan = await MealPlan.find({createdAt: { $gt: lessThan3Days}, 
            userId: req.user._id, 
            confirmDate: {$eq: null}
        }).exec();
        // update existing meal plan object
        // loop over the keys
        // const entries = Object.keys(req.body)
        // const updates = {}
        // console.log(`Body: `, req.body)
        // console.log(`Entries: `, entries)

        // for (let key of entries){
        //     updates[key] = Object.values(req.body)[key]
        // }
        // console.log(`reassigned Entries: `, updates);

        // let recipeName = req.param.recipe-path.split('-').map(c => c.charAt(0).toUppercase() + c.slice(1)).join(' ');
        // console.log(recipeName);

        // const requestedRecipe = await Recipe.findAndModify({recipeName: recipeName})
        // // Find all recipes
        const recipes = await Recipe.find({})

        // // Find meal plans
        // const mealPlan = await MealPlan.find({}) || null;

        res.redirect("mealPlanActive/all-recipes")
        
    }
}

module.exports = homeController;