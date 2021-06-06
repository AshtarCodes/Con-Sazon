const math = require('mathjs')

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
/* As Arrays of values
 math.evaluate('[3,7,5] oz').toString() // '[3 oz, 7 oz, 5 oz]'

 math.evaluate('[3,7,5] oz').map(el => el.to('lb')).toString()
 returns '[0.1875 lb, 0.4375 lb, 0.3125 lb]'
*/

// Define a function to convert any common unit to pounds, Liters, or  