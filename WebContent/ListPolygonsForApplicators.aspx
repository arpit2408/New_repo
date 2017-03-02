<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListPolygonsForApplicators.aspx.cs" Inherits="WebContent_ListPolygonsForApplicators" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div class="modal fade" id="listPolygonsForApplicatorsModal" role="dialog" data-backdrop="static" data-keyboard="false">
                <div class="vertical-alignment-helper">
                    <div class="modal-dialog vertical-align-center">
                        <div class="col-xs-6">
                            <!-- Modal content-->
                            <div class="modal-content" style="height: auto; width: 867px;">
                                <div class="modal-header">
                                    <button type="button" id="closemyModal" onclick="closeevent();" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Crop Locations</h4>
                                </div>
                                <div class="modal-body" style="background-color: #eee">
                                    <div class="panel panel-default">
                                        <div id="producerPolygonsforPolygons" class="panel-body">
                                            <div class="table-responsive">
                                                <table id="tablePolygons" class="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Plant Type</th>
                                                            <th>Crop Type</th>
                                                            <th>Flag type</th>
                                                            <th>County</th>
                                                            <th>Year</th>
                                                            <th>Pesticide</th>
                                                            <th>Complete</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="tabBodyModal">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <!--/panel-body-->
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
