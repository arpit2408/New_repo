<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PublicMapNew.aspx.cs" Inherits="WebContent_ApplicatorAreas" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <title>Geolocation</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        #map {
            height: 70%;
        }
    </style>







    <style type="text/css">
        #map_canvas {
            width: 400px;
            height: 300px;
        }

        .contextmenu {
            visibility: hidden;
            background: #ffffff;
            border: 1px solid #8888FF;
            z-index: 10;
            position: relative;
            width: 140px;
        }

            .contextmenu div {
                padding-left: 5px;
            }
    </style>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css" />

    <link rel="stylesheet" type="text/css" href="css/mapStyling.css" />
    <link rel="stylesheet" type="text/css" href="/WebContent/css/publicMap.css" />
    <link href='css/custom.css' rel='stylesheet' type='text/css' />
    <link href='css/registerCrop.css' rel='stylesheet' type='text/css' />
    <script type="text/javascript" src="../javascript/bootstrap.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/map.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/publicMapNew.js"></script>
    <!-- Website Font style -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
    <!-- Google Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css' />
    <link href='https://fonts.googleapis.com/css?family=Oxygen' rel='stylesheet' type='text/css' />
    <link rel="stylesheet" type="text/css" href="css/landingPage.css" />
</head>
<script>
    $.get("header.html", function (data) {
        $("#header").replaceWith(data);
    });

</script>
<script type="text/javascript">
    var user = null;
    var serverval = null;
    var usrapparea = null;
    var usrcroploc = null;
    //window.onload = init_publicmap;
</script>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" />
        <div>
            <!-- /.header  -->
            <div id="header"></div>
            <div id="wrapper" style="height: 677px; width: 1923px;">
                <input id="pac-input" class="controls" type="text" placeholder="Search Box" />
                <div id="map_canvas" style="height: 677px;"></div>
            </div>
            <div id="choiceMenuCrop" class="panel-group">
                <div class="panel panel-default" id="panel1" style="background-color: #ecf0f1">
                    <div class="panel-heading" style="background-color: #ecf0f1">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" data-target="#collapseOne"
                                href="#collapseOne">Choose Crops To Display#
                            </a>
                        </h4>

                    </div>
                    <div id="collapseOne" class="panel-collapse collapse in" style="padding-top: 20px;">
                        <div id="checkboxcrops" style="position: relative; padding-left: 20px; background-color: #ecf0f1">
                            <div class="[ form-group ]">
                                <input type="checkbox" name="fancy-checkbox-default" id="fancy-checkbox-default" autocomplete="off" />
                                <div class="[ btn-group ]">
                                    <label for="fancy-checkbox-default" class="[ btn btn-default ]" style="background-color: darkorange">
                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                        <span></span>
                                    </label>
                                    <label for="fancy-checkbox-default" class="[ btn btn-default active ]">
                                        HoneyBees
                                    </label>
                                </div>
                            </div>
                            
                            <div class="[ form-group ]">
                                <input type="checkbox" name="fancy-checkbox-primary" id="fancy-checkbox-primary" autocomplete="off" />
                                <div class="[ btn-group ]">
                                    <label for="fancy-checkbox-primary" class="[ btn btn-primary ]">
                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                        <span></span>
                                    </label>
                                    <label for="fancy-checkbox-primary" class="[ btn btn-default active ]">
                                        Fruits and Nuts
               
                                    </label>
                                </div>
                            </div>
                            <div class="[ form-group ]">
                                <input type="checkbox" name="fancy-checkbox-success" id="fancy-checkbox-success" autocomplete="off" />
                                <div class="[ btn-group ]">
                                    <label for="fancy-checkbox-success" class="[ btn btn-success ]">
                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                        <span></span>
                                    </label>
                                    <label for="fancy-checkbox-success" class="[ btn btn-default active ]">
                                        Field Crops
               
                                    </label>
                                </div>
                            </div>
                            <div class="[ form-group ]">
                                <input type="checkbox" name="fancy-checkbox-info" id="fancy-checkbox-info" autocomplete="off" />
                                <div class="[ btn-group ]">
                                    <label for="fancy-checkbox-info" class="[ btn btn-info ]">
                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                        <span></span>
                                    </label>
                                    <label for="fancy-checkbox-info" class="[ btn btn-default active ]">
                                        Nursery and Greenhouse
                                    </label>
                                </div>
                            </div>
                            <div class="[ form-group ]">
                                <input type="checkbox" name="fancy-checkbox-warning" id="fancy-checkbox-warning" autocomplete="off" />
                                <div class="[ btn-group ]">
                                    <label for="fancy-checkbox-warning" class="[ btn btn-warning ]" style="background-color: lightgray">
                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                        <span></span>
                                    </label>
                                    <label for="fancy-checkbox-warning" class="[ btn btn-default active ]">
                                        Forage and Grass
                                    </label>
                                </div>
                            </div>
                            <div class="[ form-group ]">
                                <input type="checkbox" name="fancy-checkbox-danger" id="fancy-checkbox-danger" autocomplete="off" />
                                <div class="[ btn-group ]">
                                    <label for="fancy-checkbox-danger" class="[ btn btn-danger ]" style="background-color: purple">
                                        <span class="[ glyphicon glyphicon-ok ]"></span>
                                        <span></span>
                                    </label>
                                    <label for="fancy-checkbox-danger" class="[ btn btn-default active ]">
                                        Vegetables
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="footer">
            </div>
            <script
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7FTNE22Wl6S6DTQF83sTZTqbFFPzEkmU&libraries=drawing,places,geometry&callback=initialize">
                   google.maps.event.addDomListener(window, 'load', initialize);
            </script>
            <script>
                $.get("footer.html", function (data) {
                    $("#footer").replaceWith(data);
                });
            </script>
        </div>
    </form>
</body>
</html>
