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

// create
app.post('/insert', (request, response) => {
    console.log(request.body);
    const { name } = request.body;
    const db = service.getServiceInstance();
    const result = db.insertNewName(name);
    result
        .then(data => response.json({ success: true }))
        .catch(err => console.log(err));
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


//read
app.get('/search', (request, response) => {
    const { location, priceRange } = request.query;
    const db = service.getServiceInstance();

    db.searchProperties(location, priceRange)
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// update

// delete


app.listen(process.env.PORT, () => console.log('app is running'));
