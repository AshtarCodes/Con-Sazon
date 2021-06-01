# Meal plan roadmap and feature list 

# RIGHT NOW
1. delete from meal selections

## Working
**Non-auth**
- all recipes
- single recipe

**Auth**
- local auth
- dashboard
- create meal plan and add recipes

## Left To Do
###### High priority
- confirming meal plan selections
- validation of confirmed vs unconfirmed meal plans
- displaying populated meal plan selections
- aggregating shopping list based on selections
- partial for navigating around mealPlanActive
###### medium priority
- favorited recipes
- filtering by category
- validating upload recipe form 
- setting upload recipe form to upload to UserRecipes model

###### low priority
- twitter and google auth. potentially pinterest auth for images.
- view to see history of meal plans  
- optimizing render by specifying `projection/select()` and `lean()` to mongoose docs
- set cloudinary images to lazy loading
- req.flash messages on meal plan