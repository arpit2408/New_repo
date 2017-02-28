var user = null;
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
        $('#UserName').removeAttr('data-target');
        $('#UserName').attr('data-toggle', 'dropdown');
        $('#UserName').attr('class', 'dropdown-toggle');
        var dashboard = document.createElement('li');
        dashboard.innerHTML = '<a href="/WebContent/Dashboard.aspx">User dashboard</a>';
        var account = document.createElement('li');
        account.innerHTML = '<a href="">Account</a>';
        var logout = document.createElement('li');
        logout.innerHTML = '<a onclick="Logoff()">Log out</a>';
        menuhead.appendChild(dashboard);
        menuhead.appendChild(account);
        menuhead.appendChild(logout);
        $('#UserName').empty();
        $('#UserName').append(user.firstname);
        $('#UserName').append('<span class="caret"></span>');
        $('#UserNameli').append(menuhead);
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
    $('#UserNameli').append('<a id="UserName" data-toggle="modal" data-target="#loginforModal" data-direction="right">SIGN IN <b class="caret"></b></a>');
    $('#SignUpli').show();
    $('#Homeli').show();
    
    window.location.href = '/WebContent/LandingPage.html' ;
}

function FailedLogoff(name) {
    
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