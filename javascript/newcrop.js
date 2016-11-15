var map = null;
var locindex = -1;
var locid = -1;
var loadedDrawing = null;
var locedit = false;
var locadd = false;
var polyobj = null;
var box = new DialogBox();
///arrays for crop selection
var Fieldcrops = new Array();
var Honeybees = new Array();
var Vegetables = new Array();
var FruitsandNuts = new Array();
var GreenhouseandNursery = new Array();
var Forage = new Array();
var Fallow = new Array();
var croptypes = new Array();



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

function GetCropIndex(cropid) {
    locindex = -1;
    if (usrcroploc)
    {
        if (cropid != -1) {
            for (var x = 0; x < usrcroploc.length; x++) {
                if (usrcroploc[x].id == cropid) {
                    locindex = x;
                }
            }
            if (locindex == -1) {
                //Alert("Can not find Crop");
                ///return to producers
            }
        }
    }

}
function init_newcrop() {

    if (serverval != null) {
        user = serverval;
        CreateOptions('counties', 'add');
        var parameters = location.search.substring(1);
        if (parameters != "" || parameters != "add") {
            var pos = parameters.indexOf('=');
            if (pos > 0) {
                locid = parseInt(parameters.substring(pos + 1));
            }
            else { locid = -1; }
        }
        InitializeCropInfo();
        PageMethods.LoadUserLocations(user.email, LoadUserLocations_Success, Fail);
    }
    else {
        var err = document.getElementById('error');
        if (err) {
            err.innerHTML = "No value from server";
            err.setAttribute('style', 'display:block; font-style: italic; color: Red;');
            setTimeout(hideError, 2000);
        }
    }
}

function LookUpCounty()
{
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


function LoadUserLocations_Success(val) {
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
            GetCropIndex(locid);///sets the index of the crop we are interested in (from the array of crops). WHY did someone program an array to be returned???!!!!
            if (locadd || locindex != -1) { ChangeFormProducer(2); }
            else { ChangeFormProducer(1); }
        }
        else //no locations
        {
            ChangeFormProducer(1);
        }

    }
}

function ChangeFormProducer(val) {

    if (val == 1)//no locations in database
    {

        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<b>Add New Crop Instructions</b>:</br>";
            el.innerHTML += "To include the location(s) of your crops in our listing complete the form, draw your location and click <b>“Submit.”</b></br>";
            el.innerHTML += "With the map on the right, you can use the mouse wheel to zoom in and out, you can also pan to a specific area of interest by holding the right mouse button. </br>";
            el.innerHTML += "Once you have your region on view, use your mouse to outline your field boundaries by left clicking points along the perimeter of your crop location and right clicking when you are done.";
        }
        CreateNewLocation();
        var el = document.getElementById('locsvcdiv');
        if (el) {
            el.setAttribute('style', 'display:block;');
        }
//        polyobj = null;
//        GetMap();
//        var drawing = new DrawingTools(map);
//        drawing._geomType = "polygon";
//        drawing.Draw("polygon");


    }
    else if (val == 2) //locations in database
    {
        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<b>Edit Crop Instructions</b>:</br>";
            if (locadd) {
                el.innerHTML += "You can edit your location by clicking <b>'Edit'</b> on the right side.</br>";
            }
            el.innerHTML += "With the map on the right, you can use the mouse wheel to zoom in and out, you can also pan to a specific area of interest by holding the right mouse button. </br>";
            el.innerHTML += "Once you have your region on view, use your mouse to outline your field boundaries by left clicking points along the perimeter of your crop location and right clicking when you are done.";
            el.innerHTML += "When done click <b>“Submit.”</b></br>";
        }
        GetMap();
        
        if (usrcroploc != null)
        {
            if (locadd == true) {
                ChangeLocation(usrcroploc.length - 1);
                var el = document.getElementById('locsvcdiv');
                if (el) {
                    el.setAttribute('style', 'display:none;');
                }
                var el = document.getElementById('backbuttondiv');
                if (el) {
                    el.setAttribute('style', 'display:block;');
                }
            }
            else {//loc add = false
                ChangeLocation(locindex);
                EditLocation();
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



function SubmitNewLocation() {

    var err = document.getElementById('error');
    err.innerHTML = '';
    var errflag = 0;
    var croploc = new Location();
    croploc.usremail = user.email;
//    if (usrcroploc && !locedit) {
//        var id = parseInt(usrcroploc[(usrcroploc.length) - 1].id);
//    croploc.id = id + 1; }
    if (locedit) { croploc.id = usrcroploc[locindex].id; }
//    else { croploc.id = 1; }
    croploc.planttype = document.getElementById('planttype').value;
    //alert(croploc.planttype);
    croploc.croptype = document.getElementById('croptype').value;
    croploc.cropyear = document.getElementById('cropyear').value;
    croploc.comment = document.getElementById('comments').value;
    croploc.comment = croploc.comment.replace(/'/g, "''");
    //-------------------Rama Changes begin --------------------------
    croploc.county = document.getElementById('countyselected').value;
    //-------------------Rama Changes end ----------------------------
    if (polyobj != null) {
        //croploc.coordinates = document.getElementById('coordinates').value;
        croploc.coordinates = polyobj.coordinates;
        croploc.loccentroid = polyobj.centroid.Latitude.toFixed(4) + "," + polyobj.centroid.Longitude.toFixed(4);
    }
    else if (locedit)
    {
        croploc.coordinates = usrcroploc[locindex].coordinates;
        croploc.loccentroid = usrcroploc[locindex].loccentroid;
    }

    croploc.acres = document.getElementById('acres').value;
  //  croploc.organiccrops = document.form1.organic_check.checked ? 1 : 0;
    var isitorganic = document.getElementById('organic_check').checked;
    if (isitorganic == true) {
        croploc.organiccrops = 1;
    }
    else{
        croploc.organiccrops = 0;
     }
    //croploc.certifier = document.getElementById('certifier').value;



    /////validation
    if (croploc.planttype.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter a valid Plant Type.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }

    //Validation for crop type by shalini tharavanat
    if (croploc.croptype.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter a valid Crop Type.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }


    if (croploc.cropyear.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please enter a Crop Year.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }
    if (croploc.acres > 2000) {
        var err = document.getElementById('error');
        err.innerHTML = 'Field size too big. Please redraw.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;font-size: 16px');
        errflag = 1;
    }


//    if (croploc.organiccrops == 1 && croploc.certifier.length == 0) {
//        var err = document.getElementById('error');
//        err.innerHTML = 'Please enter Certified By.';
//        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
//        errflag = 1;
//    }
    if (croploc.coordinates.length == 0) {
        var err = document.getElementById('error');
        err.innerHTML = 'Please create your Crop Location.';
        err.setAttribute('style', 'display:block;font-style: italic; color: Red;');
        errflag = 1;
    }
    var str = JSON.stringify(croploc);
    if (errflag == 0) {
        if (!locedit) {
            //alert("Add");
            box.message = "Adding crop location....<br>Informing applicators...";
            box.CreateDialog(false);
            //box.message = "Adding Crop Location to Registry....";
            PageMethods.AddNewLocation(str, croploc.usremail, AddNewLocation_Success, Fail);
        }
        else {
            //alert("Edit");
            box.message = "Modifying crop location....<br>Informing applicators...";
            box.CreateDialog(false);
            
            PageMethods.EditLocation(str, croploc.usremail, AddNewLocation_Success, Fail);
        }
    }
}
function DeleteLocation() {

    ///get email of user
    if (locindex < usrcroploc.length && locindex > -1) {
        var cropid = usrcroploc[locindex].id;
        PageMethods.DeleteLocation(user.email, cropid, DeleteLocation_Success, Fail);
    }

}

function DeleteLocation_Success(val) {
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
        setTimeout(hideError, 2000);
        //alert(val[1]);
    }
    if (val[0] == "1") {
        //alert("Location added");
        var el = document.getElementById('submit1');
        if (el) {
            el.setAttribute('disabled', 'true');
        }
   //     locadd = true;
        //   PageMethods.LoadUserLocations(user.email, LoadUserLocations_Success, Fail);

        setTimeout(GoProducer, 500);
    }
    else {
        //alert("Failed");
    }


}


function AddNewLocation_Success(val) {
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
        setTimeout(hideError, 2000);
        //alert(val[1]);
    }
    if (val[0] == "1") {
        //alert("Location added");
        var el = document.getElementById('submit1');
        if (el) {
            el.setAttribute('disabled', 'true');
        }
        locadd = true;
        box.CloseDialog();
        setTimeout(GoProducer, 500);
        //PageMethods.LoadUserLocations(user.email, LoadUserLocations_Success, Fail);
    }
    else {
        //alert("Failed");
    }
    
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
function Fail(val) {
    var el = document.getElementById('error');
    if (el) {
        el.innerHTML = val[1];
        el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
        alert(val[1]);
    }
}

function CreateNewLocation() {
    document.getElementById('planttype').value = "";
    var select = document.getElementById('croptype');
    if (select) {
        select.setAttribute('style', 'visibility: hidden; display: none;');
        select.innerHTML = "";
    }
    var date = new Date();
    var el = document.getElementById('cropyear');
    if (el)
    {
        el.setAttribute("disabled", "disabled");
        el.value = date.getFullYear();
        
    }
    document.getElementById('comments').value = "";
    document.getElementById('counties').value = "--Select county--";
    //document.getElementById('coordinates').value = "";
    document.getElementById('acres').value = "";
    document.getElementById('organic_check').checked = false;
    //document.getElementById('certifier').value = "";
    
    polyobj = null;
    GetMap();
    //var drawing = new DrawingTools(map);
    //drawing._geomType = "polygon";
    //drawing.Draw("polygon");
    var deletebtn = document.getElementById('deletebtn');
    if (deletebtn) {
        deletebtn.style.display = 'none';
    }
    
    //document.getElementById('certifier').disabled = "disabled";
}

function CancelNewLocation() {
    //ChangeFormProducer(1);
    parent.GoProducer();

}
function EditLocation() {
    if (locindex != -1) 
    {
        var deletebtn = document.getElementById('deletebtn');
        if (deletebtn) {
            deletebtn.style.display = 'inline';
        }
        EnableAll();
        var el = document.getElementById('cropyear');
        if (el) {
            el.setAttribute('disabled', 'disabled');
        }
        var el = document.getElementById('acres');
        if (el) {
            el.setAttribute('disabled', 'disabled');
        }
        var el = document.getElementById('countyselected');
        if (el) {
            el.setAttribute('disabled', 'disabled');
        }
        
        if (loadedDrawing) {
            loadedDrawing.EnablePolygon();
        }
        locedit = true;
        var el = document.getElementById('locsvcdiv');
        if (el) {
            el.setAttribute('style', 'display:block;');
        }
        var el = document.getElementById('backbuttondiv');
        if (el) {
            el.setAttribute('style', 'display:none;');
        }
    }
}
function CancelEditLocation() {

    if (loadedDrawing) {
        loadedDrawing.DisablePolygon();
    }
    ChangeLocation(locindex);
    
    var el = document.getElementById('locsvcdiv');
    if (el) {
        el.setAttribute('style', 'display:none;');
    }
    //send the user back to the main page
    if (locedit) {
        setTimeout(GoProducer, 500);
        locedit = false;
    }
    else {
        locadd = false;
        setTimeout(GoProducer, 500);
//        var el = document.getElementById('backbuttondiv');
//        if (el) 
//        {
//            el.setAttribute('style', 'display:block;');
//        }
       
    }
    
    
    

}

function ChangeLocation(cropid) {
    if (usrcroploc) {
        index = locindex;
        
        //locindex = index;
        //var el = document.getElementById('list-nav');
        //if (el) {
        //    for (var x = 0; x < el.childNodes.length; x++) {
        //        if (x == index) {
        //            el.childNodes[x].childNodes[0].style.background = 'Black';
        //        }
        //        else {
        //            el.childNodes[x].childNodes[0].style.background = 'Gray';
        //        }

        //    }
        //}

        //document.getElementById('planttype').value = usrcroploc[index].planttype;
        //CreateOptions(usrcroploc[index].planttype, 'add');
        //document.getElementById('croptype').innerHTML = usrcroploc[index].croptype;
        if (index < usrcroploc.length && index > -1) {
            SetCropOptions(usrcroploc[index].planttype, usrcroploc[index].croptype);
            document.getElementById('cropyear').value = usrcroploc[index].cropyear;
            document.getElementById('comments').value = usrcroploc[index].comment;
            document.getElementById('counties').value = usrcroploc[index].county;
            document.getElementById('countyselected').value = usrcroploc[index].county;
            //document.getElementById('coordinates').value = usrcroploc[index].coordinates;
            document.getElementById('acres').value = usrcroploc[index].acres;
            if (usrcroploc[index].organiccrops == 1) {
                document.getElementById('organic_check').checked = true;
            }

            //document.getElementById('certifier').value = usrcroploc[index].certifier;
            DisableAll();

            var xy = new Array();
            var polytype = "regPolygon";
            xy = usrcroploc[index].coordinates.split('\n');
            loadedDrawing = new PolygonPlotter(map);
            var shapeid = loadedDrawing.LoadPolygon(xy, polytype);
            usrcroploc[index].shapeid = shapeid;
            var shp = map.GetShapeByID(usrcroploc[index].shapeid);
            if (shp) {
                map.SetMapView(shp.GetPoints());
            }
        }
        else {
            locedit = false;
            locadd = false;
            CreateNewLocation();
        }
    }
    }


function DisableElements(type) {
    var typeelements = document.getElementsByTagName(type);
    for (var child = 0; child < typeelements.length; child++) {
        if (typeelements[child].type == 'text' || typeelements[child].type == 'button' || typeelements[child].type == 'textarea' || typeelements[child].type == 'select-one' || typeelements[child].type == 'checkbox') {
            typeelements[child].setAttribute('disabled', 'disabled');
        }
    }
}

function DisableAll() {
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
    var overlay = new HelpOverlay(document, 4);
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

function InitializeCropInfo() {


    croptypes.push("Field Crops");
    croptypes.push("Honeybees");
    croptypes.push("Vegetables");
    croptypes.push("Fruits and Nuts");
    croptypes.push("Greenhouse and Nursery");
    croptypes.push("Forage, Grassland");
    //croptypes.push("Fallow");
    var sel = document.getElementById('planttype');
    if (sel) {
        for (var x = 0; x < croptypes.length; x++) {
            var opt = document.createElement('option');
            opt.value = croptypes[x];
            opt.innerHTML = croptypes[x];
            sel.appendChild(opt);
        }
    }


    Fieldcrops.push('Barley');
    Fieldcrops.push('Beans, dry');
    Fieldcrops.push('Biofuels, sorghums, switchgrass, oilseeds, etc.');
    Fieldcrops.push('Canola/rapeseed');
    Fieldcrops.push('Castor');
    Fieldcrops.push('Corn');
    Fieldcrops.push('Cotton');
    Fieldcrops.push('Guar');
    Fieldcrops.push('Millets');
    Fieldcrops.push('Mungbeans');
    Fieldcrops.push('Oats ');
    Fieldcrops.push('Peanuts');
    Fieldcrops.push('Peas, dry');
    Fieldcrops.push('Rice');
    Fieldcrops.push('Rye');
    Fieldcrops.push('Safflower');
    Fieldcrops.push('Sesame');
    Fieldcrops.push('Sorghum');
    Fieldcrops.push('Soybeans');
    Fieldcrops.push('Sugarcane');
    Fieldcrops.push('Sugar beets');
    Fieldcrops.push('Sunflower');
    Fieldcrops.push('Wheat');
    Fieldcrops.push('Fallow');



    FruitsandNuts.push('Almonds');
    FruitsandNuts.push('Apples');
    FruitsandNuts.push('Apricots');
    FruitsandNuts.push('Avocados');
    FruitsandNuts.push('Bananas');
    FruitsandNuts.push('Blackberries/dewberries');
    FruitsandNuts.push('Blueberries ');
    FruitsandNuts.push('Cherries');
    FruitsandNuts.push('Chestnuts');
    FruitsandNuts.push('Figs');
    FruitsandNuts.push('Grapefruit');
    FruitsandNuts.push('Grapes-wine (Vinifera)');
    FruitsandNuts.push('Grapes-other');
    FruitsandNuts.push('Guavas');
    FruitsandNuts.push('Hazelnuts (Filberts) ');
    FruitsandNuts.push('Kumquats');
    FruitsandNuts.push('Lemons');
    FruitsandNuts.push('Limes');
    FruitsandNuts.push('Mangoes');
    FruitsandNuts.push('Nectarines');
    FruitsandNuts.push('Olives');
    FruitsandNuts.push('Oranges');
    FruitsandNuts.push('Papayas');
    FruitsandNuts.push('Peaches');
    FruitsandNuts.push('Pears');
    FruitsandNuts.push('Pecans');
    FruitsandNuts.push('Persimmons');
    FruitsandNuts.push('Pistachios');
    FruitsandNuts.push('Plumes ');
    FruitsandNuts.push('Pomegranates');
    FruitsandNuts.push('Raspberries');
    FruitsandNuts.push('Strawberries');
    FruitsandNuts.push('Tangelos');
    FruitsandNuts.push('Tangerines');
    FruitsandNuts.push('Walnuts');
    FruitsandNuts.push('Other ');
    



    GreenhouseandNursery.push('Bedding plants');
    GreenhouseandNursery.push('Container nursery');
    GreenhouseandNursery.push('Flowering plants');
    GreenhouseandNursery.push('Foliage plants');
    GreenhouseandNursery.push('Turf/Sod');
    GreenhouseandNursery.push('Vegetables-greenhouse');
    GreenhouseandNursery.push('Other');
    GreenhouseandNursery.push('Fallow');



    Forage.push('Alfalfa');
    Forage.push('Austrian winter pea');
    Forage.push('Bahia grass');
    Forage.push('Bermuda grass');
    Forage.push('Forage sorghum');
    Forage.push('Kline grass');
    Forage.push('Native grasses');
    Forage.push('Prairie hay');
    Forage.push('Ryegrass');
    Forage.push('Seed crops, field and grass ');
    Forage.push('Small grain hay');
    Forage.push('Sorghum sudangrass');
    Forage.push('Other grass hay');
    Forage.push('Fallow');



    Honeybees.push('Bee- yard');
    Honeybees.push('Bee-pollination');
    Honeybees.push('Bee-honey foraging');
    Honeybees.push('Other');



    Vegetables.push('Amaranths, Chinese cabbage');
    Vegetables.push('Artichokes');
    Vegetables.push('Asparagus');
    Vegetables.push('Beans, ');
    Vegetables.push('Beets ');
    Vegetables.push('Broccoli');
    Vegetables.push('Brussels sprouts');
    Vegetables.push('Cabbage');
    Vegetables.push('Cantaloupes');
    Vegetables.push('Carrots');
    Vegetables.push('Cauliflower');
    Vegetables.push('Celeriac, celery root');
    Vegetables.push('Celery');
    Vegetables.push('Chickpeas');
    Vegetables.push('Chinese beans');
    Vegetables.push('Chinese cabbage');
    Vegetables.push('Chinese okra');
    Vegetables.push('Chinese radish');
    Vegetables.push('Cilantro');
    Vegetables.push('Collards');
    Vegetables.push('Cucumbers');
    Vegetables.push('Edible flowers');
    Vegetables.push('Edible podded peas');
    Vegetables.push('Edible soybeans');
    Vegetables.push('Eggplant');
    Vegetables.push('Escarole/Endive');
    Vegetables.push('Garlic');
    Vegetables.push('Ginger');
    Vegetables.push('Honeydew melons');
    Vegetables.push('Horseradish');
    Vegetables.push('Jerusalem artichoke');
    Vegetables.push('Jicama');
    Vegetables.push('Kale');
    Vegetables.push('Kohrirabi');
    Vegetables.push('Leeks');
    Vegetables.push('Lentils');
    Vegetables.push('Lettuce');
    Vegetables.push('Melons, specialty');
    Vegetables.push('Mushrooms');
    Vegetables.push('Mustard greens');
    Vegetables.push('Okra');
    Vegetables.push('Onions, dry');
    Vegetables.push('Onions, green');
    Vegetables.push('Parsley');
    Vegetables.push('Parsnip');
    Vegetables.push('Peas, Chinese-sugar');
    Vegetables.push('Peas, green');
    Vegetables.push('Peas,  green southern, blackeyed,  crowder, etc.');
    Vegetables.push('Peas, pigeon');
    Vegetables.push('Peppers, bell');
    Vegetables.push('Peppers, Jalapeno and other');
    Vegetables.push('Potatoes');
    Vegetables.push('Pumpkins');
    Vegetables.push('Radishes ');
    Vegetables.push('Rhubarb');
    Vegetables.push('Rutabaga');
    Vegetables.push('Salisfy');
    Vegetables.push('Shallots');
    Vegetables.push('Spinach');
    Vegetables.push('Squash');
    Vegetables.push('Sweet corn');
    Vegetables.push('Sweet potatoes');
    Vegetables.push('Taro');
    Vegetables.push('Tomatoes');
    Vegetables.push('Tomatillos');
    Vegetables.push('Turnips');
    Vegetables.push('Watermelons');
    Vegetables.push('Other');
    Vegetables.push('Fallow');

    
    


}

function SetCropOptions(type, crop) {
    var el = document.getElementById('planttype');
    var index = -1;
    //CreateOptions();
    var croptype = "";
    if (el) {
        for (var x = 0; x < el.childNodes.length; x++) {
            if (type == el.childNodes[x].innerHTML) {
                el.childNodes[x].selected = true;
                index = x;
                
            }
        }

        if (index == -1) {
            var opt = document.createElement('option');
            opt.innerHTML = type;
            opt.selected = true;
            el.appendChild(opt);



        }
    }
    CreateCropOptions(type); ///create the options for the appropriate array
    var el = document.getElementById('croptype');
    var index = -1;
    if (el) {
        el.setAttribute("style", "display: block;");
        for (var x = 0; x < el.childNodes.length; x++) {
            if (crop == el.childNodes[x].innerHTML) {
                el.childNodes[x].selected = true;
                index = x;
            }
        }

        if (index == -1) {
            var opt = document.createElement('option');
            opt.innerHTML = crop;
            opt.selected = true;
            el.appendChild(opt);
        }
    }



}

function CreateCropOptions(selectid) {
    //croptypes.push("Field Crops");
    //croptypes.push("Honeybees");
    //croptypes.push("Vegetables");
    //croptypes.push("Fruits and Nuts");
    //croptypes.push("Greenhouse and Nursery");
    //croptypes.push("Forage, Grassland");
    var temparr = null;
    if (selectid == "Field Crops") {
        temparr = Fieldcrops; ///works as a pointer to the arary
    }
    else if (selectid == "Honeybees") {
        temparr = Honeybees;
    }
    else if (selectid == "Vegetables") {
        temparr = Vegetables;
    }
    else if (selectid == "Fruits and Nuts") {
        temparr = FruitsandNuts;
    }
    else if (selectid == "Greenhouse and Nursery") {
        temparr = GreenhouseandNursery;
    }
    else if (selectid == "Forage, Grassland") {
        temparr = Forage;
    }

    if (temparr) {
        var sel = document.getElementById('croptype');
        sel.setAttribute("style", "display: block;");

        while (sel.childNodes.length != 0) {
            sel.removeChild(sel.childNodes[0]);
        }
        if (sel) {
            for (var x = 0; x < temparr.length; x++) {
                var opt = document.createElement('option');
                opt.innerHTML = temparr[x];
                sel.appendChild(opt);
            }
        }


    }



}