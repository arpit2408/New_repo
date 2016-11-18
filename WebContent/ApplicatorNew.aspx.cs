using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Collections;
using Newtonsoft.Json;

public partial class WebContent_ApplicatorNew : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] GetApplicatorAreas(string email)
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        ArrayList locationArr = new ArrayList();
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "select * from applicator_areas  order by modifieddate desc";
                //sql = sql.Replace("[EMAIL]", email);
                //sql = sql.Replace("[YEAR]", "2016");

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                AppArea apparea = null;
                while (reader.Read() && reader.HasRows)
                {
                    try
                    {
                        
                        apparea = new AppArea();
                        if (!reader.IsDBNull(0))
                        {
                            apparea.usremail = reader.GetString(0).ToString();
                        }
                        if (!reader.IsDBNull(1))
                        {
                            apparea.appareaname = reader.GetString(1).ToString();
                        }
                        if (!reader.IsDBNull(2))
                        {
                            apparea.county = reader.GetString(2).ToString();
                        }
                        if (!reader.IsDBNull(3))
                        {
                            apparea.coordinates = reader.GetString(3).ToString();
                        }
                        if (!reader.IsDBNull(4))
                        {
                            apparea.areacentroid = reader.GetString(4).ToString();
                        }
                        if (!reader.IsDBNull(5))
                        {
                            apparea.acres = reader.GetString(5).ToString();
                        }
                        
                       
                        locationArr.Add(apparea);

                    }
                    catch (Exception errReader)
                    {

                        retval[0] = "0";
                        retval[1] = "Database Access Problem";
                        retval[1] += errReader.Message;
                    }
                }
                retval[0] = "1";
                retval[1] = JsonConvert.SerializeObject(locationArr);
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