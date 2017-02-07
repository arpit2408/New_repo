var checkedItems = {};
var user;
function loginUser() {
    var useremail = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    //parameters = "id=" + useremail + "&pwd=" + password;
    $.ajax({
        type: 'POST',
        url: '/LoginUser.svc/AuthenticateUser',
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
    var val = returnObj.d;
    $("#loginmsg").show();
    $('#loginmsg').append("Error Logging In" + "<br>");
    $('#loginmsg').removeClass('alert-success').addClass('alert-danger');
}

function dashboardOnLoad() {
    var user = checkloggedInUser();
    if (user!=null) {
        var href = window.top.location.href;
        var usernameValue = user.firstname;
        var useremail = user.email;
        $('#UserName').empty();
        $('#UserName').append(usernameValue);
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
                td_action_v.id = val[i].id;
                var text_ind = document.createTextNode(i + 1);
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
                for (var d = 0; d < cordiarr.length; d++)
                    cordichnge = cordichnge + cordiarr[d] + ";"
                td_action_v.innerHTML = td_action_v.innerHTML +
                    '<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.08em;" onclick=\'editPolygon("'
                    + cordichnge + '","' + val[i].loccentroid + '","' + val[i].flagtype + '","' + val[i].id + '","'
                    + (val[i].planttype) + '","' + (val[i].croptype) + '","' + (val[i].cropyear)
                    + '","' + (val[i].comment) + '","' + (val[i].markerPos) + '")\'>create</i>&nbsp;&nbsp;<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.38em;" onclick=\'""\'>delete</i>&nbsp;&nbsp;<span><i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.38em;" onclick=\'sharePolygon("' + val[i].id + '")\'>share</i></span>';

                tr.appendChild(td_index_v);
                tr.appendChild(td_plty_v);
                tr.appendChild(td_county_v);
                tr.appendChild(td_cropyr_v);
                tr.appendChild(td_action_v);
                table.appendChild(tr);
            }
            loadNewApplicatorAreas();
        }
    }
    function Fail_location(resultobj) {
        var val = resultobj.d;
    }

}
function loadNewApplicatorAreas() {
    var useremail = user.email;
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
function sharePolygon(cropId) {
    var userType = "2";
    document.getElementById('cropId').value = "";
    //alert(document.getElementById('cropId').value);
    document.getElementById('cropId').value = cropId;
    $.ajax({
        type: 'POST',
        url: 'ListApplicator.aspx/GetUsers',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ userType: userType }),
        dataType: 'json',
        success: function (data) {
            Applicator_list(data)
        },
        error: function (textStatus, errorThrown) {
            Applicator_list("No Applicators found in your area")
        }
    });

    $('#listApplicatorsModal').modal('show');
}
function Applicator_list(resultobj) {
    var applicatorusr = resultobj.d;
    var val = JSON.parse(applicatorusr[1]);

    var tableApp = document.getElementById('check-list-box');
    for (var i = 0; i < val.length; i++) {

        var li = document.createElement('li');
        li.setAttribute("id", val[i].user_id);
        var ul = document.createElement('ul');
        li.setAttribute("class", "list-group-item");
        var span = document.createElement('span');
        span.setAttribute("class", "state-icon glyphicon glyphicon-unchecked");
        li.appendChild(span);
        li.setAttribute("style", "cursor: pointer;");
        //
        var td_fn = document.createElement('li');
        var td_email = document.createElement('li');
        var td_cmnyName = document.createElement('li');
        var td_addr = document.createElement('li');
        var text_fn = document.createTextNode('Name:- ' + val[i].firstname + '       ' + val[i].lastname);
        var text_email = document.createTextNode('Contact details:- ' + val[i].email + ',' + val[i].phone1);
        var text_cmnyName = document.createTextNode('Company Name:- ' + val[i].companyname);
        var text_add = document.createTextNode('Address :- ' + val[i].address + ',' + val[i].city + ',' + val[i].state + ',' + val[i].zip);
        td_fn.appendChild(text_fn);
        //td_ln.appendChild(text_ln);
        td_email.appendChild(text_email);
        td_cmnyName.appendChild(text_cmnyName);
        td_addr.appendChild(text_add);
        ul.appendChild(td_fn);
        //ul.appendChild(td_ln);
        ul.appendChild(td_email);
        ul.appendChild(td_cmnyName);
        ul.appendChild(td_addr);
        li.appendChild(ul);
        for (var j = 0; j < 3; j++) {
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.setAttribute("class", "hidden");
            li.appendChild(checkbox);
        }
        tableApp.appendChild(li);
    }
    $(function () {
        $('.list-group.checked-list-box .list-group-item').each(function () {

            // Settings
            var $widget = $(this),
                $checkbox = $('<input type="checkbox" class="hidden" />'),
                color = ($widget.data('color') ? $widget.data('color') : "success"),
                style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
                settings = {
                    on: {
                        icon: 'glyphicon glyphicon-check'
                    },
                    off: {
                        icon: 'glyphicon glyphicon-unchecked'
                    }
                };

            $widget.css('cursor', 'pointer')
            $widget.append($checkbox);

            // Event Handlers
            $widget.on('click', function () {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
                updateDisplay();
            });
            $checkbox.on('change', function () {
                updateDisplay();
            });


            // Actions
            function updateDisplay() {
                var isChecked = $checkbox.is(':checked');

                // Set the button's state
                $widget.data('state', (isChecked) ? "on" : "off");

                // Set the button's icon
                $widget.find('.state-icon')
                    .removeClass()
                    .addClass('state-icon ' + settings[$widget.data('state')].icon);

                // Update the button's color
                if (isChecked) {
                    $widget.addClass(style + color + ' success');
                } else {
                    $widget.removeClass(style + color + ' success');
                }
            }

            // Initialization
            function init() {

                if ($widget.data('checked') == true) {
                    $checkbox.prop('checked', !$checkbox.is(':checked'));
                }

                updateDisplay();

                // Inject the icon if applicable
                if ($widget.find('.state-icon').length == 0) {
                    $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
                }
            }
            init();
        });


    });
}
$(document).ready(function () {
    $('#get-checked-data').on('click', function (event) {
        event.preventDefault();
        counter = 0;
        $("#check-list-box li.success").each(function (idx, li) {
            checkedItems[counter] = $(li).attr('id');
            counter++;
        });
        submitapplicatorlist();
    });
});
function submitapplicatorlist() {
    var cropId = null;
    if (document.getElementById('cropId') != null)
        cropId = document.getElementById('cropId').value;

    $('#listApplicatorsModal').modal('hide');
    var rowtobeUpdatedinDashboard = document.getElementById(cropId);
    if (rowtobeUpdatedinDashboard != null)
        rowtobeUpdatedinDashboard.innerHTML = '<span class="btn-success">Shared</span>';
    alert(checkedItems);
    for (var i = 0; i < checkedItems.length; i++) {
        alert(checkedItems[i]);
    }
    document.getElementById('cropId').value = "";

}

function myFunction() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("check-list-box");
    tr = table.getElementsByTagName("li");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("ul")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}
