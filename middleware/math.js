const { create, all } = require('mathjs')
const config = {  }
const math = create(all, config)
const Recipe = require('../models/Recipe')
const mongoose = require('mongoose')
/* 
Already defined units
--MASS--
gram (g)
ounce (oz)

--VOLUME--
teaspoon
tablespoon
liter (l, L, lt, liter)

--LIQUID VOLUME--
fluidounce (floz)
cup (cp)
pint (pt)
quart (qt)
gallon (gal)

**to test**
1 pound (lb)

*/
/* usage


 Converting b/w number and fraction
 const a = math.number(0.3)
 const b = math.fraction(a)   // 3/10
 math.number(b)   // 0.3
*/

/* 
Inputs
integers and fractions in teaspoon, tablespoon, cup, oz, lb

Outputs
cup, oz, lb, liter, gallon, items. 
*/
// Define a function to convert any common unit to pounds, Liters, or  



/* Convert 
cup
teaspoon
tablespoon
clove
bunch
ounce
stalk
pound
*
*
*/
//build class to get count of all units
// async function countUnits () {
//     try {
//         const ingredients = await Recipe.find({})
//         console.log(`INGREDIENTS `,ingredients)
        
//     } catch (error) {
//         console.error(error);
//     }
// }

// try {
//     countUnits()
    
// } catch (error) {
//     console.error(error)
// }
let unit = 'cup'
let x = math.unit(3,'tablespoon').to(unit)
let a = math.unit(1, 'teaspoon').to(unit)
let result = math.add(x,a)

// console.log(result);
// console.log(result.toNumber().toFixed(1) + ` ${unit}`);
console.log(result.formatUnits());

// let z = math.evaluate(`number(${a}, grams)`)
// console.log(math.round(z)) // prints 8

let y = math.unit('1 cup')
// console.log(y.to('floz').toString()); // prints '7.9999 floz'
// console.log(`IS INSTANCE? `,math.typeOf(y) == 'Unit');

const definedUnits = {
    teaspoon: 'cup',
    tablespoon: 'cup',
    cup: 'cup',    
}

const ignoredProducts = ['salt', 'oregano', 'lime', 'lemon',  ]

// console.log(math.unit);
module.exports = { math, definedUnits }