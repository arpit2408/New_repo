var map = null;
var areaindex = -1;
var loadedDrawing = null;
var areaedit = false;
var polyobj = null;
var cropdraw = -1;
var box = new DialogBox();
var counter = 0;
var tempusrcroploc = null;
var conflictcroploc = new Array();
var sortedconflictcrop = new Array();
var usrcroploc = new Array();
var usrapparea = new Array();
var cropshapelayer = null;
var appshapelayer = null;
var buffershapelayer = null;
var numberofitems = 10;
var itemoffset = 0;
var cropitemoffset = 0;
var pgnum = 1;

/*===================================================*/
function bufferArea() {
    this.coordinates = "";
    this.areacentroid = "";
}

////code by shalini menon tharavanat
//function getIP() {
//  PageMethods.GetUserIP(GetUserIP_Success, GetUserIP_Fail);
//}

//function GetUserIP_Fail(val) {
//    Document.getElementById('ipadd').innerHTML = 'Not able to get your IP' + val + ' ';
//}

function GetUserIP_Success(val) {
    Document.getElementById('ipadd').innerHTML = 'IP address is' + val+' ';
}
//end myIP

function init_applicator() {
    
    if (serverval != null) 
    {
        user = serverval;
        CreateOptions('acounties', 'add');
        //setup the map
        StartLoadingData();
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
function GetUser() {
    var parameters = "id=" + user.email;
    jQuery.ajax({
        // type: 'POST',
        url: 'Login.svc/GetUserDetails',
        success: GetUser_Success,
        fail: GetUser_Fail,
        async: false,
        cache: false,
        data: parameters,
        dataType: "text",
        dataFilter: function (data) {
            var msg;
            if (typeof (JSON) !== 'undefined' &&
            typeof (JSON.parse) === 'function')
                msg = JSON.parse(data);
            else
                msg = eval('(' + data + ')');

            if (msg.hasOwnProperty('d'))
                return msg.d;
            else
                return msg;
        }

    })
}
function GetUser_Success(res) {
    if (res[0] == "1") {
        user = JSON.parse(res[1]);
        //alert(user.prefoptions);
    }
}

function GetUser_Fail() {


}


function StartLoadingData() {
    GetUser();
    box.message = "Loading application locations....";
    box.CreateDialog(null);
    PageMethods.LoadApplicatorAreas(user, LoadUserAreas_Success, LoadUserAreas_Fail);

}


function LoadUserAreas_Success(val) {
    var el = document.getElementById('error');
    
    if (el) {
        if (val[0] == "0") 
        {
            el.innerHTML = val[1];
            el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
            setTimeout(hideError, 2000);
            box.CloseDialog(50);
            box.message = "Error loading application locations, please refresh your browser....";
            box.CreateDialog(null);
        }
    }
    if (val[0] == "1")//load location 
    {
        GetMap();
        usrapparea = JSON.parse(val[1]);
        if (usrapparea.length > 0)// at least one location
        {
            ChangeForm(2);
        }
        else//no location
        {
            ChangeForm(2);
        }
        parent.adjustFrameHeight();
        box.CloseDialog(50);
        ////now load crop Areas
        box.message = "Loading Crops...";
        box.CreateDialog(null);
        PageMethods.LoadCropAreas(user, LoadCrops_Success, LoadCrops_Fail);
        
    }
    
    var crops = document.getElementById('allcrop_check');
    if (crops) {
        crops.checked = true;
        ChangeCropView(1);
    }
    
}

function LoadCrops_Success(val)
{
    box.CloseDialog(10);
    if (val[0] == '1') {
        usrcroploc = JSON.parse(val[1]);
        createCropsTable(1);
        DrawAllCrops();
        if (usrapparea) {
            if (usrapparea.length > 50) {
                ///do a conflict check for the first app area
                GoRealTimeConflict(0);

            }
            else {
                ///do a conflict check for all app areas
                Checkconflictforallcrops();
            }
        }

    }
}

function LoadCrops_Fail()
{


}

function ChangeForm(val) {

    if (val == 1)//no locations in database
    {
        //set first time description
        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<h3>Your Pesticide Application Areas Dashboard</h3>";
            el.innerHTML += "Welcome <b>" + user.firstname + " " + user.lastname + "</b>:</br>";
            if (user.preferences == "none") {
                el.innerHTML += "Please select one of the options under <b>'Notification Preferences'</b>, to setup when to receive notifications by email, once a new crop area is registered to our Texas database. ";
            }
            else {
                el.innerHTML += "<br>This page will allow you to create and save current, or potential pesticide application locations and set up preferences for how you would like to be notified when there are changes to the crops in our database. Your application areas are confidential and visible only by you. The tools on this page also allow you to view all crops registered in Texas, and to create reports detailing crops nearest to your application areas.";
            }
            el.innerHTML += "To include the area(s) of your applications in our listing click <b>“Add”</b>.";
            el.innerHTML += "<br><br><H3>For more help please <a href = 'Javascript:SetHelp(3)'>click here</a></H3>";
        }
        //setup the notification preferences
        if (user.preferences=="none") {
            //DisableAll();
            EditPreferences();
        }
        else {
            
            
            var radioctrls = document.getElementsByName('notifications');
            for (var x = 0; x < radioctrls.length; x++) {
                radioctrls[x].checked = false;
                if (radioctrls[x].value == user.preferences) {
                    radioctrls[x].checked = true;
                }
            }
            //CancelEditPreferences();
        }
        
    }

    else if (val == 2) //locations in database
    {
        var el = document.getElementById('description');
        if (el) {
            el.innerHTML = "<h1>Pesticide Applicator Dashboard</h1>";
            el.innerHTML += "Welcome <b>" + user.firstname + " " + user.lastname + "</b>:</br>";
            el.innerHTML += "<br>This page will allow you to create and save current, or potential pesticide application locations and set up notifications when there are changes to the crops in our database. Your application areas are confidential and visible only by you. The tools on this page also allow you to view all crops registered in Texas, and to create reports detailing crops nearest to your application areas.";
            //el.innerHTML += "You can add a new application area by clicking the <b>'Add'</b> link on 'Application Areas' or you can edit your area by selecting the area using the tabs, and click <b>'Edit'</b> on the right side.";
            el.innerHTML += "<br><br><H3>For more help please <a href = 'Javascript:SetHelp(3)'>click here</a></H3>";
        }
        //load user preferences
        
        if (user.preferences=="none") {
            DisableAll();
            EditPreferences();
        }
        else {
            
            var radioctrls = document.getElementsByName('notifications');
            for (var x = 0; x < radioctrls.length; x++) {
                radioctrls[x].checked = false;
                if (radioctrls[x].value == user.preferences) {
                    radioctrls[x].checked = true;
                }
            }
            //CancelEditPreferences();
        }
        
        //setup map
        GetMap();
        /// Display all locations and details in form 
        if (usrapparea != null)//populate with the first location by default.
        {
            CreateAreasTable();
            DrawApplicatorAreas();
            //var loadedDrawings = new PolygonPlotter(map);
            //loadedDrawings.LoadMultiPolygons(usrapparea, "area");
            //loadedDrawings.LoadMultiPolygons(usrapparea, "buffer");
     
        }
    }
}


    function GetMap() {
        if (map) { map.DeleteAllShapes(); }
        map = new VEMap('mapdiv');
        map.LoadMap();
        var TexasLat = 31.386944444444445;
        var TexasLon = -99.17027777777778;
        var mapCenter = new VELatLong(TexasLat, TexasLon);
        var TexasZoomLvl = 6;
        map.SetMapStyle(VEMapStyle.Hybrid);
        map.SetCenterAndZoom(mapCenter, TexasZoomLvl);
        cropshapelayer = new VEShapeLayer();
        appshapelayer = new VEShapeLayer();
        buffershapelayer = new VEShapeLayer();
        map.AddShapeLayer(appshapelayer);
        map.AddShapeLayer(cropshapelayer);
        map.AddShapeLayer(buffershapelayer);
    }

    function EditPreferences() {
        var el = document.getElementById('notificationprefs');
        el.setAttribute('style', 'display:block');
        EnableElements('input', 'radio');
        EnableElements('input', 'text');
        var countiesopt = document.getElementById('countiesopt');
        if (user.preferences == "counties")
        {
            var distedit = document.getElementById('distance');
            if (distedit) {
                distedit.value = "";///set distance box to empty
            }
            if (countiesopt) 
            {
                PopulateSelectCtlr();
                var prefvalue = "";
                if (user.preferences=="counties") {
                    prefarray = user.prefoptions.split(",");
                    //select the stored counties from user preferences
                    var selectobj = document.getElementById('counties');
                    if (selectobj) {
                        for (var opt = 0; opt < selectobj.options.length; opt++) 
                        {
                            var curropt = selectobj.options[opt].value;
                            for (var y = 0; y < prefarray.length; y++) {
                                if (curropt == prefarray[y]) {
                                    selectobj.options[opt].selected = true;
                                }
                            }

                        }
                    }
                }
            }
        }
        else if (user.preferences == "area") {
            var distedit = document.getElementById('distance');
            if (distedit) {
                distedit.value = user.prefoptions;
            }
        }
        else {
            var distedit = document.getElementById('distance');
            if (distedit) {
                distedit.value = user.prefoptions;
            }
        }
        
    
        var el = document.getElementById('prefsvcdiv');
        if (el) {
            el.setAttribute('style', 'display:block; padding: 0 4px 0px 4px;');
        }
    }

    function CancelEditPreferences() {
        var el = document.getElementById('notificationprefs');
        if (el) {
            el.setAttribute('style', 'display:none;');
        }
        var prefvalue = "";
        if (user.preferences=="state" && user.preferences != "none") {
            prefvalue = user.preferences.split(';')[0];
            if (prefvalue == "area") {
                var distance = user.preferences.split(';')[1];
                var el = document.getElementById('distance');
                el.value = distance;
            }
        }
        else if (user.preferences == "none") { prefvalue = "state"; }
        else { prefvalue = user.preferences; }
        var radioctrls = document.getElementsByName('notifications');
        for (var x = 0; x < radioctrls.length; x++) {
            radioctrls[x].checked = false;
            if (radioctrls[x].value == prefvalue) {
                radioctrls[x].checked = true;
            }
        }
        DisableElements('input', 'radio');
        DisableElements('input', 'text');
        var el = document.getElementById('prefsvcdiv');
        if (el) {
            el.setAttribute('style', 'display:none;');
        }
        var el = document.getElementById('counties');
        if (el) {
            el.setAttribute('style', 'visibility: hidden; display: none;');
        }
    }
    function SavePreferences() {
        var radioctrls = document.getElementsByName('notifications');
    
        var prefvalue = "none";
        var prefoption = "";
    
        var errflag = 0;
        var errMsg = "";
        for (var x = 0; x < radioctrls.length; x++) {
            if (radioctrls[x].checked) {
                prefvalue = radioctrls[x].value;
                break;
            }
        }
        //var el = document.getElementById('notificationprefs');
        // el.setAttribute('style','display:none');
        if (prefvalue == "counties") {
            var selectobj = document.getElementById('counties');
            if (selectobj) {
                for (var opt = 0; opt < selectobj.options.length; opt++) 
                {
                    if (selectobj.options[opt].selected) 
                    {
                        if (selectobj.options[opt].value != "--Select county--") {
                            prefoption+= selectobj.options[opt].value;
                            if (opt != selectobj.options.length - 1) { prefoption += ","; }
                        }

                    }
                }
                //if (countiesstr.charAt(countiesstr.length - 1) == ",") {
                //    prefoption = prefoption.slice(0, -1);
                //}
            }
        }
        else if (prefvalue == "area") {
            var el = document.getElementById('distance');
            var notificationdistance = el.value;
            prefoption = parseFloat(notificationdistance);
        }
    

        if (prefvalue == "counties" && prefoption == "") {
            errflag = 1;
            errMsg = "Please select one or more counties for which you would like to receive notifications";
        }

        var distance = parseFloat(notificationdistance);
        if (prefvalue == "area" && isNaN(distance) == true) {
            errflag = 1;
            errMsg = "Please enter a notification distance from your application areas";
        }
        if (prefvalue == "area" && isNaN(distance) == false)
        {
            prefoption = distance;
            var el = document.getElementById('distance');
            el.value = prefoption;
        }

        if (user != null && errflag != 1) {
            CancelEditPreferences();
            box.message = "Updating preferences....";
            box.CreateDialog();
            PageMethods.SaveUsrPreferences(user.email, prefvalue, prefoption, SaveUsrPreferences_Success, Fail);
        }
        else {
        
            box.message = "Please fix the following errors:<br>" + errMsg;
            box.CreateDialog(4000);
        
        }
    }

    function SaveUsrPreferences_Success(val) {
        var el = document.getElementById('error');
        box.CloseDialog(10);
        if (val[0] == "1") {
            user = JSON.parse(val[1]);
            var div = document.getElementById('list');
            if (div) {
                div.innerHTML = "";
            }
            //PageMethods.LoadApplicatorAreas(user, LoadUserAreas_Success, Fail);
            ///reload the areas
            StartLoadingData();
        }
        else {
            box.message = "Error Saving Messages. Please refresh browser";
            box.CreateDialog(2000);
            

        }////
        if (el) {
            el.innerHTML = val[1];
            el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
            setTimeout(hideError, 2000);
        
            
        }
    
    }

    function PopulateSelectCtlr() {
        CreateOptions('counties', 'add');
        var el =  document.getElementById('counties');
        if (el) {
            el.setAttribute('style', 'visibility: visible; display: block;');
        }
    }
    function hideSelectCtrl() {
        var el = document.getElementById('counties');
        if (el) {
            el.setAttribute('style', 'visibility: hidden; display: none;');
        }
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
                box.message = e.message;
                box.CreateDialog(1000);
           
            }
        }
    }
    function Fail(val) {
        var el = document.getElementById('error');
        if (el) {
            el.innerHTML = val[1];
            el.setAttribute('style', 'background-color: #E0DED2; font-style: italic; color: Red; display:block;');
            box.message = "Oops something went wrong. Please refresh your browser";
            box.CreateDialog(3000);
        }
    }

    function LoadUserAreas_Fail(val) {
        alert("User Areas" + val);
    }


    function ChangeAppTable(page) {
        itemoffset = page * numberofitems;
        CreateAreasTable();
    }

    function ChangeCropTable(page, numberoftables) {
        if (numberoftables < 5) {
            cropitemoffset = page * numberofitems;
            createCropsTable(page);
        }
        else {
            cropitemoffset = (page) * numberofitems;
            createCropsTable(page);
        
        }
    }

    function CreateAreasPagination() {
        var div = document.getElementById('apppagination');
        if (div) {
            div.innerHTML = "";
            var table = document.createElement('table');
            table.style.width = "200px";
            div.appendChild(table);
            var row = document.createElement('tr');
            var col = document.createElement('td');
            //col.setAttribute('colspan', '2');
            table.appendChild(row);
            row.appendChild(col);
            var numberoftables = (usrapparea.length / numberofitems);
            if (numberoftables < 1) {
                numberoftables = 1;
            }
            var span = document.createElement('span');
            span.innerHTML = "Page: ";
            col.appendChild(span);
            for (var x = 0; x < numberoftables; x++) {
                var a = document.createElement('a');
                a.innerHTML = x + 1;
                a.setAttribute('href', "Javascript:ChangeAppTable(" + x + ")");
                var span = document.createElement('span');
                span.innerHTML = "&nbsp|&nbsp";
                col.appendChild(a);
                if (x < numberoftables - 1) {
                    col.appendChild(span);
                }

            }
        }
    }



    function CreateAreasTable() {
        var div = document.getElementById('list');
        if (div) {
            while (div.childNodes.length)
            {
                div.removeChild(div.childNodes[0]);
            }
            var table = document.createElement('table');
            table.setAttribute('class', 'appareaslist');
            //icons row
            // real time check conflict function that checks for conflict by querying database to see for any new crops added
            var row = document.createElement('tr');
            table.appendChild(row);
            var col = document.createElement('td');
            row.appendChild(col);
            var arealtime = document.createElement('input');
            arealtime.className = 'stdbutton';
            arealtime.style.width = "90px";
            arealtime.setAttribute('type', 'button');
            arealtime.value = "Show All Conflicts";
            arealtime.setAttribute('onclick', "Javascript:Checkconflictforallcrops()");
            col.appendChild(arealtime);
            var col = document.createElement('td');
            col.setAttribute('style', 'text-align:center;');
            row.appendChild(col);
            var arealtime = document.createElement('input');
            arealtime.className = 'stdbutton';
            arealtime.style.width = "90px";
            arealtime.setAttribute('type', 'button');
            arealtime.value = "Add New Area";
            //<a id='addarea' onclick='Javascript:GoNewArea("add");' class='rctlr'>Add</a>
            arealtime.setAttribute('onclick', "Javascript:GoNewArea()");
            col.appendChild(arealtime);
            row.appendChild(col);
            row = document.createElement('tr');
            table.appendChild(row);
            col = document.createElement('td');
            col.colSpan = 2;
            row.appendChild(col);
            //list.innerHTML += "<br>";
            if (usrapparea) 
            {
                for (var x = 0; x < numberofitems; x++) {
                    var row = document.createElement('tr');
                    var col = document.createElement('td');
                    //col.setAttribute('colspan', '2');
                    row.appendChild(col);
                    table.appendChild(row);
                    if (x + itemoffset < usrapparea.length) {
                        var a = document.createElement('a');
                        a.innerHTML = (x + 1 + itemoffset) + "&nbsp;&nbsp" + usrapparea[x + itemoffset].appareaname + ' ';
                        a.setAttribute('class', 'clickable');
                        a.setAttribute('onclick', 'Javascript:ZoomToArea(' + (x + itemoffset) + ');');
                        col.appendChild(a);
                        var col = document.createElement('td');
                        row.appendChild(col);
                        var acheck = document.createElement('input');
                        acheck.type = 'button';
                        acheck.value = 'Show Conflicts';
                        acheck.setAttribute('class', 'smallbutton');
                        acheck.setAttribute('onclick', 'Javascript:GoRealTimeConflict('+(itemoffset + x) + ');');
                        col.appendChild(acheck)
                        var aedit = document.createElement('input');
                        aedit.type = 'button';
                        aedit.value = 'Edit';
                        aedit.setAttribute('class', 'smallbutton');
                        ////get appareaid
                        var appareaid = usrapparea[x + itemoffset].id;
                        aedit.setAttribute('onclick', 'Javascript:GoNewArea("edit=' + (appareaid) + '");');
                        col.appendChild(aedit);
                    }
                
                
                }
            
                CreateAreasPagination();
            }
            div.appendChild(table);
        
        }
   
    }

    // Function that calls the webservice to check for conflicts by querying database to include any new crops added
    function Checkconflictforallcrops() {
        box.message = "Checking for crop locations close to your application areas....";
        box.CreateDialog(null);
        ConflictCheck.RealTimeConflictCheck(user, checknotificationcrops_Success, checknotificationcrops_Fail);
        var div = document.getElementById('cropareapanel');
        if (div) {
            div.innerHTML = "<h2>Crops closest to:</h2><h2><i>All Your Locations</i></h2>";
        }
    }

    /// Crops that are in conflict with applicator areas are populated in this table - Right pane of the screen.

    function AddCropPagination(pgnum) {
        var table = document.createElement('table');
        var div = document.getElementById('croppagination');
        if (div) {
            div.innerHTML = "";
            div.appendChild(table);
            var row = document.createElement('tr');
            var col = document.createElement('td');
            col.setAttribute('colspan', '2');
            col.setAttribute('style', 'height:20px');
            table.appendChild(row);
            row.appendChild(col);
            var numberoftables = (counter / numberofitems);
            if (numberoftables < 1) {
                numberoftables = 1;
            }
            var span = document.createElement('span');
            span.innerHTML = "Page: ";
            col.appendChild(span);
            if (numberoftables < 10) {
                for (var x = 0; x < numberoftables & x < 10; x++) {
                    var a = document.createElement('a');
                    a.innerHTML = x + 1;
                    a.setAttribute('href', "Javascript:ChangeCropTable(" + x + "," + numberoftables + ")");
                    var span = document.createElement('span');
                    span.innerHTML = "&nbsp|&nbsp";
                    col.appendChild(a);
                    if (x < numberoftables - 1) {
                        col.appendChild(span);
                    }
                }
            }
            else {
                var a = document.createElement('a');
                a.innerHTML = "Previous ";
                a.setAttribute('href', "Javascript:Gotopage(" + 1 + "," + numberoftables + ")");
                col.appendChild(a);
                var el = document.getElementById('pagenumber');
                if (!el) {
                    var pgno = document.createElement('label');
                    pgno.id = "pagenumber";
                    pgno.innerHTML = pgnum;
                    col.appendChild(pgno);
                    var label = document.createElement('label');
                    label.innerHTML = " of " + Math.ceil(numberoftables);
                    col.appendChild(label);

                }

                var a = document.createElement('a');
                a.innerHTML = " Next";
                a.setAttribute('href', "Javascript:Gotopage(" + 2 + "," + numberoftables + ")");
                col.appendChild(a);

            }
        }


    }

    function AddCropViewCtrls() {

        var div = document.getElementById('mapareapanel');
        div.innerHTML = "<h2>Map of your Application Areas and All Registered Crops</h2>";
        if (div) {
        
            var input = document.createElement('input');
            //input.setAttribute('name', 'view_check');
            input.setAttribute('id', 'buffer_check');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('style', 'width:15px;');
            input.setAttribute('checked', 'checked');
            input.setAttribute('onclick', 'Javascript:HideBuffer()');
            var label = document.createElement('label'); //view area buffer label
            label.setAttribute('for', 'view_check');
            label.innerHTML = "View 1 mile Application Buffer&nbsp;&nbsp";
            div.appendChild(input);
            div.appendChild(label);

            var input = document.createElement('input');
            input.setAttribute('id', 'crop_check');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('style', 'width:15px;');
            input.setAttribute('onclick', 'Javascript:ChangeCropView(2)');
            //col.appendChild(input);
            var label = document.createElement('label'); 
            label.setAttribute('for', 'view_check');
            label.setAttribute('style', 'width:150px');
            label.innerHTML = "View Notification Crops&nbsp;&nbsp";
            div.appendChild(input);
            div.appendChild(label);
            /////////////
            var input = document.createElement('input');
            input.setAttribute('id', 'allcrop_check');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('checked', 'true');
            input.setAttribute('style', 'width:15px;');
            input.setAttribute('onclick', 'Javascript:ChangeCropView(1)');
            var label = document.createElement('label'); //view area buffer label
            label.setAttribute('for', 'view_check');
            label.innerHTML = "View All Crops&nbsp;&nbsp";
            div.appendChild(input);
            div.appendChild(label);
        
        }
        var div = document.getElementById('appareapanel');
        if (div)
        {
            div.innerHTML = "<h2>Saved Application Areas</h2>";

        }
        var div = document.getElementById('cropareapanel');
        if (div) {
            //div.innerHTML = "Below is a list of Texas Sensitive crops, sorted by distance from your application areas.";

        }
    }

    function CreateLegend() {
        var div = document.getElementById('maplegend');
        if (div) {
            div.innerHTML = "<br/>";
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
            label.innerHTML = "&nbsp;Field Crops&nbsp;&nbsp;&nbsp;<br>";
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
            label.innerHTML = "&nbsp;Nursery and Greenhouse&nbsp;&nbsp;&nbsp;";
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
            label.innerHTML = "&nbsp;Vegetables&nbsp;&nbsp;&nbsp;<br>";
            span.appendChild(label);
            div.appendChild(span);
            ///////////////////////////////////////////
            var span = document.createElement('span');
            var img = document.createElement('img');
            var label = document.createElement('label');
            img.setAttribute('src', 'images/pushpins/applicatorpushpin.png');
            img.setAttribute('alt', 'bees');
            img.style.height = "25px";
            img.style.width = "25px";
            img.style.top = "10px";
            img.style.position = 'relative';
            span.appendChild(img);
            label.setAttribute('style', 'font-weight: bold');
            label.innerHTML = "&nbsp;Your Application Areas&nbsp;&nbsp;&nbsp;<br>";
            span.appendChild(label);
            div.appendChild(span);

        }
    }
    function createCropsTable(pgnum) {
    
        var div = document.getElementById('cropareas');
        if (div) {
            while (div.childNodes.length)
            {
                div.removeChild(div.childNodes[0]);
            }
            
            var table = document.createElement('table');
            table.setAttribute('style', 'width:200px');
            div.appendChild(table);
            var row = document.createElement('tr');
            table.appendChild(row);
            var col = document.createElement('td');
            col.innerHTML = "Crop#:";
            row.appendChild(col);
            col = document.createElement('td');
            col.innerHTML = "Distance:";
            row.appendChild(col);
            col = document.createElement('td');
            col.innerHTML = "App Area:";
            row.appendChild(col);
            if (conflictcroploc) {
                if (conflictcroploc.length == 0) {
                    var row = document.createElement('tr');
                    var col = document.createElement('td');
                    col.colSpan = 3;
                    col.style.textAlign = "center";

                    row.appendChild(col);
                    table.appendChild(row);
                    col.innerHTML = "<b>No conflicts to report</b>";

                }
                for (var x = 0; x < numberofitems; x++) {
                    var row = document.createElement('tr');
                    var col = document.createElement('td');
                    row.appendChild(col);
                    table.appendChild(row);
                    if (x + cropitemoffset < counter) {
                        if (conflictcroploc[x + cropitemoffset].conflictflag == 1) {
                            var a = document.createElement('a');
                            //a.innerHTML = "Crop ";
                            col.style.color ="rgb(80,80,80)";
                            col.appendChild(a);
                            var a = document.createElement('a');
                            a.innerHTML = conflictcroploc[x + cropitemoffset].cropid + ' ';
                            var cropid = conflictcroploc[x + cropitemoffset].cropid;
                            a.setAttribute('href', '#');
                            a.setAttribute('onclick', 'Javascript:ZoomToCrop(' + cropid + ');');
                            col.appendChild(a);
                            ///////next col
                            var col = document.createElement('td');
                            row.appendChild(col);
                            table.appendChild(row);
                            var label = document.createElement('label');
                            label.style.fontSize = '12px';
                            label.innerHTML = "<b>"+parseFloat(conflictcroploc[x + cropitemoffset].distance).toFixed(2) + "</b> miles";
                            col.appendChild(label);
                            var col = document.createElement('td');
                            row.appendChild(col);
                            table.appendChild(row);
                            var a = document.createElement('a');
                            //a.style.fontSize = '12px';
                            var appareaindex = GetAppAreaIdFromName(conflictcroploc[x + cropitemoffset].appareaname);
                            a.innerHTML = conflictcroploc[x + cropitemoffset].appareaname;
                            a.setAttribute('href', 'Javascript:ZoomToArea(' + appareaindex + ');');
                            col.appendChild(a);
                        }
                    }
                }
            
            }
    
            AddCropPagination(pgnum);
            AddCropViewCtrls();
            CreateLegend();
   
        }
    }

    function GetAppAreaIdFromName(appareaname) {
        for (var x = 0; x < usrapparea.length; x++) {
            if (appareaname == usrapparea[x].appareaname) {
                return x;
            }
        }
        return -1;

    }

    function compare(a,b)
    {
        return (a.crop.id) - (b.crop.id);
    }

    function createdisplaycroplist ()
    {
        var displaycropidlist = new Array();
   
        for(var i = 0; i<usrcroploc.length;i++)
        {
            for (var j = 0; j <counter; j++)
            {
                if (conflictcroploc[j].cropid == usrcroploc[i].id )
                {
                    displaycropidlist.push(usrcroploc[i]);
                }
            }
        }
    
        return displaycropidlist;
    }

    function ChangeCropView(type) {
        var allcrops = document.getElementById('allcrop_check');
        var conflictcrops = document.getElementById('crop_check');
        if (allcrops.checked == false && conflictcrops.checked == false) {
            cropshapelayer.Hide();
            return;
        }
        if (type==1) {
            ////plot all the crops
            cropshapelayer.Show();
            conflictcrops.checked = false;
            allcrops.checked = true;
            ShowAllCrops();
            return;

        }
        if (type==2)
        {
            cropshapelayer.Show();
            ///plot conflict crops
            allcrops.checked = false;
            conflictcrops.checked = true;
            HideNonConflictCrops();
            return;
        }
    }

    //function ShowAllCrops() {
    //var el = document.getElementById('crop_check');
    //if (el.checked)
    //{
    //    el.checked = false;
    //    }
    //    //tempusrcroploc = usrcroploc;
    //    //tempusrcroploc.sort(compare);
    //    var el = document.getElementById('allcrop_check');
    //    if (el.checked) {
    //        cropdraw = -1;
    //    }
    //    else {
    //      //  el.setAttribute('checked', true);
    //        cropdraw = 0;
    //    }
    //    HideCrops(2);
    //alert('it worked');
    //}

    // Function that takes care of the paginations when number of tables exceeds 5
    function Gotopage(page, numberoftables) {
        if (page == 1) {
            var el = document.getElementById('pagenumber');
            var x = parseInt(el.innerHTML);
            if (x > 1) {
                el.innerHTML =  x-1;
                ChangeCropTable(x-1, numberoftables);
            }
        }

        if (page == 2) {
            var el = document.getElementById('pagenumber');
            var x = parseInt(el.innerHTML);
            if (x < conflictcroploc.length) {
                el.innerHTML =  x+1;
                ChangeCropTable(x+1, numberoftables);
            }
        }
    }

    /// function that is called when a particular crop location is clicked upon in the applicator page

    function ZoomToCrop(cropid) {
        for (var x = 0; x < usrcroploc.length; x++) {
            if (parseInt(usrcroploc[x].id) == cropid) {
                ////zoom to centroid
                var location = usrcroploc[x].loccentroid.split(",");
                var latlon = new VELatLong(parseFloat(location[0]), parseFloat(location[1]));
                map.SetCenter(latlon);
            }
        }
    }
    function SplitCoordinateString(coordstring)
    {
        var retval = new Array();
        var points = coordstring.split("\n");
        for (var x = 0; x< points.length; x++)
        {
            var latlon = points[x].split(",");
            try{
                var point = new VELatLong(parseFloat(latlon[0]), parseFloat(latlon[1]));
            }
            catch (e) {

            }
            retval.push(point);
        }
        return retval;
    }

    function CheckPlotShape(cropobj) {
        ///checks to see if a plot location is on the conflicted list
        for (var x = 0; x < conflictcroploc.length; x++) {
            if (conflictcroploc[x].conflictflag == 1 && conflictcroploc[x].cropid == cropobj.id) {
                return true;
            }

        }
        return false;
    }

    function DrawApplicatorAreas() {
        if (usrapparea) {
            var box1 = new DialogBox();
            box1.message = "Drawing Your Application Areas...";
            box1.CreateDialog(null);
            if (appshapelayer) {
                appshapelayer.DeleteAllShapes();
            }
            for (var x = 0; x < usrapparea.length; x++) {
                var points = SplitCoordinateString(usrapparea[x].coordinates);
                try {
                    var shp = new VEShape(VEShapeType.Polygon, points);
                    //var polygon = new VEShape(VEShapeType.Polygon, this.polyPoints);
                    appshapelayer.AddShape(shp);
                    var title = "<b></b><br><b>" + (usrapparea[x].appareaname) + "</b></br>";;
                    shp.SetCustomIcon("<div class ='pushpinapparea'><div class='text'>" + (x + 1) + "</div></div>");
                    description = "<b>County:</b> " + usrapparea[x].county + "</br>";
                    description += "<b>Area [acres]:</b> " + usrapparea[x].acres + "</br>";
                    if (usrapparea[x].pestcidename == null) {
                        usrapparea[x].pestcidename = "N/A";
                    }
                    description += "<b>Pesticide:</b> " + usrapparea[x].pestcidename;
                    description += "<br><b>Comments:</b><br>" + usrapparea[x].comment;
                    shp.SetDescription(description);
                    shp.SetTitle(title);
                    shp.SetFillColor(new VEColor(255, 0, 0, 0.2));
                    shp.SetLineColor(new VEColor(255, 0, 0, 0.4));
                    usrapparea[x].shapeid = shp.GetID();
                }
                catch (e) {
                    //alert(e.message);
                    box.CloseDialog(50);
                }
            }///endn for

            box1.CloseDialog(50);
        }
        DrawBufferAreas();
        

    }
    function DrawBufferAreas() {
        if (usrapparea) {
            var box1 = new DialogBox();
            box1.message = "Drawing Your Application Areas...";
            box1.CreateDialog(null);
            if (buffershapelayer) {
                buffershapelayer.DeleteAllShapes();
            }
            for (var x = 0; x < usrapparea.length; x++) {
                var points = SplitCoordinateString(usrapparea[x].buffercoords);
                try {
                    var shp = new VEShape(VEShapeType.Polygon, points);
                    buffershapelayer.AddShape(shp);
                    shp.HideIcon();
                    shp.SetFillColor(new VEColor(255, 255, 0, 0.0));
                    shp.SetLineColor(new VEColor(255, 255, 0, 0.5));
                    
                    
                }
                catch (e) {
                    //alert(e.message);
                    box.CloseDialog(50);
                }
            }///endn for

            box1.CloseDialog(50);
        }



    }

    //function DrawConflictCrops(plotall) {
    //    ///draws crops on the map. If plotall is true, it plots all crops. Otherwise, just the conflict crops
    //    var box1 = new DialogBox();
    //    box1.message = "Drawing Crops Within Notification Distance...";
    //    box1.CreateDialog(null);
    //    cropshapelayer.DeleteAllShapes();
    //    for (var x = 0; x < usrcroploc.length; x++) {
    //        if (CheckPlotShape(usrcroploc[x])==true)
    //        {
    //            var points = SplitCoordinateString(usrcroploc[x].coordinates);
    //            try {
    //                var shp = new VEShape(VEShapeType.Polygon, points);
    //                //var polygon = new VEShape(VEShapeType.Polygon, this.polyPoints);

    //                cropshapelayer.AddShape(shp);
    //                if (usrcroploc[x].planttype.toUpperCase() == "FIELD CROPS") {
    //                    shp.SetCustomIcon("<div class ='pushpinStyle_field'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
    //                }
    //                else if (usrcroploc[x].planttype.toUpperCase() == "HONEYBEES") {
    //                    shp.SetCustomIcon("<div class ='pushpinStyle_bees'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
    //                }
    //                else if (usrcroploc[x].planttype.toUpperCase() == "VEGETABLES") {
    //                    shp.SetCustomIcon("<div class ='pushpinStyle_vegetables'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
    //                }
    //                else if (usrcroploc[x].planttype.toUpperCase() == "FRUITS AND NUTS") {
    //                    shp.SetCustomIcon("<div class ='pushpinStyle_nuts'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
    //                }
    //                else if (usrcroploc[x].planttype.toUpperCase() == "GREENHOUSE AND NURSERY") {
    //                    shp.SetCustomIcon("<div class ='pushpinStyle_nursery'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
    //                }
    //                else if (usrcroploc[x].planttype.toUpperCase() == "FORAGE") {
    //                    shp.SetCustomIcon("<div class ='pushpinStyle_forage'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
    //                }
    //                else{
    //                    shp.SetCustomIcon("<div class ='pushpinStyle_unknown'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
    //                }
    //                title = "Location: " + usrcroploc[x].id;
    //                description = "<b>Crop:</b> " + usrcroploc[x].croptype + "</br>";
    //                description += "<b>Crop Year:</b> " + usrcroploc[x].cropyear + "</br>";
    //                description += "<b>Organic Crop:</b> " + (usrcroploc[x].organiccrops == "1" ? "Yes" : "No") + "</br>";
    //                description += "<b>County:</b> " + usrcroploc[x].county;
    //                //description += "<b>Producer email:</b> " + locationobj[i].usremail;
    //                shp.SetDescription(description);
    //                shp.SetTitle(title);
    //                shp.SetLineColor(new VEColor(0, 255, 0, 0.3));
    //                shp.SetFillColor(new VEColor(0, 0, 0, 0.0));
    //                //polygon.SetCustomIcon(icon);
    //                //polygon.SetIconAnchor(latlon);
    //            }
    //            catch (e) {
    //                //alert(e.message);
    //                box.CloseDialog(50);
    //            }
    //        }
    //    }
    //    box1.CloseDialog(50);
        


    //}

    function DrawAllCrops() {
        ///draws crops on the map. If plotall is true, it plots all crops. Otherwise, just the conflict crops
        var box1 = new DialogBox();
        box1.message = "Plotting Crops on map...";
        box1.CreateDialog(null);
        cropshapelayer.DeleteAllShapes();
        if (usrcroploc != null) {
            for (var x = 0; x < usrcroploc.length; x++) {
                var points = SplitCoordinateString(usrcroploc[x].coordinates);
                try {
                    var shp = new VEShape(VEShapeType.Polygon, points);
                    //var polygon = new VEShape(VEShapeType.Polygon, this.polyPoints);
                    cropshapelayer.AddShape(shp);
                    if (usrcroploc[x].planttype.toUpperCase() == "FIELD CROPS") {
                        shp.SetCustomIcon("<div class ='pushpinStyle_field'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
                    }
                    else if (usrcroploc[x].planttype.toUpperCase() == "HONEYBEES") {
                        shp.SetCustomIcon("<div class ='pushpinStyle_bees'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
                    }
                    else if (usrcroploc[x].planttype.toUpperCase() == "VEGETABLES") {
                        shp.SetCustomIcon("<div class ='pushpinStyle_vegetables'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
                    }
                    else if (usrcroploc[x].planttype.toUpperCase() == "FRUITS AND NUTS") {
                        shp.SetCustomIcon("<div class ='pushpinStyle_nuts'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
                    }
                    else if (usrcroploc[x].planttype.toUpperCase() == "GREENHOUSE AND NURSERY") {
                        shp.SetCustomIcon("<div class ='pushpinStyle_nursery'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
                    }
                    else if (usrcroploc[x].planttype.toUpperCase() == "FORAGE, GRASSLAND") {
                        shp.SetCustomIcon("<div class ='pushpinStyle_forage'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
                    }
                    else {
                        shp.SetCustomIcon("<div class ='pushpinStyle_unknown'><div class='text'>" + (usrcroploc[x].id) + "</div></div>");
                    }
                    title = "Location: " + usrcroploc[x].id;
                    description = "<b>Crop:</b> " + usrcroploc[x].croptype + "</br>";
                    description += "<b>Crop Year:</b> " + usrcroploc[x].cropyear + "</br>";
                    description += "<b>Organic Crop:</b> " + (usrcroploc[x].organiccrops == "1" ? "Yes" : "No") + "</br>";
                    description += "<b>County:</b> " + usrcroploc[x].county;
                    //description += "<b>Producer email:</b> " + locationobj[i].usremail;
                    shp.SetDescription(description);
                    shp.SetTitle(title);
                    shp.SetLineColor(new VEColor(0, 255, 0, 0.3));
                    shp.SetFillColor(new VEColor(0, 0, 0, 0.0));
                    usrcroploc.shapeid = shp.GetID();
                    
                }
                catch (e) {
                    //alert(e.message);
                }
            }
        }
        box1.CloseDialog(10);
    }

    function HideNonConflictCrops() {
        if (usrcroploc != null) {
            for (var x = 0; x < usrcroploc.length; x++) {
                if (CheckPlotShape(usrcroploc[x]) == false) {
                    var shp = cropshapelayer.GetShapeByIndex(x);
                    if (shp) {
                        shp.Hide();
                    }
                }
                else {
                    var shp = cropshapelayer.GetShapeByIndex(x);
                    if (shp) {
                        shp.Show();
                    }

                }
            }
        }
    }

    function ShowAllCrops() {
        if (usrcroploc != null) {
            for (var x = 0; x < usrcroploc.length; x++) {
               

                var shp = cropshapelayer.GetShapeByIndex(x);
                if (shp) {
                    shp.Show();
                }
                
            }
        }

    }

    //function ChangeLocation(index) {
    //    //check if view all crops is checked. If yes then hide the shape and uncheck the box
    //    var el = document.getElementById('allcrop_check');
    //    if (el.checked) {
    //        el.checked = false;
    //        var shape = map.GetShapeLayerByIndex(3);
    //        if (shape) {
    //            if (shape.IsVisible())
    //            { shape.Hide(); }
    //        }
    //    }
    //    // Check if the view crops checkbox is checked . If not then check the box true
    //    var el = document.getElementById('crop_check');
    //    if (!el.checked) {
    //        el.checked = true;
    //    }
    //    // For crops present continue with 2 cases 1) state wide preference 2) area or county wide preference
    //    if (conflictcroploc) {
    //        cropdraw = 0;
    //        locindex = index;
    //        var centroid = usrcroploc[index].loccentroid.split(',');

    //        /// If shape id is already present and the preference is not statewide go ahead and plot the shape!!
    //        if (usrcroploc[index].crop) {
    //                var shp = map.GetShapeByID(usrcroploc[index].shapeid);
    //                if (shp) {
    //                    var shapeindex = 3
    //                    var shape = map.GetShapeLayerByIndex(shapeindex);
    //                    if (shape.IsVisible()) {
    //                        map.SetMapView(shp.GetPoints());
    //                    }
    //                    else {
    //                        shape.Show();
    //                        map.SetMapView(shp.GetPoints());
    //                    }
    //                }
    //        }
    //        //if (user.preference == "state") {
    //        //    var stateusrcroploc = usrcroploc;
    //        //    stateusrcroploc.sort(compare);
    //        //    for (var j = 1; j < counter; j++) {
    //        //        if (stateusrcroploc[j - 1].crop.id != stateusrcroploc[j].crop.id)
    //        //            usercropinuserapparea.push(stateusrcroploc[j - 1].crop);
    //        //    }
    //        //    var cropfound = 0;
    //        //    for (var i = 0; i < usercropinuserapparea.length; i++) {
    //        //        if (usercropinuserapparea[i].crop.id = usrcroplolc[index].crop.id)
    //        //            cropfound = 1;
    //        //    }
    //        //    if (cropfound == 1) {
    //        //        if (usercropinuserapparea[i].crop.shapeid) {
    //        //            var shp = map.GetShapeByID(usercropinuserapparea[i].crop.shapeid);
    //        //            if (shp) {
    //        //                map.SetMapView(shp.GetPoints());
    //        //            }
    //        //        }
    //        //    }

    //        //}
    //        else {
    //            var loadedDrawings = new PolygonPlotter(map);
    //            var usercropinuserapparea = new Array();
    //            if (user.preferences != "state") {
    //                for (var j = 0; j < counter; j++) {
    //                    usercropinuserapparea.push(usrcroploc[j].crop);
    //                }
    //       }
    //            else {
    //                var stateusrcroploc = usrcroploc;
    //                stateusrcroploc.sort(compare);
    //                for (var j = 1; j < counter; j++) {
    //                    if (stateusrcroploc[j - 1].crop.id != stateusrcroploc[j].crop.id)
    //                        usercropinuserapparea.push(stateusrcroploc[j - 1].crop);
    //                }
    //            }
    //            loadedDrawings.LoadMultiPolygons(usercropinuserapparea, "crop");
    //            var el = document.getElementById('crop_check');
    //            if (el) {
    //                var shapeindex = 3; //el.name.substring(el.name.length - 1);
    //                if (shapeindex < map.GetShapeLayerCount()) {
    //                    var shape = map.GetShapeLayerByIndex(shapeindex);
    //                    shape.Show();
    //                    var cropfound = 0;
    //                    var foundindex = 0;
    //                    if (user.preferences == "state") {
    //                        for ( var i = 0; i < usercropinuserapparea.length; i++) {
    //                            if (usercropinuserapparea[i].id == usrcroploc[index].id) {
    //                                cropfound = 1;
    //                                foundindex = i;
    //                            }
    //                        }
    //                        if (cropfound == 1) {
    //                            if (usercropinuserapparea[foundindex].shapeid) {
    //                                var shp = map.GetShapeByID(usercropinuserapparea[foundindex].shapeid);
    //                                if (shp) {
    //                                    map.SetMapView(shp.GetPoints());
    //                                }
    //                            }
    //                        }
    //                    }
    //                    else {
    //                        if (usrcroploc[index].crop.shapeid) {
    //                            var shp = map.GetShapeByID(usrcroploc[index].shapeid);
    //                            if (shp) {
    //                                map.SetMapView(shp.GetPoints());
    //                            }
    //                        }
    //                    }

    //                }
    //            }
    //        }

    //    }
    //}

    /// Function that calculates the realtime conflict for a particular application area
    function GoRealTimeConflict(index) {
        //var offset = index.substr(5,1);
        if (index < usrapparea.length && index >= 0) {
            var userapparea = usrapparea[index];
            ConflictCheck.RealTimeConflictCheckArea(userapparea, user, checknotificationcrops_Success, checknotificationcrops_Fail)
            box.message = "Checking for crop locations close to application:<br>" + userapparea.appareaname + "....";
            box.CreateDialog(false);
            var div = document.getElementById('cropareapanel');
            if (div) {
                div.innerHTML = "<h2>Crops closest to:</h2><h2><b>" + userapparea.appareaname + "</b></h2>";

            }
        }
    }


    function HideCrops(type) {
        // --------------------------- Rama Changes begin ----------------------------------------- 
        //var el = document.getElementById('crop_check');
        //if (el.checked) {
        //    cropdraw = -1;
        //}
        
        ///// The crops whose county match the counties where the applicator has applications are identified so that only these crops can be shown in the map instead of all the crops  
        //if (cropdraw == -1) {
        //    var loadedDrawings = new PolygonPlotter(map);
        //    if (type == 1) {
        //        var usercropinuserapparea = new Array();

        //        if (user.preferences != "state") {
        //            var cropids = createdisplaycroplist();
        //            for (var j = 0; j < cropids.length; j++) {
        //                usercropinuserapparea.push(cropids[j]);
        //            }
        //        }
        //        else {
        //            var usercropinuserapparea = new Array();

        //            for (var j = 0; j < usrcroploc.length; j++)
        //                usercropinuserapparea.push(usrcroploc[j]);
        //        }

        //        loadedDrawings.LoadMultiPolygons(usercropinuserapparea, "crop");
        //    }
        //    if (type == 2) {

        //        var usercropinuserapparea = new Array();
        //        for (var j = 0; j < usrcroploc.length; j++) {
        //            usercropinuserapparea.push(usrcroploc[j]);
        //        }
        //            loadedDrawings.LoadMultiPolygons(usercropinuserapparea, "crop");
                
        //        // --------------------------- Rama Changes End -----------------------------------------     
        //    }
        //}
        //    if (cropdraw == 0) {
                
        //        var el = document.getElementById('crop_check');
        //        if (el) {
        //            var shapeindex = 3; //el.name.substring(el.name.length - 1);
        //            if (shapeindex < map.GetShapeLayerCount()) {
        //                var shape = map.GetShapeLayerByIndex(shapeindex);
        //                if (shape) {
        //                    if (shape.IsVisible())
        //                    { shape.Hide(); }
        //                    else { shape.Show(); }
        //                }
        //            }
        //        }
        //    }
        

        //cropdraw = 0;
    }

    function HideBuffer() {
        var el = document.getElementById('buffer_check');
        if (el) {
            var shapeindex = 3;//el.name.substring(el.name.length - 1);
            if (shapeindex < map.GetShapeLayerCount()) {
                var shape = buffershapelayer; //map.GetShapeLayerByIndex(shapeindex);
                if (shape) {
                    if (shape.IsVisible()) { shape.Hide(); }
                    else { shape.Show(); }
                }
            }
        }
    }


    function ZoomToArea(index) {
        if (usrapparea) {
            areaindex = index;
            var centroid = usrapparea[index].areacentroid.split(',');
            if (usrapparea[index].shapeid) {
                var shp = map.GetShapeByID(usrapparea[index].shapeid);
                if (shp) {
                    map.SetMapView(shp.GetPoints());
                }
            }
            else {

                map.SetCenter(new VELatLong(parseFloat(centroid[0]), parseFloat(centroid[1])));
            }
            //  
        }
    }

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
                if (typeelements[child].type == type) 
                {
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
    function EnableElements(tag, type) 
    {
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
        var overlay = new HelpOverlay(document, 5);
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

    

    function checknotificationcrops_Success(retval) {
        if (retval[0] == '1') {
            conflictcroploc = JSON.parse(retval[1]);
            cropitemoffset = 0;
            counter = 0;
            
            if (user.preferences != "state") {
                for (i = 0; i < conflictcroploc.length; i++) {
                    if (conflictcroploc[i].conflictflag == 1) {
                        counter = counter + 1;
                    }
                }
            }
            else {
                counter = conflictcroploc.length;
            }
            box.CloseDialog();
            createCropsTable(1);
            
            ChangeCropView(2);
            //DrawConflictCrops();
        }
        else {
            ///error
            box.CloseDialog();
        }
        parent.adjustFrameHeight();
    
    }
    function checknotificationcrops_Fail() {
        //alert('failure');
        box.CloseDialog();
    }