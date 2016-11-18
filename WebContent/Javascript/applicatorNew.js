var shapes = [];
var flag = 1;
function initMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 16,
        center: new google.maps.LatLng(30.6187, -96.3365),
        mapTypeId: 'roadmap'
    });
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'polygon']
        },
        polygonOptions: {
            editable: false,
            draggable: true,
            strokecolor: '#E9967A'
        }
    });
    drawingManager.setMap(map);
    drawingManager.setDrawingMode(null);
    google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
        var newShape = event.overlay;
        newShape.type = event.type;
        shapes.push(newShape);
        if (drawingManager.getDrawingMode()) {
            drawingManager.setDrawingMode(null);
        }
    });
    google.maps.event.addListener(drawingManager, "drawingmode_changed", function () {
        if (flag == 1) {
            if (drawingManager.getDrawingMode() != null && drawingManager.getDrawingMode() != 'marker') {
                for (var i = 0; i < shapes.length; i++) {
                    for (var j = 0; j < shapes[i].length; j++)
                        shapes[i][j].setMap(null);
                }
                shapes = [];
            }
            flag = 0;
        }
        else {
            if (drawingManager.getDrawingMode() != null && drawingManager.getDrawingMode() != 'marker') {
                for (var i = 0; i < shapes.length; i++) {
                        shapes[i].setMap(null);
                }
                shapes = [];
            }
        }
    });
    var customSearch = document.getElementById("pac-input");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(customSearch);
    createSearchFunctionlity(map);
    init_applicatorMapNew();
    function init_applicatorMapNew() {
        PageMethods.GetApplicatorAreas("1=1", Query_Applicator_Success, Fail_Applicator);
    }
    function Query_Applicator_Success(val) {
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
        var applicatorloc = JSON.parse(val[1]);
        for (var i = 0; i < applicatorloc.length; i++) {
            arr = [];
            var coordinatesfromdb = applicatorloc[i].coordinates;
            var coordinates=coordinatesfromdb.split("\n");
            for (var j = 0; j < coordinates.length; j++) {
                var coordi = coordinates[j].split(",");
                arr.push(new google.maps.LatLng(
                      parseFloat(coordi[0]),
                      parseFloat(coordi[1])
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
            shapes.push(polygons);
        }
        //map.fitBounds(bounds);
        map.setZoom(12);
    }
    function Fail_Applicator(val) {
    }
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