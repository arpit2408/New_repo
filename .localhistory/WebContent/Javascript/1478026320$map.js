var map;
var drawingManager;
var shapes = [];

function initMap() {
    var myLatlng = new google.maps.LatLng(51.51686166794058, 3.5945892333984375);
    var mapOptions = {
        zoom: 17,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false
    }
    var infoWindow = new google.maps.InfoWindow({ map: map });
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!'
    });
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    //Getting map DOM element
    var mapElement = document.getElementById('map_canvas');

    map = new google.maps.Map(map_canvas, mapOptions);

    var iconWhite = {
        url: "/WebContent/Images/WhiteFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var iconRed = {
        url: "/WebContent/Images/RedFlag.JPG", // url
        scaledSize: new google.maps.Size(35, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON, 'marker']
        },
        markerOptions: {
            icon: iconWhite
        },
        polygonOptions: {
            editable: true,
            draggable: true,
            strokecolor: '#E9967A'
        }
    });

    drawingManager.setMap(map);
    var customControlDiv = document.createElement('div');
    var customControl = new CustomControl(customControlDiv, map, 'red');
    var customControlDiv1 = document.createElement('div');
    var customControl1 = new CustomControl(customControlDiv1, map, 'green');
    var customControlDiv2 = document.createElement('div');
    var customControl2 = new CustomControl(customControlDiv2, map, 'teal');
    var customControlDiv3 = document.createElement('div');
    var customControl3 = new CustomControl(customControlDiv3, map, 'black');
    var customControlDiv4 = document.createElement('div');
    var customControl4 = new CustomControl(customControlDiv4, map, 'yellow');
    
    var customControlWrapperMenu = document.getElementById('wrapperMenu');
    var customSpaceDiv = document.getElementById('spaceDiv');
    var customSpaceDivLeft = document.getElementById('spaceLeft');
    
    //var customControlDivMenu = document.getElementById('menuBar');
    //var customControlDivInnerMenu = document.getElementById('innerMenu');
    //customControlWrapperMenu.appendChild(customControlDivMenu);
    //customControlDivMenu.appendChild(customControlDivInnerMenu);
    //var customControlMenu = new CustomdivMenuControl(customControlDivMenu, map, 'yellow');
    customControlDiv.index = 1;
    //customControlMenu.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv1);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv2);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv3);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv4);
    map.controls[google.maps.ControlPosition.LEFT].push(customSpaceDiv);
    map.controls[google.maps.ControlPosition.LEFT].push(customControlWrapperMenu);
    
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
        $('#areaPolygon').val((0.000247105 * google.maps.geometry.spherical.computeArea(event.overlay.getPath())).toFixed(2));
        $('#cropYear').val(new Date().getFullYear());
    });

}

function overlayDragListener(overlay) {
    google.maps.event.addListener(overlay.getPath(), 'set_at', function (event) {
        $('#vertices').val(overlay.getPath().getArray());
    });
    google.maps.event.addListener(overlay.getPath(), 'insert_at', function (event) {
        $('#vertices').val(overlay.getPath().getArray());
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
            drawingControl: true,
            icon: iconRed
        });
        drawingManager.setMap(map);
    });
}
google.maps.event.addDomListener(window, 'load', initMap);