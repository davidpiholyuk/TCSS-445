const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

// Create a new connection to the MySQL database
const connection = mysql.createConnection({
    host: process.env.HOST,  // Database host, usually localhost for local development
    user: process.env.USER,  // Username for the database
    password: process.env.PASSWORD,  // Password for the database
    database: process.env.DATABASE,  // Name of the database
    port: process.env.DB_PORT

});

connection.connect((err) => {
    if (err) {
        console.log(err.message);

    }
    else {
        console.log("connected")
    }

});

class Service {
    static getServiceInstance() {
        return instance ? instance : new Service();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM Country`;
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            // console.log(response);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }

    async searchProperties(location, priceRange) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = `
                  SELECT *
                  FROM Listings
                  INNER JOIN Address_Zipcode ON Listings.AddressID = Address_Zipcode.AddressID
                  INNER JOIN Zip ON Address_Zipcode.ZipID = Zip.ZipID
                  INNER JOIN City ON Zip.CityID = City.CityID
                  WHERE City.\`City Name\` = ?
                `;

                const params = [location];

                console.log("price " + priceRange);
                if (priceRange) {
                    const [minPrice, maxPrice] = priceRange.split('-');
                    query += ` AND Listings.\`Listing Price\` BETWEEN ? AND ?`;
                    params.push(minPrice, maxPrice);
                }

                connection.query(query, params, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = Service;