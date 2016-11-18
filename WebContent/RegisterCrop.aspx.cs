using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebContent_RegisterCrop : System.Web.UI.Page
{
    
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod()]
    [System.Web.Script.Services.ScriptMethod()]
    public static string[] GetCounty(string croplocation)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "no county found";
        croplocation crop = new croplocation();
        string temp = croplocation.Replace(";", "\n");
        crop.coordinates = temp;
        ArrayList result = CheckCropCounty(crop);
        if (result.Count > 0)
        {
            retval[0] = "1";
            retval[1] = "";
            for (int x = 0; x < result.Count; x++)
            {
                if (x == result.Count - 1)
                {
                    retval[1] += result[x];
                }
                else
                {

                    retval[1] += result[x] + ", ";
                }
            }
        }
        //retval[1] = "Brazos";
        return retval;
    }

    //Checks to see if a crop is in a county. Returns an array of counties that the crop resides within
    public static ArrayList CheckCropCounty(croplocation crop)
    {
        ArrayList retval = new ArrayList();
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
                        ////county object stored. Now check point in polygon for all vertices of crop
                        PolygonC countypoly = new PolygonC(co.coordinates, "lonlat");
                        PolygonC croppoly = new PolygonC(crop.coordinates, "latlon");
                        bool incounty = false;
                        for (int y = 0; y < croppoly.coordinates.Count; y++)
                        {
                            if (countypoly.PointInside((PointC)(croppoly.coordinates[y])))
                            {
                                incounty = true;

                            }
                        }
                        if (incounty)
                        {
                            retval.Add(co.name);
                        }
                    }
                    catch (Exception errReader)
                    {


                    }
                }

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
    public static string validatefields(Object obj,List<String> listforuncheckvalues )
    {
        var fieldValues = obj.GetType()
                     .GetFields()
                     .Select(field => field.GetValue(obj))
                     .ToList();
        var fieldNames = typeof(croplocation).GetFields()
                            .Select(field => field.Name)
                            .ToList();
        TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
        for(int i=0;i<fieldValues.Count;i++)
        {
            bool flagforcheck = String.IsNullOrWhiteSpace((string)fieldValues.ElementAtOrDefault(i));
            if (flagforcheck && !listforuncheckvalues.Contains(fieldNames.ElementAtOrDefault(i).ToString()))
            {
                var field = textInfo.ToTitleCase(fieldNames.ElementAtOrDefault(i).ToString());
                return field + " has incorrect value";
            }
        }
        return null;
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] AddNewLocation(string userlocation, string email)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        DateTime date = new DateTime();
        date = DateTime.Now;
        SqlConnection conn = null;
        user auser = (user)HttpContext.Current.Session["user"];
        croplocation obj = JsonConvert.DeserializeObject<croplocation>(userlocation);
        List<String> listforuncheckvalues = new List<string>();
        listforuncheckvalues.Add("comment");
        listforuncheckvalues.Add("loccentroid");
        listforuncheckvalues.Add("certifier");
        String validateValue = validatefields(obj, listforuncheckvalues);
        if (!String.IsNullOrWhiteSpace(validateValue))
        {
            retval[1] = validateValue;
            return retval;
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
                string sql = "INSERT INTO producer_locations (email, planttype, croptype, cropyear, comment, county, coordinates, loccentroid, acres, organiccrops, certifier, modifieddate, year, deleted) ";
                sql += " VALUES ('[EMAIL]', '[PTYPE]', '[CTYPE]', '[CYEAR]', '[COMMENT]', '[COUNTY]', '[COORDINATES]', '[LOCCENTR]', '[ACRES]', '[ORGCROP]', '[CERTIF]', '[DATE1]', '[YEAR]', 0);";
                sql += "SELECT SCOPE_IDENTITY()";
                sql = sql.Replace("[EMAIL]", obj.usremail);
                sql = sql.Replace("[PTYPE]", obj.planttype);
                sql = sql.Replace("[CTYPE]", obj.croptype);
                sql = sql.Replace("[CYEAR]", date.Year.ToString());
                sql = sql.Replace("[COMMENT]", obj.comment);
                sql = sql.Replace("[COUNTY]", obj.county);
                sql = sql.Replace("[COORDINATES]", obj.coordinates);
                sql = sql.Replace("[LOCCENTR]", obj.loccentroid);
                sql = sql.Replace("[ACRES]", obj.acres);
                sql = sql.Replace("[ORGCROP]", obj.organiccrops.ToString());
                sql = sql.Replace("[CERTIF]", obj.certifier);
                sql = sql.Replace("[DATE1]", date.ToString());
                sql = sql.Replace("[YEAR]", date.Year.ToString());
                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                if (reader.HasRows == true)
                {
                    reader.Read();
                    retval[0] = "1";
                    retval[1] = "Location & Crop Added Successfully.";
                    string extrainfo = "";
                    if (reader.IsDBNull(0) == false)
                    {
                        extrainfo = (reader.GetDecimal(0).ToString());
                    }
                    EventLog e = new EventLog();
                    e.InsertAddCrop(extrainfo);
                }
                else
                {
                    retval[0] = "0";
                    retval[1] = "Location & Crop Addition failed. User does not exist.";
                }
                cmd.Dispose();
                reader.Dispose();
                
            }
        }
        catch (SqlException e)
        {
            retval[0] = "0";
            retval[1] = "Add Location failed. Data base error";
            retval[1] += e.Message;
        }
        finally
        {
            conn.Close();
        }



        return retval;
    }
}