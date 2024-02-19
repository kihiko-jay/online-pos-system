let position = 1; // Initialize the position variable

// Define a lookup table for barcodes, item descriptions, and prices
const itemLookup = {"001": { description: "1 kilogram of sugar", price: 10.00 },
"002": { description: "Blue Band margarine of 500 grams", price: 150.00 },
"003": { description: "1 kilogram of Maize Flour", price: 160.00 },
"004": { description: "Sunlight Washing Powder 500grams", price: 170.00 },
"005": { description: "Nike Pair Of Shoes Mne", price: 5000.00 },
"006": { description: "Men T-Shirt (large)", price: 799.00 },
"007": { description: "Menengai Bar Soap", price: 200.00 },
"008": { description: "Kienyeji Eggs", price: 20.00 },
"009": { description: "Britannia Biscuit", price: 250.00 },
"010": { description: "750ml Gordons Gin", price: 2000.00 },
"011": { description: "1 kg Sindano Rice", price: 189.00 },
"012": { description: "1 kilogram Cowpeasr", price: 450.00 },
"013": { description: "800grams UNited Bread", price: 110.00 },
"014": { description: "500ml Brookside Milk", price: 80.00 },
"015": { description: "1 litre Delmonte Mango Juice", price: 350.00 },
"016": { description: "500grams Harpic powder", price: 250.00 },
"017": { description: "1 kilogram greengrams", price: 300.00 },
"018": { description: "Royco Cubes 5grams", price: 10.00 },
"019": { description: "1 kilogram Kienyeji Chicken ", price: 750.00 },
"020": { description: "200grams Nivea Lotion", price: 299.00 },
  // Add more items as needed
};

function addItem() {
  const table = document.getElementById("posTable");
  const newRow = table.insertRow(-1);
  const positionCell = newRow.insertCell(0);
  const barcodeCell = newRow.insertCell(1);
  const descriptionCell = newRow.insertCell(2);
  const priceCell = newRow.insertCell(3);
  const quantityCell = newRow.insertCell(4);
  const totalCell = newRow.insertCell(5);

  positionCell.textContent = position++;
  barcodeCell.innerHTML = '<input type="number" oninput="lookupItem(this)" onkeydown="moveToNextCell(event, this, 4)">'; // Added event listener to move to quantity cell
  descriptionCell.innerHTML = '<span></span>'; // Placeholder for description
  priceCell.innerHTML = '<span></span>'; // Placeholder for price
  quantityCell.innerHTML = '<input type="number" oninput="calculateItemTotal(this)" onkeydown="moveToNextCell(event, this, 5)">'; // Added event listener to move to next row or quantity input of next row
  totalCell.textContent = 0;
}

function lookupItem(input) {
  const barcode = input.value;
  const row = input.parentElement.parentElement;
  const descriptionCell = row.cells[2].querySelector("span");
  const priceCell = row.cells[3].querySelector("span");
  const quantityInput = row.cells[4].querySelector("input");

  if (itemLookup.hasOwnProperty(barcode)) {
    descriptionCell.textContent = itemLookup[barcode].description;
    priceCell.textContent = itemLookup[barcode].price.toFixed(2);
    quantityInput.focus(); // Set focus to the quantity input field
  } else {
    descriptionCell.textContent = "Item not found";
    priceCell.textContent = "0.00";
  }
}

let consecutiveEmptyRows = 1; // Start with zero consecutive empty rows

function moveToNextCell(event, currentElement, nextCellIndex) {
  if (event.keyCode === 13) { // Check if the Enter key is pressed
    event.preventDefault(); // Prevent default behavior of the Enter key
    const row = currentElement.parentElement.parentElement;
    const nextRow = row.nextElementSibling; // Get the next row
    if (nextRow) {
      const nextInput = row.cells[nextCellIndex].querySelector("input"); // Get the input field of the next cell
      if (nextInput) {
        addItem(); // Add new row
        nextInput.focus(); // Set focus to the next input field
        
      }
    } else {
      // If there is no next row, add a new row and calculate the total
     
      calculateTotal(); // Calculate total for the last row
      addItem(); // Add new row
      
      //document.getElementById("cashReceived").focus(); // Set focus to the "Cash Received" input field
      //return; // Exit the function
    }
    
    // Check if the current row is empty
    if (isEmptyRow(row)) {
      consecutiveEmptyRows++; // Increment consecutive empty rows count
      if (consecutiveEmptyRows >= 2) {
        calculateTotal(); // Calculate total if two consecutive rows are empty
        const nextRowBarcodeInput = nextRow.cells[1].querySelector("input"); // Get the item barcode input of the next row
        if (nextRowBarcodeInput) {
          nextRowBarcodeInput.focus(); // Set focus to the item barcode input of the next row
        }
      }
    } else {
      consecutiveEmptyRows = 0; // Reset consecutive empty rows count
      calculateTotal(); // Calculate total
      const nextPositionCell = row.cells[0].nextElementSibling; // Get the next position cell
      if (nextPositionCell) {
        nextPositionCell.focus(); // Set focus to the next position cell
      }
    }
  }
}




  

// Function to check if a row is empty
function isEmptyRow(row) {
  const inputs = row.querySelectorAll("input[type='number']");
  return Array.from(inputs).every(input => !input.value);
}

function calculateItemTotal(input) {
  const row = input.parentElement.parentElement;
  const price = parseFloat(row.cells[3].querySelector("span").textContent);
  const quantity = parseFloat(input.value);
  const total = price * quantity;
  row.cells[5].textContent = total.toFixed(2);
}

function calculateTotal() {
  const table = document.getElementById("posTable");
  let totalAmount = 0;
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const total = parseFloat(row.cells[5].textContent);
    totalAmount += total;
  }
  document.getElementById("totalAmount").textContent = "Total Amount: " + totalAmount.toFixed(2);
}

function calculateBalance() {
  const cashReceived = parseFloat(document.getElementById("cashReceived").value);
  const totalAmount = parseFloat(document.getElementById("totalAmount").textContent.split(":")[1]);
  const balance = cashReceived - totalAmount;
  document.getElementById("balance").textContent = "Balance: " + balance.toFixed(2);
}
