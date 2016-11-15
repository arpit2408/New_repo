<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Account.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Texas Crop Website</title>
    <link rel = "Stylesheet" type ="text/css" href ="CSS/Iframe.css" />
    <link rel = "Stylesheet" type ="text/css" href ="CSS/Account.css" />
    <link rel = "Stylesheet" type ="text/css" href ="ModalDialog/modaldialog.css" />
    <script type="text/javascript" src="javascript/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="ModalDialog/modaldialog.js"></script>
    <script  type ="text/javascript" src ="javascript/authenticate.js" ></script>
    <script  type ="text/javascript" src ="javascript/account.js" ></script>
    <script type="text/javascript" src="javascript/Navigation.js"></script>
    <script type="text/javascript" src="javascript/overlay.js"></script>
    <script type="text/javascript" src="javascript/util.js"></script>
        
</head>
<body class='inner'>
<script type ="text/javascript" >

    var user = null;
    var serverval = null;
    window.onload = init_acc;
    
    
</script>

    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"/>
    <div >
        <table id ='maintable' class="navigation">
     
        <tr><td id = 'maincontent'>
        
            <table class = 'signup'><tr>
            <td colspan = '2'>
            <div>
                <%--<a id='loadhelp' onclick='Javascript:LoadHelpOverlay();' class='rctlr'>Help with this page</a>--%>
            </div>
            <div id = 'description'>
            Loading...
            </div>
            </td></tr>
            </table>
            <table id = 'signup' class = 'signup'>
            
            <tr>
            
            </tr>
            <tr>
            <td class='signup' colspan = '2' style = 'background-color: #E0DED2;'>User:</td>
            </tr>
            <tr>
            <td class='signup'>User Name (email)*:</td><td><input id = 'email1' class='signup' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup' colspan = '2' style = 'background-color: #E0DED2;'>Details:</td>
            </tr>
            <tr>
            <td class='signup'>First Name*:</td><td class='signup'><input id = 'firstname' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup'>Last Name*:</td><td class='signup'><input id = 'lastname' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup'>Farm/Company Name*:</td><td class='signup'><input id = 'companyname' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup'>Address*:</td><td class='signup'><input id = 'address' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup'>City*:</td><td><input class='signup' id = 'city' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup'>State*:</td><td><input class='signup' id = 'state' type = 'text'  value='TX' readonly="readonly" /></td>
            </tr>
            <tr>
            <td class='signup'>Zip Code*:</td><td><input class='signup'  id = 'zip' type = 'text' /></td>
            </tr>
            
            <tr>
            <td class='signup'>Website:</td><td><input class='signup' id = 'website' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup'>Business Phone*:</td><td><input id = 'phone1' class='signup' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup'>Mobile Phone:</td><td><input class='signup' id = 'phone2' type = 'text' /></td>
            </tr>
            <%--<tr>
            <td class='signup' id='licensecell' style="display:none;"></td><td class='signup'><input id = 'license' type = 'text' style="display:none;"/></td>
            </tr>--%>
            
            <tr>
            <td colspan = '2' class='signup' style = 'text-align: center;' ><input style = 'text-align: center;' id = 'submit1' class='signup' value = 'submit' type = 'button' onclick = 'Register()'/></td>
            </tr>
            </table>
           
             <%--Change Password Part--%>
            <table id = 'change_password' class = 'signup' style = 'display:none'>
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
            <td class='signup'  >User Name (email):</td><td><input id = 'email3' class='signup' type = 'text' /></td>
            </tr>
            <tr>
            <td class='signup' colspan = '2' style = 'background-color: #E0DED2;'>Password:</td>
            </tr>
            <tr>
            <td class='signup'>Old Password:</td><td class='signup'><input id = 'oldpassword' type="password" /></td>
            </tr>
            <tr>
            <td class='signup'>New Password:</td><td class='signup'><input id = 'password1' type="password" /></td>
            </tr>
            <tr>
            <td class='signup'>Retype New Password:</td><td><input class='signup'  id = 'password2' type="password" /></td>
            </tr>
            <tr>
            <td colspan = '2' class='signup' style = 'text-align: center;' ><input style = 'text-align: center;' id = 'submit2' class='signup' value = 'submit' type = 'button' onclick = 'ChangePassword()'/></td>
            </tr>
            </table>
             <%--Request Password Part--%>
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
            <td style = 'text-align: center;' colspan = '2' class='signup'><input  id = 'submit3' class='signup' value = 'submit' type = 'button' onclick = 'RequestPassword()'/></td>
            </tr>
            </table>
            <br />
            <div id = 'error' align='center' style = 'background-color: #E0DED2; font-style: italic; color: Red; display:none;'>Error</div>
            <br />
            <div id='actions' align='center'>
            <span>
            <a onclick = 'ChangeForm(2)' href = '#'>Change Password</a> | <a onclick = 'ChangeForm(3)' href = '#'>Forgotten Password</a> | <a onclick = 'ChangeForm(4)' href = '#'>Edit Details</a>
            </span>
            </div>
        
            
        </td></tr>
        </table>
    
    </div>
    </form>
   
</body>
</html>
