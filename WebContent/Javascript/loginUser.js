function loginUser() {
    var useremail = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    PageMethods.AuthenticateUser(useremail, password, Authenticate_User_Success, Fail_User_Validate);
    
    
}
function Authenticate_User_Success(val) {
    setTimeout(fade_out, 5000);
    function fade_out() {
        $("#loginmsg").fadeOut().empty();
    }
    if (val[0] == 1) {
        var names = val[1].split(" ");
        $("#loginmsg").show();
        $('#loginmsg').append(val[1] + "<br>");
        $('#loginmsg').removeClass('alert-danger').addClass('alert-success');
        window.location.href = 'dashboard.html?username=' + names[0];
        return false;
    }
    else {
        $("#loginmsg").show();
        $('#loginmsg').append("Error Logging In" + "<br>");
        $('#loginmsg').removeClass('alert-success').addClass('alert-danger');
    }
}
function Fail_User_Validate(val) {
    $("#loginmsg").show();
    $('#loginmsg').append("Error Logging In" + "<br>");
    $('#loginmsg').removeClass('alert-success').addClass('alert-danger');
}

function dashboardOnLoad() {
    var href = window.top.location.href;
    var username = href.split("?");
    var usernameValue = username[1].split("=");
    $('#UserName').empty();
    $('#UserName').append(usernameValue[1]);
}