const downloadbtn = document.getElementById("download-btn");

document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndPopulateTable();
  fetchReportData();
});

async function fetchDataAndPopulateTable() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/displayItems", {
      headers: { Authorization: token },
    });
    if (!response.status === 200) {
      throw new Error("Network response was not ok");
    }
    const data = response.data;
    console.log("expensedata==> ", data);

    const expenseTable = document.getElementById("expense-table");
    data.forEach((expense) => {
      const row = expenseTable.insertRow();
      const createdAt = new Date(expense.createdAt);
      row.insertCell(0).textContent = createdAt.toLocaleDateString();
      row.insertCell(1).textContent = expense.description;
      row.insertCell(2).textContent = expense.category;
      row.insertCell(3).textContent = expense.amount;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

downloadbtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/download", {
    headers: { Authorization: token },
  });
  console.log(response);

  if (response.data.fileURL) {
    const a = document.createElement("a");
    const link = document.getElementById("link");
    link.textContent = response.data.fileURL;
    a.href = response.data.fileURL;
    a.download = "expense.txt";
    a.click();
    saveLinkToDB(response.data.fileURL);
  } else {
    console.log("No file URL found in the response");
  }
});

async function saveLinkToDB(link) {
  const linkobj = { link };

  const token = localStorage.getItem("token");

  const response = await axios.post("http://localhost:3000/savelink", linkobj, {
    headers: { Authorization: token },
  });
}

async function fetchReportData() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/reportData", {
      headers: { Authorization: token },
    });
    if (!response.status === 200) {
      throw new Error("Network response was not ok");
    }
    const data = response.data;
    console.log("linkData==> ", data);

    const expenseTable = document.getElementById("expense-table1");
    data.forEach((expense) => {
      const row = expenseTable.insertRow();
      const createdAt = new Date(expense.createdAt);
      row.insertCell(0).textContent = createdAt.toLocaleDateString();
      row.insertCell(1).textContent = expense.link;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
