var map;
var drawingManager;
var shapes = [];

function initMap() {
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
    
    

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [ 'marker','polygon']
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
        if (drawingManager.getDrawingMode() != null && drawingManager.getDrawingMode() != 'marker') {
            for (var i = 0; i < shapes.length; i++) {
                shapes[i].setMap(null);
            }
            shapes = [];
        }
    });

   

    // Add a listener for the "drag" event.
    google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
        overlayDragListener(event.overlay);
        $('#vertices').val(event.overlay.getPath().getArray());
        $('#myModal').modal('show');
        $("#myModal").draggable({ handle: ".modal-header" });
        $('#areaPolygon').val((0.000247105 * google.maps.geometry.spherical.computeArea(event.overlay.getPath())).toFixed(2));
        $('#cropYear').val(new Date().getFullYear());
        var coordinates="";
        for (var i = 0; i < event.overlay.getPath().getLength() ; i++) {
            coordinates += event.overlay.getPath().getAt(i).toUrlValue(6) + ";";
        }
        $('#polygonpath').val(coordinates);
        //$('#centroid').val(event.overlay.getPath().getBounds().getCenter());
        $('#countyselected').val(getCountyInfo(coordinates));
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
function getCountyInfo(value) {
    PageMethods.GetCounty(value, LookUpCounty_Success);
        
    function LookUpCounty_Success(val) {
        if (val[0] == '1') {
            var el = document.getElementById('countyselected');
            el.value = val[1];
        }

    }
}
function overlayDragListener(overlay) {
    google.maps.event.addListener(overlay.getPath(), 'set_at', function (event) {
        $('#vertices').val(overlay.getPath().getArray());
    });
    google.maps.event.addListener(overlay.getPath(), 'insert_at', function (event) {
        $('#vertices').val(overlay.getPath().getArray());
    });
}

function controlMarkerDiv() {
    var controlUI2 = document.getElementById('areaMarker');
    google.maps.event.addDomListener(controlUI2, 'click', function () {
        var iconRed = {
            url: "/WebContent/Images/RedFlag.JPG", // url
            scaledSize: new google.maps.Size(35, 40), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        drawingManager.setOptions({
            drawingControl: true,
            icon: iconRed
        });

    });

}
function controlAreaRemover() {

   
}
function controlFlagDiv() {
    var controlUI = document.getElementById('trying');
    // Setup the click event listeners
    google.maps.event.addDomListener(controlUI, 'click', function () {
        var iconRed = {
            url: "/WebContent/Images/RedFlag.JPG", // url
            scaledSize: new google.maps.Size(35, 40), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.marker);
        

    });
}
function CustomdivMenuControl(controlDiv, map, flag) {

    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);
    controlUI.addEventListener('click', function () {
        $('#myModal').modal('show');
        $('#areaPolygon').val((0.000247105 * google.maps.geometry.spherical.computeArea(event.overlay.getPath())).toFixed(2));
        $('#cropYear').val(new Date().getFullYear());

    });
}
function CustomControl(controlDiv, map, flag) {

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#ffffff';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = '#ccc';
    controlUI.style.height = '25px';
    controlUI.style.width = '25px';
    controlUI.style.marginTop = '5px';
    controlUI.style.marginLeft = '-6px';
    controlUI.style.paddingTop = '1px';
    controlUI.style.cursor = 'flag';
    controlUI.style.textAlign = 'center';
    if (flag == 'red')
        controlUI.style.backgroundImage = "url('/WebContent/Images/RedFlag.JPG')";
    if (flag == 'green')
        controlUI.style.backgroundImage = "url('/WebContent/Images/GreenFlag.JPG')";
    if (flag == 'teal')
        controlUI.style.backgroundImage = "url('/WebContent/Images/TealFlag.JPG')";
    if (flag == 'black')
        controlUI.style.backgroundImage = "url('/WebContent/Images/BlackFlag.JPG')";
    if (flag == 'yellow')
        controlUI.style.backgroundImage = "url('/WebContent/Images/YellowFlag.JPG')";
    controlUI.style.backgroundSize = '20px';
    controlUI.title = 'Click to set the map to Home';
    controlDiv.appendChild(controlUI);



    // Setup the click event listeners
    google.maps.event.addDomListener(controlUI, 'click', function () {
        var iconRed = {
            url: "/WebContent/Images/RedFlag.JPG", // url
            scaledSize: new google.maps.Size(35, 40), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
        drawingManager.setOptions({
            markerOptions:
                                           { icon: iconRed }
        });
        
       
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
}
function SubmitNewLocation() {
    var iconBase = '/WebContent/Images/Flags/';
    var iconBlackFlag = {
        url: iconBase + "BlackFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconGreenFlag = {
        url: iconBase + "GreenFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconRedFlag = {
        url: iconBase + "RedFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconTealFlag = {
        url: iconBase + "TealFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconWhiteFlag = {
        url: iconBase + "WhiteFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconYellowFlag = {
        url: iconBase + "YellowFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var icons = {
        "BlackFlag": {
            icon: iconBlackFlag
        },
        "GreenFlag": {
            icon: iconGreenFlag
        },
        "RedFlag": {
            icon: iconRedFlag
        },
        "TealFlag": {
            icon: iconTealFlag
        },
        "WhiteFlag": {
            icon: iconWhiteFlag
        },
        "YellowFlag": {
            icon: iconYellowFlag
        }
    };

    var croploc = new Location();
    croploc.id = 1;
    croploc.usremail = "mtchakerian@tamu.edu";
    croploc.planttype = document.getElementById('plant').value;
    croploc.croptype = document.getElementById('crop').value;
    croploc.cropyear = document.getElementById('cropYear').value;
    if (document.getElementById('form_message') != null)
        croploc.comment = document.getElementById('form_message').value;
    croploc.comment = croploc.comment.replace(/'/g, "''");
    croploc.county = document.getElementById('countyselected').value;
    var coordinatesforpolygon = document.getElementById('polygonpath').value;
    var cordinateslist = coordinatesforpolygon.split(";");
    croploc.coordinates = coordinatesforpolygon;
    croploc.loccentroid = "";
    croploc.acres = document.getElementById('areaPolygon').value;
    var isitorganic = document.getElementById('someSwitchOptionSuccess').checked;
    if (isitorganic == true) {
        croploc.organiccrops = 1;
    }
    else {
        croploc.organiccrops = 0;
    }

    croploc.certifier = "";



    var str = JSON.stringify(croploc);
    PageMethods.AddNewLocation(str, croploc.usremail, AddNewLocation_Success, Fail);
    function AddNewLocation_Success(val) {
        if (val[0] == 1) {
            $("#successmessage").show();
            $("#successmessage").empty();
            $("#successmessage").append('<strong>Success! </strong>' + val[1]);
            $("#form1 :input").prop("disabled", true);
        }
        if (val[0] == 0) {

            $("#errormessage").show();
            $("#errormessage").empty();
            $("#errormessage").append('<strong>Error! Some values are incorrect. </strong>' + val[1]);
        }
    }
    function Fail(val) {
    }
    
    var flagvalues = $('#flagoptions').text();
    var flagop = flagvalues.split("Flag");
    var firstval = flagop[0].substring(2, flagop[0].length);
    var valuefirst = new CustomFlagMarker();
    valuefirst.type = firstval + 'Flag';
    alert(valuefirst.type);
    valuefirst.position = new google.maps.LatLng(30.658354982307571, -96.396270512761134);
    addMarker(valuefirst);
    
    for (var i = 1; i < flagop.length; i++) {
        var value = new CustomFlagMarker();
        value.type = flagop[i] + 'Flag';
        value.position = new google.maps.LatLng(30.658354982307571+(i)*0.1, -96.396270512761134);
        addMarker(value);
        alert(value.type);
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
        alert(custom.type)
    }
}



