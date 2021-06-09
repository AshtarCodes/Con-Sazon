const axios = require('axios')

module.exports = {
    parseIngredients: async (ingredients) => {
        try {
            if (!Array.isArray(ingredients)){
                throw 'Invalid data type passed to parseIngredients. Please pass an array.';
            }
            const url = 'https://sandbox.zestfuldata.com/parseIngredients'
            const {data} = await axios.post(url, {
                "ingredients": ingredients
            },{
              Headers: "Content-Type: application/json"
            });
            if(data.error){
              throw `Zestful error: ${data.error}`;
            } else {
              return data.results;
            }          
        } catch (error) {
            console.error(error);
        }
    }
}

/*
Expected response

{
  "results": [
    {
      "ingredientRaw": "3 large Granny Smith apples",
      "ingredientParsed": {
        "quantity": 3.0,
        "unit": null,
        "productSizeModifier": "large",
        "product": "Granny Smith apples",
        "preparationNotes": null,
        "usdaInfo": {
            "category": "Fruits and Fruit Juices",
            "description": "Apples, raw, granny smith, with skin (Includes foods for USDA's Food Distribution Program)",
            "fdcId": "168203",
            "matchMethod": "exact"
        }
      },
      "confidence": 0.9242,
      "error": null
    },
  ]
}
*/