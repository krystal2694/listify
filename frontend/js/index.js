let endPointRoot = "https://stormy-ridge-95291.herokuapp.com/API/V1/";
// let endPointRoot = "http://localhost:8080/API/V1/";

function handleLogIn() {
    // get user info from input fields
    let userInfo = {
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value
    }

    verifyUser(userInfo).then(
        function(responseBody) {
            // deal with error if there is one
            if (responseBody.ERROR) {
                window.showSnackBar(responseBody.ERROR, 'error-snackbar', 4000);
            } else {
                console.log("User verified with id: " + responseBody.userId);
                localStorage.setItem("userId", responseBody.userId);
                localStorage.setItem("username", responseBody.username);
                localStorage.setItem("theme", responseBody.theme);
                window.location.replace('home.html');
            }
        }
    );
}

function verifyUser(userInfo) {
    return new Promise (function(resolve, reject) {
        // ajax call
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", `${endPointRoot}user/login`, true);
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
    document.getElementById("login-btn").addEventListener("click", handleLogIn);
}

