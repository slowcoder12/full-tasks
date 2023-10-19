const form = document.querySelector('#expense-form');
form.addEventListener('submit', async function (e){
    e.preventDefault()

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const expenseObj = {amount,description,category};
   

    try{
        const response = await axios.post('http://localhost:3000/login/addExpense', expenseObj);
        const list = document.getElementById('exp-container');
        const newItem = document.createElement('li');

        newItem.innerHTML = `${amount} - ${description} - ${category} <button>Delete<button>`
        list.appendChild(newItem);

    }
    catch(err) {
console.log('error occured',err);

    }

});