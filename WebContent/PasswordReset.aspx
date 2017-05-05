<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PasswordReset.aspx.cs" Inherits="WebContent_PasswordReset" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Hit the Target</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/Register.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/landingPage.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script type="text/javascript" src="../javascript/bootstrap.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/loginUser.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/common.js"></script>
</head>
<body>
    <script type="text/javascript">
        //window.onload = passwordlinkcheck;
    </script>
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" id="navBar" style="background-color: #4e0b0b; color: #fff">
        <div class="container-fluid">

            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a class="navbar-brand" href="#">
                    <img alt="TAMUlogo" src="/images/TAM-Logo-white.png" style="max-width: 81%;" /></a>
                <a class="navbar-brand" href="http://kelab.tamu.edu/" target="_blank">
                    <img alt="KELlogo" src="/WebContent/Images/HomePage/KELlogo_sm.jpg" style="max-width: 93%; padding-top: 10px" /></a>
                <a class="navbar-brand" href="https://agrilifeextension.tamu.edu/" target="_blank">
                    <img alt="" src="/WebContent/Images/HomePage/agri_extension.jpg" class="img-responsive" style=" padding-left: 10px; padding-top: 10px; max-width: 115%;" /></a>
				


            </div>
        </div>
    </nav>
    <div style="margin-top:10%;max-width:100%;">
        <form id="form1" runat="server">
            <div>
                <div class="container">
                    <div class="panel panel-info">

                        <div class="panel-body">
                            <div class="row">
                                <div class="alert alert-danger" id="passerrormessage" style="display: none"></div>
                                <div class="alert alert-success" id="passsuccessmessage" style="display: none"></div>


                                <div class=" col-md-12 col-lg-12 ">
                                    <table class="table table-user-information  ">
                                        <tbody>

                                            <tr>
                                                <td>New Password:</td>
                                                <td>
                                                    <input type="password" class="form-control" id="newPass" /></td>
                                            </tr>
                                            <tr>
                                                <td>Confirm password:</td>
                                                <td>
                                                    <input type="password" class="form-control" id="confimPass" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="row">
                                        <div class="col-md-2"><a href="#" class="btn btn-primary form-actions" type="submit" onclick="passWordResetVialink()">Save Details</a></div>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div id="footer"></div>
</body>
<script>
    $.get("footer.html", function (data) {
        $("#footer").replaceWith(data);
    });
</script>
</html>
