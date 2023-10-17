const form = document.querySelector('#form');
form.addEventListener('submit',function(e){
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {name,email,password};
   // console.log(user);

    axios.post('http://localhost:3000/signup', user).then(response => {
        if (response.status === 200) {
            alert(response.data.message);  
        }
    })
    .catch(err => {
        //console.log(err);
        if (err.response && err.response.status === 400) {
            alert(err.response.data.message);
        }
    });
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
});

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit',function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginUser = {email,password};

    axios.get(`http://localhost:3000/login/${email}`,loginUser)
    .then(response=>{
        if(response.status === 200){
            alert("user logged in successfully")
        }
    })
    .catch(err=>{
        if(err.response.status === 400){
            alert(err.response.data.message);

        }
        else{
            alert("error occured");
        }
      
    });

    

})