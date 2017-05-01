<%@ Page Language="C#" AutoEventWireup="true" CodeFile="RegisterNewUser.aspx.cs" Inherits="WebContent_RegisterNewUser" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
   <link rel="icon" href="/WebContent/Images/HomePage/logo_icon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/Register.css">
    <script type="text/javascript" src="../javascript/bootstrap.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/common.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/registerNew.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/countries.js"></script>
    <!-- Website Font style -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
    <!-- Google Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/landingPage.css">
    <title>Admin</title>

    <script>
        $.get("HeaderNav.html", function (data) {
            $("#header").replaceWith(data);
        });

    </script>
    <style>
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid blue;
  border-right: 16px solid green;
  border-bottom: 16px solid red;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
</head>
<body>
    <!-- /.header  -->
    <div id="header">
    </div>

    <!-- /.header end -->
    <div class="container">
        <div class="row main">
            
            <div class="panel-heading">
                
                <div class="panel-title text-center">
                    <h1 class="title" style="color: #1d0000">Hit the Target</h1>
                    <hr />
                </div>
                <label id="messages_content"/>
            </div>
            <div id="loading-modal" class="modal fade">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <%--<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>--%>
                            <h4 class="modal-title">Registering user to the database. Please wait.</h4>
                        </div>
                        <div class="modal-body">
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                    <span class="sr-only">0% Complete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-login main-center" >
                <div id="messages" class="hide" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                
                <div class="alert alert-danger" id="errormessage" style="display: none"></div>
                <div class="alert alert-success" id="successmessage" style="display: none"></div>
                <form id="registerUserForm" runat="server">
                    <asp:ScriptManager ID="ScriptManager1" runat="server" ScriptMode="Release" EnablePageMethods="true"></asp:ScriptManager>
                    <div class="form-group">
                        <label for="name" class="cols-sm-2 control-label">First Name</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" name="name" id="name" placeholder="Enter your First Name" required="required" />
                            </div>
                            <span class="errorspan" id="nameerror"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="cols-sm-2 control-label">Last Name</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" name="lname" id="lname" placeholder="Enter your Last Name" required="required" />
                            </div>
                            <span class="errorspan" id="lnameerror"></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email" class="cols-sm-2 control-label">Your Email</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-envelope fa" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" name="usremailadd" id="usremailadd" placeholder="Enter your Email" />
                            </div>
                            <span class="errorspan" id="emailerror"></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="companyName" class="cols-sm-2 control-label">Company Name</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-users fa" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" name="companyName" id="companyName" placeholder="Enter your Company Name" />
                                <span class="glyphicon form-control-feedback"></span>
                            </div>
                            <span class="errorspan" id="companyNameerror"></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="Address" class="cols-sm-2 control-label">Address</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-building fa" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" name="Address" id="Address" placeholder="Enter your Address" required />
                            </div>
                            <span class="errorspan" id="Addresserror"></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="Address" class="cols-sm-2 "></label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon ">State</span>
                                <select onchange="print_city('city',this.selectedIndex);" id="state" name="state" class="form-control" required></select>
                                <span class="input-group-addon ">City</span>
                                <select id="city" name="city" class="form-control" required></select>
                                <script type="text/javascript ">print_state("state");</script>
                                <span class="input-group-addon">Zip</span>
                                <input type="text" class="form-control" name="zipCode" id="zipCode" placeholder="Enter your Zip" required />
                            </div>
                            <span class="errorspan" id="zipCodeerror"></span>
                            <span class="errorspan" id="cityerror"></span>
                            <span class="errorspan" id="stateerror"></span>
                        </div>
                    </div>



                    <div class="form-group">
                        <label for="txtPhone" class="cols-sm-2 control-label">Phone Number</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-phone fa" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" name="txtPhone" id="txtPhone" placeholder="Enter your Phone Number" required />
                            </div>
                            <span class="errorspan" id="txtPhoneerror"></span>
                        </div>


                    </div>
                    <div class="form-group">
                        <label for="password" class="cols-sm-2 control-label">Password</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-lock fa" aria-hidden="true"></i></span>
                                <input type="password" class="form-control" name="password" id="usrpassword" placeholder="Enter your Password" required />
                            </div>
                            <span class="errorspan" id="passworderror"></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="confirm" class="cols-sm-2 control-label">Confirm Password</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-lock fa" aria-hidden="true"></i></span>
                                <input type="password" class="form-control" name="confirm" id="confirmusrpassword" placeholder="Confirm your Password" required />
                            </div>
                            <span class="errorspan" id="confirmerror"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <h5 style="font-weight: bold" class="control-label">Please select what type of user you are:- </h5>


                        <div class="searchable-container">
                            <div class="items col-xs-5 col-sm-5 col-md-3 col-lg-3">
                                <div class="info-block block-info clearfix">

                                    <div data-toggle="buttons" class="btn-group bizmoduleselect">
                                        <label class="btn btn-default">
                                            <div class="bizcontent">
                                                <input type="checkbox" name="var_id[]" autocomplete="off" value="1">
                                                <span class="glyphicon glyphicon-ok glyphicon-lg"></span>
                                                <h5>Producer</h5>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="items col-xs-5 col-sm-5 col-md-3 col-lg-3">
                                <div class="info-block block-info clearfix">

                                    <div data-toggle="buttons" class="btn-group bizmoduleselect">
                                        <label class="btn btn-default">
                                            <div class="bizcontent">
                                                <input type="checkbox" name="var_id[]" autocomplete="off" value="2">
                                                <span class="glyphicon glyphicon-ok glyphicon-lg"></span>
                                                <h5>Applicator</h5>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="items col-xs-5 col-sm-5 col-md-3 col-lg-3">
                                <div class="info-block block-info clearfix">

                                    <div data-toggle="buttons" class="btn-group bizmoduleselect">
                                        <label class="btn btn-default">
                                            <div class="bizcontent">
                                                <input type="checkbox" name="var_id[]" autocomplete="off" value="3">
                                                <span class="glyphicon glyphicon-ok glyphicon-lg"></span>
                                                <h5>Consultant</h5>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div class="form-group" style="padding-top:7em">
                        <label for="confirm" class="cols-sm-2 control-label">Enter your Identification number</label>
                        <div class="cols-sm-10">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-lock fa" aria-hidden="true"></i></span>
                                <input class="form-control" type="number" id="identification" placeholder="Please provide your Identification number" required="required">
                            </div>
                            <span class="errorspan" id="identificationerror"></span>
                        </div>
                    </div>

                    <div class="form-group ">
                        <button type="button" class="btn btn-primary btn-lg btn-block login-button" id="userSubmit" disabled="disabled" onclick="Signup()">Register</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
    <div style="padding-bottom:20px;"></div>
    <!-- Footer -->
    <div id="footer">
    </div>
   
   
</body>
<script>
    $.get("footer.html", function (data) {
        $("#footer").replaceWith(data);
    });
</script>
</html>
