var map = "";
var featuresloc ="";
var markers = [];
function createSearchFunctionlity(map) {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
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




function initialize() {
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(30.658354982307571, -96.396270512761134),
        disableDefaultUI: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
    var customControlDiv = document.getElementById("choiceMenuCrop");
    //var customSearch = document.getElementById("adv-search");
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(customControlDiv);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(customSearch);
    createSearchFunctionlity(map);
    createPublicCrops(map);
}

function onClickofCheckCrop() {
    for(var i=0;i<markers.length;i++)
    {
        if(markers[i].type==document.getElementById())
        markers[i].setMap(null);
    }
}
$(document).ready(function () {
    $(function () {
        $("input[name*='checkforcrop']").click(function () {
            if ($(this).is(':checked')) {
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i].title == this.value)
                        markers[i].setMap(map);
                }
            }
            else {
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i].title == this.value)
                        markers[i].setMap(null);
                }
            }
        });
    });
});

function xmlParse(str) {
    if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
        var doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.loadXML(str);
        return doc;
    }

    if (typeof DOMParser != 'undefined') {
        return (new DOMParser()).parseFromString(str, 'text/xml');
    }

    return createElement('div', null);
}

