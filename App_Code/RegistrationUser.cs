using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.Text;
using System.Data.SqlClient;
using System.Drawing;

/// <summary>
/// Summary description for RegistrationUser
/// </summary>
public class RegistrationUser
{
	public RegistrationUser()
	{
		        
	}
    [System.Web.Services.WebMethod]
    public static string RegisterUser(string email, string password)
    {
        string result = "Congratulations!!! your account has been created.";
        if (email.Length == 0)//Zero length check
        {
            result = "Email Address cannot be blank";
        }
        else if (!email.Contains(".") || !email.Contains("@")) //some other basic checks
        {
            result = "Not a valid email address";
        }
        else if (!email.Contains(".") || !email.Contains("@")) //some other basic checks
        {
            result = "Not a valid email address";
        }

        else if (password.Length == 0)
        {
            result = "Password cannot be blank";
        }
        else if (password.Length < 5)
        {
            result = "Password canonot be less than 5 chars";
        }

        return result;
    }
}