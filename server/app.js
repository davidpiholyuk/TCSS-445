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
    // console.log(request.body);
    const {name} = request.body;

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
})

// update

// delete

app.listen(process.env.PORT, () => console.log('app is running'));
 //app.listen(3000, () => console.log(`App listening at http://localhost:${3000}`));

// // Port number for the server to listen on
// const port = 3000;

// // Define a route handler for GET requests to /country
// app.get('/', (req, res) => {



//     // Connect to the database
//     connection.connect(function (err) {
//         if (err) {
//             return console.error('error: ' + err.message);  // If an error occurs during connection, log it
//         }
//         console.log('Connected to the MySQL server.');  // If connection is successful, log it
//     });

//     // SQL query to get data from the Country table
//     let sql = `SELECT * FROM Country WHERE countryID=?`;

//     // Send the query to the database
//     connection.query(sql, [req.query.id], (error, results) => {
//         if (error) {
//             return console.error(error.message);  // If an error occurs during the query, log it
//         }
//         res.send(results);  // If the query is successful, send the results back to the client
//     });

//     // Close the database connection
//     connection.end(function (err) {
//         if (err) {
//             return console.log('error:' + err.message);  // If an error occurs while closing the connection, log it
//         }
//         console.log('Close the database connection.');  // If the connection is successfully closed, log it
//     });
// });

// // Start the server and have it listen on the given port
// app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
