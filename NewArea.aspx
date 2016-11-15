<%@ Page Language="C#" AutoEventWireup="true" CodeFile="NewArea.aspx.cs" Inherits="NewArea" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Texas Crop Registry</title>

    <link rel = "Stylesheet" type ="text/css" href ="CSS/Iframe.css" />
    <link rel="stylesheet" type="text/css" href="CSS/newlocation.css"/>
    <link rel="stylesheet" type="text/css" href="ModalDialog/modaldialog.css"/>
    <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"></script>
    <script type="text/javascript" src="javascript/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="ModalDialog/modaldialog.js"></script>
    <script type="text/javascript" src="javascript/DialogBox.js"></script>

    <script  type ="text/javascript" src ="javascript/authenticate.js" ></script>
    <%--<script type="text/javascript" src="javascript/applicator.js"></script>--%>
    <script type="text/javascript" src="javascript/newlocation.js"></script>
    <script type="text/javascript" src="javascript/select.options.js"></script>
    <script type="text/javascript" src="javascript/latlon.calculations.js"></script>
    <script type="text/javascript" src="javascript/DrawingTools.js"></script>
    <script type="text/javascript" src="javascript/Navigation.js"></script>
    <script type="text/javascript" src="javascript/overlay.js"></script>
</head>
<body class='inner'>
<script type ="text/javascript" >
    var user = null;
    var serverval = null;
    var usrapparea = null;
    window.onload = init_newarea;
    
    
</script>

    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"/>
    <div style="background-color:white">
        <table id ='maintable' class="applicator">
     
        <tr>
            <td id = 'maincontent'>
            
                <table class = 'addlocation'><tr>
                    <td colspan = '2'>
                    <div id = 'description'>
                    Loading...
                    
                    </div>
                    
                   <%-- <br />
                    <span>
                    <a onclick='Javascript:CreateNewAppArea()' class='clickable'>Add New Area</a> | 
                    <a onclick='Javascript:CancelNewAppArea()' class='clickable'>Cancel New Area</a>
                    </span>--%>
                    <br />
                    <div id='areasctrl'>
                    
                    </div>
                    </td></tr>
                </table>
                
                <div id='appinfodiv'>
                <table id = 'appinfo' class = 'addlocation'>
                
                    <tr>
                    <td class='addlocation' colspan = '2' style = 'background-color: #E0DED2;'>Application Area Information:<a id='areaedit' onclick='Javascript:EditAppArea()' class='rctlr'></a></td>
                    </tr>
                    <tr>
                    <td class='addlocation'>County:</td><td class='addlocation'><input readonly="readonly" id='countyselected' class='addlocation' type = 'text' disabled ="disabled"/></td>
                    </tr>
                    <tr>
                    <td class='addlocation'>Number of Acres:</td><td class='addlocation'><input readonly="readonly" id = 'acres' class='addlocation' type = 'text' /></td>
                    </tr>
                    <tr>
                    <td class='addlocation'>Name of Application Area:</td><td><input class='addlocation' id = 'appareaname' type = 'text' /></td>
                    </tr>
                    <tr>
                    <td class='addlocation'>Pesticide Name:</td><td><input class='addlocation' id = 'pesticide' type = 'text' /></td>
                    </tr>
                    <tr>
                    <td class='addlocation'>Comments or Description:</td><td><textarea class='' id = 'comments' name = 'comments'  rows="8" cols="22" style="width:200px;"></textarea></td>
                    </tr>
                    <tr>
                    <td colspan='2' align="right">
                        <div id='areasvcdiv' style="display: none" align="right">
                            <br /><br />
                            <span>
                            <a onclick='Javascript:SubmitNewAppArea()' class='clickable'>Submit</a>&nbsp&nbsp&nbsp
                            <a id = 'deletebtn' onclick='Javascript:DeleteAppArea()' class='clickable'>Delete Location</a>&nbsp&nbsp&nbsp
                            <a onclick='Javascript:CancelEditAppArea()' class='clickable'>Cancel</a>
                            </span>
                            <br /><br /><br /><br /><br /><br /><br /><br />
                        </div>
                        <div id='backbuttondiv' style="display: none" align="right">
                        <br />
                        <%--<span>--%>
                        <%--<a onclick='Javascript:EditLocation()' class='clickable'>Save</a> | --%>
                        <a onclick='Javascript:GoApplicator();' class='clickable'>My Appications Map</a>
                        <%--</span>--%>
                        <br />
                        <br />
                    </div>
                    </td>
                    </tr>
                </table>
                
                </div>
                
                <div id = 'error' align='center' 
                    style = 'background-color: #E0DED2; font-style: italic; color: Red; display:none;'>Error</div>
                <br />
                
            </td>
            
            <td id='mapcontent'>
                <div>
                    <%--<a id='loadhelp' onclick='Javascript:LoadHelpOverlay();' class='rctlr' style="padding-right: 32px; right:0px; top:0px; position:fixed;">Help with this page</a>--%>
                </div>
                <div id='appareadiv'>
                <table id='apparea' class='addlocation'>
                    <tr>
                    <td class='addlocation' colspan = '2' style = 'background-color: #E0DED2;'>Application Areas:</td>
                    </tr>
                    <tr>
                    <td colspan= '2' class='addlocation'>Zoom To County: <select id='acounties' name='acounties' onchange="Javascript:document.getElementById('findloc').value = this.options[this.selectedIndex].value + ' county, TX';FindLoc();"></select>
                    </td>
                    </tr>
                    <tr>
                        <td>
                            Or search by zip, city or address: <br />
                            <input id="findloc" value="Search location here..." onclick="Javascript: this.select();" type="text" style="width: 342px"/>
                                
                                <input id="findloc_btn" value="Find" type="button" onclick="Javascript: FindLoc();" 
                                style="width: 50px" />
                        </td>
                    </tr>
                    <tr>
                    <td>
                         <ol>
                               <li>
                                Use the controls  above to zoom to a general area of Texas (e.g. select a county, or type in an address or zipcode).
                               </li>
                               <li>
                                Zoom and Pan the map to locate your application boundary, and center it within the map so that you can see the whole area. 
                                </li>
                               <li>
                           <a id ='startdrawing' href="Javascript: StartDrawing()">Click Here to Start Drawing</a> (Use <b>Left Mouse Button</b> to define each corner).
                               </li>
                               <li>
                                Click the link above to finish drawing. <b>If you make a mistake</b>, finish drawing the current shape, then just repeat step 3. 
                               </li>
                               <li>
                                Fill out the applications on the left, and then press submit to save the area to your list.
                               </li>
                            </ol>

                    </td>
                        <td></td>
                     </tr>   
                    <tr>
                    <td>
                        <div id='mapdiv' 
                            style="border: 1px solid #000000; height: 530px; position: relative; width:400px;"></div>
                    </td>
                    </tr>
                    
                    <%--<tr>
                    <td>
                        <textarea class="" id="coordinates" name="coordinates" rows="8" 
                            cols="47" readonly="readonly"></textarea>
                    </td>
                    </tr>--%>
                    
                </table>
                </div>
            </td>
        </tr>
        <%--<tr>
            <td colspan = '2' class='addlocation' style = 'text-align: center;' ><input style = 'text-align: center;' id = 'submit1' class='addlocation' value = 'submit' type = 'button' onclick = 'Javascript:SubmitNewAppArea()' /></td>
        </tr>--%>
        </table>
    
    </div>
    </form>
</body>
</html>
