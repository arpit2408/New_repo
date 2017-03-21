<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript" src="/WebContent/Javascript/loginUser.js"></script>
</head>
<body>   
              
    <form id="form1" runat="server">
        <div>
            <div class="container ">
                <div class="modal fade left modalZIndex" id="loginforModal" role="dialog" >
                    <div class="modal-dialog">
                         <!-- Modal content-->
                        <div class="modal-content modalZIndex" style="height: auto; width: auto; ">
                            <div class="modal-header modalZIndex">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Sign In</h4>
                            </div>
                            <div class="modal-body modalZIndex" style="background-color: #eee">



                                <div style="padding-top: 30px" class="panel-body modalZIndex">

                                    <div style="display: none" id="login-alert" class="alert alert-danger col-sm-12"></div>


                                    <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                        <input id="email" type="text" class="form-control" name="username" value="" placeholder="username or email" />
                                    </div>

                                    <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                                        <input id="password" type="password" class="form-control" name="password" placeholder="password" />
                                    </div>

                                </div>
                                <div class="alert alert-danger fade in" id="loginmsg" style="display: none">
                                </div>

                                <div class="input-group">
                                    <div class="checkbox">
                                        <label>
                                            <input id="login-remember" type="checkbox" name="remember" value="1" />
                                            Remember me
                                        </label>

                                    </div>

                                </div>

                                <div class="">
                                    <input type="input" class="btn btn-primary" style="width: 120px" onclick="loginUser()" onkeydown="loginUser()" value="Login" />
                                </div>



                                <div class="form-group">
                                    <div class="" style="padding-top: 10px">
                                        <div style="border-top: 1px solid#888; padding-top: 15px; font-size: 85%">
                                            Don't have an account! 
                                                        <a href="/WebContent/RegisterNewUser.aspx">Sign Up Here</a>
                                        </div>
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
