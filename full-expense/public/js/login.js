
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit',async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginUser = {email,password};
    try {

    const response = await axios.post(`http://localhost:3000/login/${loginUser.email}`,loginUser);
        if(response.status === 200){

            alert("user logged in successfully");
            
        }
        window.location.href = 'expense.html';
    }
    catch(err) {
        if(err.response.status === 401){
            alert(err.response.data.message);
        }

        else if(err.response.status === 404){
            alert(err.response.data.message);
        }
      
    };

      

    

})