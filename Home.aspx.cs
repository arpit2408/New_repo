using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;

public partial class Home : System.Web.UI.Page
{
    public static user auser = null;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session.Count > 1)
        {
            if (Session["loggedon"] != null)
            {
                if (Session["loggedon"].ToString() == "1")
                {
                    auser = (user)HttpContext.Current.Session["user"];
                }
                else
                {
                    
                }
            }
        }
        else
        {
            //Response.Write("User Not logged on");

        }
        EventLog event1 = new EventLog();
        string page = HttpContext.Current.Request.Url.AbsoluteUri;
        event1.InsertPageVisitEvent(page);
        
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] GetUser()
    {
        //HttpContext.Current.Session["dummy"] = 0;
        string[] retval = new string[3];
        retval[2] = HttpContext.Current.Session.SessionID.ToString();
        retval[1] = "";
        retval[0] = "0";

        //if (HttpContext.Current.Session.Count > 2)
        //{
        //user auser = (user)HttpContext.Current.Session["user"];
        if (auser != null)
        {
            retval[1] = JsonConvert.SerializeObject(auser);
            retval[0] = "1";
        }
        else
        {
            retval[1] = "User not loaded by the session";
            retval[0] = "1";
        }
        //}

        return retval;
    }
}
