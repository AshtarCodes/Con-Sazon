
// Middleware for parsing request body for ingredient and instruction fields 
function groupByProperty(body, substr) {
   const arr = Object.entries(body)
              .filter(([key]) => key.includes(substr))
              .reduce((accumulator, [key, value]) => {
                const [, i, keyName] = key.split('-');
                if (!accumulator[i-1]) {
                   accumulator[i-1] = {};
                }
                accumulator[i-1][keyName] = value;
                return accumulator;
              }, []);
    return arr;
};

// Per MDN, this replaces most if not all URL delimiters including [ !, ', (, ), *]
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}


module.exports = {
    groupByProperty, fixedEncodeURIComponent
};