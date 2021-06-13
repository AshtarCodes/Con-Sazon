const { create, all, fermiCouplingDependencies } = require('mathjs')
const config = {  }
const math = create(all, config)
const Recipe = require('../models/Recipe')
const mongoose = require('mongoose')
/* 
Already defined units
--MASS--
gram (g)
ounce (oz)
lb (lbs) - does not include "pound"

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


// Testing mathjs syntax here
math.createUnit('oolong', '1 cup')
let unit = 'cup'
let x = math.unit(3,'oolong').to(unit)
let a = math.unit(1, 'oolong').to(unit)
let result = math.add(x,a)

// console.log(math.unit(1,'lbs').to('oz').toString())
// console.log(math.unit(1,'lbs').formatUnits());
// console.log(result.formatUnits()); // "cup"
// console.log(result.toNumber().toFixed(1) + ` ${result.formatUnits()}`); // 1.1 cup

// let z = math.evaluate(`number(${a}, grams)`)
// console.log(math.round(z)) // prints 8

let y = math.unit('1 cup')
// console.log(y.to('floz').toString()); // prints '7.9999 floz'
// console.log(`IS INSTANCE? `,math.typeOf(y) == 'Unit');

// IN USE
math.createUnit('stalk', {definition: '1 cup', aliases: ['stalks']})
math.createUnit('pound', {definition: '16 oz', aliases: ['pounds', 'lb', 'lbs']}, {override: true})
math.createUnit('bunch', {definition: '1 cup', aliases: ['bunches']})
math.createUnit('clove', {definition: '1 teaspoon', aliases: ['cloves']})

// consider turning this into class methods that manage amounts returned
const definedUnits = {
    teaspoon: 'tablespoon',
    tablespoon: 'cup',
    cup: 'cup',
    stalk: 'stalk',
    pound: 'pound',
    bunch: 'bunch',
    clove: 'cloves',
    ounce: 'ounce',    
}

const ignoreProductUnits = ['salt', 'oregano', 'lime', 'lemon', 'oil', 'cumin', 'paprika', 'powder', 'sauce']

// console.log(math.unit);
module.exports = { math, definedUnits, ignoreProductUnits }