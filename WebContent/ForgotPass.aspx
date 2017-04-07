<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ForgotPass.aspx.cs" Inherits="WebContent_ForgotPass" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Hit The Target</title>
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
</head>
<body>
    <div id="header"></div>
    <form id="form1" runat="server">
        <div>
            <div class="container">

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">

                    <!-- Modal -->
                    <div class="modal fade" id="forgotPass_Modal" role="dialog" data-backdrop="static" tabindex="-1" data-keyboard="false">
                        <div class="modal-dialog">

                            <!-- Modal content-->
                            <div class="modal-content" style="height: auto; width: 800px;">
                                <div class="modal-header">
                                    <button type="button" id="closemyModalPass" onclick="closeChangePass();" class="close" data-dismiss="modal">&times;</button>

                                    <h4 class="modal-title col-md-3">Change Password</h4>

                                </div>
                                <div class="modal-body" style="background-color: #eee">
                                    <div class="panel panel-info">

                                        <div class="panel-body">
                                            <div class="row">
                                                <div class="alert alert-danger" id="forgotPasserrormessage" style="display: none"></div>
                                                <div class="alert alert-success" id="forgotPasssuccessmessage" style="display: none"></div>
                                                <div class=" col-md-12 col-lg-12 ">
                                                    <div style="margin-bottom: 25px" class="input-group">
                                                        <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                                        <input id="usremail" type="text" class="form-control" name="username" value="" placeholder="Please enter your email address" />
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-sm-5"></div>
                                                        <div class="col-sm-2"><a href="#" class="btn btn-primary form-actions" type="submit" onclick="forgotPassword()">Submit</a></div>

                                                        <div class="col-sm-5"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>

</html>
