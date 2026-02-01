// Load Records
let records = JSON.parse(localStorage.getItem("records")) || [];

// Default Incentive Scheme
let incentiveScheme =
  JSON.parse(localStorage.getItem("incentiveScheme")) ||
  {
    remarks: {
      "EXPAT": 1000,
      "SAVING": 250,
      "CLUB": 1000,
      "BUSINESS": 1000,
      "PRESTIGE": 1000,
      "MINOR": 300,
      "VANTAGE": 2000,
      "SALARY": 300,
      "ASP": 250,
      "SENIOR": 250,
      "LADIES": 250,
      "POS": 1000
    },

    percentages: {
      "TERM INVESTMENT": {
        NEW: 0.25,
        EXISTING: 0.15
      },

      "FACILITY": {
        NEW: 0.25,
        EXISTING: 0.15
      }
    }
  };
  
localStorage.setItem("incentiveScheme", JSON.stringify(incentiveScheme));


// Load Remark Dropdown
function loadRemarkOptions() {
  let remarkSelect = document.getElementById("remark");

  remarkSelect.innerHTML =
    `<option value="">Select Remark</option>`;

  Object.keys(incentiveScheme).forEach(type => {
    let option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    remarkSelect.appendChild(option);
  });
}


// Dashboard Summary Totals
function updateDashboard() {

  // Total Incentive
  let total = records.reduce((sum, r) => sum + r.incentive, 0);
  document.getElementById("totalIncentive").innerText =
    total.toFixed(2);

  // CIF Count
  document.getElementById("totalCIF").innerText =
    records.length;

  // TI Achieved
  let tiTotal = records
    .filter(r => r.service === "TERM INVESTMENT")
    .reduce((sum, r) => sum + r.amount, 0);

  document.getElementById("tiAchieved").innerText =
    tiTotal.toLocaleString();

  // Facility Achieved
  let facilityTotal = records
    .filter(r => r.service === "FACILITY")
    .reduce((sum, r) => sum + r.amount, 0);

  document.getElementById("facilityAchieved").innerText =
    facilityTotal.toLocaleString();
}


// Monthly Dashboard Table
function loadMonthlyDashboard() {

  let dashboardBody =
    document.getElementById("monthlyDashboard");

  dashboardBody.innerHTML = "";

  let months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  months.forEach(month => {

    let monthRecords = records.filter(r => {
      let recordMonth =
        new Date(r.date).toLocaleString("en-US", { month: "long" });
      return recordMonth === month;
    });

    let cifCount = monthRecords.length;

    let incentiveTotal =
      monthRecords.reduce((sum, r) => sum + r.incentive, 0);

    let tiTotal =
      monthRecords.filter(r => r.service === "TERM INVESTMENT")
                  .reduce((sum, r) => sum + r.amount, 0);

    let facilityTotal =
      monthRecords.filter(r => r.service === "FACILITY")
                  .reduce((sum, r) => sum + r.amount, 0);

    let row = `
      <tr>
        <td>${month}</td>
        <td>LKR ${incentiveTotal.toFixed(2)}</td>
        <td>${cifCount}</td>
        <td>${tiTotal.toLocaleString()}</td>
        <td>${facilityTotal.toLocaleString()}</td>
      </tr>
    `;

    dashboardBody.innerHTML += row;
  });
}


// Auto-fill today's date in the date input
window.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");

    // Get today's date in YYYY-MM-DD format (required by HTML date input)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;
});

// Save Record Form
document.getElementById("recordForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();

    let date = document.getElementById("date").value;
    let customer = document.getElementById("customer").value;
    let cif = document.getElementById("cif").value;

    let status = document.getElementById("status").value;
    let service = document.getElementById("service").value;

    let amount = parseFloat(document.getElementById("amount").value);
    let remark = document.getElementById("remark").value;

    // Incentive Calculation
    let incentive = 0;

    

    // Base incentive 0.25% for NEW TERM INVESTMENT or FACILITY
    if (status === "NEW" && (service === "TERM INVESTMENT" || service === "FACILITY")) {
      incentive += amount * 0.0025;
    } else {
      incentive += amount * 0.0015;
    }





    // Extra incentive from Remark Scheme
    if (remark && incentiveScheme[remark]) {
      incentive += incentiveScheme[remark];
    }

    let record = {
      date,
      customer,
      cif,
      status,
      service,
      amount,
      remark,
      incentive
    };

    // Save record to localStorage
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));

    alert("Record Saved Successfully!");

    this.reset();

    // Reset date to today after clearing the form
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    document.getElementById("date").value = `${year}-${month}-${day}`;

    updateDashboard();
    loadMonthlyDashboard();
});

// Run On Load
loadRemarkOptions();
updateDashboard();
loadMonthlyDashboard();