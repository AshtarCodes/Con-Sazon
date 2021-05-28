const addIngredientBtn = document.querySelector('#addIngredientBtn');
const addIngredientRow = document.querySelector('#addIngredientRow');

addIngredientBtn.addEventListener('click', addIngredientField)

function addIngredientField (){
    let ingredientSection = document.querySelector('#ingredientsSection')
    let childCount = document.querySelector('#ingredientsSection').childElementCount;
    let newIngredientNum = Number(childCount) - 1;

    const fieldSet = document.createElement('fieldset')
    fieldSet.className = 'row mb-2 justify-content-center';

    const heading = document.createElement('h5')
    heading.innerText = `Ingredient ${newIngredientNum}`
    heading.classList.add('h4')

    const quantityDiv = document.createElement('div')
    quantityDiv.className = 'col-sm-4 p-3'

    const nameDiv = document.createElement('div')
    nameDiv.className = 'col-sm-4 p-3'

    const optionalDiv = document.createElement('div')
    optionalDiv.className = 'col-sm-4 p-3'

    const notesDiv = document.createElement('div')
    notesDiv.className = 'col-sm-4 p-3'

    // QUANTITY
    const quantitylabel = document.createElement('label')
    quantitylabel.setAttribute('for',`ingredient-${newIngredientNum}-quantity`)
    quantitylabel.classList.add('form-label')
    quantitylabel.innerText = `Quantity`

    const quantityinput = document.createElement('input')
    quantityinput.setAttribute('type','text')
    quantityinput.setAttribute('name',`ingredient-${newIngredientNum}-quantity`)
    quantityinput.setAttribute('id',`ingredient-${newIngredientNum}-quantity`)
    quantityinput.classList.add('form-control')

    // NAME
    const nameLabel = document.createElement('label')
    nameLabel.setAttribute('for',`ingredient-${newIngredientNum}-name`)
    nameLabel.classList.add('form-label')
    nameLabel.innerText = 'Name'

    const nameInput = document.createElement('input')
    nameInput.setAttribute('type','text')
    nameInput.setAttribute('name',`ingredient-${newIngredientNum}-name`)
    nameInput.setAttribute('id',`ingredient-${newIngredientNum}-name`)
    nameInput.classList.add('form-control')

    // OPTIONAL
    const optionalLabel = document.createElement('label')
    optionalLabel.setAttribute('for',`ingredient-${newIngredientNum}-optional`)
    optionalLabel.classList.add('form-label')
    optionalLabel.innerText = 'Optional?'

    const optionalSelect = document.createElement('select')
    optionalSelect.setAttribute('name',`ingredient-${newIngredientNum}-optional`)
    optionalSelect.setAttribute('id',`ingredient-${newIngredientNum}-optional`)
    optionalSelect.classList.add('form-control')

    const optionalNo = document.createElement('option')
    optionalNo.setAttribute('value','no')
    optionalNo.innerText = 'No'

    const optionalYes = document.createElement('option')
    optionalYes.setAttribute('value','yes')
    optionalYes.innerText = 'Yes'

    optionalSelect.append(optionalYes,optionalNo)
    // NOTES
    const notesLabel = document.createElement('label')
    notesLabel.setAttribute('for',`ingredient-${newIngredientNum}-notes`)
    notesLabel.classList.add('form-label')
    notesLabel.innerText = 'Notes'

    const notesInput = document.createElement('input')
    notesInput.setAttribute('type','text')
    notesInput.setAttribute('name',`ingredient-${newIngredientNum}-notes`)
    notesInput.setAttribute('id',`ingredient-${newIngredientNum}-notes`)
    notesInput.classList.add('form-control')
    
    quantityDiv.append(quantitylabel,quantityinput)
    nameDiv.append(nameLabel,nameInput)
    optionalDiv.append(optionalLabel,optionalSelect)
    notesDiv.append(notesLabel,notesInput)

    fieldSet.append(heading,quantityDiv,nameDiv,optionalDiv,notesDiv)

    // append ingredient fieldset right before the button to add ingredient fields
    addIngredientRow.insertAdjacentElement('beforebegin',fieldSet)
}