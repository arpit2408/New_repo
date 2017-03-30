using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;

// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "LoginUser" in code, svc and config file together.
[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class LoginUser
{
    [OperationContract]
    public string[] AuthenticateUser(string id, string pwd)
    {
        string[] retval = new string[3];
        retval[0] = "0";
        retval[1] = "Authentication Failed";
        retval[2] = "";
        SqlConnection conn = null;
        user auser=null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];//@"Data Source = 128.194.196.150\SQLEXPRESS;Initial Catalog=TXSCrops;Integrated Security=false;User ID=aspnet;Password=kelab";
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "SELECT [email],[firstname],[password] FROM  user_details  where email = '[EMAIL]'"; // string sql = "select password, salt from test_table where Username = '[ID]'";
                sql = sql.Replace("[EMAIL]", id);//
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                string authpwd = "";
                string firstname = "";
                while (reader.Read())
                {
                    authpwd = reader.GetString(2);
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
                    GetUserDetails(id);
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
                        auser.phone = reader.GetString(9);
                    }
                    if (!reader.IsDBNull(12))
                    {
                        auser.activated = reader.GetBoolean(12);////////here
                    }
                    if (!reader.IsDBNull(15))
                    {
                        auser.usertype = reader.GetString(15);
                    }
                    if (!reader.IsDBNull(16))
                    {
                        auser.user_id = reader.GetInt32(16).ToString();
                    }
                    retval[0] = "1";
                }
                HttpContext.Current.Session["loggedon"] = 1;
                HttpContext.Current.Session["user"] = auser;
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
    [OperationContract]
    [WebGet()]
    public string[] CheckLogin()
    {
        //HttpContext.Current.Session["dummy"] = 0;
        string[] retval = new string[3];
        retval[1] = "";
        retval[0] = "0";
        user usercheck = (user)HttpContext.Current.Session["user"];
        if (usercheck!=null)
        {
            retval[1] = JsonConvert.SerializeObject(usercheck);
            retval[0] = "1";
        }
        return retval;
    }
    [OperationContract]
    [WebGet()]
    public string[] Logoff()
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "Logoff Failed";
        user auser = (user)HttpContext.Current.Session["user"];
        HttpContext.Current.Session.Clear();
        retval[0] = "1";
        retval[1] = "Logoff Success";
        /*if (auser != null)
        {
            EventLog event1 = new EventLog();
            event1.InsertSuccessfullLogoff(auser.email);
        }*/
        return retval;
    }
}
