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

document.getElementById("leaderboard").style.display = "none";
document
  .getElementById("prem-btn")
  .addEventListener("click", async function (e) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/buyPremium",
        null,
        {
          headers: { Authorization: token },
        }
      );

      //console.log("ressssspoonnseee", response);

      const key_id = response.data.key_id;
      const order_id = response.data.order.orderId;

      let options = {
        key: key_id,
        order_id: order_id,
        handler: async function (response) {
          console.log("response===>>.", response);
          try {
            await axios.post(
              "http://localhost:3000/updateTransactionStatus",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            );

            alert("You are a premium user now");

            const premMsg = document.getElementById("prem-msg");
            premMsg.innerText = "You are now a Premium User";

            document.getElementById("prem-btn").style.display = "none";
          } catch (error) {
            console.error("Error updating transaction status:", error);
            alert("Transaction failed. Please try again.");
          }
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
      e.preventDefault();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Transaction failed. Please try again.");
    }
  });

async function checkPrem(token) {
  try {
    const response = await axios.get("http://localhost:3000/checkPremium", {
      headers: { Authorization: token },
    });
    //console.log(response);
    if (response.data === true) {
      const premMsg = document.getElementById("prem-msg");
      premMsg.innerText = "You are now a Premium User";

      document.getElementById("prem-btn").style.display = "none";
      document.getElementById("leaderboard").style.display = "block";
    } else {
      const premMsg = document.getElementById("prem-msg");
      premMsg.innerText = "";

      document.getElementById("prem-btn").style.display = "block";
      document.getElementById("leaderboard").style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
}

document
  .getElementById("leaderboard")
  .addEventListener("click", getLeaderBoard);
async function getLeaderBoard() {
  try {
    const response = await axios.get("http://localhost:3000/leaderBoard");
    console.log(response);
    response.data.forEach((user) => {
      const leaderboardStats = document.getElementById("leaderboardStats");
      const newItem = document.createElement("li");
      newItem.innerHTML = `${user.user.name} - Total Expense: $${user.totalExpense}`;
      leaderboardStats.appendChild(newItem);
    });
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("load", () => {
  const token = localStorage.getItem("token");
  checkPrem(token);
  displayItems();
});
