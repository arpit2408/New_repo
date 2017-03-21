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
    
    
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] AddNewCropLocation(string userlocation)
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
        listforuncheckvalues.Add("certifier");
        listforuncheckvalues.Add("flagtype");
        listforuncheckvalues.Add("markerPos");
        listforuncheckvalues.Add("cropShared");
        listforuncheckvalues.Add("pesticideApplied");
        listforuncheckvalues.Add("pesticideName");
        listforuncheckvalues.Add("markCompleted");
        listforuncheckvalues.Add("mappedAs");
        listforuncheckvalues.Add("usremail");
        String validateValue = ValidatorCustom.validatefields(obj, listforuncheckvalues);
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
                StringBuilder sql=null;
                string msg=null;
                if (obj.id == "-1")
                {
                    sql = new StringBuilder("INSERT INTO producer_locations"); 
                    sql.Append(" (email, planttype, croptype, cropyear, comment, county, coordinates, loccentroid,") ;
                    sql.Append(" acres, organiccrops, certifier, modifieddate, year,flagtype,");
                    sql.Append(" shareCropInfo,markerPos,pesticideApplied,pesticideName,user_id,markCompleted) ");
                    sql.Append(" VALUES ('[EMAIL]', '[PTYPE]', '[CTYPE]', '[CYEAR]', '[COMMENT]', '[COUNTY]', ");
                    sql.Append(" '[COORDINATES]', '[LOCCENTR]', '[ACRES]', '[ORGCROP]', '[CERTIF]', '[DATE1]', '[YEAR]',"); 
                    sql.Append(" '[FLAGTYPE]','[SHARECROPINFO]','[MARKERPOS]','[PESTICIDEAPPLIED]',");
                    sql.Append(" '[PESTICIDENAME]','[USER_ID]','[MARKCOMPLETED]')");
                    sql.Replace("[EMAIL]", auser.email);
                    sql.Replace("[PTYPE]", obj.planttype);
                    sql.Replace("[CTYPE]", obj.croptype);
                    sql.Replace("[CYEAR]", date.Year.ToString());
                    sql.Replace("[COMMENT]", obj.comment);
                    sql.Replace("[COUNTY]", obj.county);
                    sql.Replace("[COORDINATES]", obj.coordinates);
                    sql.Replace("[LOCCENTR]", obj.loccentroid);
                    sql.Replace("[ACRES]", obj.acres);
                    sql.Replace("[ORGCROP]", obj.organiccrops.ToString());
                    sql.Replace("[CERTIF]", obj.certifier);
                    sql.Replace("[DATE1]", date.ToString());
                    sql.Replace("[YEAR]", date.Year.ToString());
                    sql.Replace("[FLAGTYPE]", obj.flagtype.ToString());
                    sql.Replace("[SHARECROPINFO]", obj.shareCropInfo.ToString());
                    sql.Replace("[MARKERPOS]", obj.markerPos.ToString());
                    sql.Replace("[PESTICIDEAPPLIED]", obj.shareCropInfo.ToString());
                    sql.Replace("[PESTICIDENAME]", obj.markerPos.ToString());
                    sql.Replace("[USER_ID]", auser.user_id);
                    sql.Replace("[MARKCOMPLETED]",obj.markCompleted.ToString());
                    msg="Location & Crop Added Successfully.";
                }
                else
                {
                    sql = new StringBuilder("Update producer_locations set planttype = '[PTYPE]',");
                    sql.Append(" croptype = '[CTYPE]', cropyear ='[CYEAR]' , comment = '[COMMENT]' , county = '[COUNTY]',"); 
                    sql.Append(" coordinates = '[COORDINATES]',loccentroid = '[LOCCENTR]', acres = '[ACRES]',");
                    sql.Append(" organiccrops = '[ORGCROP]', certifier = '[CERTIF]', modifieddate = '[DATE1]',");
                    sql.Append(" year = '[YEAR]' , deleted = '0', flagtype = '[FLAGTYPE]',");
                    sql.Append(" shareCropInfo = '[SHARECROPINFO]',markerPos = '[MARKERPOS]',"); 
                    sql.Append(" pesticideApplied='[PESTICIDEAPPLIED]',");
                    sql.Append(" pesticideName='[PESTICIDENAME]', markCompleted='[MARKCOMPLETED]'");
                    sql.Append(" Where producerLocID = '[producerLocID]'");
                    //sql.Replace("[EMAIL]", obj.usremail);
                    sql.Replace("[PTYPE]", obj.planttype);
                    sql.Replace("[CTYPE]", obj.croptype);
                    sql.Replace("[CYEAR]", date.Year.ToString());
                    sql.Replace("[COMMENT]", obj.comment);
                    sql.Replace("[COUNTY]", obj.county);
                    sql.Replace("[COORDINATES]", obj.coordinates);
                    sql.Replace("[LOCCENTR]", obj.loccentroid);
                    sql.Replace("[ACRES]", obj.acres);
                    sql.Replace("[ORGCROP]", obj.organiccrops.ToString());
                    sql.Replace("[CERTIF]", obj.certifier);
                    sql.Replace("[DATE1]", date.ToString());
                    sql.Replace("[YEAR]", date.Year.ToString());
                    sql.Replace("[FLAGTYPE]", obj.flagtype.ToString());
                    sql.Replace("[SHARECROPINFO]", obj.shareCropInfo.ToString());
                    sql.Replace("[MARKERPOS]", obj.markerPos.ToString());
                    sql.Replace("[PESTICIDEAPPLIED]", obj.pesticideApplied.ToString());
                    sql.Replace("[PESTICIDENAME]", obj.pesticideName.ToString());
                    sql.Replace("[MARKCOMPLETED]", obj.markCompleted.ToString());
                    sql.Replace("[producerLocID]", obj.id.ToString());
                    msg= "Location & Crop Updated Successfully.";
                }
                cmd = new SqlCommand(sql.ToString(), conn);
                reader = cmd.ExecuteReader();
                if (reader.RecordsAffected > 0)
                {
                    reader.Read();
                    retval[0] = "1";
                    retval[1] = msg;
                }
                else
                {
                    retval[0] = "0";
                    retval[1] = "Operation failed.Please try again..!!";
                }
                cmd.Dispose();
                reader.Dispose();
            }
        }
        catch (SqlException e)
        {
            retval[0] = "0";
            retval[1] = "Update Location failed. Data base error";
            retval[1] += e.Message;
        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
}