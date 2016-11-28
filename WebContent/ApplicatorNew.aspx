<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ApplicatorNew.aspx.cs" Inherits="WebContent_ApplicatorNew" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">

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
     <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="css/mapStyling.css" />
    <link rel="stylesheet" type="text/css" href="/WebContent/css/publicMap.css" />
    <link href='css/custom.css' rel='stylesheet' type='text/css' />
    <link href='css/registerCrop.css' rel='stylesheet' type='text/css' />
    <script type="text/javascript" src="../javascript/bootstrap.js"></script>
    
    <script type="text/javascript" src="/WebContent/Javascript/applicatorNew.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/publicMapNew.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/common.js"></script>
    <script type="text/javascript" src="/javascript/lat.lon.calculations.js"></script>
    <!-- Website Font style -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
    <!-- Google Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css' />
    <link href='https://fonts.googleapis.com/css?family=Oxygen' rel='stylesheet' type='text/css' />
    <link rel="stylesheet" type="text/css" href="css/landingPage.css" />
</head>
<script>
    $.get("HeaderNav.html", function (data) {
        $("#header").replaceWith(data);
    });
    $.get("ApplicatorPesticideRegister.aspx", function (data) {
        $("#modalDiv").replaceWith(data);
    });
</script>
<script type="text/javascript">
    var user = null;
    var serverval = null;
    var usrapparea = null;
    var usrcroploc = null;
    //window.onload = setOnloadEvent(event);
</script>
<body>
    <div id="header"></div>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" />
        <div>
            <div id="modalDiv"></div>
            <!-- /.header  -->
            <div id="wrapper" style="height: 677px; width: 1923px;">
                <input id="pac-input" class="controls" type="text" placeholder="Search Places" />
                <div id="map_canvas" style="height: 677px;"></div>
            </div>
            
            <div id="footer">
            </div>
            <script
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7FTNE22Wl6S6DTQF83sTZTqbFFPzEkmU&libraries=drawing,places,geometry&callback=initMap">
                   google.maps.event.addDomListener(window, 'load', initMap);
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
