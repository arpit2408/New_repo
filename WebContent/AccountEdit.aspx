<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AccountEdit.aspx.cs" Inherits="WebContent_AccountEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
    <script type="text/javascript" src="/WebContent/Javascript/countries.js"></script>
</head>
<body>
    <!-- /.header  -->
    <div id="header">
    </div>
    <form id="form1" runat="server">
        <div>
            <div class="container">

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">

                    <!-- Modal -->
                    <div class="modal fade" id="profileEditModal" role="dialog" data-backdrop="static" tabindex="-1" data-keyboard="false">
                        <div class="modal-dialog">

                            <!-- Modal content-->
                            <div class="modal-content" style="height: auto; width: 800px;">
                                <div class="modal-header">
                                    <button type="button" id="closemyModalDet" onclick="closeEventAccDetails();" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Edit Profile</h4>
                                </div>
                                <div class="modal-body" style="background-color: #eee">
                                    <div class="panel panel-info">
                                        
                                        <div class="panel-body">
                                            <div class="row">
                                                


                                                <div class=" col-md-12 col-lg-12 ">
                                                    <table class="table table-user-information table-striped ">
                                                        <tbody>
                                                            <tr>
                                                                <td>First Name:</td>
                                                                <td ><input type="text" class="form-control" id="FirstName"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Last Name:</td>
                                                                <td ><input type="text" class="form-control" id="LastName"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Email:</td>
                                                                <td ><input type="email" class="form-control" id="usremail" disabled="disabled"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Company:</td>
                                                                <td ><input type="text" class="form-control" id="company"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Address:</td>
                                                                <td ><input type="text" class="form-control" id="address"/></td>
                                                            </tr>
                                                            <tr> 
                                                                <td>State:</td>
                                                                <td ><select onchange="print_city('city',this.selectedIndex);" id="state" name="state" class="form-control" ></select></td>
                                                            </tr>
                                                            <tr> 
                                                                <td>City:</td>
                                                                <td ><select id="city" name="city" class="form-control" ></select>
                                                                     <script type="text/javascript ">print_state("state");</script>
                                                                </td>
                                                            </tr>
                                                            <tr> 
                                                                <td>ZipCode:</td>
                                                                <td ><input type="text" class="form-control" id="zip"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Phone Number:</td>
                                                                <td ><input type="text" class="form-control" id="phoneNum"/></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    
                                                    <a href="#" class="btn btn-primary form-actions" type="submit" onclick="updateAccDetails()">Update Details</a>
                                                    <a href="#" class="btn btn-danger form-actions" type="submit">Cancel</a>
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
