<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PublicMap.aspx.cs" Inherits="PublicMap" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Texas Crop Registry</title>

    <link rel = "Stylesheet" type ="text/css" href ="CSS/Iframe.css" />
    <link rel="stylesheet" type="text/css" href="CSS/publicmap.css"/>
    <link rel="stylesheet" type="text/css" href="ModalDialog/modaldialog.css"/>
    <%--<link rel="stylesheet" type="text/css" href="CSS/Producer.css"/> <%--For pushpins--%>
    <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"></script>
    <script type="text/javascript" src="javascript/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="ModalDialog/modaldialog.js"></script>
    <script type="text/javascript" src="javascript/DialogBox.js"></script>
    <%--<script type="text/javascript" src="javascript/util.js"></script>--%>
    <%--<script  type ="text/javascript" src ="javascript/authenticate.js" ></script>--%>
    <script type="text/javascript" src="javascript/publicmap.js"></script>
    <script type="text/javascript" src="javascript/select.options.js"></script>
    <%--<script type="text/javascript" src="javascript/mapping_tools.js"></script>--%>
    <script type="text/javascript" src="javascript/DrawingTools.js"></script>
    <script type="text/javascript" src="javascript/overlay.js"></script>
    <%--<script type="text/javascript" src="javascript/Navigation.js"></script>--%>
</head>

<script type ="text/javascript" >
    var croplocs = null;
    var countiesObj = null;
    window.onload = init_publicmap;
    
    
</script>
    <body class='inner'>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"/>
    <div>
        <table id ='maintable' class="producer">
        <tr>
            <td id = 'maincontent'>
               <div id = 'description'>
                </div>
                <div id='userregions'>
                <table id = 'croplocs'>
                
                    <tr>
                    <td colspan = '2' style = 'background-color: #E0DED2;'> Crop Locations:</td>
                    </tr>
                    
                    <tr>
                    <td id='croplist' style ="vertical-align:top;">
                    <div id='maplegend'>
                        
                    </div>
                    </td>
                    <td id='mapcontent'>
                        <div id='croplocdiv' style='display:block;'>
                            <table id='croploc' class='mapcroplocs'>
                                <tr>
                                <td>
                                    <div id='mapdiv' style="border: 1px solid #000000; height: 600px; position: relative; width:646px;"></div>
                                </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input id="findloc" value="Search location here..." onclick="Javascript:this.select();" type="text" style="width: 588px"/>
                                            
                                            <input id="findloc_btn" value="Find" type="button" onclick="Javascript:FindLoc();" 
                                            style="width: 50px" />
                                    </td>
                                </tr>
               
                            </table>
                        </div>
                        <div id='cropviewdiv' style='display:none; height:500px; overflow-y:auto; overflow-x:hidden;'></div>
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
