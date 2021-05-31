const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const User = require('./User')
const Recipe = require('./Recipe')

// Plan is to use mongoose aggregation to auto-populate recipes. 

const MealPlanSchema = new mongoose.Schema({    
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    week: [{type: mongoose.Schema.Types.ObjectId, ref: "Recipe"}],
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()},
    confirmDate: {type: Date, default: null},
})

// create index to expire unconfirmed documents after 72 hours

module.exports = mongoose.model('MealPlan', MealPlanSchema)
