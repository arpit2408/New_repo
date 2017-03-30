<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ChangePassword.aspx.cs" Inherits="WebContent_ChangePassword" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
</head>
<body>
    <form id="form1" runat="server">
        <div>

            <div class="container">

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">

                    <!-- Modal -->
                    <div class="modal fade" id="passwordChange_Modal" role="dialog" data-backdrop="static" tabindex="-1" data-keyboard="false">
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
                                                <div class="alert alert-danger" id="passerrormessage" style="display: none"></div>
                                                <div class="alert alert-success" id="passsuccessmessage" style="display: none"></div>


                                                <div class=" col-md-12 col-lg-12 ">
                                                    <table class="table table-user-information  ">
                                                        <tbody>
                                                            <tr>
                                                                <td>Old Password:</td>
                                                                <td><input type="password" class="form-control" id="oldPass" /></td>
                                                            </tr>
                                                            <tr>
                                                                <td>New Password:</td>
                                                                <td><input type="password" class="form-control" id="newPass" /></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Confirm password:</td>
                                                                <td><input type="password" class="form-control" id="confimPass" /></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div class="row">
                                                        <div class="col-md-2"><a href="#" class="btn btn-primary form-actions" type="submit" onclick="updateUsrPassword()">Save Details</a></div>
                                                        <div class="col-md-2"><a href="#" class="btn btn-danger form-actions" type="submit" onclick="closeChangePass()">Cancel</a></div>
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
