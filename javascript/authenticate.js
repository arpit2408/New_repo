
var width = 0;
var height = 0;
//var user; ///the logged on user!
var usrtype_mbox = "";


function Details() 
{
    this.email = "";
    this.firstname = "";
    this.lastname = "";
    this.companyname = "";
    this.address = ""; 
    this.city = "";
    this.state = "";
    this.zip = "";
    this.website = "";
    this.phone1 = "";
    this.phone2 = "";
    this.password = "";
}

function init() {

    //////check to see if the user is logged in
   
    
    //resize();
//    initmb();
    jQuery.ajax({
        // type: 'POST',
    url: 'Login.svc/CheckLogin',
        success: CheckLogin_Success,
        fail: Fail,
        async: false,
        cache: false,
        dataType: "text",
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

    });


}

function CheckLogin_Success(val) 
{
    if (val[0] == "1") ///user session is store/exists
    {
        user = JSON.parse(val[1]);
        DisplayUser();
        //GoHome();
    }
    else 
    {
        ////check cookies
        var pwd = getCookie('password');
        var email = getCookie('userid');
        ///also send the user type (producer or applicator)
        AuthenticateCookie(email, pwd);

    }

}

function Authenticate(user, pwd) 
{

    //PageMethods.Authenticate(user, pwd, Authenticate_Success, Fail);
    var parameters = "id=" + user + "&pwd=" + pwd;
    jQuery.ajax({
        //type: 'Get',
        url: 'Login.svc/Authenticate',
        success: Authenticate_Success,
        fail: Fail,
        data: parameters,
        dataType: "text",
        async: false,
        cache: false,
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

function AuthenticateCookie(user, pwd) {

    //PageMethods.Authenticate(user, pwd, Authenticate_Success, Fail);
    var parameters = "id=" + user + "&pwd=" + pwd;
    jQuery.ajax({
        //type: 'Get',
        url: 'Login.svc/AuthenticateCookie',
        success: Authenticate_Success,
        fail: Fail,
        data: parameters,
        dataType: "text",
        async: false,
        cache: false,
        //context: func_callback,
        dataFilter: function (data) {
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


function Authenticate_Success(val) {
    //document.getElementById('loginerr').innerHTML = val[1];
    if (val[0] == '1') {
        user = JSON.parse(val[2]);
        DisplayUser();
        //GoHome();
    }
    else //user not logged in sent to Home page
    {
        GoHome();
    }
}

function Fail() {
    ////write some code here!
    var box = new DialogBox();
    box.message = "Error Connecting To Databases for Validation";
    box.CreateDialog(2000);
}

function Logoff() {

    //    alert('');
    jQuery.ajax({
        // type: 'POST',
        url: 'Login.svc/Logoff',
        success: Logoff_Success,
        fail: Fail,
        dataType: "text",
        cache: false,
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

    function Logoff_Success(val) 
    {
        //alert(val[1]);
        eraseCookie("userid");
        eraseCookie("password");
        
            var idel = document.getElementById('userid');
            var pwdel = document.getElementById('userpwd');
            if (idel && pwdel) {
                pwdel.setAttribute('type', 'text');
                idel.value = "Email";
                pwdel.value = "Password";

            }
        
        user = null;
        DisplayUser();
        GoHome();
        // window.location.reload();
    }
    
    function eraseCookie(name) {
        setCookie(name, "", -1);
    }

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}



function resize(evt) {

    width = window.screen.availWidth
    height = window.screen.availHeight
    //document.getElementById('bannerrow').setAttribute('style', 'width: ' + (width) + 'px;');
    //document.getElementById('searchrow').setAttribute('style', 'width: ' + (width) + 'px;');
    var xpos = (width - 1000)/2;
    //document.getElementById('bannerlogo').setAttribute('style', 'left: ' + xpos + 'px;');
    ///document.getElementById('register').setAttribute('style', 'left: ' + (width - (xpos+70)) + 'px; top: 25px');
    //document.getElementById('account').setAttribute('style', 'position:absolute; left: ' + (width - (xpos + 300)) + 'px; top: 0px');
}

function Signin() 
{

    //sm('login', 350, 200);
    SigninAuthenticate();
}

function SigninAuthenticate_Success(val)
{
    //document.getElementById('loginerr').innerHTML = val[1];
    if (val[0] == '1') {
        user = JSON.parse(val[2]);
        setCookie('userid', user.email, 60);
        setCookie('password', val[1], 60);
        
        DisplayUser();
        //window.location.reload();
        GoHome();
    }
    else {
        //alert(val[1]);
        var box = new DialogBox();
        box.message = "Validation Error<br>" + val[1];
        box.CreateDialog(2000);
    }
    ///called when authentication success from dialog box
}

function SigninAuthenticate() {

    ////called when authentication occurs from dialog box
//    var user = document.getElementbyid('loginid').value;
    //    var pwd = document.getElementbyid('loginpwd').value;
    var user = document.getElementById('userid').value;
    var pwd = document.getElementById('userpwd').value;
//    var usrtype = document.getElementById('usrtype').value;//usrtype_mbox;//GetUserType();
   

    //Modified LFC 02/08/2012 escape() encodes special characters with exception of : *@-_+./
    var encodepwd = escape(pwd);

    var parameters = "id=" + user + "&pwd=" + encodepwd;//var parameters = "id=" + user + "&pwd=" + pwd;
    jQuery.ajax({
       // type: 'POST',
        url: 'Login.svc/Authenticate',
        success: SigninAuthenticate_Success,
        fail: Fail,
        async: false,
        cache: false,
        data: parameters,
        dataType: "text",
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



function DisplayUser() //displays the user info in the current page
{
        var str = "";
        if (user == null) 
        {
            var login = document.getElementById('div_Login');
            if (login) {
                login.style.display = 'block';
            }
            var userdet = document.getElementById('div_Account');
            if (userdet) {
                userdet.style.display = 'none';
            }
            var userlbl = document.getElementById('user');
            if (userlbl)
            {
                userlbl.innerHTML = "";
            }
        
        }
        else 
        {
            var login = document.getElementById('div_Login');
            if (login) {
                login.style.display = 'none';
            }
            var userdet = document.getElementById('div_Account');
            if (userdet) {
                userdet.style.display = 'block';
                //closeMenu($("#nav-one"));
                document.getElementById('accountnavigation').style.display = 'none';;
                
            }
            var userlbl = document.getElementById('user');
            if (userlbl) {

                if (userlbl.innerHTML != "") {
                    
                    userlbl.innerHTML = user.email + userlbl.innerHTML;
                }
                else {
                    userlbl.innerHTML = user.email + '<span class="arrow"></span>';
                }
                
            }
        }
        /////now display the name
    }
    
    

    function AccountEdit() {

        window.location = "Account.aspx?EDITDETAILS";

    }

    function AccountRequestPassword() {
        window.location = "Account.aspx?REQUESTPASSWORD";
    }

    function AccountRegister() 
    {
        window.location = "Account.aspx?REGISTER";
    }

    function GetUserType() 
    {
        var currpath = document.location.pathname;
        var vars = currpath.split('/');
        var usrtype = vars[vars.length - 1].substring(0, (vars[vars.length - 1].length - 5));
        if (usrtype == "Producer" || usrtype == "Applicator") 
        {
            return usrtype; 
        }
        else { return document.getElementById('usrtype').value; }
    }

    function hideLabel(val, action) {
        var emailel = document.getElementById('userid');
        var pwdel = document.getElementById('userpwd');

        if (val == 0) {
            if (emailel.value.length == 0 && action == "blur") {
                var el = document.getElementById('userid');
                if (el) {
                    el.value = 'Email';
                    el.setAttribute('style', 'color: #999999');
                }
            }
        }

        if (val == 1) {

            if (pwdel.value.length == 0 && action == "blur") {
                var el = document.getElementById('userpwd');
                if (el) {
                    el.value = 'Password';
                    el.setAttribute('type', 'text');
                    el.setAttribute('style', 'color: #999999');
                }
            }
        }
    }
    function ChangeText(val) {
        
        if (val == 1) {
            var el = document.getElementById('userid');
            el.innerHTML = "";
            el.value = "";
            el.setAttribute('style', 'color:black');
            
                 }
        if (val == 2) {
            var el = document.getElementById('userpwd');
            el.value = "";
            el.innerHTML = "";
                  el.setAttribute('type', 'password');
              el.setAttribute('style', 'color:black');
             }
   }

   
