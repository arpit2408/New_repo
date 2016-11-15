<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="TexasCropRegistry.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title>Texas Crop Registry</title>
    
    <link  rel="stylesheet" type="text/css" href="CSS/Styles_Default.css"/>
    <link  rel="stylesheet" type="text/css" href="CSS/Menu.css"/>
    <link  rel="stylesheet" type="text/css" href="CSS/Iframe.css"/>
    <link  rel="stylesheet" type="text/css" href="CSS/Account.css"/>
    
    <script type="text/javascript" src="javascript/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="javascript/dropmenu.js"></script>
    <script type="text/javascript" src="javascript/util.js"></script>
     <script type="text/javascript" src="javascript/account.js"></script>
    <script type="text/javascript" src="javascript/Navigation.js"></script>
    <script type="text/javascript" src="javascript/authenticate.js"></script>
    <script type="text/javascript" src="javascript/DialogBox.js"></script>
   <script type="text/javascript" src="javascript/Bowser.js"></script>
    <script type = "text/javascript">

        function GetURLParameters() {
            var match,
                    pl = /\+/g,  // Regex for replacing addition symbol with a space
                    search = /([^&=]+)=?([^&]*)/g,
                    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                    query = window.location.search.substring(1);

            urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
        }
        var urlParams = null;; ////global 

        
        var user = null;
        window.onload = initDefault;
        
        $(document).ready(function() {
             //$("#nav-one").dropmenu(); //drop down menu
             $("#nav-two").dropmenu();

        });
        function CloseHelpOverlay() {
            var overlay = document.getElementById('overlay');
            var imgoverlay = document.getElementById('imagesoverlay');
            if (overlay) {
                document.body.removeChild(overlay);
                document.body.removeChild(imgoverlay);
            }
        }
        function initDefault() {
            init();
            BrowserCompatability();
            GetURLParameters();
            if (!urlParams.page) {
                GoHome();
            }
            else {
                if (urlParams.page) {
                    if (urlParams.page == "Producer") {

                        GoProducer();
                        return;
                    }
                    if (urlParams.page == "Applicator") {

                        GoApplicator();
                        return;
                    }
                    if (urlParams.page == "Account") {
                        if (urlParams.type) {
                            //window.location = "Google.com";
                            GoAccount(urlParams.type);
                            return;
                        }
                        else {

                            GoAccount();
                            return;
                        }
                    }

                }

            }
        }
        function BrowserCompatability() {
            var err = 1;
            //alert(JSON.stringify(bowser, null, '    '));
            var div = document.getElementById('browsercompatability');
            if (div) {
                if (document.getElementById) {
                    var js = document.getElementById('detectjavascript');
                    if (js) {
                        js.style.display = 'none';
                    }
                }
                if (bowser.name == "Internet Explorer") {
                    if (bowser.version > 8) {
                        err = 0;
                    }
                }
                else if (bowser.name == "Chrome")
                {
                    if (bowser.version > 20) {
                        err = 0;
                    }

                }
                else if (bowser.name == "Firefox") {

                    if (bowser.version > 15) {
                        err = 0;
                    }
                }
                else if (bowser.name == "Opera") {

                    if (bowser.version > 9) {
                        err = 0;
                    }
                }
                else if (bowser.name == "Safari") {

                    if (bowser.version > 3) {
                        err = 0;
                    }
                }
                div.innerHTML += "<br><br>Detected Browser: <b>" + bowser.name + " version " + bowser.version + "<b><br>";
                if (err == 0) {
                    div.style.display = 'none';
                }
            }

        }
     </script>
     
    <%--<style type="text/css">
        #div_Login {
            width: 433px;
        }
    </style>--%>
     
</head>

<body>
<noscript><font face='arial'>JavaScript must be enabled in order for you to use page in standard view. However, it seems JavaScript is either disabled or not supported by your browser. To use standard view, enable JavaScript by changing your browser options, then <a href="">try again</a>. </font></noscript>
<form id="Form1" runat="server" >

    
    <div id="container">
        
    <!-- Header Images -->
    <div id="header">
       <%--<img src="images/TDA-logo.jpg" alt="TDA" width="440" height="71" border="0"  />--%>
         <img src="images/banner3.png" alt="Texas Crop Registry" width="960" height="130" border="0"  />
    </div>

    <%--<table>
    <tr>
    <td>--%>
        <%--<table cellpadding="0" cellspacing="0" width ="960px" >
    <!-- Dropdown Menu -->
    <tr>
    <td >--%>
     <div  id="div_DropMenu" style="display:inline;">
         <ul id="nav-one" class="dropmenu"  style="z-index:1000; top: 0px; left: 0px;"> 
            <li><a href="javascript:GoHome();">Home</a></li>
             
            <li><a href="javascript:GoProducer();">Producers</a></li>
            <li><a href="javascript:GoApplicator();">Applicators </a></li>
             <li><a href="javascript:GoAccount();">Register / Account</a></li>
             <li><a href="javascript:GoFAQ()">FAQ</a></li>
            <li><a href="javascript:GoMap();">Public Map</a></li>
             
             <li><a href="javascript:GoBackground();">Background</a></li>
           <%-- <li><a href="#"> sensitive crops  </a> </li>--%>
             
				<%--<ul> 
					<li><a href="#">FAQ</a></li> 
					<li><a href="#">User Guide</a></li> 
                    <li><a href="#">Contact Us</a></li> 
				</ul> --%>
			</li> 
             <li>
            <div id='div_Login' style="display: block;">
		        <table cellpadding="2" cellspacing="2" class='usermenu' id='logintable'>
		        
                <tr>
                <td class ='usermenu'>
                    <input type='text' id='userid' class='usermenu'  
                    onclick="Javascript: ChangeText(1);" onfocus= "Javascript:ChangeText(1);  "  onblur="Javascript:hideLabel(0,'blur');"  value = "Email"  />
                   <%--<label  onclick="Javascript:ChangeText();"id="emaillbl" class='usermenu' style="margin-left:10px">Email</label> %> 
                    <% onfocus="if(this.value=='Email')     this.value=''" value="Email" style="right: 189px;"  style="right: 73px;"--%>
                    
                </td>
                <td class ='usermenu'>
                    <input type='text' id='userpwd' class='usermenu' 
                    onclick="Javascript: ChangeText(2);"  onblur="Javascript:hideLabel(1,'blur');" onfocus= "Javascript:ChangeText(2);"  value ="Password" />
                    <%-- <div id='pwdlbl' class='usermenu' style="margin-left:10px;">Password</div>  value = "Password"--%>
                     
                </td>
                <td class='smallbutton'>
                <input type="button" id='sumbit1' onclick='Javascript: Signin()' value='Log In' class='smallbutton'/>
                </td>
                            
                <td><input type="button" id='Button1' onclick='Javascript: GoAccount("REQUESTPASSWORD")' value='Forgot Password' class='bigbutton'/></td>
                </tr>
                </table>
		    </div>
            <div id='div_Account' style="display: none;">
		    <table id ='userdetails' cellpadding="0" cellspacing="0" class='usermenu'  >
		    <tr>
		        <td>
                    <ul id="nav-two" class="dropmenu"  style="z-index:1000;">
                    <li><a id='user' href="#"></a> 
				        <ul id ="accountnavigation"> 
                       <%-- ---------------Rama Changes Begin -------------------------%>
					        <li><a href="#" onclick="Javascript:GoAccount('EDITDETAILS')">Edit Account</a></li>
                       <%-- ---------------Rama Changes End -------------------------%>
					        <li><a href="#" onclick='Javascript:Logoff()'>Log Out</a></li>
				        </ul> 
			        </li> 
		            </ul> 
                </td>
		    </tr>
	        </table>
		   
             
    </div>
             </li>
             
         
		</ul>
         </div>
        <div id ="browsercompatability">
            <H2 style='text-align: center'>Browser Compatibility Warning</H2><br/>
            <div id ="detectjavascript">
                <H2>We have detected that your Javascript is disabled. Javascript must be enabled.</H2><br />
                </div>
                The Texas Crop Registry is optimized for the following browsers:<br/><br/>
                Microsoft Internet Explorer 10+, Google Chrome, Mozilla Firefox, Apple Safari. <br /><br />
                You may be able to continue using some features of the site with your current browser, but we recommend that you update your browser to one of the above.



        </div>
         
		
        
             
         
         
         
   <%-- </td>
    </tr>
   </table>--%>
    <!-- Content Iframe: will have Map or Other Content from menu -->
        <table id="contenttable">
            <tr>
                <td id ="contenttd">
                    <div id="content">
                        <iframe id="contentIframe" name ="contentIframe" frameborder="0" scrolling="no"  width="100%"  height="100%" onload ="adjustFrameHeight()"></iframe>
                    </div>
                </td>
                <td id ="helptd">
                    <div id ="helpdiv">
                        "Hello"
                    </div>
                </td>
            </tr>
       </table>
    <div id="forgot_pwd" style= 'display:none'>  
   <%-- <iframe id="Iframe1" name ="contentIframe" frameborder="0" scrolling="no"  width="100%"  ></iframe>--%>
    
    <table id ='maintable' class="navigation">
     
        <tr><td id = 'maincontent'>
     <table id = 'request_password' class = 'signup' style = 'display:none'>
            <tr>
            <td colspan = '2'>
            
            </td></tr>
            <tr>
            <%--<td colspan = '2'>
            <div class = 'error' style = 'background-color: #E0DED2; font-style: italic; color: Red; display:none;'>Error</div>
            </td>--%>
            </tr>
            <tr>
            <td class='signup' colspan = '2' style = 'background-color: #E0DED2;'>User:</td>
            </tr>
            <tr>
            <td class='signup'  >User Name (email):</td><td><input id = 'email4' class='signup' type = 'text' /></td>
            </tr>
            <tr>
            <td style = 'text-align: center;' colspan = '2' class='signup'><input  id = 'submit3' class='signup' value = 'submit' type = 'button' onclick = 'Javascript:RequestPassword();'/></td>
            </tr>
            </table>
            </td>
            </tr>
            </table>
    </div>
    <!--end content-->
    <!--footer-->
    <div id="footer">
        <p>© Texas Crop Registry. All rights reserved. <a href="mailto:mtchkerian@tamu.edu?Subject=Texas Crops"></a></p>
    </div><!--end footer-->
</div><!--end container-->
   
</form>
</body>
</html>