// When the page first loads, fetch the data from the database and populate the HTML table
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/getAll')
        .then(response => response.json());
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

// Get a reference to the "Add Listing" button
const addListingButton = document.getElementById("add-listing-button");

// Get a reference to the dropdown menu
const listingDropdown = document.getElementById("listing-dropdown");
const listingDropdownHead = document.getElementById("listing-dropdown-header");
// Add an event listener to handle the button click event
addListingButton.addEventListener("click", function () {
    if (listingDropdown.style.display == "none") {
        // Populate agent selection list
        fetch('http://localhost:3000/Agents')
            .then(response => response.json())
            .then(agentNames => {
                console.log(agentNames.data);
                const agents = agentNames.data;
                // Access the dropdown select element
                const dropdownSelect = document.getElementById('agent-name-input');

                // Iterate over the agent names and create option elements
                agents.forEach(agentName => {
                    const option = document.createElement('option');
                    option.value = agentName; // Set the value of the option to the agent name
                    option.textContent = agentName; // Set the visible text of the option to the agent name
                    dropdownSelect.appendChild(option); // Append the option to the dropdown select element
                });
            })

        // Populate zipcode selection list
        fetch('http://localhost:3000/Zipcodes')
            .then(response => response.json())
            .then(zipcodes => {
                console.log(zipcodes.data);
                const zips = zipcodes.data;
                // Access the dropdown select element
                const dropdownSelect = document.getElementById('zip-input');

                // Iterate over the agent names and create option elements
                zips.forEach(zip => {
                    const option = document.createElement('option');
                    option.value = zip; // Set the value of the option to the agent name
                    option.textContent = zip; // Set the visible text of the option to the agent name
                    dropdownSelect.appendChild(option); // Append the option to the dropdown select element
                });
            })
        listingDropdownHead.style.display = "flex";
        listingDropdown.style.display = "flex";
    } else {
        const agentdropdownSelect = document.getElementById('agent-name-input');
        agentdropdownSelect.innerHTML = '';
        const zipdropdownSelect = document.getElementById('zip-input');
        zipdropdownSelect.innerHTML = '';
        listingDropdown.style.display = "none";
        listingDropdownHead.style.display = "none";
    }
});

// Get a reference to the "Save Listing" button
const saveListingButton = document.getElementById("save-listing-button");

// Add an event listener to handle the button click event
saveListingButton.addEventListener("click", function () {

    // Retrieve the selected values from the dropdown menu
    const listingType = document.getElementById("listing-status-input").value;
    const streetName = document.getElementById("street-name-input").value;
    const listingPrice = document.getElementById("listing-price-input").value;

    //If the required fields aren't filled out do nothing
    if (!listingType || !streetName || !listingPrice) {
        return;
    }

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

// Display search results in an HTML table
function displaySearchResults(data) {
    const searchResultsContainer = document.querySelector('#property-search-results');

    // Create or clear the search results table
    let table = searchResultsContainer.querySelector('table');
    if (!table) {
        table = document.createElement('table');
        table.innerHTML = `
        <caption>Property Search Results</caption>
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

function displayPropertyDetails(data) {
    const propertyDetailsContainer = document.querySelector('#property-details');

    let table = propertyDetailsContainer.querySelector('table');
    if (!table) {
        table = document.createElement('table');
        table.innerHTML = `
      <caption>Property Results</caption>
        <tbody>
          ${Object.entries(data)
                .map(([key, value]) => `
              <tr>
                <td>${key}</td>
                <td>${value}</td>
              </tr>
            `)
                .join('')}
        </tbody>
      `;
        propertyDetailsContainer.appendChild(table);
    } else {
        table.querySelector('tbody').innerHTML = `
        ${Object.entries(data)
                .map(([key, value]) => `
            <tr>
              <td>${key}</td>
              <td>${value}</td>
            </tr>
          `)
                .join('')}
      `;
    }

    // Make the property details container visible
    propertyDetailsContainer.classList.remove('hidden');
}

// Event listener for the real estate agent form submission
const agentSearchForm = document.querySelector('#realestate-agent-search');
agentSearchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve the selected agent ID from the dropdown
    const agentSelect = document.querySelector('#agent-select');
    const selectedAgent = agentSelect.value;

    console.log(agentSelect);
    console.log(selectedAgent);

    // Send request to the backend to fetch properties associated with the agent
    fetch(`http://localhost:3000/agentProperties?agentID=${selectedAgent}`)


        .then(response => response.json())
        .then(data => displayAgentProperties(data))
        .catch(error => console.log(error));
});

function displayAgentProperties(agent) {
    data = agent.data;
    const searchResultsContainer = document.querySelector("#agent-search-results");

    // console.log(data);
    // Create or clear the search results table
    let table = searchResultsContainer.querySelector('table');
    if (!table) {
        table = document.createElement('table');
        table.innerHTML = `
        <caption>Agent Information</caption>
            <thead>
                <tr>
                    <th>Agent ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Years of Experience</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        searchResultsContainer.appendChild(table);
    } else {
        table.querySelector('tbody').innerHTML = '';
    }

    // Populate the table with agent information
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6">No agent found.</td>`;
        table.querySelector('tbody').appendChild(row);
    } else {
        data.forEach(agent => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${agent.AgentID}</td>
                <td>${agent['First Name']}</td>
                <td>${agent['Last Name']}</td>
                <td>${agent.Email}</td>
                <td>${agent['Phone Number']}</td>
                <td>${agent['Years of Experience']}</td>
            `;
            table.querySelector('tbody').appendChild(row);
        });
    }

    // Make the search results container visible
    searchResultsContainer.classList.remove('hidden');
}



document.querySelector("#city-select-form").addEventListener('submit', function (event) {
    event.preventDefault();

    const city = document.querySelector("#city-select").value;

    fetch(`http://localhost:3000/averagePrice?city=${city}`)
        .then(response => response.json())
        .then(data => displayAveragePrice(data))
        .catch(error => console.log(error));
});



// Display average price in an HTML table
function displayAveragePrice(prices) {

    data = prices.data;
    console.log(data);

    const searchResultsContainer = document.querySelector("#average-price-results");

    // Create or clear the results table
    let table = searchResultsContainer.querySelector('table');
    if (!table) {
        table = document.createElement('table');
        table.innerHTML = `
            <caption>Average Price Results</caption>
            <thead>
                <tr>
                    <th>City Name</th>
                    <th>Average Price</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        searchResultsContainer.appendChild(table);
    } else {
        table.querySelector('tbody').innerHTML = '';
    }

    // Populate the table with average price results
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="2">No results found.</td>`;
        table.querySelector('tbody').appendChild(row);
    } else {
        data.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result["City Name"]}</td>
                <td>${result["Average Price"]}</td>
            `;
            table.querySelector('tbody').appendChild(row);
        });
    }

    // Make the results container visible
    searchResultsContainer.classList.remove('hidden');
}

