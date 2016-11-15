//--------------------------------------------
// DrawingTools.js
//--------------------------------------------
// Drawing tools for Virtual Earth
//--------------------------------------------
//TODO: draw rubberband(rectangle) & polygon
var drawing = null;




function PolygonPlotter() {
    this.shapeLayer = null;
    this.shapeLayer = null;
    this.shapelayer = null;
    this.geomType = "";
    
    this.zoomLevel;
    this.polyPoints = null;
    this.selecting = false;
    this.map = map;
    this.polyobj = null;
    this.buffer = 0.25; //buffer distance to calculate buffer polygon around application polygon

}

    //Draw a polygon with loaded points
    PolygonPlotter.prototype.LoadPolygon = function (polypoints, polytype) {
        if (polytype != "coPolygon") {
            this.Clear();
            //this.Detach();
        }
        this.shapeLayer = new VEShapeLayer();

        this.polyPoints = new Array(0);

        for (var point = 0; point < polypoints.length; point++) {
            if (polypoints[point] != "") {
                var xy = polypoints[point].split(',');
                var latlon = null;
                if (polytype != "coPolygon") {
                    latlon = new VELatLong(parseFloat(xy[0]), parseFloat(xy[1]));
                }
                else {
                    latlon = new VELatLong(parseFloat(xy[1]), parseFloat(xy[0]));
                }
                //if (point == 0) { origin = latlon; }
                this.polyPoints.push(latlon);
            }
        }
        //polyPoints.push(origin);
        //draw polyline if there is only two points in the array
        if (this.polyPoints.length < 3) {
            var polygon = new VEShape(VEShapeType.Polyline, this.polyPoints);
        }
        else {
            //create a new polygon
            var polygon = new VEShape(VEShapeType.Polygon, this.polyPoints);
        }
        //calculate area
        if (polytype != "coPolygon") {
            var measure = new Measure();
            var totalArea = measure.CalculateArea(this.polyPoints);
            var centroid = measure.PolygonCentroid(this.polyPoints);
            var description = "<b>Area [acres]:</b> " + totalArea.acres;
            polygon.SetDescription(description);
            polygon.SetTitle("Your location: ");
            polygon.SetIconAnchor(centroid);
            //draw the new polygon on the map
            if (this.shapeLayer) {
                this.shapeLayer.AddShape(polygon);
               // locationobj[i].shapeid = polygon.GetID();
            }

            if (this.map.GetZoomLevel() < 14) { this.map.SetCenterAndZoom(centroid, 16); }
            else { this.map.SetCenter(centroid); }

            this.map.AddShapeLayer(this.shapeLayer);
        }
        else {
            polygon.SetLineColor(new VEColor(0, 0, 255, 0.3));
            polygon.SetLineWidth(2);
            //            polygon.SetTitle("county" + _polypoints.length);
            polygon.SetFillColor(new VEColor(102, 204, 0, 0.0));
            polygon.HideIcon();
            //draw the new polygon on the map
            if (this.shapeLayer) {
                this.shapeLayer.AddShape(polygon);
            }
            this.map.AddShapeLayer(this.shapeLayer);
            this.map.EnableShapeDisplayThreshold(false);
        }
        return polygon.GetId();
    }

    //Draw a polygon with loaded points
    PolygonPlotter.prototype.LoadMultiPolygons = function (locationobj, type) {
        //this.Clear();
        if (locationobj == null) {
            return;
        }
        //this.Detach();
        this.shapeLayer = new VEShapeLayer();
        for (var i = 0; i < locationobj.length; i++) {
            if (type == "buffer") {
                var _polypoints = locationobj[i].buffercoords.split('\n');
            }
            else {
                var _polypoints = locationobj[i].coordinates.split('\n');
            }
            this.polyPoints = new Array(0);

            for (var point = 0; point < _polypoints.length; point++) {
                if (_polypoints[point] != "") {
                    var xy = _polypoints[point].split(',');
                    var latlon = new VELatLong(parseFloat(xy[0]), parseFloat(xy[1]));
                    //if (point == 0) { origin = latlon; }
                    this.polyPoints.push(latlon);
                }
            }
            //polyPoints.push(origin);
            var polygon = null;
            //draw polyline if there is only two points in the array
            if (this.polyPoints.length < 3) {
                polygon = new VEShape(VEShapeType.Polyline, this.polyPoints);
            }
            else {
                //create a new polygon
                polygon = new VEShape(VEShapeType.Polygon, this.polyPoints);
            }
            //create polygon info
            var tittle = "";
            var description = "";
            if (type == "crop") {
                //croptypes.push("Field Crops");
                //croptypes.push("Honeybees");
                //croptypes.push("Vegetables");
                //croptypes.push("Fruits and Nuts");
                //croptypes.push("Greenhouse and Nursery");
                //croptypes.push("Forage, Grassland");
                var icon = "";
                var iconname = "";
                if (locationobj[i].planttype == "Field Crops") {
                    polygon.SetCustomIcon("<div class ='pushpinStyle_field'><div class='text'>" + (i + 1) + "</div></div>");
                }
                else if (locationobj[i].planttype == "Honeybees") {
                    polygon.SetCustomIcon("<div class ='pushpinStyle_bees'><div class='text'>" + (i + 1) + "</div></div>");
                }
                else if (locationobj[i].planttype == "Vegetables") {
                    polygon.SetCustomIcon("<div class ='pushpinStyle_vegetables'><div class='text'>" + (i + 1) + "</div></div>");
                }
                else if (locationobj[i].planttype == "Fruits and Nuts") {
                    polygon.SetCustomIcon("<div class ='pushpinStyle_nuts'><div class='text'>" + (i + 1) + "</div></div>");
                }
                else if (locationobj[i].planttype == "Greenhouse and Nursery") {
                    polygon.SetCustomIcon("<div class ='pushpinStyle_nursery'><div class='text'>" + (i + 1) + "</div></div>");
                }
                else {
                    polygon.SetCustomIcon("<div class ='pushpinStyle_forage'><div class='text'>" + (i + 1) + "</div></div>");
                }
                //                { iconname = "vegetables_32x32S.png"; } //vegetables_32x32.png
                //                else { iconname = "fruits_nuts_32x32.png"; } //fruits_icon_32x32.png
                //                icon = "<img src='images/" + iconname + "'/>";
                var xy = locationobj[i].loccentroid.split(',');
                var latlon = new VELatLong(parseFloat(xy[0]), parseFloat(xy[1]));
                tittle = "Location: " + (i + 1);
                description = "<b>Crop:</b> " + locationobj[i].croptype + "</br>";
                description += "<b>Crop Year:</b> " + locationobj[i].cropyear + "</br>";
                description += "<b>Organic Crop:</b> " + (locationobj[i].organiccrops == "1" ? "Yes" : "No") + "</br>";
                description += "<b>County:</b> " + locationobj[i].county;
                description += "<b><br>Comments:</b><br> " + locationobj[i].comment;
                polygon.SetDescription(description);
                polygon.SetTitle(tittle);
                polygon.SetLineColor(new VEColor(255, 0, 0, 0.3));
                polygon.SetFillColor(new VEColor(255, 0, 0, 0.2));
                //polygon.SetCustomIcon(icon);
                polygon.SetIconAnchor(latlon);
            }
            else if (type == "area") {

                var xy = locationobj[i].areacentroid.split(',');
                var latlon = new VELatLong(parseFloat(xy[0]), parseFloat(xy[1]));
                //------------------------------- Rama Changes Begin-------------------------------------
                tittle = "<b></b><br><b>" + (locationobj[i].appareaname) + "</b></br>";;
                polygon.SetCustomIcon("<div class ='pushpinapparea'><div class='text'>" + (i + 1) + "</div></div>");
                description = "<b>County:</b> " + locationobj[i].county + "</br>";
                description += "<b>Area [acres]:</b> " + locationobj[i].acres + "</br>";
                if (locationobj[i].pestcidename == null) {
                    locationobj[i].pestcidename = "N/A";
                }
                description += "<b>Pesticide:</b> " + locationobj[i].pestcidename;
                description += "<br><b>Comments:</b><br>" + locationobj[i].comment;
                polygon.SetDescription(description);
                polygon.SetTitle(tittle);
                polygon.SetIconAnchor(latlon);
                //------------------------------- Rama Changes Begin-------------------------------------
                // polygon.HideIcon();
            }
            else {

                var xy = locationobj[i].areacentroid.split(',');
                var latlon = new VELatLong(parseFloat(xy[0]), parseFloat(xy[1]));
                polygon.SetLineColor(new VEColor(255, 0, 0, 0.3));
                polygon.SetFillColor(new VEColor(255, 255, 0, 0.2));
                // polygon.SetIconAnchor(latlon);
                polygon.HideIcon();
            }

            //draw the new polygon on the map
            if (this.shapeLayer) {
                this.shapeLayer.AddShape(polygon);
                locationobj[i].shapeid = polygon.GetID();
                if (type == "buffer") {
                    var checkel = document.getElementById('view_check');
                    if (checkel) {
                        checkel.setAttribute('name', 'view_area_' + this.shapeLayer.GetId());
                    }
                }
            }
        }
        var rect = this.shapeLayer.GetBoundingRectangle();
        this.map.AddShapeLayer(this.shapeLayer);
        this.map.SetMapView(rect);
        return this.shapeLayer.GetId();
    }

    PolygonPlotter.prototype.Clear = function() {
        if (this.shapeLayer) {
            this.shapeLayer.DeleteAllShapes();
        }

        if (this.map) {
            this.map.DeleteAllShapes();
        }

    }

    PolygonPlotter.prototype.EnablePolygon = function () {
        // _map = map;
        //if (this.map) {
        //    _geomType = "polygon";
        //    _map.AttachEvent("onclick", MouseClickHandler);
        //    _map.AttachEvent("onmousemove", MouseMoveHandler);
        //    _map.AttachEvent("onmouseover", MouseOverHandler);
        //}
    }

    PolygonPlotter.prototype.DisablePolygon = function () {
                //_map = map;
                if (this.map) {
                    //Detach();
                }
    }


    function DrawingTools(map) {

        this.shapeLayer = null;
        this.geomType = "";
        this.lineLayer;
        this.zoomLevel;
        this.polyPoints = null;
        this.selecting = false;
        this.map = map;
        this.polyobj = null;
        this.buffer = 0.25; //buffer distance to calculate buffer polygon around application polygon

    }

//    //Starts drawing
DrawingTools.prototype.Draw = function (geomType) {
        this.Clear();
        //this.Detach();
        this.polyPoints = new Array();
        this.geomType = geomType;

        if (this.geomType != "") {
            if (geomType == "polygon" || geomType == "rectangle") {
                this.shapeLayer = new VEShapeLayer();
               this.map.AddShapeLayer(this.shapeLayer);
                //            if (!_map.DetachEvent("onmousedown", MouseDownHandler)) _map.DetachEvent("onmousedown", MouseDownHandler);
                //            if (!_map.DetachEvent("onmouseup", MouseUpHandler)) _map.DetachEvent("onmouseup", MouseUpHandler);
                // Attach the event handlers to the mouse
               var obj = this.MouseClickHandler.bind(this);
                this.map.AttachEvent("onclick", obj);
            }

            //this.map.AttachEvent("onmousemove", MouseMoveHandler);
            //this.map.AttachEvent("onmouseover", MouseOverHandler);
        }
}


   



//    //zoom in if map is zoomed out
DrawingTools.prototype.zoomToLevel = function(centroid) {
        var x = window.confirm("Area Of Interest Is Too Large, Please Zoom In.")
        if (x) { 
            this.map.SetCenterAndZoom(centroid, 14);
        }
        //reset
        this.selecting = false;
        this.polyPoints = new Array(0);
        this.Clear();
    }



//    

    DrawingTools.prototype.Clear = function() {
                if (this.shapeLayer) {
                    this.shapeLayer.DeleteAllShapes();
               }

        if (this.map) {
            this.map.DeleteAllShapes();
        }

    }
    DrawingTools.prototype.drawPolygon = function () {
        //remove the polygon that is on the map
        this.shapeLayer.DeleteAllShapes();
        var polygon = null;
        //draw polyline if there is only two points in the array
        //        if (this.polyPoints.length > 1 && this.selecting == true) {
        //            var polygon = new VEShape(VEShapeType.Pushpin, this.polyPoints);
        //            polygon.HideIcon();
        //            this.shapeLayer.AddShape(polygon);
        //        }
        //        else if (this.polyPoints.length > 2 && this.selecting == false) {
        //            var polygon = new VEShape(VEShapeType.Pushpin, this.polyPoints);
        //            polygon.HideIcon();
        //            //draw the new polygon on the map
        //            this.shapeLayer.AddShape(polygon);

        //        }

        if (this.selecting == true) {

            for (var x = 0; x < this.polyPoints.length; x++) {
                var shp = new VEShape(VEShapeType.Pushpin, this.polyPoints[x]);
                shp.SetCustomIcon("<img src = 'images/mappin.png' class = 'customicon'/>");
                this.shapeLayer.AddShape(shp);

            }
            if (this.polyPoints.length > 1) {
                var line = new VEShape(VEShapeType.Polyline, this.polyPoints);
                line.HideIcon();
                this.shapeLayer.AddShape(line);
            }

        }

        if (this.selecting == false) {

            if (this.polyPoints.length > 2) {
                var line = new VEShape(VEShapeType.Polygon, this.polyPoints);
                line.HideIcon();
                this.shapeLayer.AddShape(line);
            }

        }


    }

//    //This is for drawing polygon or point
    DrawingTools.prototype.MouseClickHandler = function(e) {
        //get the pixel and latlon
        if (e.leftMouseButton && this.selecting == true) {
            // enable selecting mode
            X = e.mapX;
            Y = e.mapY;
            if (this.polyPoints.length == 0) {
            }
            if( this.geomType != "point") {
                var point = this.map.PixelToLatLong(new VEPixel(X, Y));
                //add the new point to the array if not duplicate
                this.polyPoints.push(point);
                if (this.geomType == "polygon") { this.drawPolygon(); }
            }

            // disable the VE mouse events 
            return true;
        }
        else {
            //if (this.geomType != "point") { this.FinishDrawing(e); }
        }
    }

    DrawingTools.prototype.FinishDrawing = function () {
        //e.handled = true;
        //alert(polyPoints.length);
        // On mouse up, if in selecting mode cancel selecting mode
        if (this.polyPoints.length == 0) {
            this.polyPoints = new Array(0);
            this.selecting = false;
            return;
        }
        else {
            if (this.selecting) {
                // cancel selecting mode
                this.selecting = false;

                if (this.geomType == "polygon") {//e.eventName == "ondoubleclick") {
                    if (this.polyPoints.length < 3) {
                        
                        var msg = new DialogBox();
                        msg.message = "Your Area must have more than 3 corners<br>Please try again!";
                        msg.CreateDialog(1000);
                        return;
                    }
                    var measure = new Measure();
                    //check zoom first
                    

                    //calculate area and centroid

                    var totalArea = measure.CalculateArea(this.polyPoints);
                    var centroid = measure.PolygonCentroid(this.polyPoints);

                    var vbuffer = Math.sqrt(2 * (Math.pow(this.buffer, 2)));

                    ///populate the textbox with all lat/lon poitns of polygon
                    var pointstr = "";
                    var pointbufferstr = "";
                    var prevlat = null;
                    var prevlon = null;
                    var pointadded = false;

                    for (var x = 0; x < this.polyPoints.length; x++) {
                        if (x < this.polyPoints.length - 1 && pointadded) {
                            pointstr += "\n"; pointbufferstr += "\n";
                            pointadded = false;
                        }
                        if (prevlat != this.polyPoints[x].Latitude && prevlon != this.polyPoints[x].Longitude) {
                            pointstr += this.polyPoints[x].Latitude.toFixed(4) + "," + this.polyPoints[x].Longitude.toFixed(4);
                            pointadded = true;
                            pointbufferstr += GetLatLonfromD(centroid.Latitude, centroid.Longitude, this.polyPoints[x].Latitude, this.polyPoints[x].Longitude, vbuffer);
                        }
                        prevlat = this.polyPoints[x].Latitude;
                        prevlon = this.polyPoints[x].Longitude;


                    }
                    //                    for (point in polyPoints.length - 2) {
                    //                        
                    //                    }
                    //document.getElementById('coordinates').value = pointstr;

                    var el = document.getElementById('acres');
                    if (el) {
                        el.value = totalArea.acres;
                        el.setAttribute('disabled', 'disabled');
                    }


                    //store polygon properties for use
                    this.polyobj = new polyObject();
                    this.polyobj.area = totalArea;
                    //_polyobj.centroid = measure.Centroid(polyPoints);
                    this.polyobj.centroid = measure.PolygonCentroid(this.polyPoints);
                    this.polyobj.coordinates = pointstr;
                    this.polyobj.buffercoords = pointbufferstr;
                    //                    _polyobj.id = polygon.GetID();
                    polyobj = this.polyobj;
                    LookUpCounty();
                    this.drawPolygon();

                    this.polyPoints = new Array(0);
                    X = 0;
                    Y = 0;

                }
            }
        }
    }

//    ///////Draw polygon
 

//    //mouse move shares rectangle and polygon
    DrawingTools.prototype.MouseMoveHandler = function (e) {
        //When moving the mouse, if in "selecting" mode, draw, otherwise do nothing.
        var pix = new VEPixel(e.mapX, e.mapY);
        var LL = this.map.PixelToLatLong(pix);
        //        var string = "<span style='float:right; margin-right:4px;'>Location: " + LL.Latitude.toFixed(4) + " " + LL.Longitude.toFixed(4) + "</span>";
        //        if (document.getElementById('mapLoc') != null)
        //            document.getElementById('mapLoc').innerHTML = string;

        if (this.selecting) {
            var x = e.mapX;
            var y = e.mapY;
            // clear select box
            //if (shapeLayer) { _map.DeleteShape(shapeLayer) };
            if (this.geomType == "polygon" || this.geomType == "rectangle") {


                var dx = Math.abs(X) - Math.abs(x);
                var dy = Math.abs(Y) - Math.abs(y);

                //do not want to redraw polygon unless we move a significant amount
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    var latlong = this.map.PixelToLatLong(new VEPixel(x, y));
                    //polyPoints.pop();
                    //polyPoints.push(latlong);

                    if (this.geomType == "polygon") { //drawPolygon(); }
                    }
                }
            }
            else {
                return false;
            }

        }
    }

      



        DrawingTools.prototype.Detach =function() {
            if (this.map) {
                if (this.map.DetachEvent("onclick", MouseClickHandler)) {
                    this.map.DetachEvent("onclick", MouseClickHandler);
                }
                if (!this.map.DetachEvent("onmousemove", MouseMoveHandler)) {
                    this.map.DetachEvent("onmousemove", MouseMoveHandler);
                }
                if (!this.map.DetachEvent("onmouseover", MouseOverHandler)) {
                    this.map.DetachEvent("onmouseover", MouseOverHandler);
                }
            }
        }


    


    
    function StartDrawing() {
        var el = document.getElementById('startdrawing');
        if (el) {
            el.innerHTML = 'Click Here To Finish Drawing';
            el.setAttribute('href', 'Javascript: EndDrawing()');
            drawing = new DrawingTools(map);
            //drawing._polyobj.splice(0, drawing._polyobj.length - 1);
            drawing.geomType = "polygon";
            drawing.selecting = true;
            drawing.Draw("polygon");
        }


  }
    function EndDrawing() {
        var el = document.getElementById('startdrawing');
        if (el) {
            el.innerHTML = 'Click Here To Start Drawing';
            el.setAttribute('href', 'Javascript: StartDrawing()');
            drawing.FinishDrawing();
            
        }


    }
    //drawing properties//
    function polyObject() {
        this.centroid = null;
        this.area = null;
        this.id = null;
        this.coordinates = null;
        this.buffercoords = null;
    }




    //************************//
    //****** Measure object for Area Calculation******//
    function Measure() {
        this.EARTHRADIUS = 6378137; // in metres
        this.SQMTOSQKM = 0.000001; //conversion factor
        this.SQMTOSQMI = 0.000000386102159; //conversion factor
        this.ACRES = 247.105381;
    }
    Measure.prototype.GetMedianCentroid = function (b) {
        var h = b.length - 2;
        var c = [];
        var d = -90;
        var f = 90;
        var e = -180;
        var g = 180;
        c[0] = 0;
        c[1] = 0;
        for (var a = 0; a < h; a = a + 2) {
            if (g > b[a]) g = b[a];
            if (e < b[a]) e = b[a];
            if (f > b[a + 1]) f = b[a + 1];
            if (d < b[a + 1]) d = b[a + 1]
        }
        c[0] = (e + g) / 2;
        c[1] = (d + f) / 2;
        return c;
    }
    Measure.prototype.GetUnitSpherePoint = function (c, d) {
        var a = [];
        var b = Math.PI / 180;
        a[0] = Math.cos(c * b);
        a[1] = a[0] * Math.sin(d * b);
        a[0] = a[0] * Math.cos(d * b);
        a[2] = Math.sin(c * b);
        return a;
    }
    Measure.prototype.GetTangentPlaneBasis = function (a) {
        var b = [];
        var e = [];
        var f = [];
        b[0] = 0;
        b[1] = 0;
        b[2] = 0;
        var d = 0;
        var c = 1;
        if (Math.abs(a[2]) > Math.abs(a[0])) {
            d = 2;
            if (Math.abs(a[0]) > Math.abs(a[1])) c = 0;
        }
        else if (Math.abs(a[2]) > Math.abs(a[1])) c = 2;
        var g = Math.sqrt(a[d] * a[d] + a[c] * a[c]);
        b[d] = -a[c] / g; b[c] = a[d] / g;
        e[0] = a[1] * b[2] - a[2] * b[1];
        e[1] = a[2] * b[0] - a[0] * b[2];
        e[2] = a[0] * b[1] - a[1] * b[0];
        f[0] = b;
        f[1] = e;
        return f;
    }
    Measure.prototype.GetProjectedCoordinates = function (c, e, f, g, h) {
        var b = [];
        var a = this.GetUnitSpherePoint(g, h);
        var d = a[0] * c[0] + a[1] * c[1] + a[2] * c[2];
        if (d <= 0) {
            b.VALID = false;
            return b;
        }
        else {
            a[0] = a[0] - c[0];
            a[1] = a[1] - c[1];
            a[2] = a[2] - c[2];
            b[0] = (a[0] * e[0] + a[1] * e[1] + a[2] * e[2]) / d;
            b[1] = (a[0] * f[0] + a[1] * f[1] + a[2] * f[2]) / d;
            b.VALID = true;
            return b;
        }
    }
    Measure.prototype.SignedExcess = function (a, b, c) {
        if (b[0] * c[1] - c[0] * b[1] > 0) return a;
        else return -a
    }
    Measure.prototype.TriangleExcess = function (e, g, f, h, b, c) {
        var d = this.GreatCircleDistance(e, g, f, h) / this.EARTHRADIUS;
        var a = (b + c + d) / 2;
        a = Math.tan(a / 2) * Math.tan((a - b) / 2) * Math.tan((a - c) / 2) * Math.tan((a - d) / 2);
        if (a > 0) {
            a = Math.sqrt(a);
            return 4 * Math.atan(a);
        }
        else return 0;
    }
    Measure.prototype.GreatCircleDistance = function (i, g, j, h) {
        var a = Math.PI / 180;
        var b = i * a;
        var c = j * a;
        var d = Math.sin((b - c) / 2);
        var e = Math.sin((g - h) * a / 2);
        var f = Math.asin(Math.sqrt(d * d + Math.cos(b) * Math.cos(c) * e * e));
        return this.EARTHRADIUS * 2 * f;
    }
    Measure.prototype.SemiGreatCircleDistance = function (c, a, d, b) {
        if (Math.abs(a - b) > 180) return 2 * this.EARTHRADIUS * Math.PI - this.GreatCircleDistance(c, a, d, b);
        else return this.GreatCircleDistance(c, a, d, b);
    }
    Measure.prototype.CalculateAreaP = function (a) {
        if (!a) return -1;
        var k = a.length;
        if (k < 8) return -1;
        var c = this.GetMedianCentroid(a);
        var j = this.GetUnitSpherePoint(c[1], c[0]);
        var l = this.GetTangentPlaneBasis(j);
        var m = l[0];
        var n = l[1];
        var g = 0;
        var b = 0;
        var h = this.SemiGreatCircleDistance(c[1], c[0], a[1 + b], a[b]) / this.EARTHRADIUS;
        var i;
        var d = this.GetProjectedCoordinates(j, m, n, a[1], a[0]);
        var e;

        if (!d.VALID) return -1;

        var p = h;
        var o = d;

        for (b = 2; b < k; b = b + 2) {
            i = this.SemiGreatCircleDistance(c[1], c[0], a[1 + b], a[b]) / this.EARTHRADIUS;
            e = this.GetProjectedCoordinates(j, m, n, a[1 + b], a[b]);
            if (!e.VALID) return -1;
            g = g + this.SignedExcess(this.TriangleExcess(a[b - 1], a[b - 2], a[1 + b], a[b], h, i), d, e);
            d = e;
            h = i;
        }
        return Math.abs(g) * this.EARTHRADIUS * this.EARTHRADIUS;
    }
    Measure.prototype.CalculateArea = function (VEPoints) {
        //var VEPoints = this.polyPoints;
        var pointAry = [];
        //close polygon
        VEPoints.push(VEPoints[0]);
        if (VEPoints[0] != undefined) {
            for (point in VEPoints) {
                pointAry.push(VEPoints[point].Longitude);
                pointAry.push(VEPoints[point].Latitude);
            }

            var sqM = this.CalculateAreaP(pointAry);
            var areaObj = new Object;
            areaObj.mi = sqM * this.SQMTOSQMI;
            areaObj.km = (sqM * this.SQMTOSQKM).toFixed(4);
            areaObj.acres = (areaObj.km * this.ACRES).toFixed(2);
            return areaObj;
        }
    }
    //Calculate the centroid of an array of 2D points Not very accurate!
    Measure.prototype.Centroid = function (VEPoints) {
        //var VEPoints = b.GetPoints();
        var pointAry = new Array();
        var sumx = 0;
        var sumy = 0;
        var count = 0;
        if (VEPoints[0] != undefined) {
            for (point in VEPoints) {
                sumx += VEPoints[point].Longitude;
                sumy += VEPoints[point].Latitude;
                count++;
            }
            pointAry[0] = sumx / count;
            pointAry[1] = sumy / count;
            return pointAry;
        }
    }


    Measure.prototype.PolygonCentroid = function (VEPoints) {
        var sumY = 0;
        var sumX = 0;
        var partialSum = 0;
        var sum = 0;
        if (VEPoints[0] != undefined) {
            //close polygon
            VEPoints.push(VEPoints[0]);

            var n = VEPoints.length;

            for (var i = 0; i < n - 1; i++) {
                partialSum = VEPoints[i].Longitude * VEPoints[i + 1].Latitude - VEPoints[i + 1].Longitude * VEPoints[i].Latitude;
                sum += partialSum;
                sumX += (VEPoints[i].Longitude + VEPoints[i + 1].Longitude) * partialSum;
                sumY += (VEPoints[i].Latitude + VEPoints[i + 1].Latitude) * partialSum;
            }

            var area = 0.5 * sum;

            return new VELatLong(sumY / 6 / area, sumX / 6 / area);
        }
    }



    Measure.prototype.CalculateAreaRec = function (points1, points2) {
        var width = this.CalculateDistanceRec(points1.Latitude, points1.Longitude, points1.Latitude, points2.Longitude);
        var height = this.CalculateDistanceRec(points1.Latitude, points1.Longitude, points2.Latitude, points1.Longitude);
        //alert(width.toFixed(4) + ", " + height.toFixed(4));
        var areaObj = new Object;
        areaObj.km = (width * height).toFixed(4);
        areaObj.acres = (areaObj.km * 247.105381).toFixed(2);
        //return (area * 247.105381).toFixed(2);
        return areaObj;

    }
    Measure.prototype.CalculateDistanceRec = function (lat1, lon1, lat2, lon2) {
        R = 6371; //earths radius (mean radius = 6,371km);
        dLat = (lat2 - lat1) * Math.PI / 180;
        dLon = (lon2 - lon1) * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = R * c;
        return d;

    }

//******End Measure object******************//