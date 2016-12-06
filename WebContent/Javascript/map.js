var map;
var drawingManager;
var shapes = [];
var centroid;
var editPoly = false;
var editPolycoordinates = "";
var href = "";
var drawnPolygon;
function initMap() {
    href = window.top.location.href;
    var cordipoints = href.split("?");
    if (cordipoints[1] != null) {
        var editPolycoordinates = cordipoints[1].split("=");
    }
    var myLatlng = new google.maps.LatLng(30.658354982307571, -96.396270512761134);
    var mapOptions = {
        zoom: 14,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false
    }
    var infoWindow = new google.maps.InfoWindow({ map: map });
   
    var mapElement = document.getElementById('map_canvas');

    map = new google.maps.Map(map_canvas, mapOptions);
    
    if (editPolycoordinates != "" && editPolycoordinates != null) {
        var coodichange = editPolycoordinates[1];
        var coordinates = coodichange.split(";");
        var arr = new Array();
        var polygons = [];
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
            editable: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#f1c40f',
            fillOpacity: 0.35
        }));
        polygons[polygons.length - 1].setMap(map);
        map.setCenter(bounds.getCenter());
        var listener = google.maps.event.addListener(map, "idle", function () {
            if (map.getZoom() < 15) map.setZoom(15);
            google.maps.event.removeListener(listener);
        });
    }
    

        drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker', 'polygon']
            },
            polygonOptions: {
                editable: false,
                draggable: false,
                strokecolor: '#E9967A'
            }
        });
        drawingManager.setMap(map);

        // Add a listener for creating new shape event.
        google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
            var newShape = event.overlay;
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



        // Add a listener for the "drag" event.
        google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
            overlayDragListener(event.overlay);
            drawnPolygon = event.overlay;
            $('#vertices').val(event.overlay.getPath().getArray());
            $('#myModal').modal('show');
            $("#myModal").draggable({ handle: ".modal-body" });
            $('#areaPolygon').val((0.000247105 * google.maps.geometry.spherical.computeArea(event.overlay.getPath())).toFixed(2));
            $('#cropYear').val(new Date().getFullYear());
            var coordinates = "";
            for (var i = 0; i < event.overlay.getPath().getLength() - 1 ; i++) {
                coordinates += event.overlay.getPath().getAt(i).toUrlValue(6) + "\n";
            }
            coordinates += event.overlay.getPath().getAt(event.overlay.getPath().getLength() - 1).toUrlValue(6);
            $('#polygonpath').val(coordinates);
            var bounds = new google.maps.LatLngBounds();
            var polygonCoords = event.overlay.getPath().getArray();
            for (var i = 0; i < polygonCoords.length; i++) {
                bounds.extend(polygonCoords[i]);
            }
            $('#countyselected').val(getCountyInfo(coordinates));
            centroid = bounds.getCenter();
            
        });
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
}
function SubmitNewLocation(event) {
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
    var flagvalues = $('#flagoptions').text();
    var flagop = flagvalues.split("Flag");
    var firstval = flagop[0].substring(2, flagop[0].length);
    var valueForFlags = "";
    var valuefirst = new CustomFlagMarker();
    valuefirst.type = firstval + 'Flag';
    valuefirst.position = centroid;
    addMarker(valuefirst);
    valueForFlags += valuefirst.type;
    for (var i = 1; i < flagop.length; i++) {
        if (flagop[i] != null && flagop[i] != "") {
            var value = new CustomFlagMarker();
            value.type = flagop[i] + 'Flag';
            valueForFlags += ","+value.type;
            value.position = new google.maps.LatLng(centroid.lat() + (i) * 0.002, centroid.lng() + (i) * 0.002);
            addMarker(value);
        }
    }

    function CustomFlagMarker() {
        var position = new google.maps.LatLng(0, 0);
        var type = "";
    }
    function addMarker(custom) {
        var marker = new google.maps.Marker({
            position: custom.position,
            icon: icons[custom.type].icon,
            title: custom.type,
            map: map
        });
    }


    var croploc = new Location();
    croploc.id = "1";
    croploc.usremail = "mtchakerian@tamu.edu";
    croploc.planttype = document.getElementById('plant').value;
    croploc.croptype = document.getElementById('crop').value;
    croploc.cropyear = document.getElementById('cropYear').value;
    if (document.getElementById('form_message') != null)
        croploc.comment = document.getElementById('form_message').value;
    croploc.comment = croploc.comment.replace(/'/g, "''");
    croploc.county = document.getElementById('countyselected').value;
    var coordinatesforpolygon = document.getElementById('polygonpath').value;
    croploc.coordinates = coordinatesforpolygon;
    var lat = centroid.lat();
    var lng = centroid.lng();
    croploc.loccentroid = lat + "," + lng;
    croploc.acres = document.getElementById('areaPolygon').value;
    var isitorganic = document.getElementById('someSwitchOptionSuccess').checked;
    croploc.flagType = valueForFlags;
    if (isitorganic == true) {
        croploc.organiccrops = "1";
    }
    else {
        croploc.organiccrops = "0";
    }
    croploc.certifier = "";
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
            $("#form1 :input").prop("disabled", true);
            drawnPolygon.setOptions({ strokeWeight: 2.0, fillColor: icons[valuefirst.type].color });
        }
        if (val[0] == 0) {

            $("#errormessage").show();
            $("#errormessage").empty();
            $("#errormessage").append('<strong>Error! Some values are incorrect. </strong>' + val[1]);
        }
    }
    function Fail(val) {
    }
}

function editPolygon(coordinates) {
    window.location.href = 'Producer.aspx?coordinates=' + coordinates;
    editPolycoordinates = coordinates;
}
function closeevent() {
            $('#registerCropForm').trigger("reset");
            $('#flagtechModal').trigger("reset");
}


