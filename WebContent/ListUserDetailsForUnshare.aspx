<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListUserDetailsForUnshare.aspx.cs" Inherits="WebContent_ListUserDetailsForUnshare" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div class="modal fade" id="listUserForUnshareModal" role="dialog" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog">
                    <div class="col-xs-6">
                        <!-- Modal content-->
                        <div class="modal-content" style="height: auto; width: 867px;">
                            <div class="modal-header">
                                <button type="button"  class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">User Details</h4>
                            </div>
                            <div class="modal-body" style="background-color: #eee">
                                <div class="panel panel-default">
                                    <div id="userDetailsUnshare" class="panel-body">
                                        <div class="table-responsive">
                                            <table id="tableUserUnshare" class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Address</th>
                                                        
                                                        <th>MappedAs</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tBodyUserUnshare">
                                                </tbody>
                                            </table>
                                        </div>
                                        <input class="btn btn-primary col-xs-12" type="button" onclick="submitUnmaplist(this);" value="Submit" id="unshareUsers" />
                                    </div>
                                    <!--/panel-body-->
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
