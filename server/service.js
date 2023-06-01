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

                console.log(params);

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

    async getPropertyDetails(addressID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
              SELECT *
              FROM Listings
              INNER JOIN Address_Zipcode ON Listings.AddressID = Address_Zipcode.AddressID
              INNER JOIN Zip ON Address_Zipcode.ZipID = Zip.ZipID
              INNER JOIN City ON Zip.CityID = City.CityID
              WHERE Listings.AddressID = ?
            `;

                connection.query(query, [addressID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0]); // Assuming only one row will be returned
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchAgent(agentName) {
        console.log("agent name " + agentName);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT \`AgentID\`, \`First Name\`, \`Last Name\`, \`Phone Number\`, \`Email\` FROM Agent WHERE \`First Name\` LIKE ? OR \`Last Name\` LIKE ?`;

                connection.query(query, [`%${agentName}%`, `%${agentName}%`], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAgents() {
        try {
          const query = "SELECT CONCAT(`First Name`, ' ', `Last Name`) AS `fullName` FROM Agent";
          const results = await new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                } else {
                    resolve(results);
                }
            });
          });
            const agentNames = results.map((row) => row.fullName);
            return agentNames;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getZipcodes() {
        try {
            const query = "SELECT `Zipcode` FROM zip";
            const results = await new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(results);
                    }
                });
            });
          
            const zipcodes = results.map((row) => row.Zipcode);
            return zipcodes;
        } catch (error) {
            console.log(error);
            return [];
        }
    }





}

module.exports = Service;