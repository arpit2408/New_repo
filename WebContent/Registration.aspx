<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Registration.aspx.cs" Inherits="WebContent_Registration" %>

<!DOCTYPE html>
<html lang="en">

    <head runat="server">
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.7/jquery.validate.min.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="../CSS/bootstrap.css">
        <link rel="stylesheet" type="text/css" href="css/Register.css">
        <script type="text/javascript" src="../javascript/bootstrap.js"></script>
        <script type="text/javascript" src="/WebContent/Javascript/cropAdd.js"></script>
        <script type="text/javascript" src="/WebContent/Javascript/registerNew.js"></script>
        <script type="text/javascript" src="/WebContent/Javascript/countries.js"></script>
		<!-- Website Font style -->
	    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
		<!-- Google Fonts -->
		<link href='https://fonts.googleapis.com/css?family=Passion+One' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Oxygen' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="css/landingPage.css">
	<title>Admin</title>
        <script>
            $.get("header.html", function (data) {
                $("#header").replaceWith(data);
            });

        </script>
	</head>
	<body>
        <!-- /.header  -->
   <div id="header" >
            </div>

    <!-- /.header end -->
		<div class="container">
			<div class="row main">
				<div class="panel-heading">
	               <div class="panel-title text-center">
	               		<h1 class="title" style="color:#1d0000">Texas Corp Registry</h1>
	               		<hr />
	               	</div>
	            </div> 
				<div class="main-login main-center">
                    <div id="messages" class="hide" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <div id="messages_content"></div>
                    </div>
					<form class="form-horizontal" data-toggle="validator" id="registerForm" method="post"  role="form" action="#" runat="server">
                        <asp:ScriptManager ID="ScriptManager1" runat="server"  EnablePageMethods="true" ></asp:ScriptManager>
                            
                        <div class="form-group">
							<label for="name" class="cols-sm-2 control-label">Your Name</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="name" id="name" placeholder="Enter your Name" required="required"/>
								</div>
                                <span class="errorspan" id="nameerror"></span>
							</div>
						</div>

						<div class="form-group">
							<label for="email" class="cols-sm-2 control-label">Your Email</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="email" id="email"  placeholder="Enter your Email" required/>
								</div>
                                <span class="errorspan" id="emailerror"></span>
							</div>
						</div>

						<div class="form-group">
							<label for="companyName" class="cols-sm-2 control-label">Company Name</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-users fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="companyName" id="companyName" placeholder="Enter your Company Name"/>
                                    <span class="glyphicon form-control-feedback"></span>
								</div>
                                <span class="errorspan" id="companyNameerror"></span>
							</div>
						</div>

                        <div class="form-group">
							<label for="Address" class="cols-sm-2 control-label">Address</label>
							<div class="cols-sm-10">
								<div class="input-group">
									 <span class="input-group-addon"><i class="fa fa-building fa" aria-hidden="true"></i></span>
									 <input type="text" class="form-control" name="Address" id="Address"  placeholder="Enter your Address" required/>
								</div>
                                <span class="errorspan" id="Addresserror"></span>
							</div>
						</div>
                        <div class="form-group">
							<label for="Address" class="cols-sm-2 "> </label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon ">State</span>
                                    <select onchange="print_city('city',this.selectedIndex);" id="state" name="state"  class="form-control" required></select>
				                    <span class="input-group-addon ">City</span>
                                    <select id="city" name="city" class="form-control" required></select>
                                    <script type="text/javascript ">print_state("state");</script>
                                    <span class="input-group-addon">Zip</span>
									<input type="text" class="form-control" name="zipCode" id="zipCode"  placeholder="Enter your Zip" required/>
								</div>
                                <span class="errorspan" id="zipCodeerror"></span>
                                <span class="errorspan" id="cityerror"></span>
                                <span class="errorspan" id="stateerror"></span>
							</div>
						</div>
                        <div class="form-group">
							<label for="txtPhone" class="cols-sm-2 control-label">Phone Number</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-phone fa" aria-hidden="true"></i></span>
									<input type="password" class="form-control" name="txtPhone" id="txtPhone"  placeholder="Enter your Phone Number" required/>
								</div>
                                <span class="errorspan" id="txtPhoneerror"></span>
							</div>
                            
                                
						</div>
						<div class="form-group">
							<label for="password" class="cols-sm-2 control-label">Password</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock fa" aria-hidden="true"></i></span>
									<input type="password" class="form-control" name="password" id="password"  placeholder="Enter your Password" required/>
								</div>
                                <span class="errorspan" id="passworderror"></span>
							</div>
						</div>

						<div class="form-group">
							<label for="confirm" class="cols-sm-2 control-label">Confirm Password</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock fa" aria-hidden="true"></i></span>
									<input type="password" class="form-control" name="confirm" id="confirm"  placeholder="Confirm your Password" required/>
								</div>
                                <span class="errorspan" id="confirmerror"></span>
							</div>
						</div>

						<div class="form-group ">
							<button type="submit" class="btn btn-primary btn-lg btn-block login-button" onclick="Signup()">Register</button>
						</div>
						
					</form>
				</div>
			</div>
		</div>
       <!-- Footer -->
         <div id="footer">
        </div>
	</body>
    <script>
        $.get("footer.html", function (data) {
            $("#footer").replaceWith(data);
        });
    </script>
</html>
