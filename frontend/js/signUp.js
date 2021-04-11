let endPointRoot = "https://stormy-ridge-95291.herokuapp.com/API/V1/";
// let endPointRoot = "http://localhost:8080/API/V1/";

function handleSignUp() {
    // get user sign up info from input fields
    let userInfo = {
        'username': document.getElementById('name').value,
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value
    }

    registerUser(userInfo).then(
        function(responseBody) {
            // deal with error if there is one
            if (responseBody.ERROR) {
                window.showSnackBar(responseBody.ERROR, 'error-snackbar', 4000);
            } else {
                console.log("User registered with id: " + responseBody.userId);
                localStorage.setItem("userId", responseBody.userId);
                localStorage.setItem("username", userInfo.username);
                localStorage.setItem("theme", "bootstrap");
                window.location.replace('home.html');
            }
        }
    );
}

function registerUser(userInfo) {
    return new Promise (function(resolve, reject) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", `${endPointRoot}user`, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.response));
            } else if (this.readyState == 4) {
                console.log(this.response);
                reject();
            }
        };
        xhttp.send(JSON.stringify(userInfo));
    });
}

window.onload = function () {
    document.getElementById("signup-btn").addEventListener("click", handleSignUp);
}

