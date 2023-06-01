// Import necessary modules
const mysql = require('mysql2');  // MySQL library for Node.js
const express = require('express');  // Express.js library for building web servers

// Create an instance of an Express app
const app = express();

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const service = require('./service');

// To be able to send data to backend
app.use(cors());
// send in json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/**routes*/

// Insert data into db
app.post('/insert', (request, response) => {
    const db = service.getServiceInstance();
    const {
      agent,
      listingStatus,
      street,
      zip,
      bedrooms,
      bathrooms,
      units,
      sqft,
      year,
      lot,
      appraisal,
      tax,
      price,
    } = request.body;    
    console.log(request.body);

    // Call the insertNewData method on your database service instance
    db.insertNewData(agent, listingStatus, street, zip, bedrooms, bathrooms, units, sqft, year, lot, appraisal, tax, price)
     .then(() => {
       response.json({ success: true });
     })
     .catch(error => {
       console.error(error);
       response.json({ success: false, error: error.message });
    });
});

// read
app.get('/getAll', (request, response) => {
    const db = service.getServiceInstance();

    const result = db.getAllData();
    result.then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });
});


//read
app.get('/search', (request, response) => {
    const { location, priceRange } = request.query;
    const db = service.getServiceInstance();

    db.searchProperties(location, priceRange)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});


app.get('/propertyDetails', (request, response) => {
    const { addressID } = request.query;
    const db = service.getServiceInstance();

    db.getPropertyDetails(addressID)
        .then(data => response.json(data))
        .catch(err => console.log(err));
});

app.get('/agentProperties', (request, response) => {
    console.log("here");

    const { agentID } = request.query;

    const db = service.getServiceInstance();
    console.log(agentID);


    db.searchAgent(agentID)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/Addresses', (request, response) => {
    const db = service.getServiceInstance();
    db.getAddresses()
        .then(data => response.json({ data: data }))
        .catch(error => console.log(error));
});

app.get('/Agents', (request, response) => {
    const db = service.getServiceInstance();
    db.getAgents()
        .then(data => response.json({ data: data }))
        .catch(error => console.log(error));
});

app.get('/Zipcodes', (request, response) => {
    const db = service.getServiceInstance();
    db.getZipcodes()
        .then(data => response.json({ data: data }))
        .catch(error => console.log(error));
});

app.get('/averagePrice', (request, response) => {
    const { city } = request.query;
    const db = service.getServiceInstance();
    db.getAveragePrice(city)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/homesSold', (request, response) => {
    const db = service.getServiceInstance();
  
    db.getHomesSold()
      .then(data => response.json({ data: data }))
      .catch(err => console.log(err));
  });

app.listen(process.env.PORT, () => console.log('app is running'));
