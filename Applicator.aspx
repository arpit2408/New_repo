<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Applicator.aspx.cs" Inherits="Applicator" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Texas Crop Registry Website</title>

    <link rel = "Stylesheet" type ="text/css" href ="CSS/Iframe.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Applicator.css"/>
    <link rel="stylesheet" type="text/css" href="ModalDialog/modaldialog.css"/>
    <link rel="stylesheet" type="text/css" href="CSS/Producer.css"/>
    <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"></script>
    <script type="text/javascript" src="javascript/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="ModalDialog/modaldialog.js"></script>
    <%--<script type="text/javascript" src="javascript/util.js"></script>--%>
    <script  type ="text/javascript" src ="javascript/authenticate.js" ></script>
    <script type="text/javascript" src="javascript/DialogBox.js"></script>
    <script type="text/javascript" src="javascript/applicator.js"></script>
    <script type="text/javascript" src="javascript/select.options.js"></script>
    <script type="text/javascript" src="javascript/lat.lon.calculations.js"></script>
    <script type="text/javascript" src="javascript/DrawingTools.js"></script>
    <script type="text/javascript" src="javascript/Navigation.js"></script>
    <script type="text/javascript" src="javascript/overlay.js"></script>
    <script type="text/javascript" src="javascript/Countyselector.js"></script>
    <script type="text/javascript" src="javascript/util.js"></script>
   
</head>
<body class='inner'>
<script type ="text/javascript" >
    var user = null;
    var serverval = null;
    var usrapparea = null;
    var usrcroploc = null;
    window.onload = init_applicator;
    //window.onload = GetMap;
 </script>

    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" EnableScriptGlobalization="True">
            <Services>
                <asp:ServiceReference Path="ConflictCheck.asmx" />
                <asp:ServiceReference Path="WebService.asmx" />
                <asp:ServiceReference Path="Login.svc" />
            </Services>
        </asp:ScriptManager>


    <div style ='background-color: white;'>
        <table id ='maintable' class="applicator">
     
        <tr>
            <td id = 'maincontent'>
                <div>

                    <%--<a id='loadhelp' onclick='Javascript:LoadHelpOverlay();' class='rctlr' style="padding-right: 25px;">Help with this page</a>--%>
<%--shalini--%>
                    <%--<a id='A1' onclick='Javascript:getIP();' class='rctlr' style="padding-right: 25px;">get IP</a>--%>
           <%--  <div id ="ipadd"> your IP Address will be displayed here </div>--%>
           
                         </div>
                
                <div id = 'description'>
                    
                </div>
                
                <div id='preferences'>
                     <table id='emailoptions'>
                        <tr>
                        <td colspan = '3' style = 'background-color: #E0DED2;vertical-align:middle;'>Notification Preferences:<a id='editpref' onclick='Javascript:EditPreferences();' class='rctlr'>Edit</a></td>
                        </tr>
                         <tr>
                             <td>
                         
                        <div id ="notificationprefs" style ="display: none">
                        <table id='emailopt'>
                        <tr>
                            <td class='preferences'>
                                <input id='stateopt' type='radio' name ='notifications' value='state' 
                                    checked="checked" onclick='Javascript:hideSelectCtrl();'/>
                                <label for='stateopt'>State wide</label>
                            </td>
                            <td>
                            <input id='emailchkbox' type = "checkbox" checked = "checked"/>
                            <label for ='emailchkbox'>Notify me through email on new crops added under my application area(s)</label>
                            </td>
                        </tr>
                        
                        <tr>
                            <td class='preferences'>
                                <input id='usrareaopt' type='radio' name ='notifications' value='area' onclick='Javascript:hideSelectCtrl();'/>
                                <label>By Distance:&nbsp;</label>
                                <input id='distance' type ="text" style ="width :25px"/>
                                <label for='usrareaopt'>&nbsp;Miles or less from your application area(s)</label>
                                 
                               
                            </td>
                       </tr>
                         <tr>
                            <td class='preferences'>
                                <input id='countiesopt' type='radio' name ='notifications' value='counties' 
                                    onclick='Javascript: PopulateSelectCtlr();' />
                                <label for='countiesopt'>Specific counties</label>
                            </td>
                            
                            <td class='preferences'>
                                <select id='counties' name='counties' style="visibility: hidden; display: none;" multiple="multiple" size="10"></select>
                                <div id ="countyselector"></div>
                            </td>
                        </tr>
                        </table>

                     <div id='prefsvcdiv' style="display: none" align="right">
                        <span>
                            <a onclick='Javascript:SavePreferences();' class='clickable'>Save</a> |
                            <a onclick='Javascript:CancelEditPreferences();' class='clickable'>Cancel</a>
                        </span>
                        </div>
                        
                    </div>
                                 </td></tr>
                         </table>
                  </div> <%--End Preferences Div--%>
               
                <div id='userregions'>
                    <table id = 'appareas'>
                    <tr>
                    <td colspan = '3' style = 'background-color: #E0DED2;vertical-align:middle;'>Your Application Areas:</td>
                    </tr>
                    <tr>
                    <td id='Td1'>
                    <div id='appareapanel' >
                        
                    </div>
                    </td>
                      <td>
                    <div id='mapareapanel' ></div>
                     </td>
                        <td id='Td2'>
                            <div id="cropareapanel">
                        </div>
                       </td>
                     </tr>
                    <tr>
                    <td id='areaslist'>
                    <div id='list'>
                        
                    </div>
                    </td>
                    <td id='mapcontent'>
                        <div id='appareadiv'>
                        <table id='apparea' class='mapappareas'>
                            <tr>
                            <td>
                                <div id='mapdiv' style="border: 0px solid #000000; height: 500px; position: relative; width:494px;"></div>
                            </td>
                            </tr>
                            <%--<tr>
                                <td>
                                    <input id="findloc" value="Search location here..." type="text" style="width: 343px"/>
                                        
                                        <input id="findloc_btn" value="Find" type="button" onclick="FindLoc()" 
                                        style="width: 50px" />
                                </td>
                            </tr>--%>
                            
                        </table>
                        </div>
                    </td>
                        <td id='croplist'>
                            <div id="cropareas" ">

                            </div>

                        </td>
                    </tr>
                        <tr>
                            <td>
                                
                                <div id ="apppagination">

                                </div>

                            
                            </td>
                            <td>
                                <div id="maplegend">
                                

                                </div>

                            </td>
                            <td >
                                <div id ="croppagination">

                                </div>

                            </td>
                        </tr>
                    
                </table>
                </div>
                <div id = 'error' align='center' 
                    style = 'background-color: #E0DED2; font-style: italic; color: Red; display:none;'>Error</div>
                <br />
                
            </td>
        </tr>
        </table>
    
    </div>
    </form>
</body>
</html>
