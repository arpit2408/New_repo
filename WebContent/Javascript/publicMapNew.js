var map = "";
var featuresloc ="";

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

function createPolygons(map) {
    var arr = new Array();
    var polygons = [];
    var bounds = new google.maps.LatLngBounds();
    var Colors = [
    "purple",
    "#8e44ad",
    "#0000FF",
    "#FFFFFF",
    "#000000",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF"
    ];
    // downloadUrl("subdivision-coordinates.php", function(data) {
    var xmlString = '<subdivisions><subdivision name="Auburn Hills"><coord lat="39.00748" lng="-92.323222"/><coord lat="39.000843" lng="-92.323523"/><coord lat="39.000509" lng="-92.311592"/><coord lat="39.007513" lng="-92.311378"/><coord lat="39.00748" lng="-92.323222"/></subdivision><subdivision name="Vanderveen"><coord lat="38.994206" lng="-92.350645"/><coord lat="38.985033" lng="-92.351074"/><coord lat="38.984699" lng="-92.343092"/><coord lat="38.981163" lng="-92.342234"/><coord lat="38.984663" lng="-92.3335"/><coord lat="38.993472" lng="-92.333179"/><coord lat="38.994206" lng="-92.350645"/></subdivision><subdivisions>';
    var xml = xmlParse(xmlString);
    var subdivision = xml.getElementsByTagName("subdivision");
    // alert(subdivision.length);
    for (var i = 0; i < subdivision.length; i++) {
        arr = [];
        var coordinates = xml.documentElement.getElementsByTagName("subdivision")[i].getElementsByTagName("coord");
        for (var j = 0; j < coordinates.length; j++) {
            arr.push(new google.maps.LatLng(
                  parseFloat(coordinates[j].getAttribute("lat")),
                  parseFloat(coordinates[j].getAttribute("lng"))
            ));

            bounds.extend(arr[arr.length - 1])
           
        }
        polygons.push(new google.maps.Polygon({
            paths: arr,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: Colors[j],
            fillOpacity: 0.35
        }));
        polygons[polygons.length - 1].setMap(map);
    }
    // });
    map.fitBounds(bounds);
}


function initialize() {
    var mapOptions = {
        zoom: 12,
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
            map: map
            
        });
        marker.setMap(map);
        //map.setCenter(marker.getPosition());
        var content =
        "<dl>"+
        "<dl>"+
             "<dt>Crop Name:</dt>"+
             "<dd>"+ custom.cropname +"</dd>"+
        
             "<dt>Crop Type:</dt>"+
             "<dd>"+custom.type+"</dd>"+
        "</dl>"+
        "<dl>"+
             "<dt>Crop Year:</dt>"+
             "<dd>"+custom.cropyear+"</dd>"+
        
             "<dt>Crop County:</dt>"+
             "<dd>"+custom.county+"</dd>"+
        "</dl>"
        "</dl>"

        var infowindow = new google.maps.InfoWindow({
            maxWidth: 300
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
        PageMethods.QueryProducers("All", "All", QueryProducers_Success, Fail);
    }
    function customfeature() {
        this.type = "";
        this.position = new google.maps.LatLng(0,0);
        this.cropname = "";
        this.county = "";
        this.cropyear = "";
    }
    function QueryProducers_Success(val) {
        featuresloc = JSON.parse(val[1]);
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
    

}



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



/*function initMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 16,
        center: new google.maps.LatLng(-33.91722, 151.23064),
        mapTypeId: 'roadmap'
    });
    var customControlDiv = document.getElementById("choiceMenuCrop");
    var customSearch = document.getElementById("adv-search");
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(customControlDiv);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(customSearch);
    createSearchFunctionlity(map);

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
    //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        parking: {
            icon: iconVegetable
        },
        library: {
            icon: iconFruitNuts
        },
        info: {
            icon: iconHoneyBees
        }
    };

    function addMarker(feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map
        });
        var content = "Loan Number: " + feature.position + '</h3>' + "Address: "

        var infowindow = new google.maps.InfoWindow()

        google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
                infowindow.setContent(content);
                infowindow.open(map, marker);
            };
        })(marker, content, infowindow));
    }

    var features = [
      {
          position: new google.maps.LatLng(-33.91721, 151.22630),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91539, 151.22820),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91747, 151.22912),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91910, 151.22907),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91725, 151.23011),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91872, 151.23089),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91784, 151.23094),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91682, 151.23149),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91790, 151.23463),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91666, 151.23468),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.916988, 151.233640),
          type: 'info'
      }, {
          position: new google.maps.LatLng(-33.91662347903106, 151.22879464019775),
          type: 'parking'
      }, {
          position: new google.maps.LatLng(-33.916365282092855, 151.22937399734496),
          type: 'parking'
      }, {
          position: new google.maps.LatLng(-33.91665018901448, 151.2282474695587),
          type: 'parking'
      }, {
          position: new google.maps.LatLng(-33.919543720969806, 151.23112279762267),
          type: 'parking'
      }, {
          position: new google.maps.LatLng(-33.91608037421864, 151.23288232673644),
          type: 'parking'
      }, {
          position: new google.maps.LatLng(-33.91851096391805, 151.2344058214569),
          type: 'parking'
      }, {
          position: new google.maps.LatLng(-33.91818154739766, 151.2346203981781),
          type: 'parking'
      }, {
          position: new google.maps.LatLng(-33.91727341958453, 151.23348314155578),
          type: 'library'
      }
    ];
    init_publicmapnew();
    function init_publicmapnew() {
        PageMethods.QueryProducers("All", "All", Query_Success);
    }
    function featureva() {
        this.type = "";
        this.position = new google.maps.LatLng(0, 0);
    }
    function Query_Success(val) {
        var featuresloc = JSON.parse(val[1]);
        var len = features.length;
        for (var i = 0; i < featuresloc.length; i++) {
            var feature = new featureva();
            feature.type = featuresloc[i].croptype;
            feature.position = new google.maps.LatLng(featuresloc[i].lat, featuresloc[i].long);
            features[len++] = feature;
        }
    }
    for (var i = 0, feature; feature = features[i]; i++) {
        var marker = addMarker(feature);
    }

}*/

