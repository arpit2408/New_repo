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

public class publiccrop
{
    public double lon = 0;
    public double lat = 0;
    public string croptype = "unknown";
    public string cropname = "unknown";


}

public partial class PublicMap : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ArrayList countiesArr = new ArrayList();
        string jsonObj = "";
        EventLog event1 = new EventLog();
        string page = HttpContext.Current.Request.Url.AbsoluteUri;
        event1.InsertPageVisitEvent(page);
        if (HttpContext.Current.Session["colimits"] != null)
        {
            countiesArr = (ArrayList)HttpContext.Current.Session["colimits"];
        }
        else
        {
            SqlConnection conn = null;
            try
            {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader;
                    string sql = "";

                    sql = "select * from Counties where State = 'Texas' order by CountyName asc;";
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    county co = null;

                    while (reader.Read())
                    {
                        try
                        {
                            co = new county();
                            if (!reader.IsDBNull(2))
                            {
                                co.name = reader.GetString(2);
                            }
                            if (!reader.IsDBNull(6))
                            {
                                co.coordinates = reader.GetString(6);
                                co.coordinates = co.coordinates.Replace(';', '\n');
                            }
                            countiesArr.Add(co);

                        }
                        catch (Exception errReader)
                        {

                            jsonObj = "";
                        }
                    }
                    HttpContext.Current.Session["counties"] = countiesArr;
                }
            }
            catch (SqlException ex)
            {
                jsonObj = "";
            }
            finally
            {
                conn.Close();
            }

        }
        if (countiesArr.Count > 0)
        {
            jsonObj = JsonConvert.SerializeObject(countiesArr);
            // Define the name and type of the client script on the page.
            String csName = "UserScript";
            Type csType = this.GetType();

            // Get a ClientScriptManager reference from the Page class.
            ClientScriptManager cs = Page.ClientScript;

            // Check to see if the client script is already registered.
            if (!cs.IsClientScriptBlockRegistered(csType, csName))
            {
                StringBuilder csText = new StringBuilder();
                csText.Append("<script type=\"text/javascript\"> countiesObj = " + jsonObj + "; </script>");
                cs.RegisterClientScriptBlock(csType, csName, csText.ToString());
            }
        }
        
    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] QueryProducers(string option, string value)
    {
        int seed = 234;
        Random ran = new Random(seed);
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        ArrayList locationArr = new ArrayList();

        string optvalqry = "";
        string[] optarr = option.Split(',');
        string[] valarr = value.Split(',');
        for (int i = 0; i < optarr.Length; i++)
        {
            if (valarr[i] != "All")
            {
                optvalqry += optarr[i] + " = '" + valarr[i] + "' ";
                //if (i != optarr.Length - 1)
                    optvalqry += "and ";
            }
        }

        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "";
                if (option == "All")
                {
                    sql = "select * from producer_locations where year = '[YEAR]' and deleted = 0 order by email;";
                }
                else
                {
                    sql = "select * from producer_locations where [QRYARGS] year = '[YEAR]' and deleted = 0 order by email;";
                    sql = sql.Replace("[QRYARGS]", optvalqry);
                    //sql = sql.Replace("[VALUE]", value);
                }
                
                sql = sql.Replace("[YEAR]", dt.Year.ToString());

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                publiccrop croploc = null;
                while (reader.Read())
                {
                    try
                    {
                        croploc = new publiccrop();
                        if (!reader.IsDBNull(14))
                        {
                            //croploc.id = reader.GetDecimal(14).ToString();
                        }
                        if (!reader.IsDBNull(0))
                        {
                            //croploc.usremail = reader.GetString(0);
                        }
                        if (!reader.IsDBNull(1))
                        {
                            croploc.croptype = reader.GetString(1);
                        }
                        if (!reader.IsDBNull(2))
                        {
                            croploc.cropname = reader.GetString(2);
                        }
                        //if (!reader.IsDBNull(3))
                        //{
                        //    //croploc.cropyear = reader.GetString(3);
                        //}
                        //if (!reader.IsDBNull(4))
                        //{
                        //    //croploc.comment = reader.GetString(4);
                        //}
                        //if (!reader.IsDBNull(5))
                        //{
                        //    //croploc.county = reader.GetString(5);
                        //}
                        //if (!reader.IsDBNull(6))
                        //{
                        //    //croploc.coordinates = reader.GetString(6);
                        //}
                        if (!reader.IsDBNull(7))
                        {
                            string location = reader.GetString(7);
                            string [] locationstr = location.Split(',');
                            if (locationstr.Length == 2)
                            {
                                croploc.lat = double.Parse(locationstr[0]);
                                croploc.lon = double.Parse(locationstr[1]);
                                croploc.lat += (ran.NextDouble() - 0.5) / 10;
                                croploc.lon += (ran.NextDouble() - 0.5) / 10;
                            }
                            else
                            {


                            }
                        }
                        //if (!reader.IsDBNull(8))
                        //{
                        //    //croploc.acres = reader.GetString(8);
                        //}
                        //if (!reader.IsDBNull(9))
                        //{
                        //    //croploc.organiccrops = (reader.GetBoolean(9) ? 1 : 0).ToString();
                        //}
                        //if (!reader.IsDBNull(10))
                        //{
                        //    //croploc.certifier = reader.GetString(10);
                        //}
                        locationArr.Add(croploc);

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
            retval[0] = "0";
            retval[1] = "Database Access Problem";
        }
        finally
        {
            conn.Close();
        }


        return retval;
    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] GetCoLimits()
    {
        string[] retval = new string[2];
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
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "select * from Counties where State = 'Texas' order by CountyName asc;";

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                croplocation croploc = null;
                while (reader.Read())
                {
                    try
                    {
                        croploc = new croplocation();
                        
                        if (!reader.IsDBNull(14))
                        {
                            croploc.id = reader.GetDecimal(14).ToString();
                        }
                        if (!reader.IsDBNull(0))
                        {
                            croploc.usremail = reader.GetString(0);
                        }
                        if (!reader.IsDBNull(1))
                        {
                            croploc.planttype = reader.GetString(1);
                        }
                        if (!reader.IsDBNull(2))
                        {
                            croploc.croptype = reader.GetString(2);
                        }
                        if (!reader.IsDBNull(3))
                        {
                            croploc.cropyear = reader.GetString(3);
                        }
                        if (!reader.IsDBNull(4))
                        {
                            croploc.comment = reader.GetString(4);
                        }
                        if (!reader.IsDBNull(5))
                        {
                            croploc.county = reader.GetString(5);
                        }
                        if (!reader.IsDBNull(6))
                        {
                            croploc.coordinates = reader.GetString(6);
                        }
                        if (!reader.IsDBNull(7))
                        {
                            croploc.loccentroid = reader.GetString(7);
                        }
                        if (!reader.IsDBNull(8))
                        {
                            croploc.acres = reader.GetString(8);
                        }
                        if (!reader.IsDBNull(9))
                        {
                            croploc.organiccrops = (reader.GetBoolean(9) ? 1 : 0).ToString();
                        }
                        if (!reader.IsDBNull(10))
                        {
                            croploc.certifier = reader.GetString(10);
                        }
                        //locationArr.Add(croploc);

                    }
                    catch (Exception errReader)
                    {

                        retval[0] = "0";
                        retval[1] = "Database Access Problem";
                        retval[1] += errReader.Message;
                    }
                }
                retval[0] = "1";
                //retval[1] = JsonConvert.SerializeObject(locationArr);
                cmd.Dispose();
                reader.Dispose();
            }
        }
        catch (SqlException ex)
        {
            retval[0] = "0";
            retval[1] = "Database Access Problem";
        }
        finally
        {
            conn.Close();
        }

        return retval;
    }
}
