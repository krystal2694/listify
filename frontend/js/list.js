let endPointRoot = "https://stormy-ridge-95291.herokuapp.com/API/V1/";
// let endPointRoot = "http://localhost:8080/API/V1/";
let listObj;
let prevListItem;

class ListItem {
    constructor(id, item, isChecked) {
        this.id = id;
        this.item = item;
        this.isChecked = isChecked;
    }

    // Update the list item in the database
    update() {
        let listItem = {
            'id': this.id,
            'item': document.getElementById(this.id).getElementsByClassName('form-control')[0].value,
            'isChecked': document.getElementById(this.id).getElementsByClassName('checkbox')[0].checked
        }
        console.log(listItem);
        updateListItemToDB(listItem);
    }

    // Delete the list item in the database
    delete() {
        deleteListItemFromDB(this.id);
        document.getElementById(this.id).remove();
    }
}

function deleteListItemFromDB(listItemId) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `${endPointRoot}list/${listObj.listId}/${listItemId}`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("List Item Deleted");
        } else if (this.readyState == 4) {
            console.log(this.response);
        }
    };
    xhttp.send(); 
}

function updateListItemToDB(listItem) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `${endPointRoot}list/${listObj.listId}/${listItem.id}`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("List Item Updatedd");
            console.log(this.response);
            window.showSnackBar("Updated", "updated-snackbar", 3000);
        } else if (this.readyState == 4) {
            console.log(this.response);
        }
    };
    xhttp.send(JSON.stringify(listItem));
}

function getListNameFromDB() {
    return new Promise(function (resolve, reject) {
        // ajax call
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", `${endPointRoot}list/${listObj.listId}/name`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("List name retrieved");
                resolve(this.response);
            } else if (this.readyState == 4) {
                reject({status: this.status, body: this.response});
            }
        };
        xhttp.send();
    });
}

function updateListNameToDB() {
    listObj.listName = document.getElementById('list-title').value;
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `${endPointRoot}list/${listObj.listId}`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("List name Updatedd");
            console.log(this.response);
            // remove focus from text input
            document.getElementById('list-title').blur();
            window.showSnackBar("Updated", "updated-snackbar", 3000);
        } else if (this.readyState == 4) {
            window.handleHTTPErrors({status: this.status, body: this.response})
        }
    };
    xhttp.send(JSON.stringify(listObj));
}

function getListItemsFromDB(listId) {
    return new Promise(function(resolve, reject) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", `${endPointRoot}list/${listId}/listItem`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Retrieved list items");
                resolve(this.response)
            } else if (this.readyState == 4) {
                reject({status: this.status, body: this.response})
            }
        };
        xhttp.send();
        }
    );
}

// Displays all the list items for the list
function displayListItems(listItems) {
    if (listItems != '[{}]') {
        listItems = JSON.parse(listItems);
        listItems.map(item => {
            console.log(item);
            prevListItem = new ListItem(item.id, item.item, item.isChecked)
            addListItemToPage(prevListItem);
        });
    }

    prevListItem = new ListItem('template', '', false)
    addListItemToPage(prevListItem);
}


// handler for adding a new list item
function addNewListItemHandler() {
    listId = listObj.listId;

    let listItem = document.getElementById('template');
    let item = listItem.getElementsByClassName('form-control')[0].value;
    let isChecked = listItem.getElementsByClassName('checkbox')[0].checked;

    if (!item || item.trim() === '') {
        window.alert('Cannot add blank item to list!');
        return;
    }

    let listItemInfo = {
        'listId': listId,
        'item': item,
        'isChecked': isChecked
    };

    // Add the previous list item to the database
    addListItemToDB(listItemInfo).then(
        function(listItemId) {
            console.log("Resolve: Adding the list item was successful");

            // update id of list item added to DB
            prevItem = document.getElementById('template');
            prevItem.id = listItemId;
            prevListItem.id = listItemId;

            // enable update and delete buttons for previous item
            prevItem.getElementsByClassName('update-btn')[0].disabled = false;
            prevItem.getElementsByClassName('delete-btn')[0].disabled = false;
            prevItem.getElementsByClassName('checkbox')[0].disabled = false;

            // add new empty list item to page
            prevListItem = new ListItem('template', '', false);
            addListItemToPage(prevListItem);
            document.getElementById('template').getElementsByClassName('form-control')[0].focus();
        },
        function() {
            console.log("Reject");
        }
    );
}

// Adds a new list item to the page
function addListItemToPage(listItemObj) {
    let listItemContainer = document.getElementById('list-container');
    let listItemTemplate = document.getElementById('list-item-template');

    let newListItem = listItemTemplate.cloneNode(true);
    newListItem.id = listItemObj.id;

    let checkBox = newListItem.getElementsByClassName('checkbox')[0];
    checkBox.checked = listItemObj.isChecked == 1 ? true : false;

    let textInputField = newListItem.getElementsByClassName('form-control')[0]
    textInputField.value = listItemObj.item;
    if (listItemObj.isChecked == 1) {
        textInputField.style.textDecoration = "line-through";
    }

    // add 'On Enter' functionality
    newListItem.addEventListener('keypress', function(e) {
        if (e.key == 'Enter') {
            if (listItemObj.id == 'template') {
                addNewListItemHandler();
            } else {
                listItemObj.update();
                if (newListItem.nextSibling == listItemContainer.lastElementChild) {
                    newListItem.nextSibling.getElementsByClassName('form-control')[0].focus();
                } else {
                    newListItem.getElementsByClassName('form-control')[0].blur();
                }
            }
        }
    })

    // update item on DB when item is checked/unchecked
    checkBox.addEventListener('change', (event) => {
        listItemObj.update();
        if (event.currentTarget.checked) {
            textInputField.style.textDecoration = "line-through";
        } else {
            textInputField.style.textDecoration = "";
        }
    })

    let btnUpdate = newListItem.getElementsByClassName('update-btn')[0];
    btnUpdate.onclick = function() {listItemObj.update();}

    let btnDelete = newListItem.getElementsByClassName('delete-btn')[0];
    btnDelete.onclick = function() {listItemObj.delete()}

    newListItem.style['display'] = '';
    listItemContainer.appendChild(newListItem);

    if (prevListItem.id != 'template') {
        // enable delete and update buttons for added list item
        prevItem = document.getElementById(prevListItem.id);
        prevItem.getElementsByClassName('update-btn')[0].disabled = false;
        prevItem.getElementsByClassName('delete-btn')[0].disabled = false;
        prevItem.getElementsByClassName('checkbox')[0].disabled = false;
    }
}

// Add new list item to the database
function addListItemToDB(listItemInfo) {
    return new Promise (function( resolve, reject) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", `${endPointRoot}list/${listId}/listItem`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("List item created with id: " + this.response);
                resolve(this.response);
            } else if (this.readyState == 4) {
                console.log(this.response);
                reject();
            }
        };
        xhttp.send(JSON.stringify(listItemInfo));
    });
}

// Read the local storage
function readLocalStorage() {
    if (typeof(Storage) == "undefined") {
        document.write("Web storage not supported")
        window.stop();
    } 

    // check if user is logged in
    if (localStorage.getItem("userId") == null) {
        window.location.replace("index.html");
    } else {
        let listId = localStorage.getItem("listId");
        let listName = localStorage.getItem("listName");
        listObj = {
            'listId': listId,
            'listName': listName
        }
    }
}


window.onload = function() {
    // add event listeners
    document.getElementById('add-list-item-btn').addEventListener('click', addNewListItemHandler);
    document.getElementById('nav-log-out').addEventListener('click', () => {
        localStorage.clear();
    });
    document.getElementById('list-title').addEventListener('keypress', function(e) {
        if (e.key == 'Enter') {updateListNameToDB();}
    });

    // read and load data from local storage and DB
    readLocalStorage();
    getListNameFromDB().then(
        function(response) {document.getElementById('list-title').value = JSON.parse(response)[0].listName;},
        function(errorObj) {window.handleHTTPErrors(errorObj);}
    );
    getListItemsFromDB(listObj.listId).then(
        function(response) {displayListItems(response);},
        function(errorObj) {window.handleHTTPErrors(errorObj);}
    );
} 