// when the page first loads we want to grab all the data coming from the database
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));

});


// const addBtn = document.querySelector('#add-name-btn');
// addBtn.addEventListener('click', function () {
//     const nameInput = document.querySelector('#name-input');
//     const name = nameInput.value;
//     nameInput.value = "";

//     //send to backend
//     fetch('http://localhost:3000/insert', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({ name: name })
//     })
//         .then(response => response.json())
//         .then(data => insertRowIntoTable(data['data']));
// });

const propertySearchForm = document.querySelector('#property-search-form');
propertySearchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const locationInput = document.querySelector('#location-input');
    //  const propertyTypeInput = document.querySelector('#property-type-input');
    const priceRangeInput = document.querySelector('#price-range-input');

    const location = locationInput.value;
    //  const propertyType = propertyTypeInput.value;
    const priceRange = priceRangeInput.value;

    // Send search request to backend with location and price range
    fetch(`http://localhost:3000/search?location=${location}&priceRange=${priceRange}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.data));
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

    // data.forEach(result => {

    //     html += `<div class="result-item">
    //                 <h3>${result.ListingID}</h3>
    //                 <p>${result.AddressID}</p>
    //                 <p>${result['Listing Price']}</p>
    //                 <p>${result['Listing Status']}</p>
    //             </div>`;
    // });
    // Create table body rows
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