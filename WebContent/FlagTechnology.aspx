<%@ Page Language="C#" CodeFile="FlagTechnology.aspx.cs" Inherits="WebContent_FlagTechnology" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript" src="/WebContent/Javascript/cropAdd.js"></script>
    <link rel="stylesheet" type="text/css" href="/WebContent/css/publicMap.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css' />
    <link href='https://fonts.googleapis.com/css?family=Oxygen' rel='stylesheet' type='text/css' />
    <link rel="stylesheet" type="text/css" href="css/landingPage.css" />
</head>
<body>
    
        <div id="trythis">
            <div class="modal fade" id="flagtechModal" tabindex="-1" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content" style="height: auto; width: 400px;">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Choose your Flag</h4>
                        </div>
                        <div class="modal-body" style="background-color: #ecf0f1">
                            <div id="choiceMenuCrop" class="panel-group">
                                <div class="panel panel-default" id="panel1" style="background-color: #ecf0f1">
                                    <div class="panel-heading" style="background-color: #ecf0f1">
                                        <h4 class="panel-title">
                                            <a data-toggle="collapse" data-target="#collapseOne"
                                                href="#collapseOne">Choose Flag for Crop#
                                            </a>
                                        </h4>

                                    </div>
                                    <div id="collapseOne" class="panel-collapse collapse in" style="padding-top: 20px;">
                                        <div id="checkboxcrops" style="position: relative; padding-left: 20px; background-color: #ecf0f1">
                                            <div class="[ form-group ]">
                                                <input type="checkbox" name="flag" id="fancy-checkbox-default" value="RedFlag" autocomplete="off" />
                                                <div class="[ btn-group ]">
                                                    <label for="fancy-checkbox-default" class="[ btn btn-default ]" style="background-color: #c0392b">
                                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                                        <span></span>
                                                    </label>
                                                    <label for="fancy-checkbox-default" class="[ btn btn-default active ] " data-toggle="tooltip" data-placement="right" title="signifies conventional
varieties with no
herbicide technology traits,
vineyards, apiaries, orchards,
vegetable fields and
organic crop production.
Extreme caution">
                                                        Set Flag Red
                                                    </label>
                                                </div>
                                            </div>

                                            <div class="[ form-group ]">
                                                <input type="checkbox" name="flag" id="fancy-checkbox-primary" value="YellowFlag" autocomplete="off" />
                                                <div class="[ btn-group ]">
                                                    <label for="fancy-checkbox-primary" class="[ btn btn-primary ]" style="background-color: #f1c40f">
                                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                                        <span></span>
                                                    </label>
                                                    <label for="fancy-checkbox-primary" class="[ btn btn-default active ]" data-toggle="tooltip" data-placement="right" title="is the color chosen for
Clearfield® rice, sunflower,
wheat and canola
technologies, STS® soybeans1
 and INZEN grain
sorghum">
                                                        Set Flag Yellow
               
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="[ form-group ]">
                                                <input type="checkbox" name="flag" id="fancy-checkbox-success" value="WhiteFlag" autocomplete="off" />
                                                <div class="[ btn-group ]">
                                                    <label for="fancy-checkbox-success" class="[ btn btn-success ]" style="background-color: darkgrey">
                                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                                        <span></span>
                                                    </label>
                                                    <label for="fancy-checkbox-success" class="[ btn btn-default active ]" data-toggle="tooltip" data-placement="right" title="represents technology that
is tolerant to glyphosate
herbicide. (e.g., Roundup
Ready, Glytol)">
                                                        Set Flag White
               
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="[ form-group ]">
                                                <input type="checkbox" name="flag" id="fancy-checkbox-info" value="TealFlag" autocomplete="off" />
                                                <div class="[ btn-group ]">
                                                    <label for="fancy-checkbox-info" class="[ btn btn-info ]" style="background-color: #008080">
                                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                                        <span></span>
                                                    </label>
                                                    <label for="fancy-checkbox-info" class="[ btn btn-default active ]" data-toggle="tooltip" data-placement="right" title="indicates tolerance to both
2,4-D and FOP (ACCase)
herbicides. The white
stripes indicate tolerance to
glyphosate. Where glufosinate
tolerant cotton
and soybean are planted, a
green flag should be added
to denote tolerance to glufosinate
2">
                                                        Set Flag Teal
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="[ form-group ]">
                                                <input type="checkbox" name="flag" id="fancy-checkbox-warning" value="GreenFlag" autocomplete="off" />
                                                <div class="[ btn-group ]">
                                                    <label for="fancy-checkbox-warning" class="[ btn btn-warning ]" style="background-color: #008000">
                                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                                        <span></span>
                                                    </label>
                                                    <label for="fancy-checkbox-warning" class="[ btn btn-default active ]" data-toggle="tooltip" data-placement="right" title="This technology is tolerant
to glufosinate. ">
                                                        Set Flag Green
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="[ form-group ]">
                                                <input type="checkbox" name="flag" id="fancy-checkbox-danger" value="BlackFlag" autocomplete="off" />
                                                <div class="[ btn-group ]">
                                                    <label for="fancy-checkbox-danger" class="[ btn btn-danger ]" style="background-color: #34495e">
                                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                                        <span></span>
                                                    </label>
                                                    <label for="fancy-checkbox-danger" class="[ btn btn-default active ]" data-toggle="tooltip" data-placement="right" title="The black and white checks
indicate tolerance to both
dicamba and glyphosate. A
green flag should be added
for cotton to denote glufosinate
tolerance">
                                                        Set Flag Black
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row" style="padding-top: 20px">
                                            <div class="col-md-4 center-block">
                                                <button id="singlebutton" name="singlebutton" onclick="checkforflag(this)" class="btn btn-primary center-block">
                                                   Submit
                                                </button>
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
 
</body>
   
        <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
      
</html>
