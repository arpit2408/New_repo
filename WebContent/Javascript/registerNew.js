var flagforvalidforPhone = false;
var flagforvalidforPass = false;
var flagforvalidforConfirm = false;
var flagforvalidforCompany = false;
var flagforvalidforAddr = false;
var flagforvalidforName = false;
var flagforvalidforEmail = false;
var flagforidentification = false;
function Details() {
    this.email = "",
    this.firstname = "",
    this.lastname = "",
    this.companyname = "",
    this.address = "",
    this.city = "",
    this.state = "",
    this.zip = "",
    this.phone = "",
    this.password = "",
    this.confirm = "",
    this.usertype = "",
    this.identification = ""
}


function registerSuccess(val) {
    if (val[0] == 1) {
        $("#successmessage").show();
        $("#successmessage").empty();
        $("#successmessage").append('<strong>Success! </strong>' + val[1]);
        $("#form1 :input").prop("disabled", true);
    }
    if (val[0] == 0) {

        $("#errormessage").show();
        $("#errormessage").empty();
        $("#errormessage").append('<strong>Error! Some values are incorrect. </strong>' + val[1]);
    }
}
function Fail(val) {

    $("#errormessage").show();
    $("#errormessage").empty();
    $("#errormessage").append('<strong>Error! Some values are incorrect. </strong>' + val[1]);
}
function enabledisableSubmitbutton() {
    $('#registerUserForm input').on('keyup blur', function () {
        if (flagforvalidforPhone && flagforvalidforPass && flagforvalidforConfirm && flagforvalidforCompany
            && flagforvalidforAddr && flagforvalidforName && flagforvalidforEmail && flagforidentification) {
            $('button.btn').prop('disabled', false);
        } else {
            $('button.btn').prop('disabled', 'disabled');
        }
    });
}
function validatefields() {
    $('#txtPhone').blur(function (e) {
        if (document.getElementById('txtPhone').value != "") {
            if (validatePhone('txtPhone')) {
                $('#txtPhone').closest('.input-group').removeClass('has-error').addClass('has-success');
                $('#txtPhoneerror').text("");
                flagforvalidforPhone = true;
            }
            else {
                $('#txtPhone').closest('.input-group').removeClass('success').addClass('has-error');
                $('#txtPhoneerror').text("Please enter correct telephone number");
                flagforvalidforPhone = false;
            }
        }
    });
    $('#usrpassword').blur(function (e) {
        if (document.getElementById('usrpassword') != null && document.getElementById('usrpassword').value.length < 8) {
            $('#usrpassword').closest('.input-group').removeClass('success').addClass('has-error');
            $('#passworderror').text("Invalid password(Min. 8 digits required)");
            flagforvalidforPass = false;
        }
        else if (!validatePassword()) {
            $('#confirm').closest('.input-group').removeClass('success').addClass('has-error');
            $('#confirmerror').text("");
            flagforvalidforConfirm = false;
            $('#usrpassword').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#passworderror').text("");
            flagforvalidforPass = true;
        }

        else {
            $('#usrpassword').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#passworderror').text("");
            flagforvalidforPass = true;
        }
    });
    $('#confirmusrpassword').blur(function (e) {
        if (document.getElementById('usrpassword').value != "") {
            if (validatePassword()) {
                $('#confirmusrpassword').closest('.input-group').removeClass('has-error').addClass('has-success');
                $('#confirmerror').text("");
                flagforvalidforConfirm = true;
            }
            else {
                $('#confirmusrpassword').closest('.input-group').removeClass('success').addClass('has-error');
                $('#confirmerror').text("Passwords do not match");
                flagforvalidforConfirm = false;
            }
        }
    });
    $('#companyName').blur(function (e) {
        if (document.getElementById('companyName').value.length < 2) {
            $('#companyName').closest('.input-group').removeClass('success').addClass('has-error');
            $('#companyNameerror').text("Please enter a valid company name");
            flagforvalidforCompany = false;
        }
        else {
            $('#companyName').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#companyNameerror').text("");
            flagforvalidforCompany = true;
        }
    });
    $('#Address').blur(function (e) {
        if (document.getElementById('Address').value.length < 2) {
            $('#Address').closest('.input-group').removeClass('success').addClass('has-error');
            $('#Addresserror').text("Please enter a valid Address");
            flagforvalidforAddr = false;
        }
        else {
            $('#Address').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#Addresserror').text("");
            flagforvalidforAddr = true;
        }
    });
    $('#name').blur(function (e) {
        if (document.getElementById('name').value.length < 2) {
            $('#name').closest('.input-group').removeClass('success').addClass('has-error');
            $('#nameerror').text("Please enter a valid name");
            flagforvalidforName = false;
        }
        else {
            $('#name').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#nameerror').text("");
            flagforvalidforName = true;
        }
    });
    $('#lname').blur(function (e) {
        if (document.getElementById('lname').value.length < 2) {
            $('#lname').closest('.input-group').removeClass('success').addClass('has-error');
            $('#lnameerror').text("Please enter a valid last name");
            flagforvalidforName = false;
        }
        else {
            $('#lname').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#lnameerror').text("");
            flagforvalidforName = true;
        }
    });
    $('#zipCode').blur(function (e) {
        if (document.getElementById('zipCode') != null && document.getElementById('zipCode').value.length < 5) {
            $('#zipCode').closest('.input-group').removeClass('success').addClass('has-error');
            $('#zipCodeerror').text("Please enter a valid zipcode");
            return false;
        }
        else {
            $('#zipCode').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#zipCodeerror').text("");
        }
    });
    $('#usremailadd').blur(function (e) {
        if (document.getElementById('usremailadd') != null && !isValidEmailAddress(document.getElementById('usremailadd').value)) {
            $('#usremailadd').closest('.input-group').removeClass('success').addClass('has-error');
            $('#emailerror').text("Please enter a correct email address");
            flagforvalidforEmail = false;
        }
        else {
            $('#usremailadd').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#emailerror').text("");
            flagforvalidforEmail = true;
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
    $('#identification').blur(function (e) {
        if (document.getElementById('identification').value.length < 6) {
            $('#identification').closest('.input-group').removeClass('success').addClass('has-error');
            $('#identificationerror').text("Please enter valid identification number");
            flagforidentification = false;
        }
        else {
            $('#identification').closest('.input-group').removeClass('has-error').addClass('has-success');
            $('#identificationerror').text("");
            flagforidentification = true;
        }
    });

}
function validatePassword() {
    if (document.getElementById('usrpassword').value.length < 8 || document.getElementById('usrpassword').value != document.getElementById('confirmusrpassword').value) {
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
    var atLeastOneIsChecked = $('input:checkbox:checked').map(function () {
        return this.value;
    }).get();
    if (atLeastOneIsChecked.length == 0) {
        confirm("Please select the type of user..!!")
    }
    else {
        var det = null;
        det = new Details();
        det.email = document.getElementById('usremailadd').value; //'arpit2409@tamu.edu'//
        det.firstname = document.getElementById('name').value;
        det.lastname = document.getElementById('lname').value;
        det.companyname = document.getElementById('companyName').value;
        det.address = document.getElementById('Address').value;
        if (document.getElementById('city').value == "") {
            alert("Please select the city");
            return;
        }
        det.city = document.getElementById('city').value;
        det.state = document.getElementById('state').value;
        det.zip = document.getElementById('zipCode').value;
        det.phone = document.getElementById('txtPhone').value;
        det.password = document.getElementById('usrpassword').value;
        det.confirm = document.getElementById('confirmusrpassword').value;
        det.identification = document.getElementById('identification').value;
        var usertypeVal = atLeastOneIsChecked[0];
        for (var usrtype = 1; usrtype < atLeastOneIsChecked.length; usrtype++) {
            usertypeVal += "," + atLeastOneIsChecked[usrtype];
        }
        det.usertype = usertypeVal;
        var str = JSON.stringify(det);
        PageMethods.RegisterUserDetails(str, onSucess, onError);
        
        setTimeout(fade_out, 5000);
        function fade_out() {
            $("#errormessage").fadeOut().empty();
            $("#successmessage").fadeOut().empty();
        }
    }

}
function onSucess(val) {
    
    if (val[0] == 1) {
        $("#successmessage").show();
        $("#successmessage").empty();
        $("#errormessage").empty();
        $("#successmessage").append('<strong>Success! </strong>' + val[1]);
        //disableCropForm();
        //setcolorforPolygon(drawnPolygon, valuefirst);
        //$('#registerCropForm').trigger("reset");
    }
    if (val[0] == 0) {

        $("#errormessage").show();
        $("#errormessage").empty();
        $("#errormessage").append('<strong>Error! Some values are incorrect. </strong>' + val[1]);
    }
}

function onError(val) {
    $("#errormessage").show();
    $("#errormessage").empty();
    $("#errormessage").append('<strong>Error! Some values are incorrect. </strong>' + val[1]);
}

$(document).ready(function () {
    validatefields();
    enabledisableSubmitbutton();
    $("#userSubmit").click(function () {
        $('html, body').animate({
            scrollTop: $("#messages_content").offset().top
        }, 600);
        return false;
    });
});
$(function () {
    $('#search').on('keyup', function () {
        var pattern = $(this).val();
        $('.searchable-container .items').hide();
        $('.searchable-container .items').filter(function () {
            return $(this).text().match(new RegExp(pattern, 'i'));
        }).show();
    });

});


