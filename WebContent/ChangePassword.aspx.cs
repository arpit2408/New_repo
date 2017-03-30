using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebContent_ChangePassword : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] UpdateUserPassword(string oldpwd, string newpwd)
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        user updatedUser = (user)HttpContext.Current.Session["user"];
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                string[] result = new LoginUser().AuthenticateUser(updatedUser.email, oldpwd);
                if (result[0]==("1"))
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("UPDATE user_details SET");
                    sql.Append(" password =  '[PASSWORD]'");
                    sql.Append(" where user_id = [USERID]");
                    sql.Replace("[USERID]", updatedUser.user_id);
                    sql.Replace("[PASSWORD]", newpwd.Trim());
                    SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.RecordsAffected == 1)
                    {
                        retval[0] = "1";
                        retval[1] = "Password Updated Successfully";
                        return retval;
                    }
                    sql.Clear();
                    cmd.Dispose();
                    reader.Close();
                }
                else
                {
                    retval[0] = "0";
                    retval[1] = "Old Password Incorrect";
                    return retval;

                }

            }
        }
        catch (Exception errReader)
        {
            retval[0] = "0";
            retval[1] = "Database Access Problem";
            retval[1] += errReader.Message;
        }
        return retval;
    }
}