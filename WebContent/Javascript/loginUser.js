var checkedItem = [""];
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
    if (user != null) {
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
                var td_showShared = document.createElement('td');
                
                td_action_v.setAttribute('id', val[i].id);
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
                var actiondiv = document.createElement('div');
                actiondiv.setAttribute("style","display:display");
                actiondiv.id="unshared" + val[i].id;
                var usractions = '<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.08em;" onclick=\'editPolygon("'
                    + cordichnge + '","' + val[i].loccentroid + '","' + val[i].flagtype + '","' + val[i].id + '","'
                    + (val[i].planttype) + '","' + (val[i].croptype) + '","' + (val[i].cropyear)
                    + '","' + (val[i].comment) + '","' + (val[i].markerPos)
                    + '")\'>create</i>&nbsp;&nbsp;<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.38em;" onclick=\'""\'>delete</i>&nbsp;&nbsp;<i class=\'material-icons\' style="color: #4e0b0b;font-size: 1.38em;" onclick="sharePolygon(this)"> share</i>';
                actiondiv.innerHTML = actiondiv.innerHTML + usractions;
                td_action_v.appendChild(actiondiv);
                td_action_v.innerHTML = td_action_v.innerHTML + '<button type = "button" id=shared' + val[i].id + ' class = "btn btn-success btn-xs" style="font-family:Georgia" onclick="unsharePolygon(this)" id= >UNSHARE</button>'
                
                tr.appendChild(td_index_v);
                tr.appendChild(td_plty_v);
                tr.appendChild(td_county_v);
                tr.appendChild(td_cropyr_v);
                tr.appendChild(td_action_v);
                table.appendChild(tr);
                if (val[i].cropShared == "0")
                    document.getElementById('shared' + val[i].id).style.display = "none";
                else
                    document.getElementById('unshared' + val[i].id).style.display = "none";
            }
            loadNewApplicatorAreas();
        }
    }
    function Fail_location(resultobj) {
        var val = resultobj.d;
    }

}
function loadNewApplicatorAreas() {
    PageMethods.ListGroupedActionViewLocations(Applicator_loc, Applicator_loc);
}
function Applicator_loc(resultobj) {
    var applicatorloc = resultobj;
    alert(applicatorloc.length);
    var tableApp = document.getElementById('tabAppBody');
    for (var i = 0; i < applicatorloc.length; i++) {
        var det = applicatorloc[i].split(",");
        var tr = document.createElement('tr');
        var td_Name = document.createElement('td');
        var td_email = document.createElement('td');
        var td_action = document.createElement('td');
        var text_Name = document.createTextNode(det[0]+" "+det[1]);
        var text_email = document.createTextNode(det[2]);
        
        td_Name.appendChild(text_Name);
        td_email.appendChild(text_email);
        td_action.innerHTML = td_action.innerHTML + '<button type="button" class = "btn btn-primary btn-xs" id="'+det[3]+'" onclick="showCropLocations(this)">View All</button>';
        tr.appendChild(td_Name);
        tr.appendChild(td_email);
        tr.appendChild(td_action);
        tableApp.appendChild(tr);
    }
}
function showCropLocations(e) {
    var user_id = e.id;
    window.location.href = 'Producer.aspx?user_id='+user_id;
}
function sharePolygon(e) {
    var userType = "2";
    document.getElementById('cropId').value = "";
    document.getElementById('cropId').value = e.parentElement.id;
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
        var divforboth = document.createElement('div');
        divforboth.setAttribute("class", "row");
        var divforinfo = document.createElement('div');
        divforinfo.setAttribute("class","col-sm-8");
        var td_fn = document.createElement('li');
        var td_email = document.createElement('li');
        var td_cmnyName = document.createElement('li');
        var td_addr = document.createElement('li');
        var text_fn = document.createTextNode('Name:- ' + val[i].firstname + '       ' + val[i].lastname);
        var text_email = document.createTextNode('Contact details:- ' + val[i].email + ',' + val[i].phone1);
        var text_cmnyName = document.createTextNode('Company Name:- ' + val[i].companyname);
        var text_add = document.createTextNode('Address :- ' + val[i].address + ',' + val[i].city + ',' + val[i].state + ',' + val[i].zip);
        td_fn.appendChild(text_fn);
        td_email.appendChild(text_email);
        td_cmnyName.appendChild(text_cmnyName);
        td_addr.appendChild(text_add);
        ul.appendChild(td_fn);
        ul.appendChild(td_email);
        ul.appendChild(td_cmnyName);
        ul.appendChild(td_addr);
        divforinfo.appendChild(ul);
        var divforRadio = document.createElement('div');
        divforRadio.setAttribute("class", "col-sm-4");
        divforRadio.innerHTML = divforRadio.innerHTML +
        '<div class="form-group">' +
            '<div class="row">'+
    		    '<label for="happy" required="required" class="col-sm-12  text-middle">Share Crop Info for Action?</label>' +
            '</div>' +
            '<div class="row">' +
    		    '<div class="col-sm-7 col-md-7">' +
    			    '<div class="input-group">' +
    				    '<div id="radioBtn' + val[i].user_id + '" class="btn-group">' +
    					    '<a class="btn btn-primary btn-sm notActiveRadio" data-toggle="happy" data-title="Y" id="yes"  onclick="radioOptionChange(this);">YES</a>' +
    					    '<a class="btn btn-primary btn-sm activeRadio" data-toggle="happy" data-title="N" id = "no" onclick="radioOptionChange(this);">NO</a>' +
    				    '</div>' +
    				    '<input type="hidden" name="happy" id="happy">' +
    			    '</div>' +
    		    '</div>' +
            '</div>' +
    	'</div>';
        divforboth.appendChild(divforinfo);
        divforboth.appendChild(divforRadio);
        li.appendChild(divforboth);
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
function MappingDetails() {
    this.producerLocId = "",
    this.user_Id = "",
    this.MappedForAction = ""
}
function submitapplicatorlist() {
    var cropId = null;
    var listMappings = [];
    var selectedAppliators=$("#check-list-box li.success").map(function () {
        return this.id;
    }).get();
    if (document.getElementById('cropId') != null)
        cropId = document.getElementById('cropId').value;
    document.getElementById(cropId).style.display = "none";
    var cropId = cropId.replace("unshared", "shared");
    var rowtobeUpdatedinDashboard = document.getElementById(cropId);
    if(rowtobeUpdatedinDashboard!=null)
    rowtobeUpdatedinDashboard.style.display = "";
    document.getElementById('cropId').value = "";
    $('#listApplicatorsModal').modal('hide');
    var selectedli = selectedAppliators;
    cropId = cropId.replace("shared", "");
    for (var i = 0; i < selectedli.length; i++) {
        det = new MappingDetails();
        det.producerLocId = cropId;
        var id = "radioBtn" + selectedli[i];
        if (document.getElementById(id).childNodes[0].classList.contains('activeRadio')) {
            if(document.getElementById(id).childNodes[0].id=="yes")
                det.MappedForAction = 1;
            else
                det.MappedForAction = 0;
        }
        else if (document.getElementById(id).childNodes[1].classList.contains('activeRadio')) {
            if (document.getElementById(id).childNodes[1].id == "yes")
                det.MappedForAction = 1;
            else
                det.MappedForAction = 0;
        }
        det.user_Id = selectedli[i];
        listMappings.push(det);
    }
    PageMethods.MapProducerLocations(JSON.stringify(listMappings), mappingSuccessful, mappingUnSuccessful);
    /*$.ajax({
        type: 'POST',
        url: 'Dashboard.aspx/MapProducerLocations',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(listMappings),
        dataType: 'json',
        success: function (data) {
            Applicator_loc(data)
        },
        error: function (textStatus, errorThrown) {
            Applicator_loc("Error getting the data")
        }
    });*/
    function mappingSuccessful(val) {
        var getVal = val[1];
        alert(getVal);
    }
    function mappingUnsuccessful(val) {
    }
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

function unsharePolygon(e) {
    var cropid = e.id;
    var cropIdunshare=cropid.replace("shared", "unshared");
    var sharele = document.getElementById(cropIdunshare);
    e.style.display = "none";
    sharele.style.display = "";

}

   function radioOptionChange(e) {
       
        if (e.id == "no") {
            e.className = "btn btn-primary btn-sm activeRadio";
            if (document.getElementById(e.parentElement.id).childNodes[0].id == "yes")
                document.getElementById(e.parentElement.id).childNodes[0].className = "btn btn-primary btn-sm notActiveRadio";
            else
                document.getElementById(e.parentElement.id).childNodes[1].className = "btn btn-primary btn-sm notActiveRadio";
        }
        else {
            e.className = "btn btn-primary btn-sm activeRadio";
            if (document.getElementById(e.parentElement.id).childNodes[0].id == "no")
                document.getElementById(e.parentElement.id).childNodes[0].className = "btn btn-primary btn-sm notActiveRadio";
            else
                document.getElementById(e.parentElement.id).childNodes[1].className = "btn btn-primary btn-sm notActiveRadio";
        }
        //e.removeClass('notActive').addClass('active');
        //$('span[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
        //$('span[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');
        //alert(something);
    }
