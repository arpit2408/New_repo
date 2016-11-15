
function GetURLParameters() {
    var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
}
var urlParams; ////global



function init_acc()
{
    //    PageMethods.GetUser(GetUser_Success, Fail);
    //    alert(val);
    //-- ---------------Rama Changes Begin -------------------------
    user = serverval;
    //-- ---------------Rama Changes End -------------------------
    GetURLParameters();
    if (urlParams)
    {

        if (urlParams.type == 'REGISTER') {
            ChangeForm(1);
        }
        else if (urlParams.type == 'ACTIVATEACCOUNT') {
            ChangeForm(2);
        }
        else if (urlParams.type == 'REQUESTPASSWORD') {
            ChangeForm(3);
        }
        else if (urlParams.type == 'EDITDETAILS') {
            //setTimeout("ChangeForm(4)", 10);
            ChangeForm(4);
        }
        else {
            ChangeForm(1);
        }
    }

    else {
        var err = document.getElementById('error');
        err.innerHTML = "No value from server";
        ChangeForm(1);
    }
    
}
function GetUser_Success(val) {

    if (val[0] == "1") 
    {
        user = JSON.parse(val[1]);
        
    }
    else 
    {
        
    }
}

function DisableAllFormElements(val) {

    if (val == true)///disable
    {
        var el = document.getElementById('id');
        if (el) {
            el.value = "";
            el.setAttribute('disabled');
        }

        var el = document.getElementById('firstname');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('lastname');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('companyname');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('address');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('city');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('state');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('zip');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('website');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('phone1');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('phone2');
        if (el) {
            el.setAttribute('disabled');

        }
        var el = document.getElementById('submit1');
        if (el) {
            el.setAttribute('disabled');

        }


    }
    else {//enable
        var el = document.getElementById('id');
        if (el) {
            el.value = "";
            el.setAttribute('enabled');
        }

        var el = document.getElementById('firstname');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('lastname');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('companyname');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('address');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('city');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('state');
        if (el) {
            el.setAttribute('enabled');

        }
        //            var el = document.getElementById('state');
        //            if (el) {
        //                el.value = "";

        //            }
        var el = document.getElementById('zip');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('website');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('phone1');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('phone2');
        if (el) {
            el.setAttribute('enabled');

        }
        var el = document.getElementById('submit1');
        if (el) {
            el.setAttribute('enabled');

        }

    }

}
function ChangeForm(val) 
{
    if (val == 1)//register form 
    {
        document.getElementById('signup').style.display = 'block';
        document.getElementById('change_password').style.display = 'none';
        document.getElementById('request_password').style.display = 'none';
        if (user == null)//not logged in 
        {
            DisableAllFormElements(false);
            var el = document.getElementById("description");
            if (el) 
            {
                    el.innerHTML = "<h2>Register with the Texas Crop Registry:</h2>" +
                    "Welcome to the Texas Crop Registry. If you have not already registered with the site, please fill in the form below. You will only need to register once to use the site as a Grower and/or and Applicator. If you have already registered but have forgotten your password, use the links below. " +
                                    "<br>" +
                                    "<H4>Important: After you have submitted your information, a message will be sent to the email address you have provided with an autogenerated password (if you do not receive a message check your spam box). Use this password to log into the site for the first time. </H4> Once logged in, use the links on this page to change your autogenerated password." +
                                    "<br><br><i>Required fields marked by * <i/>";
                    el.innerHTML += "<br><H3>For more help please <a href = 'Javascript:SetHelp(1)'>click here</a></H3>";
            }
            var el = document.getElementById('email1');
            if (el) {
                el.value = "";
                el.removeAttribute('disabled');
            }

            var el = document.getElementById('firstname');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('lastname');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('companyname');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('address');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('city');
            if (el) {
                el.value = "";

            }
//            var el = document.getElementById('state');
//            if (el) {
//                el.value = "";

//            }
            var el = document.getElementById('zip');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('website');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('phone1');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('phone2');
            if (el) {
                el.value = "";

            }
            var el = document.getElementById('submit1');
            if (el) {
                el.setAttribute('onclick', 'Javascript:Register()'); 

            }


        }
        else //logged in
        {
            ChangeForm(4);
            DisableAllFormElements(false);
        }

    }
    else if (val == 2)//change password form 
    {
        document.getElementById('signup').style.display = 'none';
        document.getElementById('change_password').style.display = 'block';
        document.getElementById('request_password').style.display = 'none';
        var el = document.getElementById("description");
        if (el) {
            el.innerHTML = "<H2>Change Password:</H2><BR>";
        }
        var el = document.getElementById('submit2');
        if (el) {
            el.setAttribute('onclick', 'Javascript:ChangePassword()');

        }

    }
    else if (val == 3)//request password form 
    {
        document.getElementById('signup').style.display = 'none';
        document.getElementById('change_password').style.display = 'none';
        document.getElementById('request_password').style.display = 'block';
        var el = document.getElementById("description");
        if (el) {
            el.innerHTML = "<H2>Request Password:</H2>Your existing password will be sent to your email address.<BR>";
        }


    }
    else if (val == 4)//edit details form 
    {

        document.getElementById('signup').style.display = 'block';
        document.getElementById('change_password').style.display = 'none';
        document.getElementById('request_password').style.display = 'none';
        var el = document.getElementById("description");
        if (el) {
            el.innerHTML = "<H2>Edit User Details:</H2><BR>";
        }
        if (user == null) {
            var err = document.getElementById('error');
            //err.innerHTML = 'Please enter all required information.<br>';
            err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
            err.innerHTML = "You must be registered with the system and logged in to edit your details" + '<br>';
            var el = document.getElementById('submit1');
            if (el) {
                el.setAttribute('onclick', 'Javascript:EditDetails()');
                DisableAllFormElements(true);
            }
            //ChangeForm(1);
            return;
            
        }
        else if (user != null)//logged in, fill information 
        {
            var el = document.getElementById("description");
            if (el) {
                el.innerHTML = "<H2>Change Your Account Details:</H2>Your current details are displayed below. You can modify the details in any field except your user ID. When you have finished making changes, press the submit button.";
                el.innerHTML += "<br><H3>For more help please <a href = 'Javascript:SetHelp(1)'>click here</a></H3>";
            }
            
            var el = document.getElementById('firstname');
            if (el) {
                el.value = user.firstname;

            }
            var el = document.getElementById('lastname');
            if (el) {
                el.value = user.lastname;

            }
            var el = document.getElementById('companyname');
            if (el) {
                el.value = user.companyname;

            }
            var el = document.getElementById('address');
            if (el) {
                el.value = user.address;

            }
            var el = document.getElementById('city');
            if (el) {
                el.value = user.city;

            }
            var el = document.getElementById('state');
            if (el) {
                el.value = user.state;

            }
            var el = document.getElementById('zip');
            if (el) {
                el.value = user.zip;

            }
            var el = document.getElementById('website');
            if (el) {
                el.value = user.website;

            }
            var el = document.getElementById('phone1');
            if (el) {
                el.value = user.phone1;

            }
            var el = document.getElementById('phone2');
            if (el) {
                el.value = user.phone2;

            }
            var el = document.getElementById('submit1');
            if (el) {
                el.setAttribute('onclick', 'Javascript:EditDetails()');

            }
            var el = document.getElementById('email1');
            if (el) {
                el.value = user.email;
                el.setAttribute('disabled', "true");
            }
        }
            

        }
      
        else if (val == 5)//request password form 
        {
            document.getElementById('content').style.display = 'none';
            //  document.getElementById('change_password').style.display = 'none';
            document.getElementById('forgot_pwd').style.display = 'block';
            document.getElementById('request_password').style.display = 'block';
            var el = document.getElementById("description");
            if (el) {
                el.innerHTML = "<H2>Request Password:</H2>Your existing password will be sent to your email address.<BR>";
            }


        }

        else//not logged in so user register 
        {
            ChangeForm(1);

        }


    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'display:none;font-style: italic; color: Red;');
    }
}
////////////////
function Register() {

    var err = document.getElementById('error');
    err.innerHTML = '';
    var det = null;
    var errflag = 0;

    det = new Details();
    det.email = document.getElementById('name').value;
    det.firstname = document.getElementById('email').value;
    det.lastname = document.getElementById('lastname').value;
    det.companyname = document.getElementById('companyname').value;
    det.address = document.getElementById('address').value;
    det.city = document.getElementById('city').value;
    det.state = document.getElementById('state').value;
    det.zip = document.getElementById('zipCode').value;
    det.website = document.getElementById('phonenumber').value;
    det.phone1 = document.getElementById('confirm').value;
    det.phone2 = document.getElementById('password').value;
    det.password = "";

     /////validation
    var atpos = det.email.indexOf("@");
    var dotpos = det.email.lastIndexOf(".");
    var zerolength = det.email.length;
    if (zerolength == 0 || atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= det.email.length)
    {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }
    if (det.firstname.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;

    }
    if (det.lastname.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;

    }
    if (det.companyname.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;

    }
    if (det.address.length == 0) {

        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }
    if (det.city.length == 0) {

        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }
    if (det.zip.length == 0) {

        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br><br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }


    var str = JSON.stringify(det);
    if (errflag == 0) {
        PageMethods.RegisterUser(str,Register_Success, Fail);
    }
}
function Register_Success(str) 
{
    var err = document.getElementById('error');
    err.innerHTML = str[1] + '<br>';
    err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
    
    //Modified 02/07/2012 LFC
//    GoHome();
    //setTimeout('Javascript:GoHome()', 1500);
    //err.innerHTML += ' (Redirecting...)' + '<br>';
    //alert(str[1] + ' (Redirecting...)');



}
/////////////
function EditDetails() {

    var err = document.getElementById('error');
    err.innerHTML = '';
    var det = null;
    var errflag = 0;

    det = new Details();
    det.email = document.getElementById('email1').value;
    det.firstname = document.getElementById('firstname').value;
    det.lastname = document.getElementById('lastname').value;
    det.companyname = document.getElementById('companyname').value;
    det.address = document.getElementById('address').value;
    det.city = document.getElementById('city').value;
    det.state = document.getElementById('state').value;
    det.zip = document.getElementById('zip').value;
    det.website = document.getElementById('website').value;
    det.phone1 = document.getElementById('phone1').value;
    det.phone2 = document.getElementById('phone2').value;
    det.password = "";

    /////validation
    if (det.email.length == 0) {

        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }
    if (det.firstname.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;

    }
    if (det.lastname.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;

    }
    if (det.companyname.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;

    }
    if (det.address.length == 0) {

        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }
    if (det.city.length == 0) {

        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }
    if (det.zip.length == 0) {

        var err = document.getElementById('error');
        err.innerHTML = 'Please enter all required information.<br>';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }

    if (errflag == 0) {
        var str = JSON.stringify(det);
        PageMethods.ChangeUserDetails(str, EditDetails_Success, Fail);
    }


}

function EditDetails_Success(val) {

    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1] + "<br>Redirecting back to home page....";
        el.setAttribute('style', 'display:block;font-style: italic; color: Red;');
    }
    /////refresh user object
    if (val[0] == '1') {
        var parameters = "id=" + user.email;
        jQuery.ajax({
            //type: 'Get',
            url: 'Login.svc/GetUserDetails',
            success: RefreshUserDetails,
            fail: Fail,
            data: parameters,
            dataType: "text",
            //context: func_callback,
            dataFilter: function(data) {
                var msg;

                if (typeof (JSON) !== 'undefined' &&
            typeof (JSON.parse) === 'function')
                    msg = JSON.parse(data);
                else
                    msg = eval('(' + data + ')');

                if (msg.hasOwnProperty('d'))
                    return msg.d;
                else
                    return msg;
            }

        })
        
    }
}

function RefreshUserDetails(val) {
    if (val[0] == '1') {
        user = JSON.parse(val[1]);
        //ChangeForm(2);
       setTimeout(GoHome, 3000);
    }

}








function Fail(val) {
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = "error changing password";
        el.setAttribute('style', 'display:block;font-style: italic; color: Red;');
    }
}

//////////////////////////////////
function ChangePassword() {

    var error_flag = 0;
    var invChar = /[^%]+$/g;
    var isvalid = true;
    var det = null;

    det = new Details();
    var el = document.getElementById('email3');
    if (el) {
    det.email = el.value;
    }
    el = document.getElementById('oldpassword');
    if (el) {
        var pwd = el.value;
        det.password = pwd.replace(/^\s*|\s*$/, "");
    }
    var pwd1 = "";
    var pwd2 = "";
    el = document.getElementById('password1');
    if (el) {
        pwd1 = el.value;
    }
    el = document.getElementById('password2');
    if (el) {
        pwd2 = el.value;
    }
    if (pwd1.length < 6) {

        var str = 'Password must be 6 or more characters';
        var err = document.getElementById('error');
        err.innerHTML = str;
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        error_flag = 1;

    }
    if (pwd2 != pwd1) {
        var str = 'Passwords must be the same.';
        var err = document.getElementById('error');
        err.innerHTML = str;
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        error_flag = 1;
    }
    //Modified LFC 02/08/2012 Check for special characters in pwd: %
    isvalid = invChar.test(pwd1);
    if (!isvalid) {
        var str = 'Password cannot contain "%" .';
        var err = document.getElementById('error');
        err.innerHTML = str;
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        error_flag = 1;
    }
    if (error_flag == 0) {
        //Modified LFC 02/08/2012 escape() encodes special characters with exception of : *@-_+./
        var encodepwd = escape(pwd1);
        det.password2 = pwd1;
        var userdetails = JSON.stringify(det);
        PageMethods.ChangePassword(userdetails, ChangePassword_Success, Fail);
    }


}

function ChangePassword_Success(val) {

    var el = document.getElementById('error');
    if (el) {
        Logoff();
        el.innerHTML = val[1];;
        el.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        //Modified 02/07/2012 LFC
       // setTimeout('GoHome()', 1000);
        el.innerHTML += ' (Login off...)' + '<br>';
    }


}

function RequestPassword() {

    var el = document.getElementById('email4');
    if (el) {
        //////error check
        var email = el.value;
        PageMethods.RequestPassword(email, RequestPassword_Success, Fail);
    }

}

function RequestPassword_Success(val) {

    var el = document.getElementById('error');
    if (el) {
        
        el.innerHTML = val[1];//str;
        el.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        parent.adjustFrameHeight();
        //Modified 02/08/2012 LFC
        //setTimeout('GoHome()', 2000);
        //el.innerHTML += ' (Redirecting...)' + '<br>';
    }

}

///Help overlay
function LoadHelpOverlay() {
    var overlay = new HelpOverlay(document, 2);
    overlay.Create();
//    var overlay = document.getElementById('overlay');
//    if (!overlay) {
//        var overlay = document.createElement('div');
//        overlay.setAttribute('id', 'overlay');
//        overlay.setAttribute('class', 'overlay');

//        var closeoverlay = document.createElement('div')
//        closeoverlay.setAttribute('id', 'closeoverlay');
//        closeoverlay.setAttribute('class', 'closeoverlay');
//        
//        var closebutton = document.createElement('a');
//        closebutton.setAttribute('id', 'boxclose');
//        closebutton.setAttribute('class', 'boxclose');
//        closebutton.setAttribute('onclick', 'Javascript:CloseHelpOverlay();');
//        closebutton.innerHTML = " X";

//        closeoverlay.appendChild(closebutton);

//        overlay.appendChild(closeoverlay);

//        var imgoverlay = document.createElement('div');
//        imgoverlay.setAttribute('id', 'imgoverlay');
//        imgoverlay.setAttribute('class', 'imgoverlay');
        //        overlay.appendChild(imgoverlay);
//        var img = document.createElement('img');
//        img.setAttribute('id', 'box1');
//        img.setAttribute('class', 'box1');
//        img.setAttribute('src', 'images/register_box1.png');
//        img.setAttribute('alt', 'help description');
//        overlay.appendChild(img);

//        document.body.appendChild(overlay);
//    }
}
function CloseHelpOverlay() {
    var overlay = document.getElementById('overlay');
    var imgoverlay = document.getElementById('imagesoverlay');
    if (overlay) {
        document.body.removeChild(overlay);
        document.body.removeChild(imgoverlay);
    }
}