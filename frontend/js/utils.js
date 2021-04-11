window.showSnackBar = function(message, snackBarId, time) {
    let snackBar = document.getElementById(snackBarId);
    let messageContainer = snackBar.getElementsByClassName('snackbar-message')[0];
    messageContainer.innerHTML = message;
    snackBar.className = "show";

    setTimeout(function(){ 
        snackBar.className = snackBar.className.replace("show", "");
    }, time);
}

window.handleHTTPErrors = function(errorObj) {
    console.log("Inside handleHTTPErrors");
    switch (errorObj.status) {
        case 400:
            console.log("Error 400");
            showSnackBar(errorObj.body, 'error-snackbar', 4000);
            break;
        case 403:
            console.log("Error 403");
            showSnackBar(errorObj.body, 'error-snackbar', 4000);
            break;
        case 404:
            console.log("Error 404");
            showSnackBar(errorObj.body, 'error-snackbar', 4000);
            break;
        case 500:
            console.log("Error 500");
            showSnackBar("Internal Server Error", 'error-snackbar', 4000);
            break;
        case 501:
            console.log("Error 501");
            showSnackBar("This feature has not been added yet!", 'error-snackbar', 4000);
            break;
        default:
            console.log("Default Error Case");
            showSnackBar("Unknown Response", 'error-snackbar', 4000);    }
}

// export {showSnackBar, handleHTTPErrors};