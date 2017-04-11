using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebContent_PasswordReset : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        String currurl = Request.Url.AbsoluteUri;
        string[] usernametokeVal = currurl.Split(new string[] { "username=" }, StringSplitOptions.None);
        string[] tokenval = usernametokeVal[1].Split(new string[] { "token=" }, StringSplitOptions.None);
        string[] retval = LoginUser.CheckPasswordResetLink(tokenval[0].Replace("&",""), tokenval[1]);
        if(retval[0].Equals("0")){
            Response.Redirect("BrokenLink.aspx");
        }
    }

}