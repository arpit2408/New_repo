<%@ Page Language="C#" AutoEventWireup="true" CodeFile="NewCrop.aspx.cs" Inherits="NewCrop" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Texas Crop Registry</title>

    <link rel = "Stylesheet" type ="text/css" href ="CSS/Iframe.css" />
    <link rel="stylesheet" type="text/css" href="CSS/newcrop.css"/>
    <link rel="stylesheet" type="text/css" href="ModalDialog/modaldialog.css"/>
    <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"></script>
    <script type="text/javascript" src="javascript/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="ModalDialog/modaldialog.js"></script>
    <script type="text/javascript" src="javascript/DialogBox.js"></script>
    <%--<script type="text/javascript" src="javascript/util.js"></script>--%>
    <script  type ="text/javascript" src ="javascript/authenticate.js" ></script>
    <script type="text/javascript" src="javascript/newcrop.js"></script>
    <script type="text/javascript" src="javascript/select.options.js"></script>
    <%--<script type="text/javascript" src="javascript/mapping_tools.js"></script>--%>
    <script type="text/javascript" src="javascript/latlon.calculations.js"></script>
    <script type="text/javascript" src="javascript/DrawingTools.js"></script>
    <script type="text/javascript" src="javascript/Navigation.js"></script>
    <script type="text/javascript" src="javascript/overlay.js"></script>
</head>
<body class='inner'>
<script type ="text/javascript" >
    var user = null;
    var serverval = null;
    var usrcroploc = null;
    window.onload = init_newcrop;
    
    
</script>

    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"/>
    <div style="background-color:white">
        <table id ='maintable' class="producer">
     
        <tr>
            <td id = 'maincontent'>
            
                <table class = 'addlocation'><tr>
                    
                    <td colspan = '2'>
                    <div id = 'description'>
                    Loading...
                    
                    </div>
                    <%--<span>
                    <a onclick='Javascript:CreateNewLocation()' class='clickable'>Add New Location</a> | 
                    <a onclick='Javascript:CancelNewLocation()' class='clickable'>Cancel New Location</a>
                    </span>
                    
                    <br />--%>
                    <br />
                    <div id='locationsctrl'>
                    
                    </div>
                    </td></tr>
                </table>
                
                <div id='cropinfodiv'>
                <table id = 'cropinfo' class = 'addlocation'>
                
                    <%--<tr>
                    
                    </tr>--%>
                    <tr>
                    <td class='addlocation' colspan = '2' style = 'background-color: #E0DED2;'>Crop Information:<%--<a id='areaedit' onclick='Javascript:EditLocation()' class='rctlr'>Edit</a>--%></td>
                    </tr>
                    <tr>
                    <td class='addlocation'>Plant Type*:</td>
                    <td>
                    <select id="planttype" name="planttype" onchange='Javascript:CreateCropOptions(this.options[this.selectedIndex].value);'>
                        
                    </select>
                    </td>
                    </tr>
                    <tr>
                    <td class='addlocation'>Crop*:</td>
                    <td>
                    <select id="croptype" name="croptype" style="visibility: hidden; display: none;"></select>
                    <%--<select id="vegetables" name="vegetables" style="visibility: hidden; display: none;"></select>--%>
                    </td>
                    
                    </tr>
                    <tr>
                    <td class='addlocation'>Crop Year:</td><td class='addlocation'><input id = 'cropyear' class='addlocation' disabled ="disabled" type = 'text' /></td>
                    </tr>
                    
                    <tr>
                    <td class='addlocation'>Number of Acres:</td><td class='addlocation'><input id = 'acres' class='addlocation' type = 'text' disabled ="disabled"/></td>
                    </tr>
                    <tr>
                    <td class='addlocation'>County:</td><td class='addlocation'><input id = 'countyselected' class='addlocation' type = 'text' disabled ="disabled"/></td>
                    </tr>
                    <tr>
                    <td colspan='2'>
                        <input id = 'organic_check'  name='organic_check' type = 'checkbox' 
                                           style="margin-left: -3px; margin-right: 0; width: 20px;" 
                                          />&nbsp;&nbsp;
                                    <label for="organic_check" style='width:180px;'>Check this box if this is a certified organic crop.</label></td>
                    </tr>
                    <%--
                     onchange="Javascript:document.getElementById('certifier').disabled = document.getElementById('organic_check').checked?'':'disabled';"
                    <tr>
                    <td class='addlocation'>Certified By*:</td><td><input class='addlocation' id = 'certifier' type = 'text' disabled="disabled" /></td>
                    </tr>--%>
                    <tr>
                    <td class='addlocation'>Comments or Description:</td><td><textarea class='' id = 'comments' name = 'comments'  rows="8" cols="22" style="width:200px;"></textarea></td>
                    </tr>
                    <tr>
                    <td colspan='2' align="right">
                    <div id='locsvcdiv' style="display: none" align="right">
                        <br />
                        <br />
                        <span>
                        
                        <a onclick='Javascript:SubmitNewLocation()' class='clickable'>Submit</a>   
                        <a id="deletebtn" onclick ='Javascript:DeleteLocation()' class='clickable'>&nbsp&nbsp&nbsp Delete Crop</a> 
                        <a onclick='Javascript:CancelEditLocation()' class='clickable'>&nbsp&nbsp&nbsp Cancel</a>
                        </span>
                        <br />
                        <br />
                    </div>
                    <div id='backbuttondiv' style="display: none" align="right">
                        <br />
                        <%--<span>--%>
                        <%--<a onclick='Javascript:EditLocation()' class='clickable'>Save</a> | --%>
                        <a onclick='Javascript:GoProducer();' class='clickable'>My Crops Map</a>
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
                <div id='croplocdiv'>
                <table id='croploc' class='addlocation'>
                    <tr>
                    <td class='addlocation' colspan = '2' style = 'background-color: #E0DED2;'>Crop Location:</td>
                    </tr>
                    <tr>
                    <%--<td class='addlocation'>County:</td>--%>
                    <td colspan ="2">
                    <span>Zoom to a County: <select style="width: 200px" id='counties' name='counties' onchange="Javascript:document.getElementById('findloc').value = this.options[this.selectedIndex].value + ' county, TX';FindLoc();"></select> or search for a zipcode, city or address</span>
                    <%--<input id = 'county'  class='addlocation' type = 'text' />--%>
                    </td>
                        </tr>
                    <tr>
                    <td colspan =" 2">
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
                                Zoom and Pan the map to locate your field boundary, and center it within the map so that you can see the whole area. 
                                </li>
                               <li>
                           <a id ='startdrawing' href="Javascript: StartDrawing()">Click Here to Start Drawing</a> (Use <b>Left Mouse Button</b> to define each corner). Perfect field boundaries are not necessary. Use just enough care to let an applicator know the boundary of the growing area)
                               </li>
                               <li>
                                Click the link above to finish drawing. <b>If you make a mistake</b>, finish drawing the current shape, then just repeat step 3. 
                               </li>
                               <li>
                           Fill out the crop details on the left, and then press submit.
                               </li>
                            </ol>
                       </td>
                        <td></td>
                    </tr>
                    
                    <tr>

                    <td colspan ="2">
                        <div id='mapdiv' 
                            style="border: 1px solid #000000; height: 530px; position: relative; width:400px;"></div>
                    </td>
                    </tr>
                    <tr>
                        
                    </tr>
                    <%--<tr>
                    <td>
                        <textarea class="" id="coordinates" name="coordinates" rows="8" 
                            cols="47" readonly="readonly"></textarea>
                    </td>
                    </tr>--%>
                    
                </table>
                </div>
            
        <%--<tr>
            <td colspan = '2' class='addlocation' style = 'text-align: center;' ><input style = 'text-align: center;' id = 'submit1' class='addlocation' value = 'submit' type = 'button' onclick = 'Javascript:SubmitNewLocation()' /></td>
        </tr>--%>
        
    
    </div>
    </form>
    <%-- end Dialog Box stuff - Login--%>
</body>
</html>
