$(document).ready(function () {
    var clientId = "32404943670-lm2vtidqcri5fftggct45ofm5a1sbqse.apps.googleusercontent.com";
    var redirect_uri = "https://sairish2001.github.io/present-mam-web/index.html";
    var scope = "https://www.googleapis.com/auth/drive";

    var url = "";

    if (localStorage.getItem('accessToken') != null) {  
        document.getElementById('login').innerText = "Sign out";
    }
    $("#login").click(function () {
        if (localStorage.getItem('accessToken') == null) {
            signIn(clientId, redirect_uri, scope, url);
        } else {
            signout();
        }
    });
    function signout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expires_in");
        document.getElementById('login').innerText = "Sign in";
    }
    function signIn() {
        url = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=" + redirect_uri
            + "&prompt=consent&response_type=code&client_id=" + clientId + "&scope=" + scope
            + "&access_type=offline";
        window.location = url;
    }
});
