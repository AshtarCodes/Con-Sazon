const { create, all } = require('mathjs')
const config = {  }
const math = create(all, config)
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



let x = math.unit('1 tablespoon')

let a = '1 cup'
let z = math.evaluate(`number(${a}, floz)`)
console.log(math.round(z)) // prints 8

let y = math.unit('1 cup')
console.log(y.to('floz').toString()); // prints '7.9999 floz'

module.exports = { math }