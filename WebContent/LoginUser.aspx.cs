using Newtonsoft.Json;
using System;
using System.Data.SqlClient;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Web;
public partial class WebContent_LoginUser : System.Web.UI.Page
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
    [OperationContract]
    [WebGet()]
    public string[] GetUserDetails(string id)
    {
        string[] retval = new string[2];// "";
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "select * from user_details where email = '[EMAIL]'";
                sql = sql.Replace("[EMAIL]", id);
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                user auser = new user();

                while (reader.Read())
                {
                    if (!reader.IsDBNull(0))
                    {
                        auser.email = reader.GetString(0);
                    }
                    if (!reader.IsDBNull(1))
                    {
                        auser.firstname = reader.GetString(1);
                    }
                    if (!reader.IsDBNull(2))
                    {
                        auser.lastname = reader.GetString(2);
                    }
                    if (!reader.IsDBNull(3))
                    {
                        auser.companyname = reader.GetString(3);
                    }
                    if (!reader.IsDBNull(4))
                    {
                        auser.address = reader.GetString(4);
                    }
                    if (!reader.IsDBNull(5))
                    {
                        auser.city = reader.GetString(5);
                    }
                    if (!reader.IsDBNull(6))
                    {
                        auser.state = reader.GetString(6);
                    }
                    if (!reader.IsDBNull(7))
                    {
                        auser.zip = reader.GetString(7);
                    }
                    if (!reader.IsDBNull(8))
                    {
                        auser.website = reader.GetString(8);
                    }
                    if (!reader.IsDBNull(9))
                    {
                        auser.phone1 = reader.GetString(9);
                    }
                    if (!reader.IsDBNull(10))
                    {
                        auser.phone2 = reader.GetString(10);
                    }
                    if (!reader.IsDBNull(13))
                    {
                        auser.activated = reader.GetBoolean(13);////////here
                    }
                    if (!reader.IsDBNull(14))
                    {
                        auser.preferences = reader.GetString(14);
                    }
                    if (!reader.IsDBNull(15))
                    {
                        auser.prefoptions = reader.GetString(15);
                    }
                    retval[0] = "1";
                }
                HttpContext.Current.Session["loggedon"] = 1;
                HttpContext.Current.Session["user"] = auser;


                /////////////////////////////////
                retval[1] = JsonConvert.SerializeObject(auser);
            }

        }
        catch (SqlException ex)
        {
            retval[0] = "0";
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