var map = null;
var locindex = -1;
var loadedDrawing = null;
var locedit = false;
var polyobj = null;
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
function init_producer() 
{

    if (serverval != null) 
    {
        user = serverval;
        GetMap();
        //CreateOptions('counties');
        box.message = "Loading crop locations....";
        box.CreateDialog(false);
        PageMethods.LoadUserLocations(user.email, LoadUserLocations_Success, Fail);
        
    }
    else 
    {
        var err = document.getElementById('error');
        if (err) {
            err.innerHTML = "No value from server";
            err.setAttribute('style', 'display:block; font-style: italic; color: Red;');
            setTimeout(hideError, 2000);
        }
    }
}


function LoadUserLocations_Success(val) {
    //GetMap();
    var el = document.getElementById('error');
    if (el) {
        if (val[0] == "0") {
            el.innerHTML = val[1];
            el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
            setTimeout(hideError, 2000);
            //alert(val[1]);
        }
    }
    if (val[0] == "1") //success data query
    {
        usrcroploc = JSON.parse(val[1]);
        if (usrcroploc.length > 0) //at least one location
        {
            ChangeFormProducer(2);
        }
        else //no locations
        {
            ChangeFormProducer(1);
        }
        
    }
    box.CloseDialog();
    parent.adjustFrameHeight();///adjust the height of the frame
}

function ChangeFormProducer(val) {

    if (val == 1)//no locations in database
    {
      
        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<h1>Register and Manage Your Crop Locations</h1>";
            el.innerHTML += "Welcome <b>" + user.firstname + " " + user.lastname + "</b>:</br>";
            el.innerHTML += "To include the location(s) of your crops in our listing click <b>'Add New Crop Location'</b>.</br>";
            el.innerHTML += "<br><H3>For more help please <a href = 'Javascript:SetHelp(2)'>click here</a></H3>";
         
        }
        //setup the map
        //GetMap();
    }
    else if (val == 2) //locations in database
    {
        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<h1>Register and Manage Your Crop Locations</h1>";
            el.innerHTML += "Welcome <b>" + user.firstname + " " + user.lastname + "</b>:</br><br>";
            el.innerHTML += "Add a new location by clicking  <b>'Add New Crop Location'</b>. Use the list of registered crops in the right hand panel to Zoom to a location (by clicking on the crop type). Edit a  location by clicking 'edit' next to any crop in the list. Use the map to hover over a location marker. The crop details you enter will be visible to registered pesticide applicators.</br></br>";
            el.innerHTML += "<br><H3>For more help please <a href = 'Javascript:SetHelp(2)'>click here</a></H3>";
            //var checkbox = document.createElement('input');
            //checkbox.setAttribute('type', 'checkbox');
            //checkbox.setAttribute('style', 'width:10px');
            //checkbox.setAttribute('checked', 'checked');
            //el.appendChild(checkbox);
            //var text = document.createElement('label');
            //text.innerHTML = "Notify me when I need to update my crops.";
            //el.appendChild(text);

        }
        //GetMap();
        /// Display all locations and details in form IM HERE!!!!!!!!!!!!!!
        if (usrcroploc != null)//populate with the first location by default.
        {
            CreateLocationsTable();
            var loadedDrawings = new PolygonPlotter(map);
            loadedDrawings.LoadMultiPolygons(usrcroploc, "crop");
        }
    }
}
function GetMap() 
{
    if (map) { map.DeleteAllShapes(); }
    var TexasLat = 31.386944444444445;
    var TexasLon = -99.17027777777778;
    var mapCenter = new VELatLong(TexasLat, TexasLon);
    var TexasZoomLvl = 6;
    map = new VEMap('mapdiv');
    map.LoadMap();
    map.SetMapMode(VEMapMode.Mode2D);
    map.SetMapStyle(VEMapStyle.Hybrid);
   // map.SetMapStyle(VEMapStyle.Aerial);
    map.SetCenterAndZoom(mapCenter, TexasZoomLvl);
    CreateLegend();
    
    
}


//Function to find an specific location in map (A.Birt Map.js)
function FindLoc() {
    var el = document.getElementById('findloc');
    if (el) 
    {
        if (el.value == "") { return; }
        try {
            map.Find(null, el.value);
        }
        catch (e) {
            alert(e.message);
        }
    }
}
function Fail(val) 
{
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
        alert(val[1]);
    }
}

var numberofitems = 10;
var itemoffset = 0;

function CreateLocationsTable() {
    var div = document.getElementById('list');
    if (div) 
    {
        div.innerHTML = "";
        var table = document.createElement('table');
        table.setAttribute('class', 'croplocslist');
        var row = document.createElement('tr');
        
        

        //row.appendChild(col);

      ////////append icons object
        table.appendChild(row);

        if (usrcroploc) {
            for (var x = 0; x < numberofitems; x++) {
                
                var row = document.createElement('tr');
                table.appendChild(row);
                    var col = document.createElement('td');
                    //col.setAttribute('colspan', '2');
                    //col.setAttribute('style', 'line-height:10px;');
                    row.appendChild(col);
                    
                    if (itemoffset + x < usrcroploc.length) {
                        var span = document.createElement('span');
                        var bgdiv = document.createElement('div');
                        var imgdiv = document.createElement('div');
                    

                    
                    if (usrcroploc[itemoffset + x].planttype == "Field Crops") {
                        imgdiv.className = "pushpinStyle_field";
                        imgdiv.style.top = '-3px';
                        }
                    else if (usrcroploc[itemoffset + x].planttype == "Honeybees") {
                        imgdiv.className = "pushpinStyle_bees";
                        imgdiv.style.top = '-3px';
                           
                        }
                        else if (usrcroploc[itemoffset + x].planttype == "Vegetables") {
                            imgdiv.className = "pushpinStyle_vegetables";
                            imgdiv.style.top = '-3px';
                           
                        }
                        else if (usrcroploc[itemoffset + x].planttype == "Fruits and Nuts") {
                            imgdiv.className = "pushpinStyle_nuts";
                            imgdiv.style.top = '-3px';
                            
                        }
                        else if (usrcroploc[itemoffset + x].planttype == "Greenhouse and Nursery") {
                            imgdiv.className = "pushpinStyle_nursery";
                            imgdiv.style.top = '-3px';
                           
                        }
                        else if (usrcroploc[itemoffset + x].planttype == "Forage, Grassland") {
                            imgdiv.className = "pushpinStyle_forage";
                            imgdiv.style.top = '-3px';
                        }
                        else {
                            imgdiv.className = "pushpinStyle_unknown";
                            imgdiv.style.top = '-3px';
                            
                        }
                        //imgdiv.setAttribute('class', 'text');
                        span.appendChild(imgdiv);
                        bgdiv.innerHTML = (itemoffset + x + 1);
                        bgdiv.setAttribute('class', 'text');
                        imgdiv.appendChild(bgdiv);
                        col.appendChild(span);

                        col = document.createElement('td');
                        row.appendChild(col);
                        
                        var a = document.createElement('a');
                        a.innerHTML = usrcroploc[itemoffset + x].croptype;
                        a.setAttribute('class', 'clickable');
                        a.setAttribute('onclick', 'Javascript:ChangeLocation(' + (itemoffset + x) + ');');
                        //a.setAttribute('style', 'left:20px; top:-10px; position:relative;');
                        col.appendChild(a);
                        
                        //col.appendChild(span);
                        ///edit control
                        col = document.createElement('td');
                        row.appendChild(col);
                        var aedit = document.createElement('a');
                        aedit.innerHTML = 'Edit';
                        aedit.setAttribute('class', 'rctlr');
                        aedit.setAttribute('onclick', 'Javascript:GoNewCrop("edit=' + usrcroploc[itemoffset + x].id + '");');
                        //aedit.setAttribute('style', 'top:-10px; position:relative;');
                        col.appendChild(aedit);
                    }
            }      
        }
        div.appendChild(table);
        //////now create a div with page numbers
        CreateCropPagination();
    }
}

function CreateLegend() {
    var div = document.getElementById('legend');
    if (div) {
        div.innerHTML = "";
        div.style.textAlign = "center";
        
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
        label.innerHTML = "&nbsp;Honeybees&nbsp;&nbsp;&nbsp;";
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
        label.innerHTML = "&nbsp;Fruits and Nuts&nbsp;&nbsp;&nbsp;";
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
        label.innerHTML = "&nbsp;Field Crops&nbsp;&nbsp;&nbsp;";
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
        label.innerHTML = "&nbsp;Nursery and Greenhouse&nbsp;&nbsp;&nbsp;<br>";
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
        label.innerHTML = "&nbsp;Forage and Grass&nbsp;&nbsp;&nbsp;";
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
        label.innerHTML = "&nbsp;Vegetables&nbsp;&nbsp;&nbsp;";
        span.appendChild(label);
        div.appendChild(span);

    }
}

function CreateCropPagination() {
    var div = document.getElementById('croppagination');
    if (div) {
        div.innerHTML = "";
        var numberoftables = (usrcroploc.length / numberofitems);
        if (numberoftables < 1) {
            numberoftables = 1;
        }
        var span = document.createElement('span');
        span.innerHTML = "Page: ";
        div.appendChild(span);
        for (var x = 0; x < numberoftables; x++) {
            var a = document.createElement('a');
            a.innerHTML = x + 1;
            a.setAttribute('href', "Javascript:ChangeCropTable(" + x + ")");
            var span = document.createElement('span');
            span.innerHTML = " | ";
            div.appendChild(a);
            if (x < numberoftables - 1) {
                div.appendChild(span);
            }

        }
    }

}

function ChangeCropTable(page) {
    itemoffset = page * numberofitems;
    CreateLocationsTable();


}


function ChangeLocation(index) 
{
    if (usrcroploc) 
    {
        locindex = index;
        var centroid = usrcroploc[index].loccentroid.split(',');
        if (usrcroploc[index].shapeid) {
            var shp = map.GetShapeByID(usrcroploc[index].shapeid);
            if (shp) {
                   map.SetMapView( shp.GetPoints());
            }
        }
       
    } 
}

function DisableElements(type) {
    var typeelements = document.getElementsByTagName(type);
    for (var child = 0; child < typeelements.length; child++) {
        if (typeelements[child].type == 'text' || typeelements[child].type == 'button' || typeelements[child].type == 'textarea' || typeelements[child].type == 'select-one' || typeelements[child].type == 'checkbox') 
        {
            typeelements[child].setAttribute('disabled', 'disabled');
        }
    }
}

function DisableAll() 
{
    DisableElements('input');
    DisableElements('textarea');
    DisableElements('select');
}
function EnableElements(type) {
    var typeelements = document.getElementsByTagName(type);
    for (var child = 0; child < typeelements.length; child++) {
        if (typeelements[child].type == 'text' || typeelements[child].type == 'button' || typeelements[child].type == 'textarea' || typeelements[child].type == 'select-one' || typeelements[child].type == 'checkbox') {
            typeelements[child].removeAttribute('disabled');
        }
    }
}
function EnableAll() {
    EnableElements('input');
    EnableElements('textarea');
    EnableElements('select');
}

function hideError() {
    var el = document.getElementById('error');
    if (el) {
        el.setAttribute('style', 'display:none;');
    }
}

///Help overlay
function LoadHelpOverlay() {
    var overlay = new HelpOverlay(document, 3);
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