var user = null;
$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    });
function getCountyInfo(croplocation) {
    $.ajax({
        type: 'POST',
        url: 'RegisterCrop.aspx/GetCounty',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ croplocation: croplocation }),
        dataType: 'json',
        success: LookUpCounty_Success,
        error: Fail
    });
    //PageMethods.GetCounty(value, LookUpCounty_Success, Fail);
    function LookUpCounty_Success(result) {
        var val = result.d;
        if (val[0] == '1') {
            var el = document.getElementById('countyselected');
            el.value = val[1];
        }
    }
    function Fail(val) {
    }
}
function getUrlVars(hrefString) {
    var vars = [], hash;
    var hashes = hrefString.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function checkforLandingPage() {
    var user = checkloggedInUser();
    if (user != null) {
        window.location.href = 'WebContent/dashboard.aspx';
    }
    else {
        $('#loginforModal').modal('show');
        $("#loginforModal").draggable({ handle: ".modal-body" });
    }
}
function checkloggedInUser() {
    jQuery.ajax({
        // type: 'POST',
        url: '/LoginUser.svc/CheckLogin',
        success: CheckLogin_Success,
        fail: FailedLogin,
        async: false,
        cache: false,
        dataType: "text",
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
    });
    return user;
}
function CheckLogin_Success(val) {
    if (val[0] == "1") 
    {
        user = JSON.parse(val[1]);
        var menuhead = document.createElement('ul');
        menuhead.setAttribute("class", "dropdown-menu");
        $('#SignUpli').hide();
        $('#Homeli').hide();
        if (!user.usertype.includes("1")) {
            $('#producers').hide();
            $('#AddCrop').hide();
        }
        $('#UserName').removeAttr('data-target');
        $('#UserName').attr('data-toggle', 'dropdown');
        $('#UserName').attr('class', 'dropdown-toggle');
        var dashboard = document.createElement('li');
        dashboard.setAttribute("id", "dashboardId");
        dashboard.innerHTML = '<a href="/WebContent/Dashboard.aspx">User dashboard</a>';
        var account = document.createElement('li');
        account.innerHTML = '<a onclick="openProfileModal()">Account</a>';
        var logout = document.createElement('li');
        logout.innerHTML = '<a onclick="Logoff()">Log out</a>';
        if (document.getElementById("dashboardId")==null) {
            menuhead.appendChild(dashboard);
            menuhead.appendChild(account);
            menuhead.appendChild(logout);
        }
        $('#UserName').empty();
        $('#UserName').append(user.firstname);
        $('#UserName').append('<span class="caret"></span>');
        if (document.getElementById("dashboardId") == null) {
            $('#UserNameli').append(menuhead);
        }
        $('#UserNameli').prop('onclick', null).off('click');
        return user;
    }
    else {
            $('#loginforModal').modal('show');
            $("#loginforModal").draggable({ handle: ".modal-body" });
            return null;
    }
}

function FailedLogin() {
}

function Logoff() {
    jQuery.ajax({
        // type: 'POST',
        url: '/LoginUser.svc/Logoff',
        success: Logoff_Success,
        fail: FailedLogoff,
        dataType: "text",
        cache: false,
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
    });


}

function Logoff_Success(val) {
    user = null;
    $.get("HeaderNav.html", function (data) {
        $("#header").replaceWith(data);
    });
    $('#UserNameli').empty();
    $('#UserNameli').click("checkforLandingPage();");
    $('#UserNameli').append('<a id="UserName">SIGN IN <b class="caret"></b></a>');
    $('#SignUpli').show();
    $('#Homeli').show();
    
    window.location.href = '/index.html' ;
}

function FailedLogoff(name) {
    
}
function closeEventAccDetails() {
    $("#accsuccessmessage").empty();
    $("#accerrormessage").empty();
    $("#accerrormessage").hide();
    $("#accsuccessmessage").hide();
    $('#profileEditModal').on('hidden.bs.modal', function (e) {
        $(this)
          .find("input,textarea,select")
             .val('')
             .end()
          .find("input[type=checkbox], input[type=radio]")
             .prop("checked", "")
             .end();
    })
}
function closeForgotPass() {
    $("#forgotPasssuccessmessage").empty();
    $("#forgotPasserrormessage").empty();
    $("#forgotPasserrormessage").hide();
    $("#forgotPasssuccessmessage").hide();
    $('#forgotPass_Modal').on('hidden.bs.modal', function (e) {
        $(this)
          .find("input,textarea,select")
             .val('')
             .end()
          .find("input[type=checkbox], input[type=radio]")
             .prop("checked", "")
             .end();
    })
    $('#forgotPass_Modal').modal('hide');
}
function closeChangePass() {
    $("#passsuccessmessage").empty();
    $("#passerrormessage").empty();
    $("#passerrormessage").hide();
    $("#passsuccessmessage").hide();
    $('#passwordChange_Modal').on('hidden.bs.modal', function (e) {
        $(this)
          .find("input,textarea,select")
             .val('')
             .end()
          .find("input[type=checkbox], input[type=radio]")
             .prop("checked", "")
             .end();
    })
    $('#passwordChange_Modal').modal('hide');
}
function changePassword() {
    $('#passwordChange_Modal').modal('show');
    $("#passwordChange_Modal").draggable({ handle: ".modal-body" });
}
function updateUsrPassword() {
    var oldPass = document.getElementById('oldPass').value;
    var newPass = document.getElementById('newPass').value;
    var confirmPass = document.getElementById('confimPass').value;
    if (confirmPass.length < 8 || newPass.length < 8) {
        $("#passerrormessage").show();
        $("#passerrormessage").empty();
        $("#passsuccessmessage").empty();
        $("#passsuccessmessage").hide();
        $("#passerrormessage").append('<strong>Error! </strong>' + "Password should be more than 7 characters");
        if (confirmPass != newPass) {
            $("#passerrormessage").show();
            $("#passerrormessage").empty();
            $("#passsuccessmessage").empty();
            $("#passsuccessmessage").hide();
            $("#passerrormessage").append('<strong>Error! </strong>' + "Passwords do not match");
            return;
        }
    }
    else {
        $.ajax({
            type: 'POST',
            url: 'ChangePassword.aspx/UpdateUserPassword',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ id: user.email, oldpwd: oldPass, newpwd: newPass }),
            dataType: 'json',
            success: UpdatePassword_Success,
            error: UpdatePassword_Fail
        });
    }
}
setTimeout(fade_out, 200);
function fade_out() {
    $("#errormessage").fadeOut().empty();
    $("#successmessage").fadeOut().empty();
}
function UpdatePassword_Success(returnObj) {
    var val = returnObj.d;
    if (val[0] == 1) {
        $("#passsuccessmessage").show();
        $("#passsuccessmessage").empty();
        $("#passerrormessage").empty();
        $("#passerrormessage").hide();
        $("#passsuccessmessage").append('<strong>Success! </strong>' + val[1]);
        closeChangePass();
    }
    else {
        $("#passerrormessage").show();
        $("#passerrormessage").empty();
        $("#passsuccessmessage").empty();
        $("#passsuccessmessage").hide();
        $("#passerrormessage").append('<strong>Error! </strong>' + val[1]);
    }
}
function UpdatePassword_Fail() {
}
function openProfileModal() {
   
    $('#profileEditModal').modal('show');
    $("#profileEditModal").draggable({ handle: ".modal-body" });
    $("#usremailpro").val(function (index, val) {
        return val + user.email;
    });
    $("#company").val(function (index, val) {
        return val + user.companyname;
    });
    $("#address").val(function (index, val) {
        return val + user.address;
    });
    
    $("#FirstName").val(function (index, val) {
        return val + user.firstname;
    });
    $("#LastName").val(function (index, val) {
        return val + user.lastname;
    });
    $("#zip").val(function (index, val) {
        return val + user.zip;
    });
    $("#phoneNum").val(function (index, val) {
        return val + user.phone;
    });
    $("#usertype").val(function (index, val) {
        var usertype = "";
        var userstype = "";
        if (user.usertype.includes("1")) {
            usertype+="Producer"
        }
        if (user.usertype.includes("2")) {
            userstype="Applicator";
            usertype += usertype == "" ? "" : ",";
            usertype += userstype;
        }
        if (user.usertype.includes("3")) {
            userstype = "Consultant";
            usertype += usertype == "" ? "" : "," + "Consultant";
            usertype += userstype;
        }
        return val + usertype;
    });
    $("#regNum").val(function (index, val) {
        return val + user.identification;
    });
    buildvaluesforDropDownState(user.state, user.city);
}
$(document).ready(function () {
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    $(document).on('hidden.bs.modal', '.modal', function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });
});
function updateAccDetails() {
    user.firstname = document.getElementById("FirstName").value;
    user.lastname = document.getElementById("LastName").value;
    user.address = document.getElementById("address").value;
    user.companyname = document.getElementById("company").value;
    user.state = document.getElementById("state").value;
    user.city = document.getElementById("city").value;
    user.zip = document.getElementById("zip").value;
    user.phone = document.getElementById("phoneNum").value;
    var str = JSON.stringify(user);
    $.ajax({
       type: 'POST',
       url: 'AccountEdit.aspx/UpdateUserDetails',
       contentType: 'application/json; charset=utf-8',
       data: JSON.stringify({ userdetails: str }),
       dataType: 'json',
       success: UpdateDetails_Success,
       error: UpdateDetails_Fail
    });
    function UpdateDetails_Success(returnObj) {
        var val = returnObj.d;
        if (val[0] == 1) {
            closeEventAccDetails();
            $('#profileEditModal').modal('hide');
        }
        else {
            $("#accerrormessage").show();
            $("#accerrormessage").empty();
            $("#accsuccessmessage").empty();
            $("#accsuccessmessage").hide();
            $("#accerrormessage").append('<strong>Error! </strong>' + val[1]);
        }
    }
    function UpdateDetails_Fail() {
    }
}
function init_producerMapAreas(email) {
    $.ajax({
        type: 'POST',
        url: 'Producer.aspx/ProducerPolygonAreas',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ email: email }),
        dataType: 'json',
        success: ProducerPolygons_Success,
        error: Fail_ProducerPolygons
    });
}
function ProducerPolygons_Success(resultobj) {
    var val = resultobj.d;
    var arr = new Array();
    var buffarr = new Array();
    var polygons = [];
    var bufferPolygons = [];
    var bounds = new google.maps.LatLngBounds();
    var buffbounds = new google.maps.LatLngBounds();
    var icons = {
        "BlackFlag": {
            color: "#000000"
        },
        "GreenFlag": {
            color: "#008000"
        },
        "RedFlag": {
            color: "#FF0000"
        },
        "TealFlag": {
            color: "#008080"
        },
        "WhiteFlag": {
            color: "#FFFFFF"
        },
        "YellowFlag": {
            color: "#FFFF00"
        },
        default: {
            color: "#ECB0B0"
        }
    };
    var producerloc = JSON.parse(val[1]);
    for (var i = 0, k = 0; i < producerloc.length; i++, k++) {
        arr = [];
        buffarr = [];
        var coordinatesfromdb = producerloc[i].coordinates;
        var coordinates = coordinatesfromdb.split("\n");
        for (var j = 0, n = 0; j < coordinates.length; j++, n++) {
            var coordi = coordinates[j].split(",");
            arr.push(new google.maps.LatLng(
                  parseFloat(coordi[0]),
                  parseFloat(coordi[1])
            ));
            bounds.extend(arr[arr.length - 1]);
        }
        polygons.push(new google.maps.Polygon({
            paths: arr,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: (producerloc[i].flagtype == null || producerloc[i].flagtype == "") ? "#ECB0B0" : icons[producerloc[i].flagtype.split(",")[0]].color,
            fillOpacity: 0.35
        }));
        polygons[polygons.length - 1].setMap(map);
        shapes.push(polygons);
        if (producerloc[i].markerPos != null && producerloc[i].markerPos != "") {
            var markerforPos = producerloc[i].markerPos.split(";");
            for (var k = 0; k < markerforPos.length; k++) {
                var coordinates=markerforPos[k].split(",");
                var position = new google.maps.LatLng(coordinates[0], coordinates[1]);
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: 'Entrance Points!',
                    visible:false
                });
                google.maps.event.addListener(map, 'zoom_changed', function () {
                    zoomLevel = map.getZoom();
                    if (zoomLevel > 10) {
                        marker.setVisible(true);
                    }
                    else {
                        marker.setVisible(false);
                    }
                });
            }
            
        }
    }
    if (producerloc.length > 1) {
        map.fitBounds(bounds);
        map.data.addListener('click', function (e) {
            var bounds = new google.maps.LatLngBounds();
            processPoints(e.feature.getGeometry(), bounds.extend, bounds);
            map.fitBounds(bounds);
        });
        /*var listener = google.maps.event.addListener(map, "idle", function () {
            if (map.getZoom() < 16) map.setZoom(10);
            google.maps.event.removeListener(listener);
        });*/
    }
    else if (producerloc.length == 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(14);
    }
    /*var listener = google.maps.event.addListener(map, "idle", function () {
        if (map.getZoom() < 16) map.setZoom(16);
        google.maps.event.removeListener(listener);
    });*/

}
function Fail_ProducerPolygons(resultobj) {
    var val = resultobj.d;
}
var spinnerVisible = false;
function showProgress() {
    if (!spinnerVisible) {
        $("div#spinner").fadeIn("fast");
        spinnerVisible = true;
    }
};
function hideProgress() {
    if (spinnerVisible) {
        var spinner = $("div#spinner");
        spinner.stop();
        spinner.fadeOut("fast");
        spinnerVisible = false;
    }
};
/*function createPublicCrops(map) {
    init_publicmap();
    var iconBase = '/WebContent/Images/IconsBase/';
    var iconHoneyBees = {
        url: iconBase + "honeyBees.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconFruitNuts = {
        url: iconBase + "fruits&nuts.JPEG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconForageGrass = {
        url: iconBase + "Forage_Grass.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconFieldCrops = {
        url: iconBase + "FieldCrops.png", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconNurseryGreen = {
        url: iconBase + "Nursery_Greenhouse.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconVegetable = {
        url: iconBase + "vegetable.png", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var icons = {
        "Vegetables": {
            icon: iconVegetable
        },
        "Greenhouse and Nursery": {
            icon: iconNurseryGreen
        },
        "Field Crops": {
            icon: iconFieldCrops
        },
        "Fruits and Nuts": {
            icon: iconForageGrass
        },
        "Forage, Grassland": {
            icon: iconFruitNuts
        },
        "Honeybees": {
            icon: iconHoneyBees
        }
    };

    function addMarker(custom) {

        var marker = new google.maps.Marker({
            position: custom.position,
            icon: icons[custom.type].icon,
            title: custom.type,
            map: map

        });
        marker.setMap(map);
        markers.push(marker);
        //map.setCenter(marker.getPosition());
        var content =

        "<dl>" +
             "<dt>Crop Name:</dt>" +
             "<dd>" + custom.cropname + "</dd>" +

             "<dt>Crop Type:</dt>" +
             "<dd>" + custom.type + "</dd>" +

             "<dt>Crop Year:</dt>" +
             "<dd>" + custom.cropyear + "</dd>" +

             "<dt>Crop County:</dt>" +
             "<dd>" + custom.county + "</dd>" +
        "</dl>"


        var infowindow = new google.maps.InfoWindow({

        })
        //alert("custom.position" + custom.position + "custom.type" + custom.type + "custom.cropname" + custom.cropname);
        google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
                infowindow.setContent(content);
                infowindow.open(map, marker);
            };
        })(marker, content, infowindow));
    }

    //createPolygons(map);
    function init_publicmap() {
        $.ajax({
            type: 'POST',
            url: 'PublicMapNew.aspx/QueryProducers',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ option: "All",value:"All" }),
            dataType: 'json',
            success: QueryProducers_Success,
            error: Fail
        });
        //PageMethods.QueryProducers("All", "All", QueryProducers_Success, Fail);
    }
    function customfeature() {
        this.type = "";
        this.position = new google.maps.LatLng(0, 0);
        this.cropname = "";
        this.county = "";
        this.cropyear = "";
    }
    function QueryProducers_Success(val) {
        featuresloc = JSON.parse(val.d[1]);
        drawMarkers();
    }
    function drawMarkers() {
        for (var i = 0; i < featuresloc.length; i++) {
            var customfeatureloc = new customfeature();
            customfeatureloc.type = featuresloc[i].croptype;
            customfeatureloc.position = new google.maps.LatLng(featuresloc[i].lat, featuresloc[i].lon);
            customfeatureloc.county = featuresloc[i].county;
            customfeatureloc.cropname = featuresloc[i].cropname;
            customfeatureloc.cropyear = featuresloc[i].cropyear;
            var marker = addMarker(customfeatureloc, map);
        }
    }
    function Fail(val) {

    }
}*/