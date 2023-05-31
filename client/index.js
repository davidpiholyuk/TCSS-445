// when the page first loads we want to grab all the data coming from the database
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));

});

console.log("Before adding event listener");
const propertySearchForm = document.querySelector('#property-search-form');
propertySearchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const locationInput = document.querySelector('#location-input');
    //  const propertyTypeInput = document.querySelector('#property-type-input');
    const priceRangeInput = document.querySelector('#price-range-input');

    const location = locationInput.value;
    //  const propertyType = propertyTypeInput.value;
    const priceRange = priceRangeInput.value;
    console.log("PRICE::: " + priceRange);

    // Send search request to backend with location and price range
    fetch(`http://localhost:3000/search?location=${location}&priceRange=${priceRange}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.data));
});
console.log("After adding event listener");

// Get a reference to the "Add Listing" button
const addListingButton = document.getElementById("add-listing-button");

// Get a reference to the dropdown menu
const listingDropdown = document.getElementById("listing-dropdown");

// Add an event listener to handle the button click event
addListingButton.addEventListener("click", function() {
    // Show the dropdown menu
    listingDropdown.style.display = "block";
});

// Get a reference to the "Save Listing" button
const saveListingButton = document.getElementById("save-listing-button");

// Add an event listener to handle the button click event
saveListingButton.addEventListener("click", function() {

    // Retrieve the selected values from the dropdown menu
    const listingType = document.getElementById("listing-status-input").value;
    const streetName = document.getElementById("street-name-input").value;
    const listingPrice = document.getElementById("listing-price-input").value;

    // Perform further processing or validation with the selected values
    console.log("Listing Type:", listingType);
    console.log("Street Name:", streetName);
    console.log("Listing Price:", listingPrice);

    // Hide the dropdown menu
    listingDropdown.style.display = "none";

    // Clear the input fields
    document.getElementById("listing-status-input").value = "";
    document.getElementById("street-name-input").value = "";
    document.getElementById("listing-price-input").value = "";
});


function displaySearchResults(data) {
    const searchResultsContainer = document.querySelector('#property-search-results');
    let html = '';

    if (data.length === 0) {
        html = '<p>No results found.</p>';
        return;
    }

    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Create table header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
    <th>Listing ID</th>
    <th>Address</th>
    <th>Price</th>
    <th>Status</th>
  `;
    tableHead.appendChild(headerRow);

    data.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${result.ListingID}</td>
      <td>${result.Address}</td>
      <td>${result['Listing Price']}</td>
      <td>${result['Listing Status']}</td>
    `;
        tableBody.appendChild(row);
    });


    table.appendChild(tableHead);
    table.appendChild(tableBody);

    searchResultsContainer.innerHTML = '';
    searchResultsContainer.appendChild(table);
    //  searchResultsContainer.innerHTML = html;
}



function insertRowIntoTable(data) {

}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    console.log(data);


    let tableHtml = "";
    if (data.length === 0) {
        table.innerHTML = "<tr><td class = 'no-data' colspan = '5'>No Data</td></tr>";
    }
}