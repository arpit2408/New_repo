﻿var map;
var drawingManager;
var shapes = [];
var centroid;
var editPoly = false;
var editPolycoordinates = "";
var href = "";
var drawnPolygon;
var vertices;
var polygons = [];
var allflagmarkers = [];
var markerofFlag = new Set();
var mySetofmarkers = new Set();
var arrmarkerofFlag = [];
var arrmySetofmarkers = new Map();
var recordId = "";
var urlVars;
var plantype = "";
var croptype = "";
var cmnts = "";
var organicCrop = "";
var pesticideName = "";
var markCompleted = "";
var prodshareCropInfo = false;
var typeOfView = "";
var newShape;
function initMap() {
    
    var myLatlng = new google.maps.LatLng(30.658354982307571, -96.396270512761134);
    var mapOptions = {
        zoom: 5,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: false
    }

    var mapElement = document.getElementById('map_canvas');

    map = new google.maps.Map(map_canvas, mapOptions);
    
    /*var styles = [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];

    map.set('styles', styles);*/
    href = window.top.location.href;
    urlVars = getUrlVars(href);
    recordId = decodeURIComponent(urlVars["recordId"]);
    user_id = decodeURIComponent(urlVars["user_id"]);
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
    var user = checkloggedInUser();
    if (user == null)
        return;
    else if (user_id != "undefined" && user_id != "" && user_id != null && user_id != -1) {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        $.ajax({
            type: 'POST',
            url: 'Dashboard.aspx/GetSpecificUserPolygons',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ user_id: user_id }),
            dataType: 'json',
            success: ProducerPolygons_Success,
            error: Fail_ProducerPolygons
        });
        loadProducerAreas();
    }
    else if (recordId != "undefined" && recordId != "" && recordId != null && recordId != -1) {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        showPolygonOnMap(recordId);
    }
    else {
        infoWindowlocgeo = new google.maps.InfoWindow;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindowlocgeo.setPosition(pos);
                infoWindowlocgeo.setContent('Location found.');
                //infoWindowlocgeo.open(map);
                map.setCenter(pos);
                map.setZoom(12);
            }, function () {
                handleLocationError(true, infoWindowlocgeo, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindowlocgeo, map.getCenter());
        }
        function handleLocationError(browserHasGeolocation, infoWindowlocgeo, pos) {
            infoWindowlocgeo.setPosition(pos);
            infoWindowlocgeo.setContent(browserHasGeolocation ?
                                  'Error: The Geolocation service failed.' :
                                  'Error: Your browser doesn\'t support geolocation.');
            //infoWindowlocgeo.open(map);
        }
        loadProducerAreas();
        init_producerMapAreas(user.email);
        drawingManager = new google.maps.drawing.DrawingManager({
            //drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER,
                drawingModes: ['polygon']
            },
            polygonOptions: {
                editable: false,
                draggable: false,
                strokecolor: '#E9967A'
            },
            markerOptions: {
                //icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                draggable: true,
                animation: google.maps.Animation.DROP
            }
        });
        drawingManager.setMap(map);

        // Add a listener for creating new shape event.
        google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
            newShape = event.overlay;
            newShape.type = event.type;
            shapes.push(newShape);
            if (drawingManager.getDrawingMode()) {
                drawingManager.setDrawingMode(null);
            }

        });

        // add a listener for the drawing mode change event, delete any existing polygons
        google.maps.event.addListener(drawingManager, "drawingmode_changed", function () {
            /*if (drawingManager.getDrawingMode() != null && drawingManager.getDrawingMode() != 'marker') {
                for (var i = 0; i < shapes.length; i++) {
                    shapes[i].setMap(null);
                }
                shapes = [];
            }*/
        });


        google.maps.event.addListener(drawingManager, 'drawingmode_changed', function (event) {
            if (drawingManager.getDrawingMode() == null) {

            }
        });

        // Add a listener for the "drag" event.
        google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
            if (event.type != 'marker') {
                overlayDragListener(event.overlay);
                drawnPolygon = event.overlay;
                $('#vertices').val(event.overlay.getPath().getArray());
                fillModalValues(event.overlay, false, false);
            }
            else {
                var posOfMarker = event.overlay.position;
                var ifExists = mySetofmarkers.has(posOfMarker);
                if (!ifExists) {
                    mySetofmarkers.add(posOfMarker);
                    //arrmySetofmarkers.push(posOfMarker);
                }
            }
        });
    }
    var divElem = document.getElementById('custom-search-input');
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(divElem);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    var markers = [];
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}
function showPolygon(e) {
    var action = e.id.split(",");
    window.location.href = 'Producer.aspx?recordId=' + encodeURIComponent(action[1]) + '&typeOfView=' + action[0];
}
function showPolygonOnMap(recordId) {
    $.ajax({
        type: 'POST',
        url: 'Producer.aspx/GetProducerPolygon',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ polgyonId: recordId }),
        dataType: 'json',
        success: showPolygonForApplicator,
        error: failedToShowLocation
    });
    function showPolygonForApplicator(resultObj) {
        checkloggedInUser();
        var val = JSON.parse(resultObj.d[1]);
        var cordiarr = val[0].coordinates.split("\n");
        var cordichnge = "";
        for (var d = 0; d < cordiarr.length; d++)
            cordichnge = cordichnge + cordiarr[d] + ";"
        var editPolycoordinates = cordichnge;
        var editPolyCentroid = val[0].loccentroid;
        var flagtype = val[0].flagtype;
        var markerEntrance = val[0].markerPos;
        plantype = val[0].planttype;
        croptype = val[0].croptype;
        cmnts = val[0].comment;
        organicCrop = val[0].organiccrops;
        
        pesticideName = val[0].pesticideName;
        markCompleted = val[0].markCompleted;
        prodshareCropInfo = val[0].shareCropInfo;
        typeOfView = urlVars["typeOfView"].replace("#", "");
        if (typeOfView != "watch"){
            var customControl = null;
            var customControlDiv = document.createElement('div');
            customControl = new CustomControl(customControlDiv, map, typeOfView);
            customControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(customControlDiv);
        }
        var coodichange = editPolycoordinates;
        var coordinates = coodichange.split(";");
        var arr = new Array();

        var bounds = new google.maps.LatLngBounds();
        for (var j = 0; j < coordinates.length ; j++) {
            if (coordinates[j] != "") {
                var coordi = coordinates[j].split(",");
                arr.push(new google.maps.LatLng(
                      parseFloat(coordi[0]),
                      parseFloat(coordi[1])
                ));
                bounds.extend(arr[arr.length - 1]);
            }
        }
        polygons.push(new google.maps.Polygon({
            paths: arr,
            editable: typeOfView == "edit" ? true : false,
            //draggable: typeOfView == "edit" ? true : false,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#f1c40f',
            fillOpacity: 0.35
        }));
        polygons[polygons.length - 1].setMap(map);
        drawnPolygon = polygons[0];
        map.setCenter(bounds.getCenter());
        var listener = google.maps.event.addListener(map, "idle", function () {
            if (map.getZoom() < 13) map.setZoom(13);
            google.maps.event.removeListener(listener);
        });
        if (flagtype != "undefined") {
            var flags = flagtype.split(",");
            var posForFlag = editPolyCentroid.split(",");
            var centerForflag = new google.maps.LatLng(
                      parseFloat(posForFlag[0]),
                      parseFloat(posForFlag[1])
                );
            for (var i = 0; i < flags.length; i++) {
                if (flags[i] != null && flags[i] != "") {
                    var value = new CustomFlagMarker();
                    value.type = flags[i];
                    value.position = new google.maps.LatLng(centerForflag.lat() + (i) * 0.0002, centerForflag.lng() + (i) * 0.0002);
                    var marker = addMarkerOnPolygon(value);
                    var ifExists = markerofFlag.has(marker);
                    if (!ifExists) {
                        markerofFlag.add(marker);
                        arrmarkerofFlag.push(marker);
                    }
                }
            }
        }
        vertices = polygons[0].getPath().getArray();
        google.maps.event.addListener(polygons[0].getPath(), 'set_at', function (event) {
            vertices = polygons[0].getPath().getArray();
            placeFlagatCorrectLocation(polygons[0]);
        });
        google.maps.event.addListener(polygons[0].getPath(), 'insert_at', function (event) {
            vertices = polygons[0].getPath().getArray();
            placeFlagatCorrectLocation(polygons[0]);
        });
        google.maps.event.addListener(polygons[0], 'dragend', function (event) {
            vertices = polygons[0].getPath().getArray();
            placeFlagatCorrectLocation(polygons[0]);

        });
        function placeFlagatCorrectLocation(polygon) {
            calcCentroid(polygon);
            for (var i = 0; i < arrmarkerofFlag.length; i++) {
                arrmarkerofFlag[i].setPosition(new google.maps.LatLng(centroid.lat() + (i) * 0.0002, centroid.lng() + (i) * 0.0002));
            }
            drawnPolygon = polygon;
        }
        var iconEntrance = {
            url: '/WebContent/Images/IconsBase/entrance.png', // url
            scaledSize: new google.maps.Size(25, 25), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER,
                drawingModes: ['marker']
            },
            markerOptions: {
                //icon: iconEntrance,
                //draggable: true,
                animation: google.maps.Animation.DROP
            }
        });
        if(typeOfView!="watch")
            drawingManager.setMap(map);
        google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
            if (drawingManager.getDrawingMode() != null && drawingManager.getDrawingMode() == 'marker') {
                //event.overlay.setMap(null);
                var posOfMarker = event.overlay.position;
                markerId = posOfMarker.lat() + '_' + posOfMarker.lng();
                var marker = event.overlay;
                var ifExists = mySetofmarkers.has(posOfMarker);
                if (!ifExists) {
                    mySetofmarkers.add(posOfMarker);
                    arrmySetofmarkers.set(markerId, marker); // cache marker in markers object
                    bindMarkerEvents(marker);
                    //arrmarkerEntrance.push(posOfMarker);
                }
            }
        });
        if (markerEntrance != null && markerEntrance != "") {
            var markersPositions = markerEntrance.split(";");
            for (var i = 0; i < markersPositions.length; i++) {
                if (markersPositions[i] == "" || markersPositions[i] == "undefined")
                    continue;
                var markerlatlng = markersPositions[i].split(",");
                var value = new CustomFlagMarker();
                //value.type = flags[i];
                value.position = new google.maps.LatLng(markerlatlng[0], markerlatlng[1]);
                var markerId = markerlatlng[0] + "_" + markerlatlng[1];
                var marker = new google.maps.Marker({
                    position: value.position,
                    //icon: icons[custom.type].icon,
                    //title: custom.type,
                    id: markerId,
                    map: map
                });
                var ifExists = mySetofmarkers.has(value.position);
                if (!ifExists) {
                    mySetofmarkers.add(value.position);
                    arrmySetofmarkers.set(markerId, marker); // cache marker in markers object
                    bindMarkerEvents(marker);
                    //arrmySetofmarkers.push(posOfMarker);
                }
            }
        }
    }
    function failedToShowLocation() {
    }
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function overlayDragListener(overlay) {
    google.maps.event.addListener(overlay.getPath(), 'set_at', function (event) {
        $('#vertices').val(overlay.getPath().getArray());
    });
    google.maps.event.addListener(overlay.getPath(), 'insert_at', function (event) {
        $('#vertices').val(overlay.getPath().getArray());
    });
}


function Location() {
    this.usremail = "";
    this.id = "";
    this.planttype = "";
    this.croptype = "";
    this.cropyear = "";
    this.comment = "";
    this.county = "";
    this.coordinates = "";
    this.loccentroid = "";
    this.acres = "";
    this.organiccrops = 0;
    this.certifier = "";
    this.flagType = "";
    this.shareCropInfo = "";
    this.markerPos = "";
    this.cropShared = "";
    this.markCompleted = "";
    this.pesticideName = "";
    this.pesticideApplied = "";
}
function CustomFlagMarker() {
    var position = new google.maps.LatLng(0, 0);
    var type = "";
}
/*function ConfirmDialog(message) {
    $('<div></div>').appendTo('body')
                    .html('<div><h6>' + message + '?</h6></div>')
                    .dialog({
                        modal: true, title: 'Delete message', zIndex: 10000, autoOpen: true,
                        width: 'auto', resizable: false,
                        buttons: {
                            Yes: function () {
                                alert("Yay");
                                $(this).dialog("close");
                            },
                            No: function () {
                                $(this).dialog("close");
                            }
                        },
                        close: function (event, ui) {
                            $(this).remove();
                        }
                    });
}*/

function SubmitNewLocation(event) {
    var sharecropInfo = prodshareCropInfo;
    var user = checkloggedInUser();
    if (user == null)
        return;
    if (typeOfView == "edit" || typeOfView=="") {
        if (confirm("Do you want the information of this crop to be visible to other producers..!!")) {
            sharecropInfo = true;
        } else {
            sharecropInfo = false;
        }
    }
    var flagvalues = $('#flagoptions').text();
    var flagop = flagvalues.split("Flag");
    var firstval = flagop[0].substring(2, flagop[0].length);
    var valuefirst = new CustomFlagMarker();
    var valueForFlags = "";
    if (firstval != "") {
        //For drawing two polygons at once
        if (arrmarkerofFlag != null) {
            for (var j = 0; j < arrmarkerofFlag.length; j++) {
                arrmarkerofFlag[j].setMap(null);
            }
        }
        arrmarkerofFlag = null;
        valuefirst.type = firstval + 'Flag';
        valuefirst.position = centroid;
        addMarkerOnPolygon(valuefirst);
        valueForFlags += valuefirst.type;
        for (var i = 1; i < flagop.length; i++) {
            if (flagop[i] != null && flagop[i] != "") {
                var value = new CustomFlagMarker();
                value.type = flagop[i] + 'Flag';
                valueForFlags += "," + value.type;
                value.position = new google.maps.LatLng(centroid.lat() + (i) * 0.0002, centroid.lng() + (i) * 0.0002);
                addMarkerOnPolygon(value);
            }
        }
    }
    if (arrmarkerofFlag != null && arrmarkerofFlag.length != 0 && document.getElementsByName('flagoptions')[0].checked) {
        valuefirst.type = arrmarkerofFlag[0].title;
        for (var j = 0; j < arrmarkerofFlag.length - 1; j++) {
            valueForFlags += arrmarkerofFlag[j].title + ",";
        }
        valueForFlags += arrmarkerofFlag[arrmarkerofFlag.length - 1].title;
    }
    var croploc = new Location();
    if (recordId != "undefined" && recordId != "" && recordId != null && recordId != -1)
        croploc.id = recordId;
    else
        croploc.id = "-1";
    //croploc.usremail = user.email;
    croploc.planttype = document.getElementById('plant').value;
    croploc.croptype = document.getElementById('crop').value;
    croploc.cropyear = document.getElementById('cropYear').value;
    var orgComnts = "";
    var fullComnt = "";
    var newStr = "";
    if (document.getElementById('commentsForCrops') != null) {
        var totalCmnts = document.getElementById('commentsForCrops').value;
        orgComnts = cmnts;
        totalCmnts = totalCmnts.replace(orgComnts, "");
        if (totalCmnts.trim() != "")
        newStr = user.firstname + " " + user.lastname + ": " + totalCmnts.trim() + "\n";
        fullComnt = fullComnt.concat(orgComnts,newStr);
    }
    croploc.comment = fullComnt.replace(/'/g, "''");
    croploc.county = document.getElementById('countyselected').value;
    var coordinatesforpolygon = document.getElementById('polygonpath').value;
    croploc.coordinates = coordinatesforpolygon;
    var lat = centroid.lat();
    var lng = centroid.lng();
    croploc.loccentroid = lat + "," + lng;
    croploc.acres = document.getElementById('areaPolygon').value;
    croploc.organiccrops = document.getElementById('someSwitchOptionSuccess').checked == true ? "1":"0";
    croploc.markCompleted = document.getElementById('someSwitchOptionPrimary').checked == true ? "1" : "0";
    var pesticideN = document.getElementById('pesticideName') != null ? document.getElementById('pesticideName').value : "";
    if (pesticideN.trim() != "") {
        croploc.pesticideName = pesticideN;
        croploc.pesticideApplied = 1;
    }
    else {
        croploc.pesticideName = "";
        croploc.pesticideApplied = 0;
    }
    croploc.flagType = valueForFlags;
    var posofAllMarkers = "";
    arrmySetofmarkers.forEach(function (value, key) {
        posofAllMarkers += value.position.lat() + "," + value.position.lng() + ";";
    });
    croploc.markerPos = posofAllMarkers;
    croploc.certifier = "";
    croploc.shareCropInfo = sharecropInfo;
    var str = JSON.stringify(croploc);
    PageMethods.AddNewCropLocation(str, AddNewLocation_Success, Fail);
    setTimeout(fade_out, 2000);
    function fade_out() {
        $("#errormessage").fadeOut().empty();
        $("#successmessage").fadeOut().empty();
    }
    
    function AddNewLocation_Success(val) {
        if (val[0] == 1) {
            $("#successmessage").show();
            $("#successmessage").empty();
            $("#errormessage").empty();
            $("#successmessage").append('<strong>Success! </strong>' + val[1]);
            disableCropForm();
            setcolorforPolygon(drawnPolygon, valuefirst);
            //$('#registerCropForm').trigger("reset");
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
}

function editPolygon(val) {
    window.location.href = 'Producer.aspx?coordinates=' + val.coordinates + "&centroid="
                            + val.loccentroid + "&flagType=" + val.flagtype + "&planttype=" + encodeURIComponent(val.planttype)
                                + "&croptype=" + encodeURIComponent(val.croptype) + "&year=" + val.cropyear + "&comments=" + encodeURIComponent(val.comment)
                                + "&markerPos=" + val.markerPos + "&recordId=" + encodeURIComponent(val.id)
                                + "&typeOfView=" + encodeURIComponent(val.typeOfView);
}
function closeevent() {
    $('#registerCropForm').trigger("reset");
    if(newShape!=null)
        newShape.setMap(null);
    var indexshape = shapes.indexOf(newShape);
    if (indexshape > -1) {
        shapes.splice(indexshape, 1);
    }
}

function addMarkerOnPolygon(positionOfMarker) {
    var iconBase = '/WebContent/Images/Flags/';
    var iconBlackFlag = {
        url: iconBase + "BlackFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconGreenFlag = {
        url: iconBase + "GreenFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconRedFlag = {
        url: iconBase + "RedFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconTealFlag = {
        url: iconBase + "TealFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconWhiteFlag = {
        url: iconBase + "WhiteFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconYellowFlag = {
        url: iconBase + "YellowFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var defaultIcon = {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    }
    var icons = {
        "BlackFlag": {
            icon: iconBlackFlag,
            color: "#000000"
        },
        "GreenFlag": {
            icon: iconGreenFlag,
            color: "#008000"
        },
        "RedFlag": {
            icon: iconRedFlag,
            color: "#FF0000"
        },
        "TealFlag": {
            icon: iconTealFlag,
            color: "#008080"
        },
        "WhiteFlag": {
            icon: iconWhiteFlag,
            color: "#FFFFFF"
        },
        "YellowFlag": {
            icon: iconYellowFlag,
            color: "#FFFF00"
        },
        default: {
            icon: defaultIcon,
            color: "#ECB0B0"
        }
    };

    var addedMarker = addMarker(positionOfMarker);

    function addMarker(custom) {
        var markerId = getMarkerUniqueId(custom.position.lat(), custom.position.lng());
        var marker = new google.maps.Marker({
            position: custom.position,
            icon: (custom.type != null && custom.type != "") ? icons[custom.type].icon : defaultIcon,
            title: custom.type,
            id: markerId,
            map: map
        });
        return marker;
    }
    return addedMarker;
}

function setcolorforPolygon(drawnPolygon, valuefirst) {
    var iconBase = '/WebContent/Images/Flags/';
    var iconBlackFlag = {
        url: iconBase + "BlackFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconGreenFlag = {
        url: iconBase + "GreenFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconRedFlag = {
        url: iconBase + "RedFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconTealFlag = {
        url: iconBase + "TealFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconWhiteFlag = {
        url: iconBase + "WhiteFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconYellowFlag = {
        url: iconBase + "YellowFlag.PNG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var icons = {
        "BlackFlag": {
            icon: iconBlackFlag,
            color: "#000000"
        },
        "GreenFlag": {
            icon: iconGreenFlag,
            color: "#008000"
        },
        "RedFlag": {
            icon: iconRedFlag,
            color: "#FF0000"
        },
        "TealFlag": {
            icon: iconTealFlag,
            color: "#008080"
        },
        "WhiteFlag": {
            icon: iconWhiteFlag,
            color: "#FFFFFF"
        },
        "YellowFlag": {
            icon: iconYellowFlag,
            color: "#FFFF00"
        }
    };
    drawnPolygon.setOptions({ strokeWeight: 2.0, fillColor: icons[valuefirst.type].color, draggable: true });
}
function loadProducerAreas() {
    //var useremail = "mtchakerian@tamu.edu";
    $.ajax({
        type: 'POST',
        url: 'Producer.aspx/ListAllProducerFlags',
        contentType: 'application/json; charset=utf-8',
        //data: JSON.stringify({ useremail: useremail }),
        dataType: 'json',
        success: Producer_location_Success,
        error: Fail_location
    });
    function Producer_location_Success(resultobj) {
        var user = checkloggedInUser();
        if (user != null) {
            var val = resultobj.d;
            if (val != null) {
                for (var i = 0; i < val.length; i++) {
                    if (val[i].flagtype != "") {
                        var flags = val[i].flagtype.split(",");
                        editPolyCentroid = val[i].loccentroid;
                        for (var j = 0; j < flags.length; j++) {
                            var flagcreator = new CustomFlagMarker();
                            flagcreator.type = flags[j];
                            var posForFlag = editPolyCentroid.split(",");
                            var centerForflag = new google.maps.LatLng(
                                      parseFloat(posForFlag[0]),
                                      parseFloat(posForFlag[1])
                                );
                            flagcreator.position = new google.maps.LatLng(centerForflag.lat() + (j) * 0.001, centerForflag.lng() + (j) * 0.001);
                            var markerforFlag = addMarkerOnPolygon(flagcreator);
                            allflagmarkers.push(markerforFlag);
                            if (val[i].shareCropInfo != null && val[i].shareCropInfo.toUpperCase() === "TRUE") {
                                var mapforInfoWindow = new Map();
                                //mapforInfoWindow.set("Crop Name:", val[i].planttype);
                                mapforInfoWindow.set("Crop Type:", val[i].croptype);
                                //mapforInfoWindow.set("Organic Certified:", val[i].certifier);
                                //mapforInfoWindow.set("Crop Year:", val[i].cropyear);
                                createInfoWindow(mapforInfoWindow, markerforFlag);
                            }
                        }
                    }

                }
                var markerCluster = new MarkerClusterer(map, allflagmarkers, { imagePath: 'Images/Cluster/m' });
            }

        }

    }
    function Fail_location(resultobj) {
        var val = resultobj.d;
    }
}

function createInfoWindow(dataAsMap, marker) {
    
    var content = '';
    dataAsMap.forEach(function (value, key) {
        content += '<p style="font-weight: 900">' +
                         value + '</p>'
    });
   
    content += '';
    var infowindow = new google.maps.InfoWindow({

    })
    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
        return function () {
            infowindow.setContent(content);
            infowindow.open(map, marker);
        };
    })(marker, content, infowindow));
    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });
}
function CustomControl(controlDiv, map, typeOfView) {

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = '#ccc';
    controlUI.style.height = '29px';
    controlUI.style.width = '30px';
    controlUI.style.marginTop = '5px';
    controlUI.style.marginBottom = '5px';
    controlUI.style.marginLeft = '-6px';
    controlUI.style.paddingTop = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.style.fontWeight = '700px'
    //controlUI.style.boxShadow = '0px 1px 4px #888888';
    controlUI.style.boxSizing = 'border-box';
    controlUI.style.backgroundClip = 'padding-box';
    controlUI.style.borderBottomRightRadius = '2px';
    controlUI.style.borderTopRightRadius = '2px';
    controlUI.style.bottom = '4px'
    controlUI.title = 'Click to set the map to Home';
    controlUI.id = 'Savepoly'
    //controlUI.innerText = typeOfView;
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Monotype Corsiva';
    controlText.style.fontSize = '12px';
    controlText.style.border = '2px'
    controlText.style.fontWeight = 'bold';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.style.marginTop = '4px';
    controlText.innerHTML = 'Save';
    controlUI.appendChild(controlText);

    // Setup the click event listeners
    google.maps.event.addDomListener(controlUI, 'click', function () {
        if (typeOfView == "edit") {
            var markerInPolygon = true;
            var BreakException = {};
            try {
                arrmySetofmarkers.forEach(function (value, key) {
                    markerInPolygon = google.maps.geometry.poly.containsLocation(value.position, drawnPolygon);
                    if (!markerInPolygon) {
                        throw BreakException;
                    }
                });
            }
            catch (e) {
                alert("Please place all markers inside the polygon");
            }
            if (markerInPolygon)
                fillModalValues(polygons[0], true, false, false);
        }
        else if (typeOfView == "build") {
            fillModalValues(polygons[0], true, true, true);
        }
        else 
            fillModalValues(polygons[0], true, true, false);
    });

}
function enableCropForm() {
        $("#registerCropForm :submit").prop("disabled", false);
        $("#plant").prop("disabled", false);
        $("#crop").prop("disabled", false);
        $("#closemyModal").prop("disabled", false);
        $("#someSwitchOptionSuccess").prop("disabled", false);
        $("#fancy-checkbox-warning").prop("disabled", false);
        $("#successmessage").css('display', 'none');
}
function fillModalValues(polygon, checkforflag, valuesDisabled, isApplicator) {
    $('#myModal').modal('show');
    enableCropForm();
    if (valuesDisabled) {
        disableCropForm();
        $("#applicatorcolumns").css('display', '');
        if (isApplicator) {
            $("#pesticideName").prop("disabled", false);
            $("#someSwitchOptionPrimary").prop("disabled", false);
            $("#pesticideName").attr("readonly", false);
        }
        else {
            $("#pesticideName").prop("disabled", true);
            $("#someSwitchOptionPrimary").prop("disabled", true);
        }
    }
    $("#saveRegisterCrop").prop("disabled", false);
    $("#someSwitchOptionSuccess").prop('checked', organicCrop == 1 ? true : false);
    $("#someSwitchOptionPrimary").prop('checked', markCompleted == 1 ? true : false);
    $("#pesticideName").val(pesticideName);
    $("#myModal").draggable({ handle: ".modal-body" });
    $('#areaPolygon').val((0.000247105 * google.maps.geometry.spherical.computeArea(polygon.getPath())).toFixed(2));
    if (recordId != null) {
        buildvaluesforDropDown(plantype, croptype);
        $("#commentsForCrops").prop("disabled", false);
        $("#commentsForCrops").attr("readonly", false);
        $("#commentsForCrops").val(cmnts);
        var base = (cmnts != "" && cmnts != "undefined")?cmnts:"";
        var regex = new RegExp("^" + base);
        $('#commentsForCrops').on("input", function (ev) {
            var query = $(this).val();
            regex.lastIndex = 0;
            if (!regex.test(query)) {
                $(this).val(base);
            }
        });
    }
    $('#cropYear').val(new Date().getFullYear());
    var coordinates = "";
    for (var i = 0; i < polygon.getPath().getLength() - 1 ; i++) {
        coordinates += polygon.getPath().getAt(i).toUrlValue(6) + "\n";
    }
    coordinates += polygon.getPath().getAt(polygon.getPath().getLength() - 1).toUrlValue(6);
    $('#polygonpath').val(coordinates);
    $('#countyselected').val(getCountyInfo(coordinates));
    calcCentroid(polygon);
    if (checkforflag && arrmarkerofFlag != null && arrmarkerofFlag.length != 0) {
        var checkbox = document.getElementsByName('flagoptions');
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = true;
        }
    }
}
function calcCentroid(polygon) {
    var bounds = new google.maps.LatLngBounds();
    var polygonCoords = polygon.getPath().getArray();
    for (var i = 0; i < polygonCoords.length; i++) {
        bounds.extend(polygonCoords[i]);
    }
    centroid = bounds.getCenter();
}
/**
         * Removes given marker from map.
         * @param {!google.maps.Marker} marker A google.maps.Marker instance that will be removed.
         * @param {!string} markerId Id of marker.
         */
var removeMarker = function (marker, markerId) {
    marker.setMap(null); // set markers setMap to null to remove it from map
    arrmySetofmarkers.delete(markerId); // delete marker instance from markers object
};
var getMarkerUniqueId = function (lat, lng) {
    return lat + '_' + lng;
}
function bindMarkerEvents(marker) {
    google.maps.event.addListener(marker, "rightclick", function (point) {
        var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
        removeMarker(marker, markerId); // remove it
    });
}
function disableCropForm() {
    $("#registerCropForm :input").prop("disabled", true);
    $("#registerCropForm :submit").prop("disabled", true);
    $("#plant").prop("disabled", true);
    $("#crop").prop("disabled", true);
    $("#closemyModal").prop("disabled", false);
    $("#someSwitchOptionSuccess").prop("disabled", true);
}