<%@ Page Language="C#" AutoEventWireup="true" CodeFile="RegisterCrop.aspx.cs" Inherits="WebContent_RegisterCrop" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Texas Crop Website</title>
        
        <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'/>
        <link href='css/custom.css' rel='stylesheet' type='text/css'/>
        <link href='css/registerCrop.css' rel='stylesheet' type='text/css'/>
        <script type="text/javascript" src="/WebContent/Javascript/cropAdd.js"></script>
       
</head>

<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"/>
        <div class="container" style="background-color:#eee">
             
            <!-- Modal -->
                <div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">
    
            <!-- Modal content-->
            <div class="modal-content" style="height:auto;width:800px;">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Crop Information</h4>
                </div>
                <div class="modal-body" style="background-color:#eee">
                  
            <div class="row" >

                <div class="col-lg-8 col-lg-offset-2">

                        <div class="messages"></div>

                        

                            <div class="row">
                               <div class="col-md-6">
                                   
                                    <div class="form-group">
                                            <label for="form_phone" class="cols-sm-2 " >Plant Type *:</label>
                                            <select onchange="print_crop('crop',this.selectedIndex);" id="plant" name="plant"  class="form-control" required="required"></select>
                                    </div>
                                </div>
                                 <div class="col-md-6">
                                    <div class="form-group">
				                            <label for="form_phone" class="cols-sm-2 ">Crop Type *:</label>
                                             <select id="crop" name="crop" class="form-control" required="required"></select>
                                             <script type="text/javascript ">print_plant("plant");</script>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                       <label for="form_phone">Crop Year *:</label>
                                        <input id="cropYear" type="tel" name="cropYear" class="form-control" placeholder="Please enter your phone"/>
                                        <div class="help-block with-errors"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="form_phone">Number of Acres *:</label>
                                        <input id="areaPolygon" type="tel" name="areaPolygon" class="form-control" placeholder="Please enter your phone"/>
                                        <div class="help-block with-errors"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="form_phone">County *:</label>
                                        <input id = 'countyselected' class='form-control' type = 'text' disabled ="disabled"/>
                                        <div class="help-block with-errors"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4 col-sm-offset-3 col-md-offset-4">
                                     <div class="panel panel-default" >
                                            <!-- Default panel contents -->
                                         <div class="row" >
                                            <div class="col-md-6" >
                                                 <div class="panel-heading" style="align-content:flex-start">Certified Organic Crop</div> 
                                            </div>
                                            <div class="col-md-6" style="top:40px">
                                                <div class="material-switch pull-right">
                                                <input id="someSwitchOptionSuccess" name="someSwitchOption001" type="checkbox"/>
                                                <label for="someSwitchOptionSuccess" class="label-success"></label>
                                            </div>
                                         </div>
                                         </div>

                                           
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
                                    <input type="submit" class="btn btn-primary btn-send" value="Save"/>
                                </div>
                            </div>
                            
                        
                        
                   
                    </div>
                </div>

                </div>
              </div>
      
            </div>
          </div>
  
            
        </div> <!-- /.container-->
    </form>
</body>
</html>
