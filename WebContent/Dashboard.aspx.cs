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

public partial class WebContent_Dashboard : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static ArrayList ListProducerPolygons(string useremail)
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
                string sql = "select * from producer_locations where email = '[EMAIL]' and cropyear = '[YEAR]' and deleted = 0 order by modifieddate desc;";
                sql = sql.Replace("[EMAIL]", useremail);
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
                            croploc.id = reader.GetDecimal(14).ToString();
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
                        if (!reader.IsDBNull(18))
                        {
                            croploc.cropShared = (reader.GetBoolean(18) ? 1 : 0).ToString();
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
        return locationArr;
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] MapProducerLocations(string mappingDetails)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        var data = JsonConvert.DeserializeObject<MappingLocation[]>(mappingDetails);
        user user = null;
        user = (user)HttpContext.Current.Session["user"];
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();

            for (int i = 0; i < data.Length; i++)
            {
                MappingLocation mLoc = new MappingLocation();
                mLoc = data[i];
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    StringBuilder sql = new StringBuilder("INSERT INTO MappingProducerLocation VALUES (");
                    sql.Append(" [producerLocID],[user_Id], [MappedForAction],'[modifiedDate]','[creationDate]')");
                    sql.Replace("[producerLocID]", mLoc.producerLocID);
                    sql.Replace("[user_Id]", mLoc.user_Id);
                    sql.Replace("[MappedForAction]", mLoc.MappedForAction);
                    sql.Replace("[modifiedDate]", null);
                    sql.Replace("[creationDate]", DateTime.Now.ToString());
                    SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (!(reader.RecordsAffected == 1))
                    {
                        retval[0] = "0";
                        retval[1] = "Mapping Unsuccessful";
                        return retval;
                    }
                    sql.Clear();
                    cmd.Dispose();
                    reader.Close();
                    sql.Append("UPDATE producer_locations SET cropShared =  '1' where producerLocID = [producerLocID]");
                    sql.Replace("[producerLocID]", mLoc.producerLocID);
                    cmd = new SqlCommand(sql.ToString(), conn);
                    reader = cmd.ExecuteReader();
                    if (!(reader.RecordsAffected == 1))
                    {
                        retval[0] = "0";
                        retval[1] = "Mapping Update Unsuccessful";
                        return retval;
                    }
                    sql.Clear();
                    cmd.Dispose();
                    reader.Close();
                }
            }
            retval[0] = "1";
            retval[1] = "Mapping Successful";
        }
        catch (Exception ex)
        {
            retval[0] = "0";
            retval[1] = "Mapping Unsuccessful";
            Console.Write(ex.Message);
        }
        finally
        {
            if (conn != null)
                conn.Close();
        }
        return retval;
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static ArrayList ListGroupedActionViewLocations()
    {
        SqlConnection conn = null;
        user user = (user)HttpContext.Current.Session["user"];
        if (user == null)
            return null;
        else
        {
            ArrayList groupedUsers = new ArrayList();
            try
            {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    StringBuilder sql = new StringBuilder("SELECT usr.firstname,usr.lastname,usr.email,usr.user_id");
                    sql.Append(" FROM [MappingProducerLocation] map");
                    sql.Append(" join producer_locations ploc on ploc.producerLocID=map.producerLocID");
                    sql.Append(" join user_details usr on ploc.user_id =usr.user_id");
                    sql.Append(" where map.User_ID= [User_ID] and map.creationDate > [Year]");
                    sql.Append(" group by usr.email,usr.firstname,usr.lastname,usr.user_id");
                    sql.Replace("[User_ID]", user.user_id);
                    sql.Replace("[Year]", DateTime.Today.Year.ToString());
                    SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                    SqlDataReader reader = cmd.ExecuteReader();
                    StringBuilder singleUser = new StringBuilder();
                    while (reader.Read() && reader.HasRows)
                    {
                        singleUser.Clear();
                        if (!reader.IsDBNull(0))
                             singleUser.Append(reader.GetString(0).ToString());
                        if(!reader.IsDBNull(1))
                            singleUser.Append(","+reader.GetString(1).ToString());
                        if (!reader.IsDBNull(2))
                            singleUser.Append("," + reader.GetString(2).ToString());
                        if (!reader.IsDBNull(3))
                            singleUser.Append("," + reader.GetInt32(3).ToString());
                        groupedUsers.Add(singleUser.ToString());
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
            return groupedUsers;
        }
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] GetSpecificUserPolygons(string user_id)
    {
        SqlConnection conn = null;
        user user = (user)HttpContext.Current.Session["user"];
        string[] retval=new string[2];
        if (user == null)
            return null;
        else
        {
            ArrayList locationArr = new ArrayList();
            try
            {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    StringBuilder sql = new StringBuilder("SELECT *");
                    sql.Append(" FROM [TX_CROPS].[dbo].[user_details] usrdet");
                    sql.Append(" join producer_locations ploc on usrdet.user_id= ploc.user_id");
                    sql.Append(" join MappingProducerLocation mapLoc on ploc.producerLocID = mapLoc.producerLocID");
                    sql.Append(" where usrdet.user_id=[User_ID] and mapLoc.user_id=[Session_User_ID]");
                    sql.Replace("[User_ID]", user_id.ToString());
                    sql.Replace("[Session_User_ID]", user.user_id);
                    sql.Replace("[Year]", DateTime.Today.Year.ToString());
                    SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                    SqlDataReader reader = cmd.ExecuteReader();
                    StringBuilder singleUser = new StringBuilder();
                    while (reader.Read() && reader.HasRows)
                    {
                        croplocation croparea = new croplocation();
                        if (!reader.IsDBNull(0))
                            croparea.usremail = reader.GetString(0).ToString();
                        if (!reader.IsDBNull(19))
                            croparea.planttype = reader.GetString(19).ToString();
                        if (!reader.IsDBNull(20))
                            croparea.croptype = reader.GetString(20).ToString();
                        if (!reader.IsDBNull(21))
                            croparea.cropyear = reader.GetString(21).ToString();
                        if (!reader.IsDBNull(22))
                            croparea.comment = reader.GetString(22).ToString();
                        if (!reader.IsDBNull(23))
                            croparea.county = reader.GetString(23).ToString();
                        if (!reader.IsDBNull(24))
                            croparea.coordinates = reader.GetString(24).ToString();
                        if (!reader.IsDBNull(25))
                            croparea.loccentroid = reader.GetString(25).ToString();
                        if (!reader.IsDBNull(26))
                            croparea.acres = reader.GetString(26).ToString();
                        if (!reader.IsDBNull(27))
                            croparea.organiccrops = (reader.GetBoolean(27) ? 1 : 0).ToString();
                        if (!reader.IsDBNull(28))
                            croparea.certifier = reader.GetString(28).ToString();
                        if (!reader.IsDBNull(33))
                            croparea.flagtype = reader.GetString(33).ToString();
                        if (!reader.IsDBNull(34))
                            croparea.shareCropInfo = reader.GetString(34).ToString();
                        if (!reader.IsDBNull(35))
                            croparea.markerPos = reader.GetString(35).ToString();
                        if (!reader.IsDBNull(36))
                            croparea.cropShared = (reader.GetBoolean(36) ? 1 : 0).ToString();
                        if (!reader.IsDBNull(40))
                            croparea.markCompleted = (reader.GetBoolean(40) ? 1 : 0).ToString();
                        if (!reader.IsDBNull(43))
                            croparea.mappedAs = (reader.GetBoolean(43) ? 1 : 0).ToString();
                        locationArr.Add(croparea);
                    }
                    cmd.Dispose();
                    reader.Dispose();
                }
            }
            catch (Exception ex)
            {
                retval[0] = "0";
                retval[1] = ex.Message;
                Console.Write(ex.Message);
            }
            finally
            {
                if (conn != null)
                    conn.Close();

            }
            retval[0] = "1";
            retval[1] = JsonConvert.SerializeObject(locationArr);

            return retval;
        }
    }
 }
