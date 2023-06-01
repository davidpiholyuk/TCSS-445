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

    async searchAgent(agentID) {
        console.log("agent ID: " + agentID);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM Agent WHERE AgentID = ?`;

                connection.query(query, [agentID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAddresses() {
        try {
            const query = `SELECT \`Address\` FROM \`Address_zipcode\``;
            const results = await new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(results);
                    }
                });
            });
            const addresses = results.map((row) => row.Address);
            return addresses;
        } catch (error) {
            console.log(error);
            return [];
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

    async getAveragePrice(city) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
                SELECT \`City\`.\`City Name\`, AVG(\`Listings\`.\`Listing Price\`) AS \`Average Price\`
                FROM \`Listings\`
                JOIN \`Address_Zipcode\` ON \`Listings\`.\`AddressID\` = \`Address_Zipcode\`.\`AddressID\`
                JOIN \`Zip\` ON \`Address_Zipcode\`.\`ZipID\` = \`Zip\`.\`ZipID\`
                JOIN \`City\` ON \`Zip\`.\`CityID\` = \`City\`.\`CityID\`
                WHERE \`City\`.\`City Name\` = ?
                GROUP BY \`City\`.\`City Name\`, \`Zip\`.\`Zipcode\`
            `;



                connection.query(query, [city], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getHomesSold() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
                SELECT \`City\`.\`City Name\`, COUNT(\`Sales\`.\`SaleID\`) AS \`Number of Homes Sold\`
                FROM \`Sales\`
                JOIN \`Listings\` ON \`Sales\`.\`ListingID\` = \`Listings\`.\`ListingID\`
                JOIN \`Address_Zipcode\` ON \`Listings\`.\`AddressID\` = \`Address_Zipcode\`.\`AddressID\`
                JOIN \`Zip\` ON \`Address_Zipcode\`.\`ZipID\` = \`Zip\`.\`ZipID\`
                JOIN \`City\` ON \`Zip\`.\`CityID\` = \`City\`.\`CityID\`
                WHERE \`Sales\`.\`Sale Date\` >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
                GROUP BY \`City\`.\`City Name\`, \`Zip\`.\`Zipcode\`
            `;
            


                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    //Insert data into tables
    async insertNewData(agent, listingStatus, street, zip, bedrooms, bathrooms, 
        units, sqft, yearB, lot, appraisal, tax, price) {
        try {
            let query = `SELECT \`AgentID\` FROM (SELECT \`AgentID\`, CONCAT(\`First Name\`, ' ', \`Last Name\`) AS fullName FROM agent) AS sub WHERE fullName = '${agent}'`;
            const result = await new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(results);
                    }
                });
            });
            const agentID = result[0].AgentID;
            query = `SELECT ZipID FROM zip WHERE Zipcode = '${zip}'`;
            const result1 = await new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(results);
                    }
                });
            });
            const zipID = result1[0].ZipID;

            // Create a new Date object
            const currentDate = new Date();

            // Get the current year, month, and day
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
            const day = currentDate.getDate();

            // Format the date as a string (e.g., "2023-05-30")
            const date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
            const min = Math.ceil(100);
            const max = Math.floor(10000);
            const addressID = Math.floor(Math.random() * (max - min + 1)) + min;

            //insert into address_zipcode table
            query = `INSERT INTO \`Address_Zipcode\` (\`AddressID\`, \`Address\`, \`ZipID\`, \`# of Bedrooms\`, \`# of Bathrooms\`, \`# of Units\`, \`Square Feet (Total)\`, \`Year Built\`, \`Lot Size\`) VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
            
            let values = [addressID, street, zipID, bedrooms, bathrooms, units, sqft, yearB, lot];
            
            await new Promise((resolve, reject) => {
                connection.query(query, values, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                } else {
                    resolve(results);
                }
                });
            });

            //insert into listings table
            query = `INSERT INTO \`Listings\` (\`AddressID\`, \`AgentID\`, \`Listing Date\`, \`Listing Price\`, \`Listing Status\`, \`Appraisal Value\`, \`TaxID\`) VALUES 
            (?, ?, ?, ?, ?, ?, ?)`;
            values = [addressID, agentID, date, price, listingStatus, appraisal, tax];
            
            await new Promise((resolve, reject) => {
                connection.query(query, values, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                } else {
                    resolve(results);
                }
                });
            });           
            return true; // Return true to indicate successful insertion
        } catch (error) {
            console.error(error);
            throw error;
            }
    }
}

module.exports = Service;