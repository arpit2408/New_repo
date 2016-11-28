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

function createPublicCrops(map) {
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
}