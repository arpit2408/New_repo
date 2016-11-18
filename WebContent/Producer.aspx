<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Producer.aspx.cs" Inherits="WebContent_Producer" %>

<!DOCTYPE html>
<html>
<head>

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
            height: 100%;
        }
    </style>







    <style type="text/css">
        #map_canvas {
            width: 400px;
            height: 400px;
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
   
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/Register.css">
    <link rel="stylesheet" type="text/css" href="css/mapStyling.css">
    <link href='css/custom.css' rel='stylesheet' type='text/css'>
    <link href='css/registerCrop.css' rel='stylesheet' type='text/css'>

    <script type="text/javascript" src="/WebContent/Javascript/map.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/cropAdd.js"></script>
    <!-- Website Font style -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
    <!-- Google Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Oxygen' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/landingPage.css">
</head>
<script>
  
    $.get("RegisterCrop.aspx", function (data) {
        $("#modalDiv").replaceWith(data);
    });
    $.get("FlagTechnology.aspx", function (data) {
        $("#modalForFlag").replaceWith(data);
    });
</script>

<body>
    <style>
        #wrapper {
            position: relative;
        }

        #SearchContainer {
            position: absolute;
        }

        #map_canvas {
            position: relative;
        }
    </style>


    <!-- /.header  -->
    <div id="header">
    </div>
    

    <div id="wrapper" style="height: 677px; width: 1923px; ">
        <div id="modalDiv"></div>
        <div id="modalForFlag"></div>
        <div id="map_canvas" style="height: 677px; width: 1923px;"></div>
        <input id="pac-input" class="controls" type="text" placeholder="Search Box">
        <input id="Text1" class="controls" type="text" placeholder="Search Box">
    </div>
    <div id="footer">
    </div>
    <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7FTNE22Wl6S6DTQF83sTZTqbFFPzEkmU&libraries=drawing,places,geometry&callback=initMap">
   google.maps.event.addDomListener(window, 'load', initMap);
    </script>
        <script src="https://code.jquery.com/jquery-1.11.3.js"></script>
        <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
        
    <script>
        $.get("footer.html", function (data) {
            $("#footer").replaceWith(data);
        });
    </script>
</body>
</html>
