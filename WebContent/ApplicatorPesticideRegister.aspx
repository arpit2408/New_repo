<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApplicatorPesticideRegister.aspx.cs" Inherits="WebContent_ApplicatorPesticideRegister" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript" src="/javascript/lat.lon.calculations.js"></script>
</head>
<body>
    <form id="form1" data-toggle="validator" method="post" role="form" action="#" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" />
        <div class="container" style="background-color: #eee">
            <div id="polygonpath" style="display: none"></div>
            <div id="centroidpoints" style="display: none"></div>
            <div id="flagoptions" style="display: none"></div>
            <!-- Modal -->
            <div class="modal fade" id="ModalApplicator" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content" style="height: auto; width: 800px;">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Application Area Information</h4>
                        </div>
                        <div class="modal-body" style="background-color: #eee">

                            <div class="row">
                                <div class="alert alert-danger" id="errormessage" style="display: none"></div>
                                <div class="alert alert-success" id="successmessage" style="display: none"></div>
                                <div class="col-lg-8 col-lg-offset-2">

                                    <div class="messages"></div>



                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="form_phone">Name of Application Area *:</label>
                                                <input id="appAreaName" name="appAreaName" class="form-control" placeholder="Please enter application area name" required="required" />
                                                <div class="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="form_phone">Pesticide Name *:</label>
                                                <input id="pesticideName" name="pesticideName" class="form-control" placeholder="Please enter pesticide name" required="required" />
                                                <div class="help-block with-errors"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="form_phone">Number of Acres *:</label>
                                                <input id="areaPolygon" name="areaPolygon" class="form-control" placeholder="Please enter your phone" required="required" readOnly="readOnly"/>
                                                <div class="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="form_phone">County *:</label>
                                                <input id='countyselected' class='form-control' type='text' disabled="disabled" required="required" />
                                                <div class="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        
                                            
                                        
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="form_message">Comments or Description: *</label>
                                                <textarea id="form_message" name="message" class="form-control" placeholder="Message  *" rows="4" required="required" data-error="Please,leave us a message."></textarea>
                                                <div class="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <input type="submit" onclick="SubmitNewApplicatorLocation(event)" class="btn btn-primary btn-send" value="Save" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>


        </div>
        <!-- /.container-->
    </form>
</body>
</html>
