/* eslint-disable no-restricted-syntax */
const { create, all } = require('mathjs');

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
/* math.createUnit('oolong', '1 cup');
const cup = 'cup';
const x = math.unit(3, 'oolong').to(cup);
const a = math.unit(1, 'oolong').to(cup);
const result = math.add(x, a); */

// console.log(math.unit(1,'lbs').to('oz').toString())
// console.log(math.unit(1,'lbs').formatUnits());
// console.log(result.formatUnits()); // "cup"
// console.log(result.toNumber().toFixed(1) + ` ${result.formatUnits()}`); // 1.1 cup

// let z = math.evaluate(`number(${a}, grams)`)
// console.log(math.round(z)) // prints 8

// const y = math.unit('1 cup');
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
  teaspoon: { standard: 'teaspoon', small: 'teaspoon', large: 'tablespoon' },
  tablespoon: { standard: 'tablespoon', small: 'teaspoon', large: 'cup' },
  cup: { standard: 'cup', small: 'tablespoon', large: null },
  stalk: { standard: 'stalk', small: null, large: null },
  pound: { standard: 'pound', small: 'ounce', large: null },
  bunch: { standard: 'bunch', small: null, large: null },
  clove: { standard: 'cloves', small: null, large: null },
  ounce: { standard: 'ounce', small: null, large: 'pound' },
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
  'cayenne pepper',
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
      if (!ignoreProductUnits.some((el) => item.includes(el))) {
        // If product not in the "ignore" list, then
        const quantities = itemQuantities[item];

        // parse array of quantity arrays
        for (const quantity of quantities) {
          const num = quantity[0];
          // if it's a whole item (e.g 1 banana), unit is null.
          let unit = quantity[1] ? quantity[1] : null;

          if (unit == null) {
            finalQuantity.push(num);
          } else if (!definedUnits[unit]) {
            // TODO: If unit is not recognized, then define it
            // right now, it leaves finalQuantity empty.
          } else if (definedUnits[unit]) {
            const unitToConvertTo = definedUnits[unit].standard; // teaspoon returned as tablespoon unit
            unit = math.unit(num, unit).to(unitToConvertTo); // 3 teaspoon -> 1 tablespoon

            finalQuantity.push(unit);
          }
        }
        // ! End of for-of quantities loop
        // if product quantities are all whole items (e.g 1 red pepper), add them up
        if (finalQuantity.every((el) => typeof el === 'number')) {
          const amount = finalQuantity.reduce((acc, c) => acc + c, 0);
          finalQuantity = `${amount} ${amount > 1 ? 'items' : 'item'}`;

          // if product quantities are defined mathjs units in our system, add them up
        } else if (finalQuantity.every((el) => math.typeOf(el) === 'Unit')) {
          finalQuantity = finalQuantity.reduce((acc, unit, i) => {
            if (i === 0) {
              const start = math.unit(0, unit.formatUnits());
              acc = math.add(start, unit);
            } else {
              acc = math.add(acc, unit);
            }
            return acc;
          }, 0);

          const num = finalQuantity.toNumber();

          const unit = finalQuantity.formatUnits();

          // display with 1 decimal place and unit: 1.1 cup
          let displayQuantity = `${num.toFixed(1)} ${unit}`;

          // TODO: Handle small quantities. 1 tsp vinegar -> 0.3 tbsp. 1 pinch -> 0 item
          /* ! If quantity is small, convert current unit to a smaller unit. E.g: 0.1 cup to tablespoons.
           */
          // '< 1/2 tablespoon => teaspoon', '< '
          let unitToConvertTo;
          let convertedUnit; // teaspoon returned as tablespoon unit
          if (
            (num < 0.5 && unit === 'tablespoon') ||
            (num < 0.1 && unit === 'cup')
          ) {
            unitToConvertTo = definedUnits[unit].small;
            console.log('CONVERT TO SMALL: ', unitToConvertTo);
          } else if (
            (num > 4 && unit === 'tablespoon') ||
            (num >= 3 && unit === 'teaspoon') ||
            (num >= 16 && unit === 'ounce')
          ) {
            unitToConvertTo = definedUnits[unit].large;
            console.log('CONVERT TO LARGE : ', unitToConvertTo);
          }
          // 3 teaspoon -> 1 tablespoon
          convertedUnit =
            unitToConvertTo != undefined
              ? math.unit(num, unit).to(unitToConvertTo)
              : null;

          displayQuantity =
            convertedUnit !== null ? convertedUnit : displayQuantity;

          finalQuantity = displayQuantity;

          console.log('ITEM QUANTITY: ', finalQuantity);
          // if not a whole item or a defined unit, then leave it blank
        } else {
          finalQuantity = null;
        }
      } else {
        // if in the ignored product units list, provide no quantity
        finalQuantity = null;
      }
      /* set the current product to this single quantity
      E.g. { garlic: 10 cloves }
      */
      itemQuantities[item] = finalQuantity !== '0 item' ? finalQuantity : null;

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
