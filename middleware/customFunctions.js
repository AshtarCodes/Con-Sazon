
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

module.exports = {
    groupByProperty
};