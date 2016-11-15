<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Home.aspx.cs" Inherits="Home" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Texas Crop Registry</title>
    <link href="CSS/Styles.css" rel="stylesheet" type="text/css" />
    <%--<script type="text/javascript" src="javascript/TSC_home.js"></script>--%>
    <script type="text/javascript" src="javascript/Navigation.js"></script>
    <%--<script type="text/javascript" src="javascript/authenticate.js"></script>--%>
    <script  type ="text/javascript" src ="javascript/authenticate.js" ></script>
    <script type="text/javascript" src="javascript/overlay.js"></script>
    <script type="text/javascript" src="javascript/jquery-1.4.2.min.js"></script>
</head>
<body>
    <script type ="text/javascript" >
        function LoadHelpOverlay() 
        {
            var overlay = new HelpOverlay(document, 1);
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
        window.onload = init;
        function init() {
            parent.adjustFrameHeight();
        }
    </script>
    <form id="form1" runat="server">
    
    <div>
    <%--<a id='loadhelp' onclick='Javascript:LoadHelpOverlay();' class='rctlr'>Help with this page</a>--%>
    </div>
    <div id ="maindetails">
    <h2 style="text-align:center"><b>The Texas Crop Registry</b><br />An essential tool to minimize the impact of pesticide drift</h2>
        <br />
        <h3><b>The registry is based on a simple concept:</b></h3>
<ol style="font-size: 16px;">
   <li><b>Producers</b>  for example farmers, ranchers, greenhouse growers, bee keepers can use this web-site to enter the location and information of their crop, or enterprise, on a computerized map. The type and location of their crop is then made available to pesticide applicators through this registry.<br /><br /></li>
 <li><b>Pesticide applicators</b> can search the registry to inform themselves of the location of nearby crops and their sensitivity to off-target drift. Plans can then be made to eliminate or minimize pesticide drift.</li>
</ol>
        <br/><h3>For more information about the rationale and importance of the Texas Crop Registry, click <a href = "Javascript:parent.GoBackground()">here</a>.</h3><br />
<h3><br /><b>To use the Texas Crop Registry:</b></h3><br />
<ol style="font-size: 16px; margin: 0 20px 20px 0;">
<li style="font-size: 16px; margin: 0 20px 20px 0;"><b>Register</b> to contribute or view information. You  only need to register once, and this will allow you to view and contribute information as a producer and/or an applicator. You will be asked to provide some contact details and an email that will be used as your username. After registration, a onetime only password will be sent to the email you provided. Click <a href ="Javascript:parent.GoAccount()">here</a> to go to the registration page.</li> 
<li style="font-size: 16px; margin: 0 20px 20px 0;"><b>Login</b> to the Registry using your email as a user ID, and your auto-generated password sent via email. We suggest you change your auto-generated password to something more memorable. If you ever forget your password, you can retrieve a new one via email <a href ="Javascript:parent.GoAccount(3)">here</a>.</li>
<li style="font-size: 16px; margin: 0 20px 20px 0;"><b>If you are a producer</b>  and would like to add a growing location, click the Producer menu item (or click <a href ="Javascript:parent.GoProducer()">here</a>). You will be directed to a page that helps you manage existing locations, or add new ones.</li>
<li style="font-size: 16px; margin: 0 20px 20px 0;"><b>If you are a pesticide applicator</b> and would like to view crops close to a proposed application area click the Applicator menu item (or click <a href ="Javascript:parent.GoApplicator()">here</a>). You will be directed to web-tools that you can use to manage application areas, view crop locations, and to notify you of additions to the registry.</li>
 </ol>
<h3>For more detailed instructions about using the registry, please see the FAQ sections <a href ="Javascript:parent.GoFAQ()">here</a></h3>

 <h3>
<br/>The registry is intended for commercial sites that are at least a half-acre.  It is not intended for homeowners. To be in the registry, the crops:<br /> 
</h3>
<ul style="font-size: 16px;">
 <li>
Must be for commercial use.
    </li>
    <li>
Must meet minimum total acreage requirements of:
    </li> 
    <ul style="font-size: 16px;">
    <li>
Half an acre for fruits and vegetables
    </li> 
    <li>
One acre for all other crops and  certified organic crops
    </li> 
    <li>
If it is an organic crop, it must be produced under an organic certification program.
    </li> 
        </ul>
     
</ul>
    
<h3>Acknowledgements</h3>
<p>
The Texas Crop Registry recognizes the Knowledge Engineering Laboratory of the Department of Entomology at Texas A&M University, along with Texas A&M AgriLife Research for developing this website.  The Texas Department of Agriculture is recognized for their leadership and support of the website.  The Agriculture and Environmental Safety group of Texas A&M AgriLife Extension Service is acknowleged for supporting the website.
</p>
<h3>Disclaimer</h3>
<p>
The Texas A&M University System and the  Texas Department of Agriculture assumes no liability for the accuracy of the information provided by the producers of for any damages to persons, real property or personal property or for any cause of action relating to the use of any information provided to or placed on the sensitive crop registry. The registry is provided as a service to producers and pesticide applicators and does not eliminate any liability of the registry user regarding compliance with all applicable laws and regulations.
    </p>   
     <br />
        <br />
     </div>
    </form>
</body>
</html>
