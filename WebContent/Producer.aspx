<%@ Page Language="C#" CodeFile="Producer.aspx.cs" Inherits="WebContent_Producer" %>

<!DOCTYPE html>
<html>
<head>

    <title>Geolocation</title>
         <link rel="icon" href="/WebContent/Images/HomePage/logo_icon.ico" />
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
    <link href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/Register.css">

    <link href='css/custom.css' rel='stylesheet' type='text/css'>
    <script type="text/javascript" src="/WebContent/Javascript/map.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/cropAdd.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/common.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/markerclusterer.js"></script>
    <!-- Website Font style -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
    <!-- Google Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Oxygen' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/landingPage.css">
</head>
<script>
    $.get("HeaderNav.html", function (data) {
        $("#header").replaceWith(data);
    });
    $.get("/LoginUser.aspx", function (data) {
        $("#loginModal").replaceWith(data);
    });
    $.get("RegisterCrop.aspx", function (data) {
        $("#modalDiv").replaceWith(data);
    });
    $.get("FlagTechnology.aspx", function (data) {
        $("#modalForFlag").replaceWith(data);
    });
    $.get("AccountEdit.aspx", function (data) {
        $("#accountEdit").replaceWith(data);
    });
    $.get("ChangePassword.aspx", function (data) {
        $("#changePass").replaceWith(data);
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


    <div id="wrapper" style="height: 100%; width: 100%;">
        <div id="modalDiv"></div>
        <div id="modalForFlag"></div>
        <div id="map_canvas" style="height: 100%; width: 100%;"></div>
        <div id="loginModal" class="displayModal "></div>
        <div id="accountEdit"></div>
        <div id="changePass"></div>
        <div id="custom-search-input" style="padding-left:3px;">
            <div style="top: 10px !important; position: relative">
                <div id="searchboxProd" class="input-group col-md-3">
                    <input id="pac-input" class="form-control input-md controls searchBoxPos" type="text" placeholder="Search Box">
                    <span class="input-group-btn">
                        <button class="btn btn-primary btn-md" type="button">
                            <i class="glyphicon glyphicon-search"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
        
    </div>
    <div id="footer">
    </div>
    <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7FTNE22Wl6S6DTQF83sTZTqbFFPzEkmU&libraries=drawing,places,geometry&callback=initMap">
   google.maps.event.addDomListener(window, 'load', initMap);
    </script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script>
        $.get("footer.html", function (data) {
            $("#footer").replaceWith(data);
        });
    </script>
</body>
</html>
