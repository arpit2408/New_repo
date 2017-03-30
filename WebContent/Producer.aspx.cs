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

public partial class WebContent_Producer : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] ProducerPolygonAreas(string email)
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        user user = null;
        user = (user)HttpContext.Current.Session["user"];
        if (user == null)
            return retval;
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
                string sql = "select * from producer_locations where user_id = '[USER_ID]' and email='[EMAIL]' and year = '[YEAR]'  order by modifieddate desc";
                sql = sql.Replace("[USER_ID]", user.user_id);
                sql = sql.Replace("[EMAIL]", user.user_id);
                sql = sql.Replace("[YEAR]", DateTime.Today.Year.ToString());

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                croplocation croparea = null;
                while (reader.Read() && reader.HasRows)
                {
                    try
                    {

                        croparea = new croplocation();
                        if (!reader.IsDBNull(0))
                        {
                            croparea.usremail = reader.GetString(0).ToString();
                        }
                        if (!reader.IsDBNull(1))
                        {
                            croparea.planttype = reader.GetString(1).ToString();
                        }
                        if (!reader.IsDBNull(2))
                        {
                            croparea.croptype = reader.GetString(2).ToString();
                        }
                        if (!reader.IsDBNull(3))
                        {
                            croparea.cropyear = reader.GetString(3).ToString();
                        }
                        if (!reader.IsDBNull(4))
                        {
                            croparea.comment = reader.GetString(4).ToString();
                        }
                        if (!reader.IsDBNull(5))
                        {
                            croparea.county = reader.GetString(5).ToString();
                        }
                        if (!reader.IsDBNull(6))
                        {
                            croparea.coordinates = reader.GetString(6).ToString();
                        }
                        if (!reader.IsDBNull(7))
                        {
                            croparea.loccentroid = reader.GetString(7).ToString();
                        }
                        if (!reader.IsDBNull(8))
                        {
                            croparea.acres = reader.GetString(8).ToString();
                        }
                        if (!reader.IsDBNull(9))
                        {
                            croparea.organiccrops = (reader.GetBoolean(9) ? 1 : 0).ToString();
                        }
                        if (!reader.IsDBNull(10))
                        {
                            croparea.certifier = reader.GetString(10).ToString();
                        }
                        if (!reader.IsDBNull(15))
                        {
                            croparea.flagtype = reader.GetString(15).ToString();
                        }
                        if (!reader.IsDBNull(16))
                        {
                            croparea.shareCropInfo = reader.GetString(16).ToString();
                        }
                        if (!reader.IsDBNull(17))
                        {
                            croparea.markerPos = reader.GetString(17).ToString();
                        }

                        locationArr.Add(croparea);

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
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static ArrayList ListAllProducerFlags()
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        user user = null;
        user = (user)HttpContext.Current.Session["user"];
        ArrayList locationArr = null;
        locationArr = new ArrayList();
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "select * from producer_locations where cropyear = '[YEAR]' and deleted = 0 order by modifieddate desc;";
                //sql = sql.Replace("[EMAIL]", useremail);
                sql = sql.Replace("[YEAR]", dt.Year.ToString());
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
                            croploc.id = reader.GetInt32(14).ToString();
                        }
                        if (!reader.IsDBNull(0))
                        {
                            //croploc.usremail = reader.GetString(0);
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
                        if (!reader.IsDBNull(15))
                        {
                            croploc.flagtype = reader.GetString(15);
                        }
                        if (!reader.IsDBNull(16))
                        {
                            croploc.shareCropInfo = reader.GetString(16).Trim();
                        }
                        if (!reader.IsDBNull(17))
                        {
                            croploc.markerPos = reader.GetString(17).Trim();
                        }
                        locationArr.Add(croploc);

                    }
                    catch (Exception errReader)
                    {

                    }
                }

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
        HttpContext.Current.Session["allcrops"] = locationArr;
        return locationArr;
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] GetProducerPolygon(string polgyonId){
        SqlConnection conn = null;
        user user = (user)HttpContext.Current.Session["user"];
        String[] retval=new String[2];
        if (user == null)
            return null;
        else
        {
            ArrayList polygonCordinates = new ArrayList();
            try
            {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    StringBuilder sql = new StringBuilder("SELECT *");
                    sql.Append(" FROM producer_locations where producerLocID = [PRODUCERLOCID]");
                    sql.Replace("[PRODUCERLOCID]", polgyonId);
                    SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read() && reader.HasRows)
                    {
                        croplocation croparea = new croplocation();
                        if (!reader.IsDBNull(0))
                            croparea.usremail = reader.GetString(0).ToString();
                        if (!reader.IsDBNull(1))
                            croparea.planttype = reader.GetString(1).ToString();
                        if (!reader.IsDBNull(2))
                            croparea.croptype = reader.GetString(2).ToString();
                        if (!reader.IsDBNull(3))
                            croparea.cropyear = reader.GetString(3).ToString();
                        if (!reader.IsDBNull(4))
                            croparea.comment = reader.GetString(4).ToString();
                        if (!reader.IsDBNull(5))
                            croparea.county = reader.GetString(5).ToString();
                        if (!reader.IsDBNull(6))
                            croparea.coordinates = reader.GetString(6).ToString();
                        if (!reader.IsDBNull(7))
                            croparea.loccentroid = reader.GetString(7).ToString();
                        if (!reader.IsDBNull(8))
                            croparea.acres = reader.GetString(8).ToString();
                        if (!reader.IsDBNull(9))
                            croparea.organiccrops = (reader.GetBoolean(9) ? 1 : 0).ToString();
                        if (!reader.IsDBNull(10))
                            croparea.certifier = reader.GetString(10).ToString();
                        if (!reader.IsDBNull(14))
                            croparea.id = reader.GetInt32(14).ToString(); ;
                        if (!reader.IsDBNull(15))
                            croparea.flagtype = reader.GetString(15).ToString();
                        if (!reader.IsDBNull(16))
                            croparea.shareCropInfo = reader.GetString(16).ToString();
                        if (!reader.IsDBNull(17))
                            croparea.markerPos = reader.GetString(17).ToString();
                        if (!reader.IsDBNull(19))
                            croparea.pesticideApplied = (reader.GetBoolean(19) ? 1 : 0).ToString();
                        if (!reader.IsDBNull(20))
                            croparea.pesticideName = reader.GetString(20).ToString();
                        if (!reader.IsDBNull(22))
                            croparea.markCompleted = (reader.GetBoolean(22) ? 1 : 0).ToString();
                        polygonCordinates.Add(croparea);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);
            }
            finally
            {
                if (conn != null)
                    conn.Close();
            }
            retval[0] = "1";
            retval[1] = JsonConvert.SerializeObject(polygonCordinates);
            return retval;
        }
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] DeleteProdPolygon(string polgyonId)
    {
        SqlConnection conn = null;
        user user = (user)HttpContext.Current.Session["user"];
        String[] retval=new String[2];
        retval[0] = "0";
        retval[1] = "Encountered error in deletion..!!";
        if (user == null)
            return null;
        else
        {
            ArrayList polygonCordinates = new ArrayList();
            try
            {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    StringBuilder sql = new StringBuilder("SELECT *");
                    sql.Append(" FROM producer_locations where producerLocID = [PRODUCERLOCID] and deleted = 0");
                    sql.Replace("[PRODUCERLOCID]", polgyonId);
                    SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                    SqlDataReader reader = cmd.ExecuteReader();
                    int counter = 0;
                    while (reader.Read() && reader.HasRows){
                        counter++;
                    }
                    if (counter > 1){
                        retval[0] = "0";
                        retval[1] = "More than one associated record cannot proceed..!!";
                        return retval;
                    }
                    sql.Clear();
                    cmd.Dispose();
                    reader.Close();
                    sql.Append("update producer_locations set deleted=1 where producerLocID=[PRODUCERLOCID] and user_id=[USER_ID];");
                    sql.Replace("[PRODUCERLOCID]", polgyonId);
                    sql.Replace("[USER_ID]", user.user_id);
                    cmd = new SqlCommand(sql.ToString(), conn);
                    reader = cmd.ExecuteReader();
                    if (reader.RecordsAffected > 1)
                    {
                        retval[0] = "0";
                        retval[1] = "Delete Unsuccessful";
                        return retval;
                    }
                    retval[0] = "1";
                    retval[1] = "Deleted Successfully";
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);
            }
            finally
            {
                if (conn != null)
                    conn.Close();
            }
            return retval;
        }
    }
}