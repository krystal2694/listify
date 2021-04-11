var endPointRoot = "https://stormy-ridge-95291.herokuapp.com/API/V1/";
// var endPointRoot = "http://localhost:8080/API/V1/";


handleSubmit = function() {
    let adminCredentials = {
        'username': document.getElementById('username').value,
        'password': document.getElementById('password').value
    }

    verifyCredentials(adminCredentials).then(
        function() {
            console.log("Getting statistics")
            getStatisticsFromDB();
        },
        function(errorObj) {
            window.handleHTTPErrors(errorObj);
        }
    );
}

verifyCredentials = function(adminCredentials) {
    return new Promise(function(resolve, reject) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", `${endPointRoot}admin`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Admin Credentials verified.");
                resolve();
            } else if (this.readyState == 4) {
                reject({status: this.status, body: this.response});
            }
        };
        xhttp.send(JSON.stringify(adminCredentials));
    });
};
    
function getStatisticsFromDB() {
     const xhttp = new XMLHttpRequest();
     xhttp.open("GET", `${endPointRoot}admin/statistics`, true);
     xhttp.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
            console.log("Retrieved Stats");
            displayTable(JSON.parse(this.response));
         } else if (this.readyState == 4 && this.status == 400) {
            console.log(this.response);
            window.handleHTTPErrors({
                status: this.status,
                body: this.response
            });
         }
     };
     xhttp.send();
}

// Display table containing API call execution stats
displayTable = (data) => {
    let table = document.getElementById('stat-table-body');

    // remove previous rows
    table.innerHTML = '';
    
    let counter = 1
    if (data.length == 0 || data == null) {
        let row = document.createElement('tr');
        let index = document.createElement('th');
        index.scope = 'row';
        index.innerHTML = counter++;
        let tdNoData = document.createElement('td');
        tdNoData.colSpan = '3';
        tdNoData.innerHTML= 'No data';
        row.appendChild(index);
        row.appendChild(tdNoData);
        table.appendChild(row);
    } else {
        data.map(item => {
            let row = document.createElement('tr');
            let index = document.createElement('th');
            index.scope = 'row';
            index.innerHTML = counter++;
            let tdMethod = document.createElement('td');
            tdMethod.innerHTML = item.method;
            let tdEndpoint = document.createElement('td');
            tdEndpoint.innerHTML = item.endpoint;
            let tdCount = document.createElement('td');
            tdCount.innerHTML = item.count;
    
            // Add elements to the row
            row.appendChild(index);
            row.appendChild(tdMethod);
            row.appendChild(tdEndpoint);
            row.appendChild(tdCount);
    
            // Add row to the table
            table.appendChild(row);
        });
    }

    // Make table visible 
    document.getElementById('stat-table').style.display = 'inline';
    
}

window.onload = () => {
    document.getElementById('submit-btn').addEventListener('click', handleSubmit);
}