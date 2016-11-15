var map = null;
var locindex = -1;
var loadedDrawings = null;
var locedit = false;
var polyobj = null;
var tableview = false;
var layer1 = new VEShapeLayer();
var currCropLayerID = null;
var croplocationarr = null;
var box = new DialogBox();

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
function init_publicmap() {
    //CreateOptions('county', 'view');
    GetMap();
    box.message = "Loading Crop Locations...";
    box.CreateDialog(null);
    PageMethods.QueryProducers("All", "All", QueryProducers_Success, Fail);
}

function DrawAllCrops() {
    ///draws crops on the map. If plotall is true, it plots all crops. Otherwise, just the conflict crops
    var shplayer = new VEShapeLayer();
    if (map) {
        map.AddShapeLayer(shplayer);
    }
    for (var x = 0; x < croplocationarr.length; x++) {
        
        var point = new VELatLong(croplocationarr[x].lat, croplocationarr[x].lon);
        try {
            var shp = new VEShape(VEShapeType.Pushpin, point);
            //var polygon = new VEShape(VEShapeType.Polygon, this.polyPoints);
            //cropshapelayer.AddShape(shp);
            if (croplocationarr[x].croptype.toUpperCase() == "FIELD CROPS") {
                shp.SetCustomIcon("<div class ='pushpinStyle_field'></div>");
            }
            else if (croplocationarr[x].croptype.toUpperCase() == "HONEYBEES") {
                shp.SetCustomIcon("<div class ='pushpinStyle_bees'></div>");
            }
            else if (croplocationarr[x].croptype.toUpperCase() == "VEGETABLES") {
                shp.SetCustomIcon("<div class ='pushpinStyle_vegetables'></div>");
            }
            else if (croplocationarr[x].croptype.toUpperCase() == "FRUITS AND NUTS") {
                shp.SetCustomIcon("<div class ='pushpinStyle_nuts'></div>");
            }
            else if (croplocationarr[x].croptype.toUpperCase() == "GREENHOUSE AND NURSERY") {
                shp.SetCustomIcon("<div class ='pushpinStyle_nursery'></div>");
            }
            else if (croplocationarr[x].croptype.toUpperCase() == "FORAGE") {
                shp.SetCustomIcon("<div class ='pushpinStyle_forage'></div>");
            }
            else {
                shp.SetCustomIcon("<div class ='pushpinStyle_unknown'></div>");
            }
            title = "Crop: " + croplocationarr[x].croptype;
            description = "<b>Crop:</b> " + croplocationarr[x].cropname + "</br>";
            
            shp.SetDescription(description);
            shp.SetTitle(title);
            shplayer.AddShape(shp);
            
            //polygon.SetCustomIcon(icon);
            //polygon.SetIconAnchor(latlon);
        }
        catch (e) {
            //alert(e.message);
        }
    }

}


function CreateLegend() {
    var div = document.getElementById('maplegend');
    if (div) {
        div.innerHTML = "";
        div.style.textAlign = "left";
        div.style.verticalAlign = "middle";
        ///////////////////////////////////////////
        var span = document.createElement('span');
        var img = document.createElement('img');
        var label = document.createElement('label');
        img.setAttribute('src', 'images/pushpins/pushpinyellow20.png');
        img.setAttribute('alt', 'bees');
        img.style.height = "15px";
        img.style.width = "15px";
        span.appendChild(img);
        label.setAttribute('style', 'font-weight: bold');
        label.innerHTML = "&nbsp;Honeybees<br><br>";
        span.appendChild(label);
        div.appendChild(span);
        ///////////////////////////////////////////
        var span = document.createElement('span');
        var img = document.createElement('img');
        var label = document.createElement('label');
        img.setAttribute('src', 'images/pushpins/pushpinblue20.png');
        img.setAttribute('alt', 'fruits and nuts');
        img.style.height = "15px";
        img.style.width = "15px";
        span.appendChild(img);
        label.setAttribute('style', 'font-weight: bold');
        label.innerHTML = "&nbsp;Fruits and Nuts<br><br>";
        span.appendChild(label);
        div.appendChild(span);
        ///////////////////////////////////////////
        var span = document.createElement('span');
        var img = document.createElement('img');
        var label = document.createElement('label');
        img.setAttribute('src', 'images/pushpins/pushpingreen20.png');
        img.setAttribute('alt', 'field crops');
        img.style.height = "15px";
        img.style.width = "15px";
        span.appendChild(img);
        label.setAttribute('style', 'font-weight: bold');
        label.innerHTML = "&nbsp;Field Crops<br><br>";
        span.appendChild(label);
        div.appendChild(span);
        ///////////////////////////////////////////
        var span = document.createElement('span');
        var img = document.createElement('img');
        var label = document.createElement('label');
        img.setAttribute('src', 'images/pushpins/pushpinred20.png');
        img.setAttribute('alt', 'Nursery');
        img.style.height = "15px";
        img.style.width = "15px";
        span.appendChild(img);
        label.setAttribute('style', 'font-weight: bold');
        label.innerHTML = "&nbsp;Nursery and Greenhouse<br><br>";
        span.appendChild(label);
        div.appendChild(span);
        ///////////////////////////////////////////
        var span = document.createElement('span');
        var img = document.createElement('img');
        var label = document.createElement('label');
        img.setAttribute('src', 'images/pushpins/pushpinwhite20.png');
        img.setAttribute('alt', 'fruits and nuts');
        img.style.height = "15px";
        img.style.width = "15px";
        span.appendChild(img);
        label.setAttribute('style', 'font-weight: bold');
        label.innerHTML = "&nbsp;Forage and Grass<br><br>";
        span.appendChild(label);
        div.appendChild(span);
        ///////////////////////////////////////////
        var span = document.createElement('span');
        var img = document.createElement('img');
        var label = document.createElement('label');
        img.setAttribute('src', 'images/pushpins/pushpinpurple20.png');
        img.setAttribute('alt', 'fruits and nuts');
        img.style.height = "15px";
        img.style.width = "15px";
        span.appendChild(img);
        label.setAttribute('style', 'font-weight: bold');
        label.innerHTML = "&nbsp;Vegetables<br><br>";
        span.appendChild(label);
        div.appendChild(span);
    }

}
function QueryProducers_Success(val) {
    CreateLegend();
    
    
    var el = document.getElementById('description');
    if (el) {
        el.innerHTML = "<h1>Texas  Crops Map</h1>";
        el.innerHTML += "This map shows the number of crops currently registered in the database. <b>In this 'public' map, crop information is limited, and locations are offset to protect the privacy of growers.</b>";
        el.innerHTML += "<br>Please register in order to contribute your  crop locations, or to manage pesticide application locations.";
        el.innerHTML += "";
    }
    if (val[0] != "0") 
    {
        croplocationarr = JSON.parse(val[1]);
        if (croplocationarr.length > 0) {
            DrawAllCrops();
            box.CloseDialog();
        }
        //else if (croplocs.length == 0) {
        //    var el = document.getElementById('viewoptions');
        //    var errel = document.getElementById('nocrop');
        //    if (el && errel) {
        //        el.removeChild(errel);
        //    }
        //    var el = document.getElementById('viewoptions');
        //    var label = document.createElement('p');
        //    label.id = 'nocrop';
        //    label.innerHTML = " Sorry there are no Producer Crops for the selected option.</br> Please try another county / crop type ";
        //    el.appendChild(label);

        //    PageMethods.QueryProducers("All", "All", QueryProducersAfterNoCrops_Success, Fail);
        //}

       
    }
   else {
        var el = document.getElementById('error');
        if (el) {
            el.innerHTML = val[1];
            el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
            alert(val[1]);
        }
    }
    parent.adjustFrameHeight();
}

function QueryProducersAfterNoCrops_Success(val) {

//    if (val[0] != "0") {
//        croplocs = JSON.parse(val[1]);
//        if (croplocs.length > 0) {
////            var el = document.getElementById('viewoptions');
////            var errel = document.getElementById('nocrop');
////            if (el && errel) {
////                el.removeChild(errel);
////            }
//            if (map == null) {
//                GetMap();
//            }
//            if (loadedDrawings == null) {
//                loadedDrawings = new DrawingTools(map);
//            }
//            if (currCropLayerID != null) {
//                var layer = map.GetShapeLayerByIndex(map.GetShapeLayerCount() - 1);
//                map.DeleteShapeLayer(layer);
//                //alert("Deleted");
//            }
//            currCropLayerID = loadedDrawings.LoadMultiPolygons(croplocs, "crop");
//            //            var indexlayer = map.GetShapeLayerByIndex(map.GetShapeLayerCount() - 1).iid;
//            //            alert(currCropLayerID+ " " + indexlayer);

//            if (tableview) {
//                DeleteViewTable();
//                CreateViewTable();
//            }
//        }
//    }

}

function planttypeOnChange(value) {
    //    alert(value);
    if (value != "") {
        if (value != "All") {
            CreateOptions(value, 'view');
            var el = document.getElementById('croptypelbl');
            if (el) {
                el.setAttribute('style', 'visibility: visible; display: block; font-weight: bold;');
            }
        }
        else {
            var el = document.getElementById('croptypelbl');
            if (el) {
                el.setAttribute('style', 'visibility: hidden; display: none; font-weight: bold;');
            }
            var el = document.getElementById('croptype');
            if (el) {
                el.setAttribute('style', 'visibility: hidden; display: none;');
            }
        }
        ChangeView("planttype", value);
    }
    
        
}

function ChangeView(option, value) {
    var qryoptions = "";
    var qryvalues = "";
    //-------------------Rama Changes Begin------------------
    var check = document.getElementById(option).value;

    //-------------------Rama Changes End------------------
    switch (option) {
        case "county": //county changed
            {
                if (document.getElementById(option).value != "") {
                    qryoptions = option;
                    qryvalues = value;
                    var el = document.getElementById('planttype');
                    if (el) {
                        if (el.value != "") {
                            qryoptions += ",planttype";
                            qryvalues += "," + el.value;
                        }
                    }
                    var el = document.getElementById('croptype');
                    if (el) {
                        if (el.style.display != "none" && el.value != "") {
                            qryoptions += ",croptype";
                            qryvalues += "," + el.value;
                        }
                    }
                }
                
            }
            break;
        case "planttype": //plant type changed
            {
                if (document.getElementById(option).value != "") 
                {
                    var el = document.getElementById('county');
                    if (el) 
                    {
                        if (el.value == "") 
                        {
                            el.selectedIndex = 0;
                            qryoptions = "county";
                            qryvalues = "All";
                        }
                        else 
                        {
                            qryoptions = "county";
                            qryvalues = el.value;
                        }
                    }
                    qryoptions += "," + option;
                    qryvalues += "," + value;
                    var el = document.getElementById('croptype');
                    if (el) 
                    {
                        if (el.style.display != "none" && el.value != "") 
                        {
                            qryoptions += ",croptype";
                            qryvalues += "," + el.value;
                        }
                    }
                }
            }
            break;
        case "croptype": //crop type changed
            {
                if (document.getElementById(option).value != "") 
                {
                    var el = document.getElementById('county');
                    if (el) 
                    {
                        if (el.value == "") 
                        {
                            el.selectedIndex = 0;
                            qryoptions = "county";
                            qryvalues = "All";
                        }
                        else 
                        {
                            qryoptions = "county";
                            qryvalues = el.value;
                        }
                    }
                    var el = document.getElementById('planttype');
                    if (el) 
                    {
                        if (el.value != "") 
                        {
                            qryoptions += ",planttype";
                            qryvalues += "," + el.value;
                        }
                    }
                    qryoptions += "," + option;
                    qryvalues += "," + value;
                }
            }
            break;
    }
    //-------------------Rama Changes Begin------------------
    if (check != "") {
        PageMethods.QueryProducers(qryoptions, qryvalues, QueryProducers_Success, Fail);
    }

    //-------------------Rama Changes End------------------
}

function GetMap() {
    if (map) { map.DeleteAllShapes(); }
    var TexasLat = 31.386944444444445;
    var TexasLon = -99.17027777777778;
    var mapCenter = new VELatLong(TexasLat, TexasLon);
    var TexasZoomLvl = 6;
    
    //var layer2 = new VEShapeLayer();
    map = new VEMap('mapdiv');
    map.LoadMap();
    map.SetMapStyle(VEMapStyle.Hybrid);
    map.SetCenterAndZoom(mapCenter, TexasZoomLvl);
    map.EnableShapeDisplayThreshold(false);
    
    //draw all texas county's limits
    //if (countiesObj != null) 
    //{
    //    if (loadedDrawings == null) {
    //        loadedDrawings = new PolygonPlotter(map);
    //    }
    //    for (var x = 0; x < countiesObj.length; x++) 
    //    {
    //        var parts = countiesObj[x].coordinates.split(']');
    //        for (var i = 0; i < 1; i++) 
    //        {
    //            if (parts[i] != "") 
    //            {
    //                var part = parts[i].replace("[", "");
    //                var xy = new Array();
    //                var polytype = "coPolygon";
    //                xy = part.split('\n');

    //                countiesObj[x].mapID = loadedDrawings.LoadPolygon(xy, polytype);
    //            }
    //        }
    //    }
        
    //    //alert(countiesObj.length);
        
    //}
}

//Function to find an specific location in map (A.Birt Map.js)
function FindLoc() {
    var el = document.getElementById('findloc');
    if (el) {
        if (el.value == "") { return; }
        try {
            map.Find(null, el.value);
        }
        catch (e) {
            alert(e.message);
        }
    }
}

//change the view type, either table or map
function ChangeViewType() {
    //var el = document.getElementById('viewtype');
    //if (el) {
    //    if (el.innerHTML == "Table View") //switch to table view
    //    {
    //        el.innerHTML = "Map View";
    //        var mapdiv = document.getElementById('croplocdiv');
    //        if (mapdiv) {
    //            mapdiv.setAttribute('style', 'display:none');
    //        }
    //        CreateViewTable();
    //        tableview = true;
    //        var ahelp = document.getElementById('loadhelp');
    //        if (ahelp) {
    //            ahelp.removeAttribute('onclick');
    //            ahelp.setAttribute('onclick', 'Javascript:LoadHelpOverlay(8);');
    //        }
    //    }
    //    else //switch to map view
    //    {
    //        var div = document.getElementById("cropviewdiv");
    //        if (div) {
    //            div.setAttribute('style', 'display:none');
    //        }
    //        el.innerHTML = "Table View";
    //        var mapdiv = document.getElementById('croplocdiv');
    //        if (mapdiv) {
    //            mapdiv.setAttribute('style', 'display:block');
    //        }
            
    //        DeleteViewTable();
    //        tableview = false;
    //        var ahelp = document.getElementById('loadhelp');
    //        if (ahelp) {
    //            ahelp.removeAttribute('onclick');
    //            ahelp.setAttribute('onclick', 'Javascript:LoadHelpOverlay(7);');
    //        }
    //    }
    //}
}

function ChangeLocation(index) {
    if (croplocs) {
        locindex = index;
//        var centroid = croplocs[index].loccentroid.split(',');
//        map.SetCenterAndZoom(new VELatLong(parseFloat(centroid[0]), parseFloat(centroid[1])), 16);
        var polytype = "regPolygon";
        xy = croplocs[index].coordinates.split('\n');
        loadedDrawing = new PolygonPlotter(map);
        var shapeid = loadedDrawing.LoadPolygon(xy, polytype);
        croplocs[index].shapeid = shapeid;
        var shp = map.GetShapeByID(croplocs[index].shapeid);
        if (shp) {
            map.SetMapView(shp.GetPoints());
        }
    }
    ChangeViewType();
}

function CreateViewTable() 
{
    var div = document.getElementById("cropviewdiv");
    if (div && croplocs) {
        var table = document.createElement('table');
        table.setAttribute('class', 'tableview');
        var head = document.createElement('thead');
        var row = document.createElement('tr');
        var col = document.createElement('th');
        col.setAttribute('scope', 'col');
        col.setAttribute('class', 'tableview');
        col.setAttribute('style', 'width:30px;');
        col.innerHTML = '';
        row.appendChild(col);
        col = document.createElement('th');
        col.setAttribute('scope', 'col');
        col.setAttribute('class', 'tableview');
        col.innerHTML = 'Crop';
        row.appendChild(col);
        col = document.createElement('th');
        col.setAttribute('scope', 'col');
        col.setAttribute('class', 'tableview');
        col.setAttribute('style', 'width:40px;');
        col.innerHTML = 'Acres';
        row.appendChild(col);
        col = document.createElement('th');
        col.setAttribute('scope', 'col');
        col.setAttribute('class', 'tableview');
        col.setAttribute('style', 'width:60px;');
        col.innerHTML = 'Crop Year';
        row.appendChild(col);
        col = document.createElement('th');
        col.setAttribute('scope', 'col');
        col.setAttribute('class', 'tableview');
        col.setAttribute('style', 'width:40px;');
        col.innerHTML = 'County';
        row.appendChild(col);
        col = document.createElement('th');
        col.setAttribute('scope', 'col');
        col.setAttribute('class', 'tableview');
        col.setAttribute('style', 'width:30px;')
        col.innerHTML = 'Organic';
        row.appendChild(col);
        col = document.createElement('th');
        col.setAttribute('scope', 'col');
        col.setAttribute('class', 'tableview');
        col.setAttribute('style', 'width:70px;');
        col.innerHTML = '';
        row.appendChild(col);
        ////////append header row
        head.appendChild(row);
        table.appendChild(head);

        //now the table body
        var body = document.createElement('tbody');
        body.setAttribute('style', 'overflow-x:hidden; overflow-y:auto;');
        for (var x = 0; x < croplocs.length; x++) {

            var row = document.createElement('tr');
            var col = document.createElement('td');
            col.setAttribute('class', 'tableview');
            col.setAttribute('style', 'width:30px;');
            var bgdiv = document.createElement('div');
            var imgdiv = document.createElement('div');
            if (croplocs[x].planttype == "vegetables") {
                bgdiv.setAttribute('class', 'icon2');
            }
            else {
                bgdiv.setAttribute('class', 'icon1');
            }
            imgdiv.setAttribute('class', 'text');
            imgdiv.innerHTML = (x + 1);
            bgdiv.appendChild(imgdiv);
            //            col.innerHTML = x + 1;
            col.appendChild(bgdiv);
            row.appendChild(col);
            col = document.createElement('td');
            col.innerHTML = croplocs[x].croptype;
            row.appendChild(col);
            col = document.createElement('td');
            col.setAttribute('style', 'width:40px;');
            col.innerHTML = croplocs[x].acres;
            row.appendChild(col);
            col = document.createElement('td');
            col.setAttribute('style', 'width:60px;');
            col.innerHTML = croplocs[x].cropyear;
            row.appendChild(col);
            col = document.createElement('td');
            col.setAttribute('style', 'width:40px;');
            col.innerHTML = croplocs[x].county;
            row.appendChild(col);
            col = document.createElement('td');
            col.setAttribute('style', 'width:30px;')
            col.innerHTML = croplocs[x].organiccrops == "1" ? "Yes" : "No";
            row.appendChild(col);
            col = document.createElement('td');
            col.setAttribute('style', 'width:70px;');
            var a = document.createElement('a');
            var str = 'Javascript:ChangeLocation(' + x + ')';
            a.setAttribute('class', 'clickable');
            a.setAttribute('onclick', str);
            a.setAttribute('href', '#');
            a.innerHTML = "View in Map";
            col.appendChild(a);
            row.appendChild(col);
            body.appendChild(row);
        }
        table.appendChild(body);
        div.appendChild(table);
        div.setAttribute('style', 'display:block; height:500px; overflow-y:auto; overflow-x:hidden;');
    }
}

function DeleteViewTable() {
    var div = document.getElementById("cropviewdiv");
    if (div) {
        while (div.childNodes.length > 0) {
            div.removeChild(div.firstChild);
        }
    }
}

function Fail(val) {
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
        alert(val[1]);
    }
}
///Help overlay
function LoadHelpOverlay(opt) {
    var overlay = new HelpOverlay(document, opt);
    overlay.Create();
}
function CloseHelpOverlay() {
    var overlay = document.getElementById('overlay');
    var imgoverlay = document.getElementById('imagesoverlay');
    if (overlay) {
        document.body.removeChild(overlay);
        document.body.removeChild(imgoverlay);
    }
}