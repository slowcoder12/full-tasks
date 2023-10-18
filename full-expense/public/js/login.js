

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit',function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginUser = {email,password};

    axios.post(`http://localhost:3000/login/${email}`,loginUser)
    .then(response=>{
        if(response.status === 200){
            alert("user logged in successfully")
        }
    })
    .catch(err=>{
        if(err.response.status === 401){
            alert(err.response.data.message);
        }

        else if(err.response.status === 404){
            alert(err.response.data.message);
        }
      
    });

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

    

})