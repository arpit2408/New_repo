using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebContent_ListApplicator : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] GetUsers(string producerLocID)
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        ArrayList UserArr = new ArrayList();
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                StringBuilder sql = new StringBuilder("select * from user_details"); 
                sql.Append(" where (usertype like '%2,3%' or usertype like '%2%' or usertype like '%3%')");
                sql.Append(" and user_id not in");
                sql.Append(" (select user_id from MappingProducerLocation"); 
                sql.Append("    where producerLocID=[PRODUCERLOCID] and active=1)"); 
                sql.Append(" order by lastchange desc");
                sql = sql.Replace("[PRODUCERLOCID]", producerLocID);

                cmd = new SqlCommand(sql.ToString(), conn);
                reader = cmd.ExecuteReader();
                user usr = null;
                while (reader.Read() && reader.HasRows)
                {
                    try
                    {

                        usr = new user();
                        if (!reader.IsDBNull(0))
                        {
                            usr.email = reader.GetString(0).ToString();
                        }
                        if (!reader.IsDBNull(1))
                        {
                            usr.firstname = reader.GetString(1).ToString();
                        }
                        if (!reader.IsDBNull(2))
                        {
                            usr.lastname = reader.GetString(2).ToString();
                        }
                        if (!reader.IsDBNull(3))
                        {
                            usr.companyname = reader.GetString(3).ToString();
                        }
                        if (!reader.IsDBNull(4))
                        {
                            usr.address = reader.GetString(4).ToString();
                        }
                        if (!reader.IsDBNull(5))
                        {
                            usr.city = reader.GetString(5).ToString();
                        }
                        if (!reader.IsDBNull(6))
                        {
                            usr.state = reader.GetString(6).ToString();
                        }
                        if (!reader.IsDBNull(7))
                        {
                            usr.zip = reader.GetString(7).ToString();
                        }
                        if (!reader.IsDBNull(9))
                        {
                            usr.phone1 = reader.GetString(9).ToString();
                        }
                        if (!reader.IsDBNull(17))
                        {
                            usr.user_id = reader.GetInt32(17).ToString();
                        }
                        UserArr.Add(usr);

                    }
                    catch (Exception errReader)
                    {

                        retval[0] = "0";
                        retval[1] = "Database Access Problem";
                        retval[1] += errReader.Message;
                    }
                }
                retval[0] = "1";
                retval[1] = JsonConvert.SerializeObject(UserArr);
                cmd.Dispose();
                reader.Dispose();
            }
        }
        catch (SqlException ex)
        {

        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
    public static string[] UpdateProducerLocationsWithApplicators(string userType)
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        ArrayList UserArr = new ArrayList();
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "select * from user_details where usertype like '%[UserType]%'  order by lastchange desc";
                sql = sql.Replace("[UserType]", userType);

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                user usr = null;
                while (reader.Read() && reader.HasRows)
                {
                    try
                    {

                        usr = new user();
                        if (!reader.IsDBNull(0))
                        {
                            usr.email = reader.GetString(0).ToString();
                        }
                        if (!reader.IsDBNull(1))
                        {
                            usr.firstname = reader.GetString(1).ToString();
                        }
                        if (!reader.IsDBNull(2))
                        {
                            usr.lastname = reader.GetString(2).ToString();
                        }
                        if (!reader.IsDBNull(3))
                        {
                            usr.companyname = reader.GetString(3).ToString();
                        }
                        if (!reader.IsDBNull(4))
                        {
                            usr.address = reader.GetString(4).ToString();
                        }
                        if (!reader.IsDBNull(5))
                        {
                            usr.city = reader.GetString(5).ToString();
                        }
                        if (!reader.IsDBNull(6))
                        {
                            usr.state = reader.GetString(6).ToString();
                        }
                        if (!reader.IsDBNull(7))
                        {
                            usr.zip = reader.GetString(7).ToString();
                        }
                        if (!reader.IsDBNull(9))
                        {
                            usr.phone1 = reader.GetString(9).ToString();
                        }

                        UserArr.Add(usr);

                    }
                    catch (Exception errReader)
                    {

                        retval[0] = "0";
                        retval[1] = "Database Access Problem";
                        retval[1] += errReader.Message;
                    }
                }
                retval[0] = "1";
                retval[1] = JsonConvert.SerializeObject(UserArr);
                cmd.Dispose();
                reader.Dispose();
            }
        }
        catch (SqlException ex)
        {

        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
}
