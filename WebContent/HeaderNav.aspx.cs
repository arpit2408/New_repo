using System;
using System.Data.SqlClient;
public partial class WebContent_HeaderNav : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] AuthenticateUser(string id, string pwd)
    {
        string[] retval = new string[3];
        retval[0] = "0";
        retval[1] = "Authentication Failed";
        retval[2] = "";
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];//@"Data Source = 128.194.196.150\SQLEXPRESS;Initial Catalog=TXSCrops;Integrated Security=false;User ID=aspnet;Password=kelab";
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "SELECT u.[email],u.[firstname],[textpassword],v.valid_flag FROM [TX_CROPS].[dbo].[user_validation] v join user_details u on u.email=v.email where v.email = '[EMAIL]'"; // string sql = "select password, salt from test_table where Username = '[ID]'";
                sql = sql.Replace("[EMAIL]", id);//
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                string authpwd = "";

                bool isactivate = false;
                string firstname = "";
                while (reader.Read())
                {
                    authpwd = reader.GetString(2);
                    isactivate = reader.GetBoolean(3);
                    firstname = reader.GetString(1);
                }

                if (!authpwd.Equals(pwd))//
                {
                    retval[1] = "Authentication Failed";
                }
                else
                {
                    retval[0] = "1";
                    retval[1] = firstname + " Successfully LoggedIn";
                }

            }
        }
        catch (SqlException ex)
        {
            retval[1] = "Database Access Problem";
            return retval;

        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
}