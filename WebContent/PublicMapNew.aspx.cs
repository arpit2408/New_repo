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

public class publiccrop
{
    public double lon = 0;
    public double lat = 0;
    public string croptype = "";
    public string cropname = "";
    public string cropyear = "";
    public string county = "";
}

public partial class WebContent_ApplicatorAreas : System.Web.UI.Page
{
    public static user auser = null;
    protected void Page_Load(object sender, EventArgs e)
    { }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] QueryProducers(string option, String value)
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
                        if (!reader.IsDBNull(3))
                        {
                            croploc.cropyear= reader.GetString(3);
                        }
                        if (!reader.IsDBNull(5))
                        {
                            croploc.county = reader.GetString(5);
                        }
                        if (!reader.IsDBNull(1))
                        {
                            croploc.croptype = reader.GetString(1);
                        }
                        if (!reader.IsDBNull(2))
                        {
                            croploc.cropname = reader.GetString(2);
                        }
                        if (!reader.IsDBNull(7))
                        {
                            string location = reader.GetString(7);
                            string[] locationstr = location.Split(',');
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
}
  