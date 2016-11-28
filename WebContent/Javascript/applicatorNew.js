var shapes = [];
var flag = 1;
var map;
var drawingManager;
var coordinates = "";
var eventOnload = "";
var centroid = "";
var pointbufferstr = "";
function setOnloadEvent(event) {
    eventOnload=event;
}
function initMap(event) {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 16,
        center: new google.maps.LatLng(30.6187, -96.3365),
        mapTypeId: 'roadmap'
    });
    var customSearch = document.getElementById("pac-input");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(customSearch);
    createSearchFunctionlity(map);
    createApplicatorAreas(event);
    createPublicCrops(map);
}
function createApplicatorAreas(event) {
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
    google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
        $('#vertices').val(event.overlay.getPath().getArray());
        $('#ModalApplicator').modal('show');
        //$("#ModalApplicator").draggable({ handle: ".modal-header" });
        $('#areaPolygon').val((0.000247105 * google.maps.geometry.spherical.computeArea(event.overlay.getPath())).toFixed(2));
        $('#cropYear').val(new Date().getFullYear());
      
        for (var i = 0; i < event.overlay.getPath().getLength() ; i++) {
            coordinates += event.overlay.getPath().getAt(i).toUrlValue(6) + ";";
        }
        $('#polygonpath').val(coordinates);
        var bounds = new google.maps.LatLngBounds();
        var polygonCoords = event.overlay.getPath().getArray();
        for (var i = 0; i < polygonCoords.length; i++) {
            bounds.extend(polygonCoords[i]);
        }
        $('#countyselected').val(getCountyInfo(coordinates));
        centroid = bounds.getCenter();
        var vbuffer = Math.sqrt(2 * (Math.pow(0.25, 2)));
        for (var i = 0; i < polygonCoords.length; i++) {
            pointbufferstr += GetLatLonfromD(centroid.lat(), centroid.lng(), polygonCoords[i].lat(), polygonCoords[i].lng(), vbuffer)+"\n";
        }
    });
    init_applicatorMapNew();
    function init_applicatorMapNew() {
        $.ajax({
            type: 'POST',
            url: 'ApplicatorNew.aspx/GetApplicatorAreas',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ email: "mtchakerian@tamu.edu" }),
            dataType: 'json',
            success: Query_Applicator_Success,
            error: Fail_Applicator
        });
        //event.preventDefault();
        //PageMethods.GetApplicatorAreas("mtchakerian@tamu.edu", Query_Applicator_Success, Fail_Applicator);
        //return false;
    }
    function Query_Applicator_Success(resultobj) {
        var val = resultobj.d;
        var arr = new Array();
        var buffarr = new Array();
        var polygons = [];
        var bufferPolygons = [];
        var bounds = new google.maps.LatLngBounds();
        var buffbounds=new google.maps.LatLngBounds();
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
        for (var i = 0,k=0; i < applicatorloc.length; i++,k++) {
            arr = [];
            buffarr = [];
            var coordinatesfromdb = applicatorloc[i].coordinates;
            var buffercordinates = applicatorloc[k].buffercoords;
            var coordinates = coordinatesfromdb.split("\n");
            var buffercords = buffercordinates.split("\n");
            for (var j = 0,n=0; j < coordinates.length; j++,n++) {
                var coordi = coordinates[j].split(",");
                var buffcords = buffercords[n].split(",");
                arr.push(new google.maps.LatLng(
                      parseFloat(coordi[0]),
                      parseFloat(coordi[1])
                ));
                buffarr.push(new google.maps.LatLng(
                      parseFloat(buffcords[0]),
                      parseFloat(buffcords[1])
                ));
                bounds.extend(arr[arr.length - 1]);
                buffbounds.extend(buffarr[buffarr.length - 1]);
            }
            polygons.push(new google.maps.Polygon({
                paths: arr,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: Colors[j],
                fillOpacity: 0.35
            }));
            bufferPolygons.push(new google.maps.Polygon({
                paths: buffarr,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                //fillColor: Colors[j],
                fillOpacity: 0.10
            }));
            polygons[polygons.length - 1].setMap(map);
            bufferPolygons[bufferPolygons.length - 1].setMap(map);
            shapes.push(polygons);
            shapes.push(bufferPolygons);
        }
        if (applicatorloc.length > 1) {
            map.fitBounds(bounds);
            /*var listener = google.maps.event.addListener(map, "idle", function () {
                if (map.getZoom() < 16) map.setZoom(10);
                google.maps.event.removeListener(listener);
            });*/
        }
        else if (applicatorloc.length == 1) {
            map.setCenter(bounds.getCenter());
            map.setZoom(14);
        }
        /*var listener = google.maps.event.addListener(map, "idle", function () {
            if (map.getZoom() < 16) map.setZoom(16);
            google.maps.event.removeListener(listener);
        });*/
        
    }
    function Fail_Applicator(resultobj) {
        var val = resultobj.d;
    }
}
function AppArea() {
    this.usremail = "";
    this.id = "";
    this.comment = "";
    this.county = "";
    this.coordinates = "";
    this.areacentroid = "";
    this.acres = "";
    this.buffercoords = "";
    this.license = "";
    this.pesticidename = "";

}
function SubmitNewApplicatorLocation(event)
{
    var apparea = new AppArea();
    /*var err = document.getElementById('error');
    err.innerHTML = '';
    var errflag = 0;

    if (usrapparea) {
        apparea.usremail = user.email;
        apparea.id = usrapparea.id;
    }
    else {
        apparea.usremail = 'new apparea';
        apparea.id = '-1';
    }*/
    apparea.usremail = "mtchakerian@tamu.edu";
    apparea.county = document.getElementById('countyselected').value;
    apparea.acres = document.getElementById('areaPolygon').value;
    apparea.appareaname = document.getElementById('appAreaName').value;
    apparea.pesticidename = document.getElementById('pesticideName').value;
    apparea.comment = document.getElementById('form_message').value;
    apparea.coordinates = document.getElementById("polygonpath").value;
    apparea.buffercoords = pointbufferstr;
    var lat = centroid.lat();
    var lng = centroid.lng();
    apparea.areacentroid = lat + "," + lng;
    apparea.comment = apparea.comment.replace(/'/g, "''");
    apparea.appareaname = apparea.appareaname.replace(/'/g, "''");
    var str = JSON.stringify(apparea);
    var data2 = "{\'userarea\':\'" + apparea + "\' }";
    event.preventDefault();
    PageMethods.AddNewApplicationApplicatorArea(str, AddNewLocation_Success, Fail);
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

    /*function createPolygons(map) {
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
    }*/
