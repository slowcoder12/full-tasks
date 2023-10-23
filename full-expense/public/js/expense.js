const form = document.querySelector("#expense-form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  const expenseObj = { amount, description, category };

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:3000/addExpense",
      expenseObj,
      {
        headers: { Authorization: token },
      }
    );
    const list = document.getElementById("exp-container");
    const newItem = document.createElement("li");
    console.log(response);

    newItem.innerHTML = `${amount} - ${description} - ${category} <button onClick = "deleteExp(${response.data.result.id})">Delete</button>`;
    newItem.setAttribute("data-id", response.data.result.id);
    list.appendChild(newItem);

    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
  } catch (err) {
    console.log("error occured", err);
  }
});

async function deleteExp(id) {
  try {
    const response = await axios.post(
      `http://localhost:3000/deleteExpense/${id}`
    );
    console.log(response);
    if (response.status === 200) {
      const li = document.querySelector(`[data-id = "${id}"]`);
      console.log(li);
      if (li) {
        li.remove();
      }
    }
  } catch (err) {
    console.log("error in deleting", err);
  }
}

async function displayItems() {
  try {
    const token = localStorage.getItem("token");
    const result = await axios.get("http://localhost:3000/displayItems", {
      headers: { Authorization: token },
    });
    const list = document.getElementById("exp-container");
    console.log(result);
    list.innerHTML = "";

    result.data.forEach((expense) => {
      const newItem = document.createElement("li");
      newItem.innerHTML = `${expense.amount} - ${expense.description} - ${expense.category} <button onclick="deleteExp('${expense.id}')">Delete</button>`;
      newItem.setAttribute("data-id", expense.id);
      list.appendChild(newItem);
    });
  } catch (err) {
    console.log("error occurred while fetching data", err);
  }
}

window.addEventListener("load", displayItems);
