const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const User = require('./User')
const Recipe = require('./Recipe')

// Plan is to use mongoose aggregation to auto-populate recipes. 

const MealPlan = new mongoose.Schema({    
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    week: {
        day1: {type: ObjectId, ref: "Recipe"},
        day2: {type: ObjectId, ref: "Recipe"},
        day3: {type: ObjectId, ref: "Recipe"},
        day4: {type: ObjectId, ref: "Recipe"},
        day5: {type: ObjectId, ref: "Recipe"},
        day6: {type: ObjectId, ref: "Recipe"},
        day7: {type: ObjectId, ref: "Recipe"},        
    },
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()},
    confirmDate: {type: Date, default: null},
})

module.exports = mongoose.model('MealPlan', MealPlan)

