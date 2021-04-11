let endPointRoot = "https://stormy-ridge-95291.herokuapp.com/API/V1/";
// let endPointRoot = "http://localhost:8080/API/V1/";
let userId;
let listColours;

// theme names and the list of colour classes for each
const themes = {
    'bootstrap': ['info', 'warning','danger','success'],
    'beach-day': ['light-sea-blue', 'ruby-red', 'fire-opal'],
    'barbie': ['tiffany-blue', 'rose-bonbon', 'cornflower-blue'],
    'nautical': ['russian-violet', 'light-sea-blue', 'light-blue'],
    'canucks': ['canucks-green', 'canucks-blue'],
    'canucks-retro': ['canucks-orca-blue', 'canucks-dark-blue','canucks-silver', 'canucks-red'],
    'infinity-stones': ['reality-stone', 'power-stone', 'soul-stone', 'space-stone', 'time-stone', 'mind-stone']
}

let colourTracker = 0;

// class definition for List object
class List {
    
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    delete = function() {
        deleteListFromDB(this.id);
        deleteListfromPage(this.id);
    }
    open() {
        if (typeof(Storage) == "undefined") {
            document.write("Web storage not supported")
            window.stop();
        } 
        localStorage.setItem("userId", userId);
        localStorage.setItem("listId", this.id);
        localStorage.setItem("listName", this.name);

        window.location.href = 'list.html';
    }
}


function readLocalStorage() {
    if (typeof(Storage) == "undefined") {
        document.write("Web storage not supported")
        window.stop();
    } 

    // check if user is logged in
    if (localStorage.getItem("userId") == null) {
        window.location.replace("index.html");
    } else {
        userId = localStorage.getItem("userId")
        theme = localStorage.getItem("theme");
        listColours = themes[theme];
        document.getElementById('welcome-user').innerHTML = `Hi, ${localStorage.getItem("username")}`
    }

}

function deleteListFromDB(listId) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `${endPointRoot}list/${listId}`, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("List Deleted");
        } else if (this.readyState == 4) {
            window.handleHTTPErrors({status: this.status, body: this.response});
        }
    };
    xhttp.send(); 
}

function deleteListfromPage(listId) {
    // remove from DOM
    document.getElementById(listId).remove();

    // display no list message if there are no lists left
    let numLists = document.getElementById('list-container').getElementsByClassName('card').length;
    if (numLists == 1) {
        document.getElementById('no-lists-message').style.display = 'block';
    }
}

// retreive all lists from DB
function getListsFromDB() {
    return new Promise (function(resolve, reject) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", `${endPointRoot}list/${userId}`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let responseBody = JSON.parse(this.response);
                resolve(responseBody);
            } else if (this.readyState == 4) {
                console.log(this.response);
                reject();
            }
        };
        xhttp.send();
    });
}

function displayLists (lists) {
    lists.map(list => {
        addListToPage(new List(list.listName, list.id));
    });
}

function addNewListHandler() {
    // get name of new list
    let listNameInput = document.getElementById('list-name-input');
    let listName = listNameInput.value;

    if (!listName || listName.trim() === '') {
        window.alert('You must enter a name for your new list!');
        return;
    }

    let listInfo = {
        'listName': listName,
        'userId': userId
    }

    // clear input field
    listNameInput.value = '';
    
    // add list to DB
    addListToDB(listInfo).then(
        function(listId) {
            let newList = new List(listInfo.listName, listId);
            addListToPage(newList);
        },
        function() {
            console.log("Reject")
        }
    );
}

function incrementColourTracker() {
    colourTracker++;
    if (colourTracker >= listColours.length) {
        colourTracker = 0;
    }
}

function addListToPage(listObj) {
    // remove lists message 
    document.getElementById('no-lists-message').style.display = 'none';

    // clone template
    let listContainer = document.getElementById('list-container')
    let template = document.getElementById('list-template')
    let newList = template.cloneNode(true);
    newList.id = listObj.id;

    let card = newList.getElementsByClassName('card')[0];
    card.className = "card text-white mb-3 bg-" + listColours[colourTracker];

    // make entire card clickable
    newList.addEventListener('click', (event) => {
        if(event.target.name === 'delete-btn' || event.target.localName == 'path' || event.target.localName == 'svg') {
            event.preventDefault();
            event.stopPropagation();
        } else {
            listObj.open(event);
        }
    });

    newList.getElementsByClassName('list-title')[0].innerHTML = listObj.name;

    btnDelete = newList.getElementsByClassName('delete-btn')[0];
    btnDelete.onclick = function() {listObj.delete();}
    newList.getElementsByClassName('card-body')[0].appendChild(btnDelete);

    // add list to list container
    newList.style["display"] = "inline";
    listContainer.insertBefore(newList, listContainer.firstChild);
    incrementColourTracker();
}

function addListToDB(listInfo) {
    return new Promise (function( resolve, reject) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", `${endPointRoot}list/${userId}`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("List created with id: " + this.response);
                console.log("inside addListToDB: " + listInfo.listName);
                resolve(this.response);
            } else if (this.readyState == 4) {
                console.log(this.response);
                reject({status: this.status, body: this.response});
            }
        };
        xhttp.send(JSON.stringify(listInfo));
    });
}

window.onload = function() {
    // add event listeners
    document.getElementById('add-btn').addEventListener('click', addNewListHandler);
    document.getElementById('nav-log-out').addEventListener('click', () => {
        localStorage.clear();
    });
    document.getElementById('list-name-input').addEventListener('keypress', function(e) {
        if (e.key == 'Enter') {
            addNewListHandler();
            $('#new-list-modal').modal('hide');
        }
    })

    // read and load data from local storage and DB
    readLocalStorage();
    getListsFromDB().then(
        function(responseBody) {
            if (responseBody.ERROR) {
                window.showSnackBar(responseBody.ERROR, 'error-snackbar', 4000);
            } else {
                displayLists(responseBody); 
            }
        }
    );
}