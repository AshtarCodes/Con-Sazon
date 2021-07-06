/* eslint-disable no-restricted-syntax */
const { create, all, fermiCouplingDependencies } = require('mathjs');

const config = {};
const math = create(all, config);
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
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
math.createUnit('oolong', '1 cup');
const cup = 'cup';
const x = math.unit(3, 'oolong').to(cup);
const a = math.unit(1, 'oolong').to(cup);
const result = math.add(x, a);

// console.log(math.unit(1,'lbs').to('oz').toString())
// console.log(math.unit(1,'lbs').formatUnits());
// console.log(result.formatUnits()); // "cup"
// console.log(result.toNumber().toFixed(1) + ` ${result.formatUnits()}`); // 1.1 cup

// let z = math.evaluate(`number(${a}, grams)`)
// console.log(math.round(z)) // prints 8

const y = math.unit('1 cup');
// console.log(y.to('floz').toString()); // prints '7.9999 floz'
// console.log(`IS INSTANCE? `,math.typeOf(y) == 'Unit');

// IN USE
math.createUnit('stalk', { definition: '1 cup', aliases: ['stalks'] });
math.createUnit(
  'pound',
  { definition: '16 oz', aliases: ['pounds', 'lb', 'lbs'] },
  { override: true }
);
math.createUnit('bunch', { definition: '1 cup', aliases: ['bunches'] });
math.createUnit('clove', { definition: '1 teaspoon', aliases: ['cloves'] });

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
};

const ignoreProductUnits = [
  'salt',
  'oregano',
  'lime',
  'lemon',
  'oil',
  'cumin',
  'paprika',
  'powder',
  'sauce',
];

// P: obj of arrays; R: Obj of string; E: {product: '5 items'};
// Ps: convert to object.entries, loop through sub arrays and
// 1. assume same units, check each unit error,
// get a count of how many ingredients have diff units, then how many units in each one
function sumIngredientQuantities(obj) {
  const itemQuantities = obj;
  let finalQuantity = [];
  try {
    // eslint-disable-next-line no-restricted-syntax
    // eslint-disable-next-line guard-for-in
    for (const item in itemQuantities) {
      // loop through sub arrays
      if (!ignoreProductUnits.some((el) => item.includes(el))) {
        const quantities = itemQuantities[item];
        // console.log(`QUANTITIES: `, quantities);

        // parse array of quantity arrays
        for (const quantity of quantities) {
          const num = quantity[0];
          let unit = quantity[1] ? quantity[1] : null;
          // console.log(`NUM AND UNIT: `, num, unit);

          // if it's a whole item, unit is null.
          if (unit == null) {
            finalQuantity.push(num);
          } else if (!definedUnits[unit]) {
            // for now, ignore it. eventually define it and convert.
          } else if (definedUnits[unit]) {
            // if it's a nice unit, do some conversion and add things
            // ~!!~ TODO: implement ignore list, and handle small item quantities ~~!!~~***

            const unitToConvertTo = definedUnits[unit];
            unit = math.unit(num, unit).to(unitToConvertTo);

            /* If quantity is small, convert current unit to a smaller unit. E.g: 0.1 cup to tablespoons. 
            if (unit.toNumber() < 1) {
            }
            */

            finalQuantity.push(unit);
          }
        }

        // if product quantities are all whole items (e.g 1 red pepper), add them up
        if (finalQuantity.every((el) => typeof el === 'number')) {
          finalQuantity = `${finalQuantity.reduce(
            (acc, c) => acc + c,
            0
          )} item`;

          // if product quantities are defined units in our system, add them up
        } else if (finalQuantity.every((el) => math.typeOf(el) === 'Unit')) {
          // if all elements are mathjs units, add them up
          finalQuantity = finalQuantity.reduce((acc, unit, i) => {
            if (i === 0) {
              const start = math.unit(0, unit.formatUnits());
              acc = math.add(start, unit);
            } else {
              acc = math.add(acc, unit);
            }
            return acc;
          }, 0);
          // display with 1 decimal place and unit: 1.1 cup
          finalQuantity = `${finalQuantity
            .toNumber()
            .toFixed(1)} ${finalQuantity.formatUnits()}`;

          // if not a whole item or a defined unit, then leave it blank
        } else {
          finalQuantity = null;
        }
      } else {
        // if in the ignored product units list, provide no quantity
        finalQuantity = null;
      }
      // set the current product to this single quantity
      itemQuantities[item] = finalQuantity || null;

      // reset the quantity
      finalQuantity = [];
    }
    return itemQuantities;
  } catch (error) {
    console.error(error);
  }
}
// console.log(math.unit);
module.exports = {
  math,
  definedUnits,
  ignoreProductUnits,
  sumIngredientQuantities,
};
