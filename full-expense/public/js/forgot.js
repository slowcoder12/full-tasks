const form = document.getElementById("forgot-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const obj = { email };

  const response = await axios.post(
    "http://43.204.236.189:3000/forgotPassword",
    obj
  );

  console.log(response);
  if (response.status === 200) {
    alert(response.data.message);
  }
});
