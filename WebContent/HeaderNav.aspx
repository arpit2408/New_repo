<%@ Page Language="C#"  CodeFile="HeaderNav.aspx.cs" Inherits="WebContent_HeaderNav" %>

<!DOCTYPE html>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <script type="text/javascript" src="/WebContent/Javascript/loginUser.js"></script>
</head>
<body>
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" id="navBar">
        <div class="container-fluid">

            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a class="navbar-brand" href="#">
                    <img alt="TAMUlogo" src="/images/TAM-Logo-white.png" class="img-responsive" /></a>
                <a class="navbar-brand" href="#">
                    <img alt="KELlogo" src="/images/KELlogo_sm.jpg" class="img-responsive" /></a>


            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li>
                        <a href="#">About</a>
                    </li>
                    <li>
                        <a href="#">Services</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>

                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="active ">
                        <a href="/WebContent/LandingPage.html">HOME</a>
                    </li>
                    <li>
                        <a href="/WebContent/Producer.aspx#">PRODUCERS</a>
                    </li>
                    <li>
                        <a href="/WebContent/ApplicatorNew.aspx#">APPLICATORS</a>
                    </li>
                    <li>
                        <a href="#">FAQ</a>
                    </li>
                    <li>
                        <a href="/WebContent/PublicMapNew.aspx#">PUBLIC MAP</a>
                    </li>
                    <li>
                        <a href="/WebContent/Registration.aspx#">SIGN UP</a>
                    </li>
                    <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown">SIGN IN <b class="caret"></b></a>
                        <ul class="dropdown-menu dropdown-menu-right dropdown-login-box animated bounceInRight" style="padding: 15px; min-width: 250px;">
                            <li>
                                <div class="row">
                                    <div class="col-md-12">
                                        <form  id="Form1" runat="server">
                                            <asp:scriptmanager id="ScriptManager1" runat="server" ScriptMode="Release" enablepagemethods="true" />
                                            <div>
                                                <div class="form-group">
                                                    <label class="sr-only" for="exampleInputEmail2">Email address</label>
                                                    <input type="email" class="form-control" id="email" placeholder="Email address" required>
                                                </div>
                                                <div class="form-group">
                                                    <label class="sr-only" for="exampleInputPassword2">Password</label>
                                                    <input type="password" class="form-control" id="password" placeholder="Password" required>
                                                </div>
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox">
                                                        Remember me
                                                    </label>
                                                </div>
                                                <div class="form-group">
                                                    <button type="button" class="btn btn-primary btn-block" onclick="loginUser()">Sign in</button>
                                                </div>
                                                    <div class="alert alert-danger fade in" id="loginmsg" style="display:none">
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->

        </div>
        <!-- /.container -->
    </nav>
</body>
</html>

