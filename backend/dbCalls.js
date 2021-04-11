const express = require("express");
const mysql = require("mysql");
const bcrypt = require('bcryptjs');
const { isBuffer } = require("util");
const saltRounds = 10;
const app = express();
const endPointRoot = "/API/V1/";

// database configurations
const db_config = {
    host: "us-cdbr-east-03.cleardb.com",
    user: "ba4e3935ecff67",
    password: "978424e4",
    database: "heroku_cbe7d1675678dee",
    timeout: 1000000
};

// types of errors and the respective status codes and messages to send back to client
const errorTypes = {
    'ER_DUP_ENTRY': 'There is already an account registered with this email.',
    'INCORRECT_PASSWORD': 'The password you entered is incorrect.',
    'INVALID_EMAIL': 'No account registered to email entered.',
    'LISTS_NOT_FOUND': 'No lists were found.',
    'INVALID_ADMIN_CREDENTIALS': 'Invalid Credentials - Admin Access Denied.',
    'LIST_NOT_FOUND': 'List not found.'
}

let pool = mysql.createPool(db_config);

// Function to log an API endpoint execution in the database
logAPICall = function(method, endpoint) {
    console.log("INSIDE logAPICall");
    let query = `INSERT INTO stats (method, endpoint, count) 
                VALUES ('${method}', '${endpoint}', 1) 
                ON DUPLICATE KEY UPDATE count=count+1`
    pool.query(query, (err, result) => {
        if (err) {
            console.log(err.code);
        } else {
            console.log('API call logged');
        }
    });
}

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', 'https://krystalwong.azurewebsites.net');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    console.log("Request method: " + req.method);
    console.log("URL: " + req.url);
    next();
});


////////////////////////////// LIST ENDPOINTS //////////////////////////////////////

// Get all lists for the specified user ID
app.get(endPointRoot + "list/:userId", (req, res) => {
    console.log(`Getting all lists for userId: ${req.params.userId}`);
    logAPICall(req.method, endPointRoot + "list/userId");

    let query = `SELECT * FROM lists WHERE userId = '${req.params.userId}'`;
    pool.query(query, (err, result) => {
        console.log(result);
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});

// Get list by list ID
app.get(endPointRoot + "list/:listId/name", (req, res) => {
    console.log(`Getting list name for id: ${req.params.listId}`);
    logAPICall(req.method, endPointRoot + "list/listId/name");

    let query = `SELECT * FROM lists WHERE id = '${req.params.listId}'`;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        } else if (result == '[{}]'){
            res.sendStatus(404).send(errorTypes['LIST_NOT_FOUND']);
        } else {
            console.log("List name found");
            res.send(result);
        }
    });
});



// Create a new list for the user
app.post(endPointRoot + "list/:userId", (req, res) => {
    console.log(`Creating list for userId: ${req.params.userId}`);
    logAPICall(req.method, endPointRoot + "list/userId");

    // get data sent from client
    let data = '';
    req.on('data', chunk => {
       data += chunk;
    });

    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj);

        let query = `INSERT INTO lists (userId, listName) VALUES ('${req.params.userId}', '${dataObj.listName}')`;
        console.log(query);
        pool.query(query, (err, result) => {
            if (err) {
                console.log(err.code);
                res.sendStatus(500).send("List could not be created.")
            } else {
                console.log(result);
                let dbResult = JSON.parse(JSON.stringify(result))
                let listId = dbResult.insertId;
                console.log("New list record inserted with id: " + listId);
                res.status(200).send(JSON.stringify(listId));
            }
        });
    });
});

// Update a list
app.put(endPointRoot + "list/:listId", (req, res) => {
    console.log("Updating list name");
    logAPICall(req.method, endPointRoot + "list/listId");

    // get data sent from client
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
 
    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj);

        let query = `UPDATE lists SET listName = '${dataObj.listName}' WHERE id = ${req.params.listId}`;
        console.log(query);

        pool.query(query, (err, result) => {
            if (err) {
                res.status(500).send("List name could not be updated.")
            } else {
                res.send("List name updated.");
            }
        })
    });
});

// Delete list by listId
app.delete(endPointRoot + "list/:listId", (req, res) => {
    console.log("Deleting list");
    logAPICall(req.method, endPointRoot + "list/listId");

    let query = `DELETE FROM lists WHERE id = '${req.params.listId}'`;
    pool.query(query, (err, result) => {
        if (err) {
            res.sendStatus(404).send("Could not find list.")
        } else {
            console.log(result);
            res.sendStatus(200);
        }
    });
});

// Get all list items for a specific list
app.get(endPointRoot + "list/:listId/listItem", (req, res) => {
    console.log(`Getting list items for list: ${req.params.listId}`);
    logAPICall(req.method, endPointRoot + "list/listId/listItem");

    let query = `SELECT * from listItems WHERE listId = ${req.params.listId}`;
    pool.query(query, (err, result) => {
        if (err) {
            res.send(400).send("Could not get list items.")
        } else {
            res.send(result);
        }
    });
});

// Add a new list item to a list
app.post(endPointRoot + "list/:listId/listItem", (req, res) => {
    console.log(`Adding a new list item for list: ${req.params.listId}`);
    logAPICall(req.method, endPointRoot + "list/listId/listItem");

    // get data sent from client
    let data = '';  
    req.on('data', chunk => {
      data += chunk;
    })

    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj); 

        let query = `INSERT INTO listItems (listId, item, isChecked) VALUES ('${req.params.listId}', '${dataObj.item}', ${dataObj.isChecked})`;
        console.log(query);

        pool.query(query, (err, result) => {
            if (err) {
                console.log(err.code);
                console.log('List item could not be created in DB.');
                throw err;
            } else {
                console.log(result);
                let dbResult = JSON.parse(JSON.stringify(result))
                let listItemId = dbResult.insertId;
                console.log("New list item record inserted with id: " + listItemId);
                res.status(200).send(JSON.stringify(listItemId));
            }
        });
    });
});

// Update an existing list item in a list
app.put(endPointRoot + "list/:listId/:listItemId", (req, res) => {
    console.log(`Updating a list item (id: ${req.params.listItemId}) for list: ${req.params.listId}`);
    logAPICall(req.method, endPointRoot + "list/listId/listItemId");

    // get data sent from client
    let data = '';
    req.on('data', chunk => {
       data += chunk;
    });
 
    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj); 
 
        let query = `UPDATE listItems SET item = '${dataObj.item}', isChecked = ${dataObj.isChecked}
                    WHERE listId = '${req.params.listId}' AND id = '${req.params.listItemId}'`;
        console.log(query);
 
        pool.query(query, (err, result) => {
            if (err) {
                throw err;
            } else {
                res.sendStatus(200);
            }
        });
    });
});

// Delete a list item from a list
app.delete(endPointRoot + "list/:listId/:listItemId", (req, res) => {
    console.log(`Deleteing a list item (id: ${req.params.listItemId}) for list: ${req.params.listId}`);
    logAPICall(req.method, endPointRoot + "list/listId/listItemId");

    let query = `DELETE FROM listItems WHERE listId = '${req.params.listId}' AND id = '${req.params.listItemId}'`;

    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.sendStatus(200);
        }
    }); 
});

///////////////////////////// USER PREFERENCES ENDPOINTS ///////////////////////////

// Get the user preferences for the userId
app.get(endPointRoot + "preferences/:userId", (req, res) => {
    console.log(`Getting user prefernces for user: ${req.params.userId}`);
    logAPICall(req.method, endPointRoot + "preferences/userId");

    let query = `SELECT * FROM userPreferences WHERE userId = '${req.params.userId}'`;
    console.log(query);
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});

// Update existing user preferences in the database
app.put(endPointRoot + "preferences/:userId", (req, res) => {
    console.log(`Updating user preferences for user: ${req.params.userId}`);
    logAPICall(req.method, endPointRoot + "preferences/userId");

    // get data sent from client
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    
    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj);

        let query = `UPDATE userPreferences SET theme = '${dataObj.theme}' WHERE userId = ${req.params.userId}`;
        console.log(query);

        pool.query(query, (err, result) => {
            if (err) {
                res.status(404).send(`User Id could not be found.`);
            } else {
                res.status(200).send(`User preferences updated for userId: ${req.params.userId}`);
            }
        })
    });
})

///////////////////////////// USER ENDPOINTS ///////////////////////////////////////
// POST call to register user
app.post(endPointRoot + "user", (req, res) => {
    console.log("Inside POST - signup");
    logAPICall(req.method, endPointRoot + "user");

    // get data sent from client
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    })

    // hash password and write to database
    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj); 
        
        bcrypt.hash(dataObj.password, saltRounds, function(err, hash) {
            let query = `INSERT INTO users (username, email, password)
            VALUES("${dataObj.username}", "${dataObj.email}", "${hash}")`

            pool.query(query, (err, result) => {
                if (err) {
                    console.log(err.code);
                    if (errorTypes[err.code]) {
                        res.status(200).send(JSON.stringify({'ERROR': errorTypes[err.code]}));
                    } else {
                        throw err;
                    }
                } else {
                    let userId = JSON.parse(JSON.stringify(result)).insertId;
                    console.log('User record inserted with id: ' + userId);
                    res.status(200).send(JSON.stringify({'userId': userId}));

                    let preferenceQuery = `INSERT INTO userPreferences (userId, theme)
                    VALUES("${userId}", "bootstrap")`

                    pool.query(preferenceQuery, (err, result) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            });
        });
      })
});

// POST call to login user
app.post(endPointRoot + "user/login", (req, res) => {
    console.log("Inside POST - login");
    logAPICall(req.method, endPointRoot + "user/login");

    // get data sent from client
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    })

    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj); 

        let query = `SELECT id, username, password FROM users WHERE email ="${dataObj.email}"`;

        pool.query(query, (err, result) => {
            if (err) {
                console.log(err.code);
            } else {
                console.log(result);
                if (result.length == 0) {
                    console.log("Email does not exist.")
                    res.status(200).send(JSON.stringify({'ERROR': errorTypes['INVALID_EMAIL']}));
                } else {
                    let dbResult = JSON.parse(JSON.stringify(result));
                    bcrypt.compare(dataObj.password, dbResult[0].password, function(err, result) {
                        if (result == true) {
                            console.log("Password matched, with user id: " + dbResult[0].id);

                            let preferenceQuery = `SELECT theme FROM userPreferences WHERE userId =${dbResult[0].id}`;
                            pool.query(preferenceQuery, (err, result) => {
                                if (err) {
                                    console.log(err.code);
                                } else {
                                    responseBody = {
                                        'userId': dbResult[0].id,
                                        'username': dbResult[0].username,
                                        'theme': JSON.parse(JSON.stringify(result))[0].theme
                                    }
                                    res.status(200).send(JSON.stringify(responseBody));
                                }
                            })
                        } else {
                            console.log("Password incorrect.")
                            res.status(200).send(JSON.stringify({'ERROR': errorTypes['INCORRECT_PASSWORD']}));
                        }
                    });
                }
            }
        });
      })
});


//////////////////////////////// ADMIN ENDPOINTS /////////////////////////////////////

// POST call to verify admin credentials
app.post(endPointRoot + "admin", (req, res) => {
    console.log("Inside POST - admin");
    logAPICall(req.method, endPointRoot + "admin");

    // get data sent from client
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })

    req.on('end', () => {
        let dataObj = JSON.parse(data);
        console.log(dataObj); 

        let query = `SELECT password FROM adminUsers WHERE username ="${dataObj.username}"`

        pool.query(query, (err, result) => {

            let dbResult = JSON.parse(JSON.stringify(result));
            console.log(dbResult);

            if (err) {
                console.log(err.code);
                throw err;
            } else if (dbResult.length == 0) {
                console.log("User name does not have admin priviledges.")
                res.status(403).send(errorTypes['INVALID_ADMIN_CREDENTIALS']);
            } else {
                bcrypt.compare(dataObj.password, dbResult[0].password, function(err, result) {
                    if (result == true) {
                        console.log("Admin Credentials Verified.");
                        res.sendStatus(200);
                    } else {
                        console.log("Admin Credentials Invalid.")
                        res.status(403).send(errorTypes['INVALID_ADMIN_CREDENTIALS']);
                    }
                });
            }
        });
    });
});


// GET call to retrieve api execution statistics
app.get(endPointRoot + "admin/statistics", (req, res) => {
    console.log("Inside GET - admin/statistics");
    logAPICall(req.method, endPointRoot + "admin/statistics");

    let query = `select * from stats`;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log("stats found");
            res.status(200).send(result);
        }
    });
});


module.exports = app;
