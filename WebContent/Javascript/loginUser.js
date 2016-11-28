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
        var str = "";
        var val = resultobj.d;
        var div = document.getElementById('producerPolygons');
        var table = document.createElement('table');
        var tr_heading = document.createElement('tr');
        var text_index = document.createTextNode('Index');
        var text_planttp = document.createTextNode('Plant Type');
        var text_cropty = document.createTextNode('Crop Type');
        var text_cropyr = document.createTextNode('Crop Year');
        var text_county = document.createTextNode('County');
        var text_cmnts = document.createTextNode('Comments');
        var td_index = document.createElement('td');
        var td_plty = document.createElement('td');
        var td_cropty = document.createElement('td');
        var td_cmnt = document.createElement('td');
        var td_cropyr = document.createElement('td');
        var td_county = document.createElement('td');
        td_index.innerHTML = '<b>' + "Index" + '</b>';
        td_plty.innerHTML = '<b>' + "Plant Type"+ '</b>';
        td_cropty.innerHTML = '<b>' + "Crop Type" + '</b>';
        td_cmnt.innerHTML = '<b>' + "Comments" + '</b>';
        td_county.innerHTML = '<b>' + "County" + '</b>';
        td_cropyr.innerHTML = '<b>' + "Year" + '</b>';
        
        tr_heading.appendChild(td_index);
        tr_heading.appendChild(td_plty);
        //tr_heading.appendChild(td_cropty);
        tr_heading.appendChild(td_county);
        //tr_heading.appendChild(td_cmnt);
        tr_heading.appendChild(td_cropyr);
        table.appendChild(tr_heading);
        for (var i = 0; i < val.length; i++) {
            var tr = document.createElement('tr');
            var td_index_v = document.createElement('td');
            var td_plty_v = document.createElement('td');
            var td_cropty_v = document.createElement('td');
            var td_cmnt_v = document.createElement('td');
            var td_cropyr_v = document.createElement('td');
            var td_county_v = document.createElement('td');
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

            tr.appendChild(td_index_v);
            tr.appendChild(td_plty_v);
            //tr.appendChild(td_cropty_v);
            tr.appendChild(td_county_v);
            //tr.appendChild(td_cmnt_v);
            tr.appendChild(td_cropyr_v);
            tr.innerHTML = tr.innerHTML + '<a href="/node/fasids/landscape/homeownermng/57a0c88465ddd39c1795ec7e"><span class="fa fa-map-o fa-lg"></span>&nbsp; Edit</a><a href="/node/fasids/landscape/homeownermng/57a0c88465ddd39c1795ec7e" data-http-method="delete" class="http-action-link"> <span class="fa fa-remove fa-lg"></span>&nbsp; Delete</a>'
            table.appendChild(tr);
        }
        div.appendChild(table);
    }
    function Fail_location(resultobj) {
        var val = resultobj.d;
    }
}
