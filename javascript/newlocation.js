var map = null;
var areaindex = -1;
var loadedDrawing = null;
var areaedit = false;
var areaadd = false;
var polyobj = null;
var box = new DialogBox();

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
function init_newarea() {

    if (serverval != null) 
    {
        user = serverval;
        CreateOptions('acounties', 'add');
        var parameters = location.search.substring(1);
        if (parameters != "" || parameters != "add") {
            var pos = parameters.indexOf('=');
            if (pos > 0) {
                areaid = parseInt(parameters.substring(pos + 1));
            }
            else { areaid = -1; }
        }

        
        if (areaid <0) {
            
            ChangeForm(1);
        }
        else {
            PageMethods.LoadUserAppArea(areaid, LoadUserAreas_Success, Fail);
            ChangeForm(2);
            
        }
    }
    else {
        var err = document.getElementById('error');
        if (err) {
            err.innerHTML = "No value from server";
            err.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
            setTimeout(hideError, 2000);
        }
    }
}

function DeleteAppArea() {
    //alert('');
    var email = user.email;
    var locid = usrapparea.id;
    PageMethods.DeleteArea(email, locid, DeleteAppArea_Success, Fail);
    
   
}

function DeleteAppArea_Success(val)
{
 //  alert('Success');
//    areaadd = true;
    //    PageMethods.LoadUserAreas(user.email, LoadUserAreas_Success, Fail);
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
        setTimeout(hideError, 2000);
        //alert(val[1]);
    }
    areaadd = false;
    setTimeout(GoApplicator, 500);
    
}


function LoadUserAreas_Success(val) {
    var el = document.getElementById('error');
    if (el) {
        if (val[0] == "0" ) {
            el.innerHTML = val[1];
            el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
            setTimeout(hideError, 2000);
            //alert(val[1]);
            return;
        }
    }
    if (val[0] == "1")//load location 
    {
        if (val[1] == 'null') { //new form
            ///error ///go back to original page??
            return;

        }
        else {
            usrapparea = JSON.parse(val[1]);
            ChangeForm(2);///edit form
            areaedit = true; //set to editable
        }

    }
    box.CloseDialog();
    
}

function ChangeForm(val) {
    var el = document.getElementById('countyselected');
    if (el) {
        el.setAttribute('disabled', 'disabled');
    }
    el = document.getElementById('acres');
    if (el) {
        el.setAttribute('disabled', 'disabled');
    }
    if (val == 1)//adding a new location
    {
        //set first time description or add 
        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<b>Add New Area Instructions</b>:</br>";
            el.innerHTML += "To include the area(s) of your applications in our listing complete the form and click <b>“submit.”</b></br>";
            el.innerHTML += "With the map on the right, you can use the mouse wheel to zoom in and out, you can also pan to a specific area of interest by holding the right mouse button. </br>";
            el.innerHTML += "Once you have your region on view, use your mouse to outline your field boundaries by left clicking points along the perimeter of your application area and right clicking when you are done.";

        }
        //areaedit = true; //set to editable
        CreateNewAppArea();
        PopulateForm();
        var el = document.getElementById('areasvcdiv');
        if (el) {
            el.setAttribute('style', 'display:block;');
            
        }
        var deletebtn = document.getElementById('deletebtn');
        if (deletebtn) {

            deletebtn.style.display = "none";
        }
        
    }
    else if (val == 2) //locations in database so edit
    {
        
        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<b>Edit Area Instructions</b>:</br>";
            if (areaadd) {
                el.innerHTML += "You can edit your area by clicking <b>'Edit'</b> on the right side.</br>";
            }
            el.innerHTML += "With the map on the right, you can use the mouse wheel to zoom in and out, you can also pan to a specific area of interest by holding the right mouse button. </br>";
            el.innerHTML += "Once you have your region on view, use your mouse to outline your field boundaries by left clicking points along the perimeter of your application area and right clicking when you are done.";
            el.innerHTML += "When done click <b>“submit.”</b></br>";
        }
        //setup map
        GetMap();
        /// Display all locations and details in form 
        if (usrapparea != null)//populate with the first location by default.
        {
            PopulateForm();
                var el = document.getElementById('areasvcdiv');
                if (el) {
                    el.setAttribute('style', 'display:block;');
                }
                var el = document.getElementById('backbuttondiv');
                if (el) {
                    el.setAttribute('style', 'display:none;');
                }
                
        }
    }
}
function GetMap() {
    if (map) { map.DeleteAllShapes(); }
    var TexasLat = 31.386944444444445;
    var TexasLon = -99.17027777777778;
    var mapCenter = new VELatLong(TexasLat, TexasLon);
    var TexasZoomLvl = 6;
    map = new VEMap('mapdiv');
    map.LoadMap();
    map.SetMapStyle(VEMapStyle.Hybrid);
    map.SetCenterAndZoom(mapCenter, TexasZoomLvl);
}



function SubmitNewAppArea() {
    var err = document.getElementById('error');
    err.innerHTML = '';
    var errflag = 0;
    var apparea = new AppArea();
    if (usrapparea) {
        apparea.usremail = user.email;
        apparea.id = usrapparea.id;
    }
    else {
        apparea.usremail = 'new apparea';
        apparea.id = '-1';
    }
    apparea.county = document.getElementById('countyselected').value;
    apparea.acres = document.getElementById('acres').value;
    apparea.appareaname = document.getElementById('appareaname').value;
    apparea.pesticidename = document.getElementById('pesticide').value;
    apparea.comment = document.getElementById('comments').value;
    apparea.comment = apparea.comment.replace(/'/g, "''");
    apparea.appareaname = apparea.appareaname.replace(/'/g, "''");
    if (polyobj != null) {
        //apparea.coordinates = document.getElementById('coordinates').value;
        apparea.coordinates = polyobj.coordinates;
        apparea.areacentroid = polyobj.centroid.Latitude + "," + polyobj.centroid.Longitude;
        apparea.buffercoords = polyobj.buffercoords;
    }
    else if (usrapparea == null) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please create your Application area.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;

    }
    else {
        apparea.coordinates = usrapparea.coordinates;
        apparea.areacentroid = usrapparea.areacentroid;
        apparea.buffercoords = usrapparea.buffercoords;
    }
    //apparea.producersloc = usrapparea[areaindex].producersloc;

    /////validation
    if (apparea.acres.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter Number of Acres.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }
    if (apparea.appareaname.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter a name to identify this area.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }
    if (apparea.acres > 2000) {
        var err = document.getElementById('error');
        err.innerHTML = 'Application Area too big. Please redraw';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }
    if (apparea.coordinates.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please create your Application area.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }
    var str = JSON.stringify(apparea);
    if (errflag == 0) {
        box.message = "Saving your application area...";
        box.CreateDialog();
        if (!usrapparea) {
            ///save a new area
            PageMethods.AddNewApplicationArea(str, apparea.usremail, AddNewArea_Success, Fail);
        }
        else {
            //CancelEditAppArea();
            ///edit an area - ie update the old area and set deleted flag, then create a new one
            PageMethods.EditApplicationArea(str, apparea.usremail, AddNewArea_Success, Fail);
        }
    }
}

function AddNewArea_Success(val) {
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
        setTimeout(hideError, 2000);
        //alert(val[1]);
    }
    if (val[0] == "1") {
        var el = document.getElementById('submit1');
        if (el) {
            el.setAttribute('disabled', 'true');
        }
        areaadd = true;
        
    }
    box.CloseDialog();
    ///go back to applicators page
    setTimeout(GoApplicator, 500);
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
            //alert(e.message);
        }
    }
}
function Fail(val) {
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;font-size: 16px');
        //alert(val[1]);
    }
}

function LookUpCounty() {
    if (polyobj != null) {

        PageMethods.GetCounty(polyobj.coordinates, LookUpCounty_Success);
    }

}
function LookUpCounty_Success(val) {
    if (val[0] == '1') {
        var el = document.getElementById('countyselected');
        el.value = val[1];
    }

}


function CreateNewAppArea() {
    document.getElementById('acounties').value = "--Select county--";
    document.getElementById('acres').value = "";
    //document.getElementById('licensenum').value = "";
    document.getElementById('comments').value = "";
    document.getElementById('pesticide').value = "";
    polyobj = null;
    GetMap();
    
}

function CancelNewAppArea() {
    parent.GoApplicator();
}

function EditAppArea() {
    if (areaindex != -1) 
    {
        EnableAll();
        var el = document.getElementById('countyselected');
        if (el) {
            el.setAttribute('disabled', 'disabled');
        }
        el = document.getElementById('acres');
        if (el) {
            el.setAttribute('disabled', 'disabled');
        }
        if (loadedDrawing) {
            loadedDrawing.EnablePolygon();
        }
        areaedit = true;
        var el = document.getElementById('areasvcdiv');
        if (el) {
            el.setAttribute('style', 'display:block;');
        }
       
    }
}
function CancelEditAppArea() {

    if (loadedDrawing) {
        loadedDrawing.DisablePolygon();
    }
    //ChangeArea(areaindex);
    areaedit = false;
    
    var el = document.getElementById('areasvcdiv');
    if (el) {
        el.setAttribute('style', 'display:none;');
    }
    //send the user back to mani page
    if (areaedit) {
        setTimeout(GoApplicator, 500);
        areaedit = false;
    }
    else {
        setTimeout(GoApplicator, 500);
        areaadd = false;
    }

}

function PopulateForm() {

    if (usrapparea)
    {
            document.getElementById('countyselected').value = usrapparea.county;
            document.getElementById('acres').value = usrapparea.acres;
            //document.getElementById('licensenum').value = usrapparea[index].license;
            document.getElementById('pesticide').value = usrapparea.pesticidename;
            document.getElementById('comments').value = usrapparea.comment;
            document.getElementById('appareaname').value = usrapparea.appareaname;
            //document.getElementById('coordinates').value = usrapparea[index].coordinates;
        try{
            var xy = new Array();
            var polytype = "regPolygon";
            xy = usrapparea.coordinates.split('\n');
            loadedDrawing = new PolygonPlotter(map);
            var shapeid = loadedDrawing.LoadPolygon(xy, polytype);
            usrapparea.shapeid = shapeid;
            var shp = map.GetShapeByID(usrapparea.shapeid);
            if (shp) {
                map.SetMapView(shp.GetPoints());
            }
        }
        catch (ex)
        { }
    }



}

//function ChangeArea() {
//    if (usrapparea) {
//        if (index != -1) {
//            areaindex = index;
//            var el = document.getElementById('list-nav');
//            if (el) {
//                for (var x = 0; x < el.childNodes.length; x++) {
//                    if (x == index) {
//                        el.childNodes[x].childNodes[0].style.background = 'Black';
//                    }
//                    else {
//                        el.childNodes[x].childNodes[0].style.background = 'Gray';
//                    }

//                }
//            }
            
//            document.getElementById('countyselected').value = usrapparea[index].county;
//            document.getElementById('acres').value = usrapparea[index].acres;
//            //document.getElementById('licensenum').value = usrapparea[index].license;
//            document.getElementById('pesticide').value = usrapparea[index].pesticidename;
//            document.getElementById('comments').value = usrapparea[index].comment;
//            //document.getElementById('coordinates').value = usrapparea[index].coordinates;

//            DisableAll();
//            var xy = new Array();
//            var polytype = "regPolygon";
//            xy = usrapparea[index].coordinates.split('\n');
//            loadedDrawing = new PolygonPlotter(map);
//            //loadedDrawings.LoadMultiPolygons(usrcroploc, polytype);
//           var shapeid = loadedDrawing.LoadPolygon(xy, polytype);
//           usrapparea[index].shapeid = shapeid;
//           var shp = map.GetShapeByID(usrapparea[index].shapeid);
//           if (shp) {
//               map.SetMapView(shp.GetPoints());
//           }
//        }
//        else {
//            areaedit = false;
//            areaadd = false;
//            CreateNewAppArea();
//        }
//    }
//}

function DisableElements(tag, type) {
    var typeelements = document.getElementsByTagName(tag);
    if (type == "All") {
        for (var child = 0; child < typeelements.length; child++) {
            if (typeelements[child].type == 'text' || typeelements[child].type == 'button' || typeelements[child].type == 'textarea' || typeelements[child].type == 'select-one' || typeelements[child].type == 'checkbox') {
                typeelements[child].setAttribute('disabled', 'disabled');
            }
        }
    }
    else {
        for (var child = 0; child < typeelements.length; child++) {
            if (typeelements[child].type == type) {
                typeelements[child].setAttribute('disabled', 'disabled');
            }
        }
    }
}

function DisableAll() {
    DisableElements('input', 'All');
    DisableElements('textarea', 'All');
    DisableElements('select', 'All');
}
function EnableElements(tag, type) {
    var typeelements = document.getElementsByTagName(tag);
    if (type == "All") {
        for (var child = 0; child < typeelements.length; child++) {
            if (typeelements[child].type == 'text' || typeelements[child].type == 'button' || typeelements[child].type == 'textarea' || typeelements[child].type == 'select-one' || typeelements[child].type == 'checkbox') {
                typeelements[child].removeAttribute('disabled');
            }
        }
    }
    else {
        for (var child = 0; child < typeelements.length; child++) {
            if (typeelements[child].type == type) {
                typeelements[child].removeAttribute('disabled');
            }
        }
    }
}
function EnableAll() {
    EnableElements('input', 'All');
    EnableElements('textarea', 'All');
    EnableElements('select', 'All');
}

function hideError() {
    var el = document.getElementById('error');
    if (el) {
        el.setAttribute('style', 'display:none;');
    }
}
///Help overlay
function LoadHelpOverlay() {
    var overlay = new HelpOverlay(document, 6);
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