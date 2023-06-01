**Instructions:**

Install Node.js by visiting the official website: https://nodejs.org/en/download/ and follow the instructions for your operating system.

---

**Dependencies:**

- nodemon
- express
- mysql2
- dotenv

---

**Cloning the Repository:**


Clone the repository to your local machine.

---

**Changing Directory:**


Open your terminal/command prompt.
Navigate to the server folder in the project directory.
On Windows, you can use the following command: `cd path/to/project/server`
On macOS/Linux, you can use the following command: `cd path/to/project/server`

---

**Creating and Setting Up the .env File:**


Inside the server folder, create a new file and name it .env. Ensure that the filename starts with a dot and has no extension.
Open the .env file in a text editor.
Define the following environment variables, each on a separate line:


-PORT=<port_number>
-DB_USER=<database_username>
-DB_PASSWORD=<database_password>
-DB_NAME=<database_name>
-DB_HOST=<database_host>
-DB_PORT=<database_port>

Replace the placeholder values (<port_number>, <database_username>, etc.) with the appropriate values for your setup. For example:

-PORT=3000
-DB_USER=myuser
-DB_PASSWORD=mypassword
-DB_NAME=mydatabase
-DB_HOST=localhost
-DB_PORT=3306

Save the .env file.

---

**Installing Dependencies:**


In the terminal/command prompt, make sure you are in the server folder.

Run the following command to install the dependencies:

`npm install nodemon express mysql2 dotenv`

This command will install the required packages (nodemon, express, mysql2, dotenv) using npm (Node Package Manager).

---

**Starting the Server:**

Make sure you have a MySQL database set up and properly configured with the required credentials and connection details before running the server.

In the terminal/command prompt, still inside the server folder, run the following command to start the server:

`npm start`
