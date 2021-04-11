let endPointRoot = "https://stormy-ridge-95291.herokuapp.com/API/V1/";
// let endPointRoot = "http://localhost:8080/API/V1/";

function readLocalStorage() {
    if (typeof(Storage) == "undefined") {
        document.write("Web storage not supported")
        window.stop();
    } 
    console.log(localStorage);

    // check if user is logged in
    if (localStorage.getItem("userId") == null) {
        window.location.replace("index.html");
    } 
}

function saveButtonHandler() {
    let theme = document.getElementById('theme-selector').value;

    // may have more user preferences in the future
    let userPreferences = {'theme': theme}

    updatePreferencetoDB(userPreferences).then(
        function(response) {
            window.showSnackBar('Updated', 'updated-snackbar', 3000);
            localStorage.setItem('theme', theme);
        },
        function(response) {
            console.log("inside reject");
            window.handleHTTPErrors(response);
        }
    )

}

function updatePreferencetoDB(userPreferences) {
    return new Promise (function(resolve, reject) {
        let userId = localStorage.getItem("userId");

        const xhttp = new XMLHttpRequest();
        xhttp.open("PUT", `${endPointRoot}preferences/${userId}`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.response);
            } else if (this.readyState == 4) {
                console.log(this.response);
                reject({status: this.status, body: this.response});
            }
        }
        xhttp.send(JSON.stringify(userPreferences));
    })
}

window.onload = function() {
    readLocalStorage();
    document.getElementById('theme-selector').value = localStorage.getItem('theme');
    document.getElementById('save-btn').addEventListener('click', saveButtonHandler);

}