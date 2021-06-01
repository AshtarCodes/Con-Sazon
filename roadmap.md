# Meal plan roadmap and feature list 

# Working On RIGHT NOW
- populate ingredients in confirmed view

## Working
**Non-auth**
- all recipes
- single recipe

**require Auth**
- local auth
- dashboard
- create meal plan and add or remove selections
- displaying populated meal plan selections
- confirming meal plan selections
- navigate to confirmed meal plan from dashboard

## Left To Do
###### High priority
- validation of confirmed vs unconfirmed meal plans
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