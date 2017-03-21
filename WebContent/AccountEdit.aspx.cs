using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebContent_AccountEdit : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] UpdateUserDetails(string userdetails)
    {
        user updatedUser = JsonConvert.DeserializeObject<user>(userdetails);
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
         SqlConnection conn = null;
         try
         {
             // string accesscode = GenerateAccessToken(obj.email, "register");
             string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
             conn = new SqlConnection(connection);
             conn.Open();
             if (conn.State == System.Data.ConnectionState.Open)
             {
                 StringBuilder sql = new StringBuilder();
                 sql.Append("UPDATE user_details SET");
                 sql.Append(" firstname =  '[FIRSTNAME]',");
                 sql.Append(" lastname =  '[LASTNAME]',");
                 sql.Append(" companyname =  '[COMPANY]',");
                 sql.Append(" address =  '[ADDRESS]',");
                 sql.Append(" city =  '[CITY]',");
                 sql.Append(" state =  '[STATE]',");
                 sql.Append(" zip =  '[ZIP]',");
                 sql.Append(" phoneBusiness =  '[PHONE]'");
                 sql.Append(" where user_id = [USERID]");
                 sql.Replace("[USERID]", updatedUser.user_id);
                 sql.Replace("[FIRSTNAME]", updatedUser.firstname);
                 sql.Replace("[LASTNAME]", updatedUser.lastname);
                 sql.Replace("[COMPANY]", updatedUser.companyname);
                 sql.Replace("[ADDRESS]", updatedUser.address);
                 sql.Replace("[CITY]", updatedUser.city);
                 sql.Replace("[STATE]", updatedUser.state);
                 sql.Replace("[ZIP]", updatedUser.zip);
                 sql.Replace("[PHONE]", updatedUser.phone1);
                 SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                 SqlDataReader reader = cmd.ExecuteReader();
                 if (reader.RecordsAffected == 1)
                 {
                     retval[0] = "0";
                     retval[1] = "User Details Updated Successfully";
                     HttpContext.Current.Session["user"] = updatedUser;
                     return retval;
                 }
                 sql.Clear();
                 cmd.Dispose();
                 reader.Close();
             }
         }
         catch (SqlException ex)
         {
                 retval[1] = "User Details Update Failed.";
                 retval[0] = "0";
         }
         finally
         {
             if(conn!=null)
             conn.Close();
         }
        return retval;
    }
}