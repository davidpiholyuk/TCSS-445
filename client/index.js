// When the page first loads, fetch the data from the database and populate the HTML table
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});

// Event listener for the property search form submission
const propertySearchForm = document.querySelector('#property-search-form');
propertySearchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve the search criteria values from the form inputs
    const locationInput = document.querySelector('#location-input');
    const priceRangeInput = document.querySelector('#price-range-input');
    const location = locationInput.value;
    const priceRange = priceRangeInput.value;

    // Send search request to the backend with the location and price range
    fetch(`http://localhost:3000/search?location=${location}&priceRange=${priceRange}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.data));
});

// Event listener for the "Add Listing" button click event
const addListingButton = document.getElementById("add-listing-button");
const listingDropdown = document.getElementById("listing-dropdown");
addListingButton.addEventListener("click", function () {
    // Show the dropdown menu
    listingDropdown.style.display = "block";
});

// Event listener for the "Save Listing" button click event
const saveListingButton = document.getElementById("save-listing-button");
saveListingButton.addEventListener("click", function () {
    // Retrieve the selected values from the dropdown menu and perform further processing
    const listingType = document.getElementById("listing-status-input").value;
    const streetName = document.getElementById("street-name-input").value;
    const listingPrice = document.getElementById("listing-price-input").value;

    // Hide the dropdown menu and clear the input fields
    listingDropdown.style.display = "none";
    document.getElementById("listing-status-input").value = "";
    document.getElementById("street-name-input").value = "";
    document.getElementById("listing-price-input").value = "";
});

// Display search results in an HTML table
function displaySearchResults(data) {
    const searchResultsContainer = document.querySelector('#property-search-results');

    // Create or clear the search results table
    let table = searchResultsContainer.querySelector('table');
    if (!table) {
        table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Listing ID</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        searchResultsContainer.appendChild(table);
    } else {
        table.querySelector('tbody').innerHTML = '';
    }

    // Populate the table with search results
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">No results found.</td>`;
        table.querySelector('tbody').appendChild(row);
    } else {
        data.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.ListingID}</td>
                <td>${result.Address}</td>
                <td>${result['Listing Price']}</td>
                <td>${result['Listing Status']}</td>
            `;
            table.querySelector('tbody').appendChild(row);
        });
    }

    // Make the search results container visible
    searchResultsContainer.classList.remove('hidden');
}

// Event listener for the property selection form submission
const propertySelectionForm = document.querySelector('#property-selection-form');
propertySelectionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Retrieve the selected address from the dropdown menu and send a request to fetch property details
    const addressSelect = document.querySelector('#address-select');
    const selectedAddress = addressSelect.value;
    fetch(`http://localhost:3000/propertyDetails?addressID=${selectedAddress}`)
        .then(response => response.json())
        .then(data => displayPropertyDetails(data))
        .catch(error => console.log(error));
});

// Display property details in a container
function displayPropertyDetails(property) {
    const propertyDetailsContainer = document.querySelector('#property-details');
    propertyDetailsContainer.innerHTML = '';

    // Create HTML elements to display property details
    const addressHeading = document.createElement('h2');
    addressHeading.textContent = `Property Details for ${property.Address}`;

    const listingIdParagraph = document.createElement('p');
    listingIdParagraph.textContent = `Listing ID: ${property.ListingID}`;

    const priceParagraph = document.createElement('p');
    priceParagraph.textContent = `Price: ${property['Listing Price']}`;

    const statusParagraph = document.createElement('p');
    statusParagraph.textContent = `Status: ${property['Listing Status']}`;

    // Append the elements to the container
    propertyDetailsContainer.appendChild(addressHeading);
    propertyDetailsContainer.appendChild(listingIdParagraph);
    propertyDetailsContainer.appendChild(priceParagraph);
    propertyDetailsContainer.appendChild(statusParagraph);

    // Make the property details container visible
    propertyDetailsContainer.classList.remove('hidden');
}
