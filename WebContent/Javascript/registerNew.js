var flagforvalid = true;
function Details() {
    this.email =  "",
    this.firstname = "",
    this.companyname = "",
    this.address = "",
    this.city = "",
    this.state = "",
    this.zip = "",
    this.txtPhone = "",
    this.password = "",
    this.confirm = ""
}
function registerNew() {

var det = null;
det = new Details();
det.email = document.getElementById('name').value;
det.firstname = document.getElementById('email').value;
det.companyname = document.getElementById('companyName').value;
det.address = document.getElementById('Address').value;
det.city = document.getElementById('city').value;
det.state = document.getElementById('state').value;
det.zip = document.getElementById('zipCode').value;
det.txtPhone = document.getElementById('txtPhone').value;
det.password = document.getElementById('password').value;
det.confirm = document.getElementById('confirm').value;
var str = JSON.stringify(det);
PageMethods.RegisterUser(str, registerSuccess, Fail);
}

function registerSuccess(str) {
    var err = document.getElementById('messages_content');
    err.innerHTML = str[1] + '<br>';
    err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
}

function validatefields() {
    $('#txtPhone').blur(function (e) {
        if (document.getElementById('txtPhone').value != "") {
            if (validatePhone('txtPhone')) {
                $('#txtPhone').closest('.input-group').removeClass('has-error').addClass('has-success');
                $('#txtPhoneerror').text("");
            }
            else {
                $('#txtPhone').closest('.input-group').removeClass('success').addClass('has-error');
                $('#txtPhoneerror').text("Please enter correct telephone number");
                
            }
        }
    });
    $('#password').blur(function (e) {
        if (document.getElementById('password').value != "" && document.getElementById('confirm').value != "") {
            if (validatePassword()) {
                $('#confirm').closest('.input-group').removeClass('has-error').addClass('has-success');
                $('#confirmerror').text("");
            }
            else if (document.getElementById('password').value.length < 8) {
                $('#password').closest('.input-group').removeClass('success').addClass('has-error');
                $('#passworderror').text("");
                return false;
            }
            else {
                $('#confirm').closest('.input-group').removeClass('success').addClass('has-error');
                $('#confirmerror').text("Passwords do not match");
                return false;
            }
        }
    });
    $('#confirm').blur(function (e) {
        if (document.getElementById('password').value != "") {
            if (validatePassword()) {
                $('#confirm').closest('.input-group').removeClass('has-error').addClass('has-success');
                $('#confirmerror').text("");
            }
            else {
                $('#confirm').closest('.input-group').removeClass('success').addClass('has-error');
                $('#confirmerror').text("Passwords do not match");
                return false;
            }
        }
    });
    $('#companyName').blur(function (e) {
        if (document.getElementById('companyName').value.length < 2) {
            $('#companyName').closest('.input-group').removeClass('success').addClass('has-error');
            $('#companyNameerror').text("Please enter a valid company name");
            return false;
        }
        else {
            $('#companyName').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#companyNameerror').text("");
        }
    });
    $('#Address').blur(function (e) {
        if (document.getElementById('Address').value.length < 2) {
            $('#Address').closest('.input-group').removeClass('success').addClass('has-error');
            $('#Addresserror').text("Please enter a valid Address");
            return false;
        }
        else {
            $('#Address').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#Addresserror').text("");
        }
    });
    $('#name').blur(function (e) {
        if (document.getElementById('name').value.length < 2) {
            $('#name').closest('.input-group').removeClass('success').addClass('has-error');
            $('#nameerror').text("Please enter a valid name");
            return false;
        }
        else {
            $('#name').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#nameerror').text("");
        }
    });
    $('#zipCode').blur(function (e) {
        if (document.getElementById('zipCode').value.length < 5) {
            $('#zipCode').closest('.input-group').removeClass('success').addClass('has-error');
            $('#zipCodeerror').text("Please enter a valid zipcode");
            return false;
        }
        else {
            $('#zipCode').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#zipCodeerror').text("");
        }
    });
    $('#email').blur(function (e) {
        if (!isValidEmailAddress(document.getElementById('email').value)) {
            $('#email').closest('.input-group').removeClass('success').addClass('has-error');
            $('#emailerror').text("Please enter a correct email address");
            return false;
        }
        else {
            $('#email').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#emailerror').text("");
        }
    });
    $('#state').blur(function (e) {
        if (document.getElementById('state') != null && document.getElementById('state').value == "") {
            $('#state').closest('.input-group').removeClass('success').addClass('has-error');
            $('#stateerror').text("Please select a state");
            return false;
        }
        else {
            $('#state').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#stateerror').text("");
        }
    });
    $('#city').blur(function (e) {
        if (document.getElementById('city') != null && document.getElementById('city').value == "") {
            $('#city').closest('.input-group').removeClass('success').addClass('has-error');
            $('#cityerror').text("Please select a city");
            return false;
        }
        else {
            $('#city').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#cityerror').text("");
        }
    });
}
function validatePassword() {
    if (document.getElementById('password').value.length < 8 || document.getElementById('password').value != document.getElementById('confirm').value) {
        return false;
    } else {
        return true;
    }
}
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

function Signup() {
    
        var det = null;
        det = new Details();
        det.email = document.getElementById('email').value;
        det.firstname = document.getElementById('name').value;
        det.companyname = document.getElementById('companyName').value;
        det.address = document.getElementById('Address').value;
        det.city = document.getElementById('city').value;
        det.state = document.getElementById('state').value;
        det.zip = document.getElementById('zipCode').value;
        det.txtPhone = document.getElementById('txtPhone').value;
        det.password = document.getElementById('password').value;
        det.confirm = document.getElementById('confirm').value;
        var str = JSON.stringify(det);
        PageMethods.RegisterUser(str, onSucess, onError);
    
    function onSucess(result) {
        $('#messages').removeClass('hide').addClass('alert alert-success alert-dismissible').slideDown().show();
        $('#messages_content').html('<h5>User Registered Successfully</h5>');
        $('#modal').modal('show');
    }

    function onError(result) {
        $('#messages').removeClass('hide').addClass('alert alert-error alert-dismissible').slideDown().show();
        $('#messages_content').html('<h5>' + result + '</h5>');
        $('#modal').modal('show');
    }
}

$(document).ready(function () {
        validatefields();
    });

        

