const { ObjectId, ObjectID } = require('bson')
const mongoose = require('mongoose')
const User = require('./User')

// Plan is to use mongoose aggregation to auto-populate recipes. 

const MealPlan = new mongoose.Schema({
    _id: $oid,
    userId: User._id,
    week: {
        day1: ObjectId,
        day2: ObjectId,
        day3: ObjectId,
        day4: ObjectId,
        day5: ObjectId,
        day6: ObjectId,
        day7: ObjectId,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    confirmed: false
})


module.exports = mongoose.model('MealPlan', MealPlan)