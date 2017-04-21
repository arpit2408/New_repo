<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListApplicator.aspx.cs" Inherits="WebContent_ListApplicator" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<script type="text/javascript" src="/WebContent/Javascript/loginUser.js"></script>
<body>
    <form id="form1" runat="server">
        <div>
            <div id="cropId" style="display: none"></div>
            <!-- Modal -->
            <div class="modal fade" id="listApplicatorsModal" role="dialog" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog">
                    <div class="col-xs-6">
                        <!-- Modal content-->
                        <div class="modal-content" style="height: auto; width: 800px;">
                            <div class="modal-header">
                                <button type="button" id="closemyModal" onclick="closeevent();" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Choose your Applicator/Consultant</h4>
                            </div>
                            <div class="modal-body" style="background-color: #eee;height:378px;">



                                <div class="well" style="max-height: 300px; overflow: auto;">

                                    <div class="row">
                                        
                                        <div class="row">
                                            <div class="form-group col-sm-12 searchclass">
                                                    <input type="text" class="form-control input-sm searchheight" placeholder="Search Applicator" id="myInput" onkeyup="myFunction()" onkeydown="myFunction()"/>
                                            </div>
                                            <!-- <div class="form-group col-xs-4">
                                                <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#filter-panel">
                                                    <span class="glyphicon glyphicon-cog"></span>Advanced Search
                                                </button>
                                            </div> -->
                                        </div>
                                        <div id="filter-panel" class="collapse filter-panel">
                                            <div class="panel panel-default">
                                                <div class="panel-body row">
                                                    <form class="form-inline" role="form">
                                                        <div class="form-group col-sm-4">
                                                            <label class="filter-col" style="margin-right: 0;" for="pref-perpage">Rows per page:</label>
                                                            <select id="pref-perpage" class="form-control">
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                                <option value="6">6</option>
                                                                <option value="7">7</option>
                                                                <option value="8">8</option>
                                                                <option value="9">9</option>
                                                                <option selected="selected" value="10">10</option>

                                                            </select>
                                                        </div>
                                                        <!-- form group [rows] 
                                                        <div class="form-group col-sm-3">
                                                            <label class="filter-col" style="margin-right: 0;" for="pref-search">Search:</label>
                                                            <input type="text" class="form-control input-sm" id="pref-search">
                                                        </div>
                                                        -->
                                                        <!-- form group [search] -->
                                                        <div class="form-group col-sm-5">
                                                            <label class="filter-col" style="margin-right: 0;" for="pref-orderby">Order by:</label>
                                                            <select id="pref-orderby" class="form-control">
                                                                <option>Name</option>
                                                                <option>Contact Details</option>
                                                                <option>Company Name</option>
                                                                <option>Company Name</option>
                                                            </select>
                                                        </div>
                                                        <!-- form group [order by] -->
                                                        <div class="form-group col-sm-3 paddingtopbutton">
                                                            <button type="submit" class="btn btn-default filter-col ">
                                                                <span class="glyphicon glyphicon-record"></span>Save Settings
                                                            </button>
                                                        </div>
                                                       
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                                <ul id="check-list-box" class="list-group checked-list-box">
                                </ul>
                                <br />
                                 </div>
                                <input class="btn btn-primary col-xs-12" type="button" onclick="submitapplicatorlist()" value="Submit" id="get-checked-data" />
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </form>
</body>
</html>
