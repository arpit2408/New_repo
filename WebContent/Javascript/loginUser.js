function loginUser() {
    var useremail = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    $.ajax({
        type: 'POST',
        url: 'LoginUser.aspx/AuthenticateUser',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: useremail, pwd: password }),
        dataType: 'json',
        success: Authenticate_User_Success,
        error: Fail_User_Validate
    });
    //PageMethods.AuthenticateUser(useremail, password, Authenticate_User_Success, Fail_User_Validate);
}

function Authenticate_User_Success(returnObj) {
    setTimeout(fade_out, 5000);
    function fade_out() {
        $("#loginmsg").fadeOut().empty();
    }
    var val = returnObj.d;
    if (val[0] == 1) {
        var names = val[1].split(" ");
        $("#loginmsg").show();
        $('#loginmsg').append(val[1] + "<br>");
        $('#loginmsg').removeClass('alert-danger').addClass('alert-success');
        window.location.href = 'dashboard.aspx?username=' + names[0];
        return false;
    }
    else {
        $("#loginmsg").show();
        $('#loginmsg').append("Error Logging In" + "<br>");
        $('#loginmsg').removeClass('alert-success').addClass('alert-danger');
    }
}
function Fail_User_Validate(returnObj) {
    var val=returnObj.d;
    $("#loginmsg").show();
    $('#loginmsg').append("Error Logging In" + "<br>");
    $('#loginmsg').removeClass('alert-success').addClass('alert-danger');
}

function dashboardOnLoad() {
    var href = window.top.location.href;
    var username = href.split("?");
    var usernameValue = username[1].split("=");
    var useremail = "mtchakerian@tamu.edu";
    $('#UserName').empty();
    $('#UserName').append(usernameValue[1]);
    $.ajax({
        type: 'POST',
        url: 'Dashboard.aspx/ListProducerPolygons',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ useremail: useremail }),
        dataType: 'json',
        success: Producer_location_Success,
        error: Fail_location
    });
    function Producer_location_Success(resultobj) {
        var val = resultobj.d;
        var table = document.getElementById('tabBody');
        
        for (var i = 0; i < val.length; i++) {
            var tr = document.createElement('tr');
            var td_index_v = document.createElement('td');
            var td_plty_v = document.createElement('td');
            var td_cropty_v = document.createElement('td');
            var td_cmnt_v = document.createElement('td');
            var td_cropyr_v = document.createElement('td');
            var td_county_v = document.createElement('td');
            var td_action_v = document.createElement('td');
            var text_ind = document.createTextNode(i+1);
            var text_pt = document.createTextNode(val[i].planttype);
            var text_ct = document.createTextNode(val[i].croptype);
            var text_county = document.createTextNode(val[i].county);
            var text_cmnt = document.createTextNode(val[i].comment);
            var text_cy = document.createTextNode(val[i].cropyear);
            td_index_v.appendChild(text_ind);
            td_plty_v.appendChild(text_pt);
            td_cropty_v.appendChild(text_ct);
            td_county_v.appendChild(text_county);
            td_cmnt_v.appendChild(text_cmnt);
            td_cropyr_v.appendChild(text_cy);
            var cordiarr = val[i].coordinates.split("\n");
            var cordichnge = "";
            for (var d=0; d<cordiarr.length; d++)
                cordichnge = cordichnge+cordiarr[d] + ";"
            td_action_v.innerHTML = td_action_v.innerHTML + '<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.08em;" onclick=\'editPolygon("' + cordichnge + '","' + val[i].loccentroid + '","' + val[i].flagtype + '")\'>create</i>&nbsp;&nbsp;<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.38em;" onclick=\'""\'>delete</i>';

            tr.appendChild(td_index_v);
            tr.appendChild(td_plty_v);
            tr.appendChild(td_county_v);
            tr.appendChild(td_cropyr_v);
            tr.appendChild(td_action_v);
            table.appendChild(tr);
        }
        loadNewApplicatorAreas();
    }
    function Fail_location(resultobj) {
        var val = resultobj.d;
    }
    
}
function loadNewApplicatorAreas() {
    var useremail = "mtchakerian@tamu.edu";
    $.ajax({
        type: 'POST',
        url: 'ApplicatorNew.aspx/GetApplicatorAreas',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ email: useremail }),
        dataType: 'json',
        success: function (data) {
            Applicator_loc(data)
        },
        error: function (textStatus, errorThrown) {
            Applicator_loc("Error getting the data")
        }
    });
}
function Applicator_loc(resultobj) {
    var applicatorloc = resultobj.d;
    var val = JSON.parse(applicatorloc[1]);
    var tableApp = document.getElementById('tabAppBody');
    for (var i = 0; i < val.length; i++) {
        var tr = document.createElement('tr');
        var td_index_app = document.createElement('td');
        var td_plty_app = document.createElement('td');
        var td_cropty_app = document.createElement('td');
        var td_cmnt_app = document.createElement('td');
        var td_county_app = document.createElement('td');
        var td_action_app = document.createElement('td');
        var text_ind = document.createTextNode(i + 1);
        var text_pt = document.createTextNode(val[i].appareaname);
        var text_ct = document.createTextNode(val[i].pesticidename);
        var text_county = document.createTextNode(val[i].county);
        var text_cmnt = document.createTextNode(val[i].acres);
        td_index_app.appendChild(text_ind);
        td_plty_app.appendChild(text_pt);
        td_cropty_app.appendChild(text_ct);
        td_county_app.appendChild(text_county);
        td_cmnt_app.appendChild(text_cmnt);
        td_action_app.innerHTML = td_action_app.innerHTML + '<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.08em;" onclick=\'""\'>create</i>&nbsp;&nbsp;<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.38em;" onclick=\'""\'>delete</i>';
        tr.appendChild(td_index_app);
        tr.appendChild(td_plty_app);
        tr.appendChild(td_cropty_app);
        //tr.appendChild(td_cmnt_app);
        tr.appendChild(td_county_app);
        tr.appendChild(td_action_app);
        tableApp.appendChild(tr);
    }
}


