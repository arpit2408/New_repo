<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Dashboard.aspx.cs" Inherits="WebContent_Dashboard" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>Texas Crop Registry</title>
    <meta name="generator" content="Bootply" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/loginUser.js"></script>
    <script type="text/javascript" src="/WebContent/Javascript/map.js"></script>
    <!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
    <link href="css/styles.css" rel="stylesheet">
    <link href="css/custom.css" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css' />
    <link href='https://fonts.googleapis.com/css?family=Oxygen' rel='stylesheet' type='text/css' />
    <link rel="stylesheet" type="text/css" href="css/landingPage.css" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css" />
rel="stylesheet">
</head>
<body>
    <script type="text/javascript">
        window.onload = dashboardOnLoad;
    </script>
    <script>
        $.get("HeaderNav.html", function (data) {
            $("#header").replaceWith(data);
        });
    </script>
    <div id="header"></div>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" />
        <div>
            <div class="container-fluid">
                <div class="row" style="padding-top: 50px; background-color: whitesmoke">
                    <div class="col-sm-2">

                        <hr>
                        
                        <ul class="nav nav-stacked">
                            <li class="nav-header"><a href="#" data-toggle="collapse" data-target="#userMenu">Home</a>
                                <ul class="nav nav-stacked collapse in" id="userMenu">
                                    <li class="active"><a href="#">Account</a></li>
                                    <li><a href="#"><i class="glyphicon glyphicon-envelope"></i>Your Information <span class="badge badge-info">4</span></a></li>

                                    <li><a href="LandingPage.html">Settings</a></li>
                                </ul>
                            </li>
                        </ul>
                        
                    </div>
                       
                    <!-- /col-3 -->
                    <div class="col-sm-10">

                        <!-- column 2 -->
                        <ul class="list-inline pull-right">
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="#">1. Is there a way..</a></li>
                                <li><a href="#">2. Hello, admin. I would..</a></li>
                                <li><a href="#"><strong>All messages</strong></a></li>
                            </ul>
                            </li>
                        </ul>
                        <hr>

                        <div class="row">
                            <!-- center left-->
                            <div class="col-md-7">
                                <!-- <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4>Producer Preferences</h4>
                                    </div>
                                    <div class="panel-body">
                                        <div class="container">

                                            <ul class="list-group" style="width: 400px">
                                                <li class="list-group-item">Manage your options
                                        <div class="material-switch pull-right" style="padding-top: 10px;">
                                            <input id="someSwitchOptionSuccess" name="someSwitchOption001" type="checkbox" />
                                            <label for="someSwitchOptionSuccess" class="label-success"></label>
                                        </div>
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                </div> -->
                                <hr>

                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4>Your Crop Locations</h4>
                                    </div>
                                    <div id="producerPolygons" class="panel-body">
                                         <div class="table-responsive">
                                            <table id="tablePolygons" class="table table-striped">
                                                <thead>
                                                    <tr>
                                                                
                                                        <th>Index</th>
                                                        <th>Plant Type</th>
                                                       
                                                        <th>County</th>
                                                        <th>Year</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tabBody">
                                                </tbody>
                                             </table>
                                          </div>
                                    </div>
                                    <!--/panel-body-->
                                </div>
                                <!--/panel-->

                                <hr>

                                
                            </div>
                            <!--/col-->
                            <div class="col-md-5">
                                <!-- <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4>Applicator Preferences</h4>
                                    </div>
                                    <div class="panel-body">
                                        <div class="container">

                                            <div class="radio radio-info">
                                                <input type="radio" name="survey" id="Radios1">
                                                <label>
                                                    State wide
                                                </label>
                                            </div>
                                            <div class="radio radio-info">
                                                <input type="radio" name="survey" id="Radios2">
                                                <label>
                                                    By Distance
                                                </label>
                                                <div class="input-group" id="collapseOne" style="width: 400px">
                                                    <span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
                                                    <input type="text" class="form-control" name="name" id="name" placeholder="Miles or less from your application area(s)" required="required" />
                                                </div>
                                            </div>
                                            <div class="radio radio-info">
                                                <input type="radio" name="survey" id="Radios3">
                                                <label>
                                                    Specific counties
                                                </label>
                                            </div>
                                            <ul class="list-group" style="width: 400px">
                                                <li class="list-group-item">
                                                    <div class="material-switch pull-right" style="padding-top: 20px">
                                                        <input id="someSwitchOptionPrimary" name="someSwitchOption001" type="checkbox" />
                                                        <label for="someSwitchOptionPrimary" class="label-primary"></label>
                                                    </div>
                                                    Notify me through email on new crops added under my application area(s)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div> -->
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="panel-title">
                                            <i class="glyphicon glyphicon-wrench pull-right"></i>
                                            <h4>Your Application Areas</h4>
                                        </div>
                                    </div>
                                    <div class="panel-body">
                                        <div class="table-responsive">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Index</th>
                                                        <th>Name</th>
                                                        <th>Pesticide</th>
                                                        <th>County</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tabAppBody">
                                                    
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                    <!--/panel content-->

                                </div>
                                <!--tabs-->
                                <div class="panel">
                                    <ul class="nav nav-tabs" id="myTab">
                                        <li class="active"><a href="#profile" data-toggle="tab">Profile</a></li>
                                        <li><a href="#messages" data-toggle="tab">Messages</a></li>
                                        <li><a href="#settings" data-toggle="tab">Settings</a></li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane active well" id="profile">
                                            <h4><i class="glyphicon glyphicon-user"></i></h4>
                                            Lorem profile dolor sit amet, consectetur adipiscing elit. Duis pharetra varius quam sit amet vulputate.
                               
                                    <p>Quisque mauris augue, molestie tincidunt condimentum vitae, gravida a libero. Aenean sit amet felis dolor, in sagittis nisi.</p>
                                        </div>
                                        <div class="tab-pane well" id="messages">
                                            <h4><i class="glyphicon glyphicon-comment"></i></h4>
                                            Message ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra varius quam sit amet vulputate.
                               
                                    <p>Quisque mauris augu.</p>
                                        </div>
                                        <div class="tab-pane well" id="settings">
                                            <h4><i class="glyphicon glyphicon-cog"></i></h4>
                                            Lorem settings dolor sit amet, consectetur adipiscing elit. Duis pharetra varius quam sit amet vulputate.
                               
                                    <p>Quisque mauris augue, molestie.</p>
                                        </div>
                                    </div>

                                </div>
                                <!--/tabs-->

                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4>New Requests</h4>
                                    </div>
                                    <div class="panel-body">
                                        <div class="list-group">
                                            <a href="#" class="list-group-item active">Pesticide Pestoipe pending..</a>
                                            <a href="#" class="list-group-item">Pending investing in WA..</a>
                                            <a href="#" class="list-group-item">Checkup for Wishtester Farms..</a>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <a href="#"><strong><i class="glyphicon glyphicon-comment"></i>Discussions</strong></a>


                                    <div class="row">
                                        <div class="col-md-12">
                                            <ul class="list-group">
                                                <li class="list-group-item"><a href="#"><i class="glyphicon glyphicon-flash"></i><small>(3 mins ago)</small> The 3rd page reports don't contain any links. Does anyone know why..</a></li>
                                                <li class="list-group-item"><a href="#"><i class="glyphicon glyphicon-flash"></i><small>(1 hour ago)</small> Hi all, I've just post a report that show the relationship betwe..</a></li>
                                                <li class="list-group-item"><a href="#"><i class="glyphicon glyphicon-heart"></i><small>(2 hrs ago)</small> Paul. That document you posted yesterday doesn't seem to contain the over..</a></li>
                                                <li class="list-group-item"><a href="#"><i class="glyphicon glyphicon-heart-empty"></i><small>(4 hrs ago)</small> The map service on c243 is down today. I will be fixing the..</a></li>
                                                <li class="list-group-item"><a href="#"><i class="glyphicon glyphicon-heart"></i><small>(yesterday)</small> I posted a new document that shows how to install the services layer..</a></li>
                                                <li class="list-group-item"><a href="#"><i class="glyphicon glyphicon-flash"></i><small>(yesterday)</small> ..</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                <!--
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="panel-title">
                                            <i class="glyphicon glyphicon-wrench pull-right"></i>
                                            <h4>Crop Closest To Your Area</h4>
                                        </div>
                                    </div>
                                    <div class="panel-body">
                                        <div class="table-responsive">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Crop</th>
                                                        <th>Distance</th>
                                                        <th>App-Area</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>45</td>
                                                        <td>2.45%</td>
                                                        <td>Direct</td>
                                                    </tr>
                                                    <tr>
                                                        <td>289</td>
                                                        <td>56.2%</td>
                                                        <td>Referral</td>
                                                    </tr>
                                                    <tr>
                                                        <td>98</td>
                                                        <td>25%</td>
                                                        <td>Type</td>
                                                    </tr>
                                                    <tr>
                                                        <td>..</td>
                                                        <td>..</td>
                                                        <td>..</td>
                                                    </tr>
                                                    <tr>
                                                        <td>..</td>
                                                        <td>..</td>
                                                        <td>..</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                    <!--/panel content
                                </div>
                                
                                <!--/panel-->
                                <!--
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="panel-title">
                                            <h4>Conflicts</h4>
                                        </div>
                                    </div>
                                    <div class="panel-body">
                                        <div class="col-xs-4 text-center">
                                            <img src="http://placehold.it/80/BBBBBB/FFF" class="img-circle img-responsive">
                                        </div>
                                        <div class="col-xs-4 text-center">
                                            <img src="http://placehold.it/80/EFEFEF/555" class="img-circle img-responsive">
                                        </div>
                                        <div class="col-xs-4 text-center">
                                            <img src="http://placehold.it/80/EEEEEE/222" class="img-circle img-responsive">
                                        </div>
                                    </div>
                                </div> -->
                                <!--/panel-->

                            </div>
                            <!--/col-span-6-->

                        </div>
                        <!--/row-->

                    </div>
                    <!--/col-span-9-->
                </div>
            </div>
        
    </form>
    <div id="footer" style="background-color: #999"></div>
</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/scripts.js"></script>
<script>
    $.get("footer.html", function (data) {
        $("#footer").replaceWith(data);
    });
</script>
</html>
