<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Producer.aspx.cs" Inherits="Producer" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Texas Crops Registry</title>

    <link rel = "Stylesheet" type ="text/css" href ="CSS/Iframe.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Producer.css"/>
    <link rel="stylesheet" type="text/css" href="ModalDialog/modaldialog.css"/>
    <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"></script>
    <script type="text/javascript" src="javascript/DialogBox.js"></script>
    <script type="text/javascript" src="javascript/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="ModalDialog/modaldialog.js"></script>
    <%--<script type="text/javascript" src="javascript/util.js"></script>--%>
    <script  type ="text/javascript" src ="javascript/authenticate.js" ></script>
    <script type="text/javascript" src="javascript/producer.js"></script>
    <script type="text/javascript" src="javascript/select.options.js"></script>
    <%--<script type="text/javascript" src="javascript/mapping_tools.js"></script>--%>
    <script type="text/javascript" src="javascript/DrawingTools.js"></script>
    <script type="text/javascript" src="javascript/Navigation.js"></script>
    <script type="text/javascript" src="javascript/overlay.js"></script>
    
</head>
<body class='inner'>
<script type ="text/javascript" >
    var user = null;
    var serverval = null;
    var usrcroploc = null;
    window.onload = init_producer;
    
    
</script>

    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"/>
    <div style ='background-color: white;'>
        <table id ='maintable' class="producer">
     
        <tr>
            <td id = 'maincontent'>
                <div>
                    <%--<a id='loadhelp' onclick='Javascript:LoadHelpOverlay();' class='rctlr' style="padding-right: 25px;">Help with this page</a>--%>
                </div>
                <br />
                <div id = 'description'>
                    Loading...
                </div>
                    
                   
                
                <div id='userregions'>
                <table id = 'croplocs'>
                
                    <tr>
                    <td colspan = '2' style = 'background-color: #E0DED2;' >Your Current Crop Locations:<a id='addarea' onclick='Javascript:GoNewCrop("add");' class='rctlr'>Add New Crop Location</a></td>
                    </tr>
                    
                    <tr>
                    <td id='croplist'>
                    <div id='list' style="border: 0px solid #000000; height: 374px; width:250px;">
                    
                    </div>
                    </td>
                    <td id='mapcontent'>
                        <div id='croplocdiv'>
                            <table id='croploc' class='mapcroplocs'>
                                <tr>
                                <td>
                                    <div id='mapdiv' style="border: 0px solid #000000; height: 368px; position: relative; width:644px;"></div>
                                </td>
                                </tr>
                                
               
                            </table>
                        </div>
                    </td>
                    </tr>
                    <tr>
                       <td>
                         <div id='croppagination' ></div>    
                       </td>
                        <td>
                         <div id='legend' ></div> 
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
