using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using Newtonsoft.Json;
using System.Text;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Drawing;
using ClipperLib;
using Polygon = System.Collections.Generic.List<ClipperLib.IntPoint>;
using Polygons = System.Collections.Generic.List<System.Collections.Generic.List<ClipperLib.IntPoint>>;

public partial class NewArea : System.Web.UI.Page
{
    public static user auser = null;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session.Count > 1)
        {
            if (Session["loggedon"] != null)
            {
                if (Session["loggedon"].ToString() == "1")
                {
                    //Response.Write("User logged on\n");
                    auser = (user)HttpContext.Current.Session["user"];
                    string json = JsonConvert.SerializeObject(auser);
                    // Define the name and type of the client script on the page.
                    String csName = "UserScript";
                    Type csType = this.GetType();

                    // Get a ClientScriptManager reference from the Page class.
                    ClientScriptManager cs = Page.ClientScript;

                    // Check to see if the client script is already registered.
                    if (!cs.IsClientScriptBlockRegistered(csType, csName))
                    {
                        StringBuilder csText = new StringBuilder();
                        csText.Append("<script type=\"text/javascript\"> serverval = " + json + "; </script>");
                        cs.RegisterClientScriptBlock(csType, csName, csText.ToString());
                    }
                    //Response.Write("as: " + auser.firstname + " " + auser.lastname);
                }
                else
                {
                    //Response.Write("User Not logged on");
                }
            }
        }
        else
        {
            //Response.Write("User Not logged on");

        }
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] LoadUserAppArea(int appid)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        ////check that trhe user is logged in
        
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser == null )
        {
            retval[1] = "Authentication error";
            return retval;
        }
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
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
                //applicatorID is ThemeableAttribute IDataAdapter of ThemeableAttribute area NotFiniteNumberException the applicator
                string sql = "select * from applicator_areas where email = '[EMAIL]' and year = '[YEAR]' and applicatorID = [APPID] and deleted = 0 order by modifieddate;";
                sql = sql.Replace("[EMAIL]", auser.email);
                sql = sql.Replace("[YEAR]", dt.Year.ToString());
                sql = sql.Replace("[APPID]", appid.ToString());
                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                AppArea apparea = null;
                while (reader.Read())
                {
                    try
                    {

                        apparea = new AppArea();
                        if (!reader.IsDBNull(0))
                        {
                            apparea.usremail = reader.GetString(0);
                        }
                        if (!reader.IsDBNull(1))
                        {
                            apparea.appareaname = reader.GetString(1);
                        }
                        if (!reader.IsDBNull(2))
                        {
                            apparea.county = reader.GetString(2);
                        }
                        if (!reader.IsDBNull(3))
                        {
                            apparea.coordinates = reader.GetString(3);
                        }
                        if (!reader.IsDBNull(4))
                        {
                            apparea.areacentroid = reader.GetString(4);
                        }
                        if (!reader.IsDBNull(5))
                        {
                            apparea.buffercoords = reader.GetString(5);
                        }
                        if (!reader.IsDBNull(6))
                        {
                            apparea.acres = reader.GetString(6);
                        }
                        if (!reader.IsDBNull(7))
                        {
                            apparea.license = reader.GetString(7);
                        }
                        if (!reader.IsDBNull(8))
                        {
                            apparea.pesticidename = reader.GetString(8);
                        }
                        if (!reader.IsDBNull(11))
                        {
                            apparea.id = reader.GetDecimal(11).ToString();
                        }
                        if (!reader.IsDBNull(12))
                        {
                            apparea.comment = reader.GetString(12);
                        }

                    }
                    catch (Exception errReader)
                    {
                        retval[0] = "0";
                        retval[1] = "Database Access Problem";
                        retval[1] += errReader.Message;
                    }
                }
                retval[0] = "1";
                retval[1] = JsonConvert.SerializeObject(apparea);
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

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] LoadUserAreas(string email)
    //{
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "";
    //    SqlConnection conn = null;
    //    DateTime dt = DateTime.Now;
    //    ArrayList locationArr = new ArrayList();

    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            SqlCommand cmd = null;
    //            SqlDataReader reader;
    //            string sql = "select * from applicator_areas where email = '[EMAIL]' and year = '[YEAR]' and deleted = 0 order by modifieddate;";
    //            sql = sql.Replace("[EMAIL]", email);
    //            sql = sql.Replace("[YEAR]", dt.Year.ToString());

    //            cmd = new SqlCommand(sql, conn);
    //            reader = cmd.ExecuteReader();
    //            AppArea apparea = null;
    //            while (reader.Read())
    //            {
    //                try
    //                {
    //                    apparea = new AppArea();
    //                    if (!reader.IsDBNull(12))
    //                    {
    //                        apparea.id = reader.GetDecimal(12).ToString();
    //                    }
    //                    if (!reader.IsDBNull(0))
    //                    {
    //                        apparea.usremail = reader.GetString(0);
    //                    }
    //                    if (!reader.IsDBNull(1))
    //                    {
    //                        apparea.comment = reader.GetString(1);
    //                    }
    //                    if (!reader.IsDBNull(2))
    //                    {
    //                        apparea.county = reader.GetString(2);
    //                    }
    //                    if (!reader.IsDBNull(3))
    //                    {
    //                        apparea.coordinates = reader.GetString(3);
    //                    }
    //                    if (!reader.IsDBNull(4))
    //                    {
    //                        apparea.areacentroid = reader.GetString(4);
    //                    }
    //                    if (!reader.IsDBNull(5))
    //                    {
    //                        apparea.buffercoords = reader.GetString(5);
    //                    }
    //                    if (!reader.IsDBNull(6))
    //                    {
    //                        apparea.acres = reader.GetString(6);
    //                    }
    //                    if (!reader.IsDBNull(7))
    //                    {
    //                        apparea.license = reader.GetString(7);
    //                    }
    //                    if (!reader.IsDBNull(8))
    //                    {
    //                        apparea.pesticidename = reader.GetString(8);
    //                    }
    //                    locationArr.Add(apparea);

    //                }
    //                catch (Exception errReader)
    //                {
    //                    retval[0] = "0";
    //                    retval[1] = "Database Access Problem";
    //                    retval[1] += errReader.Message;
    //                }
    //            }
    //            retval[0] = "1";
    //            retval[1] = JsonConvert.SerializeObject(locationArr);
    //            cmd.Dispose();
    //            reader.Dispose();
    //        }
    //    }
    //    catch (SqlException ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Database Access Problem";
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }


    //    return retval;
    //}

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] AddNewApplicationArea(string userarea, string email)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        DateTime date = new DateTime();
        date = DateTime.Now;
        string sql ="";
        SqlConnection conn = null;
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser.email == "")
        {
            retval[0] = "0";
            retval[1] = "User not logged in.";
            return retval;

        }
        AppArea currappArea = JsonConvert.DeserializeObject<AppArea>(userarea);
        try
        {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader = null;
                    sql = "INSERT INTO applicator_areas (email, comment, appareaname, county, coordinates, areacentroid, buffercoords, acres, license, pesticidename, modifieddate, year, deleted) ";
                    sql += "VALUES ('[EMAIL]', '[COMMENT]', '[APPAREANAME]', '[COUNTY]', '[COORDINATES]', '[AREACENTR]', '[BUFFER]', '[ACRES]', '[LICENSE]', '[PESTICIDE]', '[DATE1]', '[YEAR]', 0);";
                    sql += "SELECT SCOPE_IDENTITY()";
                    sql = sql.Replace("[EMAIL]", auser.email);
                   // sql = sql.Replace("[ID]", currappArea.id);
                    sql = sql.Replace("[COMMENT]", currappArea.comment);
                    sql = sql.Replace("[COUNTY]", currappArea.county);
                    sql = sql.Replace("[COORDINATES]", currappArea.coordinates);
                    sql = sql.Replace("[AREACENTR]", currappArea.areacentroid);
                    sql = sql.Replace("[BUFFER]", currappArea.buffercoords);
                    sql = sql.Replace("[ACRES]", currappArea.acres);
                    sql = sql.Replace("[LICENSE]", currappArea.license);
                    sql = sql.Replace("[PESTICIDE]", currappArea.pesticidename);
                    sql = sql.Replace("[DATE1]", date.ToString());
                    sql = sql.Replace("[YEAR]", date.Year.ToString());
                    sql = sql.Replace("[APPAREANAME]", currappArea.appareaname);

                    if (cmd != null && reader != null)
                    {
                        cmd.Dispose();
                        reader.Dispose();
                    }
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    if (reader.HasRows == true)
                    {
                        reader.Read();
                        string extrainfo = "";
                        if (reader.IsDBNull(0) == false)
                        {
                            extrainfo = auser.email + "," + (reader.GetDecimal(0).ToString());
                        }
                        EventLog e = new EventLog();
                        e.InsertAddAppArea(extrainfo);
                        retval[0] = "1";
                        retval[1] = "Add Area successful";
                    }
                    else
                    {
                        retval[0] = "0";
                        retval[1] = "Add Area failed. User does not exist.";
                    }
                }
            }
            catch (SqlException e)
            {
                retval[0] = "0";
                retval[1] = "Add Area failed. Data base error";
                retval[1] += e.Message;
            }
            finally
            {
                conn.Close();
            }
        
        return retval;
    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] EditApplicationArea(string userarea, string email)
    {
        ///userarea is the area that needs updating. It's id should not have changed!
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        DateTime date = new DateTime();
        date = DateTime.Now;
        string sql = "";
        SqlConnection conn = null;
        user auser = (user)HttpContext.Current.Session["user"];
        
        if (auser.email == "")
        {
            retval[0] = "0";
            retval[1] = "User not logged in.";
            return retval;

        }
        AppArea currappArea = JsonConvert.DeserializeObject<AppArea>(userarea);
        //string appareaid = currappArea.id.ToString();
        retval = DeleteArea(auser.email, currappArea.id);
        if (retval[0] == "1")
        {
            try
            {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader = null;
                    sql = "INSERT INTO applicator_areas (email, comment, appareaname, county, coordinates, areacentroid, buffercoords, acres, license, pesticidename, modifieddate, year, deleted) ";
                    sql += "VALUES ('[EMAIL]', '[COMMENT]', '[APPAREANAME]', '[COUNTY]', '[COORDINATES]', '[AREACENTR]', '[BUFFER]', '[ACRES]', '[LICENSE]', '[PESTICIDE]', '[DATE1]', '[YEAR]', 0);";
                    sql += "SELECT SCOPE_IDENTITY()";
                    sql = sql.Replace("[EMAIL]", auser.email);
                    // sql = sql.Replace("[ID]", currappArea.id);
                    sql = sql.Replace("[COMMENT]", currappArea.comment);
                    sql = sql.Replace("[COUNTY]", currappArea.county);
                    sql = sql.Replace("[COORDINATES]", currappArea.coordinates);
                    sql = sql.Replace("[AREACENTR]", currappArea.areacentroid);
                    sql = sql.Replace("[BUFFER]", currappArea.buffercoords);
                    sql = sql.Replace("[ACRES]", currappArea.acres);
                    sql = sql.Replace("[LICENSE]", currappArea.license);
                    sql = sql.Replace("[PESTICIDE]", currappArea.pesticidename);
                    sql = sql.Replace("[DATE1]", date.ToString());
                    sql = sql.Replace("[YEAR]", date.Year.ToString());
                    sql = sql.Replace("[APPAREANAME]", currappArea.appareaname);

                    if (cmd != null && reader != null)
                    {
                        cmd.Dispose();
                        reader.Dispose();
                    }
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    if (reader.HasRows == true)
                    {
                        reader.Read();
                        string extrainfo = "";
                        if (reader.IsDBNull(0) == false)
                        {
                            extrainfo = auser.email + "," + (reader.GetDecimal(0).ToString());
                        }
                        EventLog e = new EventLog();
                        e.InsertEditAppArea(extrainfo);
                        retval[0] = "1";
                        retval[1] = "Edit Area successful";
                    }
                    else
                    {
                        retval[0] = "0";
                        retval[1] = "Edit Area failed. User does not exist.";
                    }
                }
            }
            catch (SqlException e)
            {
                retval[0] = "0";
                retval[1] = "Edit Area failed. Data base error";
                retval[1] += e.Message;
            }
            finally
            {
                conn.Close();
            }
        }

        return retval;
    }
        

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] AddNewArea(string userarea, string email)
    //{
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "error";
    //    DateTime date = new DateTime();
    //    date = DateTime.Now;
    //    bool updtpreferences = false;

    //    user auser = (user)HttpContext.Current.Session["user"];
    //    AppArea currappArea = JsonConvert.DeserializeObject<AppArea>(userarea);

    //    string buffercoords = getOffsetPolygon(currappArea.coordinates);

    //    if (buffercoords != "") { currappArea.buffercoords = buffercoords; }

    //    if (auser != null && auser.email == email)
    //    {
    //        string prefusers = "";
    //        string countiesstr = "";
    //        if (auser.preferences == "area")
    //        {
    //            if (auser.prefusers != "")
    //            {
    //                string newprefusers = GetProducers(auser.preferences, null, currappArea)[1];
    //                if (newprefusers != "") { newprefusers = "\n" + newprefusers; }
    //                prefusers = auser.prefusers + newprefusers;
    //            }
    //            else
    //            {
    //                prefusers = GetProducers(auser.preferences, null, currappArea)[1];
    //            }
    //            updtpreferences = true;
    //        }
    //        else
    //        {
    //            if (auser.preferences.Split('\t')[0] == "counties")
    //            {
                    
    //                if (auser.preferences.IndexOf(currappArea.county) != -1)
    //                {
    //                    //should we update even if no chnages in the county list? since preusers gets updated when producer enters a new crop
    //                    updtpreferences = false;
    //                }
    //                else
    //                {
    //                    countiesstr += auser.preferences + "," + currappArea.county;
    //                    prefusers = GetProducers(auser.preferences, countiesstr, null)[1];
    //                    updtpreferences = true;
    //                }
                    
    //            }
    //        }

    //        SqlConnection conn = null;

    //        try
    //        {
    //            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //            conn = new SqlConnection(connection);
    //            conn.Open();
    //            if (conn.State == System.Data.ConnectionState.Open)
    //            {
    //                SqlCommand cmd = null;
    //                SqlDataReader reader = null;
    //                string sql = "update user_details set preferences = '[PREFERENCES]', prefusers = '[PREFUSERS]', lastchange = '[DATE]' where email = '[EMAIL]';";
    //                if (updtpreferences)//update preferences if a new county or a new area is added
    //                {
    //                    if (countiesstr != "")//selected counties
    //                    {
    //                        sql = sql.Replace("[PREFERENCES]", countiesstr);
    //                        auser.preferences = countiesstr;
    //                    }
    //                    else//either state or specific area
    //                    {
    //                        sql = sql.Replace("[PREFERENCES]", auser.preferences);
    //                    }
    //                    sql = sql.Replace("[PREFUSERS]", prefusers);
    //                    sql = sql.Replace("[DATE]", date.ToString());
    //                    sql = sql.Replace("[EMAIL]", email);


    //                    cmd = new SqlCommand(sql, conn);
    //                    reader = cmd.ExecuteReader();
    //                    if (reader.RecordsAffected == 1)
    //                    {
    //                        retval[1] = "Preferences Successfully Updated.";
    //                        auser.prefusers = prefusers;
    //                        HttpContext.Current.Session["user"] = auser;
    //                        retval[0] = "1";
    //                    }
    //                    else
    //                    {
    //                        retval[0] = "0";
    //                        retval[1] = "Update Preferences Failed. User does not exist.";
    //                    }
    //                    cmd.Dispose();
    //                    reader.Dispose();
    //                }

    //                sql = "INSERT INTO applicator_areas (email, comment, county, coordinates, areacentroid, buffercoords, acres, license, pesticidename, modifieddate, year, deleted) ";
    //                sql += "VALUES ('[EMAIL]', '[COMMENT]', '[COUNTY]', '[COORDINATES]', '[AREACENTR]', '[BUFFER]', '[ACRES]', '[LICENSE]', '[PESTICIDE]', '[DATE1]', '[YEAR]', 0);";
    //                sql = sql.Replace("[EMAIL]", currappArea.usremail);
    //               // sql = sql.Replace("[ID]", currappArea.id);
    //                sql = sql.Replace("[COMMENT]", currappArea.comment);
    //                sql = sql.Replace("[COUNTY]", currappArea.county);
    //                sql = sql.Replace("[COORDINATES]", currappArea.coordinates);
    //                sql = sql.Replace("[AREACENTR]", currappArea.areacentroid);
    //                sql = sql.Replace("[BUFFER]", currappArea.buffercoords);
    //                sql = sql.Replace("[ACRES]", currappArea.acres);
    //                sql = sql.Replace("[LICENSE]", currappArea.license);
    //                sql = sql.Replace("[PESTICIDE]", currappArea.pesticidename);
    //                sql = sql.Replace("[DATE1]", date.ToString());
    //                sql = sql.Replace("[YEAR]", date.Year.ToString());

    //                if (cmd != null && reader != null)
    //                {
    //                    cmd.Dispose();
    //                    reader.Dispose();
    //                }
    //                cmd = new SqlCommand(sql, conn);
    //                reader = cmd.ExecuteReader();
    //                if (reader.RecordsAffected == 1)
    //                {
    //                    retval[0] = "1";
    //                    retval[1] = "Add Area successful";
    //                }
    //                else
    //                {
    //                    retval[0] = "0";
    //                    retval[1] = "Add Area failed. User does not exist.";
    //                }
    //            }
    //        }
    //        catch (SqlException e)
    //        {
    //            retval[0] = "0";
    //            retval[1] = "Add Area failed. Data base error";
    //            retval[1] += e.Message;
    //        }
    //        finally
    //        {
    //            conn.Close();
    //        }
    //    }
    //    else
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Invalid Session ID";
    //    }

    //    return retval;
    //}

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] EditArea(string userarea, string email)
    //{
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "error";
    //    DateTime date = new DateTime();
    //    date = DateTime.Now;

    //    SqlConnection conn = null;

    //    AppArea obj = JsonConvert.DeserializeObject<AppArea>(userarea);

        

    //    try
    //    {
    //        //retval = DeleteArea(email, obj.id);
    //        //if (retval[0] == "0")
    //        //{
    //        //    return retval;
    //        //}
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            SqlCommand cmd = null;
    //            SqlDataReader reader;
    //            string sql = "Update applicator_areas set email = '[EMAIL]', appareaname = '[APPAREANAME]', comment = '[COMMENT]', county = '[COUNTY]', coordinates = '[COORDINATES]', areacentroid = '[AREACENTR]', buffercoords = '[BUFFER]', acres = '[ACRES]',";
    //            sql += " license ='[LICENSE]', pesticidename = '[PESTICIDE]', modifieddate = '[DATE1]', year = [YEAR], deleted ='0' where applicatorID = [APPLICATORID]"; 
    //            sql = sql.Replace("[EMAIL]", obj.usremail);
    //            sql = sql.Replace("[APPLICATORID]", obj.id);
    //            sql = sql.Replace("[COMMENT]", obj.comment);
    //            sql = sql.Replace("[COUNTY]", obj.county);
    //            sql = sql.Replace("[COORDINATES]", obj.coordinates);
    //            sql = sql.Replace("[AREACENTR]", obj.areacentroid);
    //            sql = sql.Replace("[BUFFER]", obj.buffercoords);
    //            sql = sql.Replace("[ACRES]", obj.acres);
    //            sql = sql.Replace("[LICENSE]", obj.license);
    //            sql = sql.Replace("[PESTICIDE]", obj.pesticidename);
    //            sql = sql.Replace("[DATE1]", date.ToString());
    //            sql = sql.Replace("[YEAR]", date.Year.ToString());
    //            sql = sql.Replace("[APPAREANAME]", date.Year.ToString());

    //            cmd = new SqlCommand(sql, conn);
    //            //cmd.Parameters.Add("@applicatorid", SqlDbType.Int).Value = Convert.ToInt32(obj.id);
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Edit Area successful";
    //            }
    //            else
    //            {
    //                retval[0] = "0";
    //                retval[1] = "Edit Area failed. User does not exist.";
    //            }
    //            cmd.Dispose();
    //            reader.Dispose();
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Edit Area failed. Data base error";
    //        retval[1] += ex.Message;
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;
    //}


    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] DeleteArea(string email, string locid)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser.email == "")
        {
            retval[0] = "0";
            retval[1] = "User not logged in.";
            return retval;

        }
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                DateTime dt = new DateTime();
                dt = DateTime.Now;
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "update applicator_areas set deleted = 1 where email = '[EMAIL]' and applicatorID = '[LOCID]' ";
                sql = sql.Replace("[EMAIL]", auser.email);
               sql = sql.Replace("[LOCID]", locid);

                cmd = new SqlCommand(sql, conn);
         //       cmd.CommandText.Cast<("@locid", SqlDbType.Int).Value = Convert.ToInt32(locid);
                reader = cmd.ExecuteReader();
                if (reader.RecordsAffected > 0)
                {
                    retval[0] = "1";
                    retval[1] = "Record Successfully Deleted.";

                }
                cmd.Dispose();
                reader.Dispose();
            }


        }
        catch (Exception ex)
        {
            string err = ex.Message;
            retval[0] = "0";
            retval[1] = err;

        }
        finally
        {
            conn.Close();
        }


        return retval;
    }


    public static string[] GetProducers(string criteria, string arg1, AppArea currApparea)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
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
                string sql = "select * from producer_locations where ";
                if (criteria == "counties")
                {
                    string[] counties = arg1.Split(',');

                    for (int i = 0; i < counties.Length; i++)
                    {
                        sql += "county = '" + counties[i] + "' ";
                        if (i != counties.Length - 1) { sql += "OR "; }
                    }
                    sql += " AND ";
                }
               
                sql += "year = '" + dt.Year.ToString() + "' AND deleted = 0 order by email;";

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                croplocation croploc = null;
                AppArea apparea = null;
                while (reader.Read())
                {
                    try
                    {
                        croploc = new croplocation();
                        if (!reader.IsDBNull(1))
                        {
                            croploc.id = reader.GetString(1);
                        }
                        if (!reader.IsDBNull(0))
                        {
                            croploc.usremail = reader.GetString(0);
                        }
                        if (!reader.IsDBNull(2))
                        {
                            croploc.planttype = reader.GetString(2);
                        }
                        if (!reader.IsDBNull(3))
                        {
                            croploc.croptype = reader.GetString(3);
                        }
                        if (!reader.IsDBNull(4))
                        {
                            croploc.cropyear = reader.GetString(4);
                        }
                        if (!reader.IsDBNull(5))
                        {
                            croploc.comment = reader.GetString(5);
                        }
                        if (!reader.IsDBNull(6))
                        {
                            croploc.county = reader.GetString(6);
                        }
                        if (!reader.IsDBNull(7))
                        {
                            croploc.coordinates = reader.GetString(7);
                        }
                        if (!reader.IsDBNull(8))
                        {
                            croploc.loccentroid = reader.GetString(8);
                        }
                        if (!reader.IsDBNull(9))
                        {
                            croploc.acres = reader.GetString(9);
                        }
                        if (!reader.IsDBNull(10))
                        {
                            croploc.organiccrops = (reader.GetBoolean(10) ? 1 : 0).ToString();
                        }
                        locationArr.Add(croploc);

                    }
                    catch (Exception errReader)
                    {
                        retval[0] = "0";
                        //retval[1] = "Database Access Problem";
                        //retval[1] += errReader.Message;
                    }
                }
                string producid_locid = "";
                croplocation prevcrop = new croplocation();
                for (int i = 0; i < locationArr.Count; i++)
                {
                    croplocation currcrop = (croplocation)locationArr[i];
   
                    if (criteria != "area" && arg1 != null)
                    {
                        if (i == 0 || producid_locid == "")
                        {
                            producid_locid = currcrop.usremail + "\t" + currcrop.id;
                        }
                        else
                        {
                            if (currcrop.usremail != prevcrop.usremail)
                            {
                                producid_locid += "\n" + currcrop.usremail + "\t" + currcrop.id;
                            }
                            else
                            {
                                producid_locid += "," + currcrop.id;
                            }
                        }
                        prevcrop = currcrop;
                    }
                    else if (currApparea != null)//preferences = area
                    {
                        ////THIS NEEDS TO GO ON A WEBSERVICE BETTER???

                        string[] refcoords = currApparea.coordinates.Split('\n');
                        string[] currcoords = currcrop.coordinates.Split('\n');

                        //centroid points
                        
                        PointC refcentroid = new PointC(float.Parse(currApparea.areacentroid.Split(',')[0]), float.Parse(currApparea.areacentroid.Split(',')[1]));
                        PointC currcentroid = new PointC(float.Parse(currcrop.loccentroid.Split(',')[0]), float.Parse(currcrop.loccentroid.Split(',')[1]));
                        
                        //area 
                        float refarea = float.Parse(currApparea.acres);

                        float factor = (float)0.0015625;// conversion factor from acres to square-miles
                        float rbuffer = (float)0.28;//buffer distance is 1/4 of a mile
                        float tolerance = (float)0.05;//tolerance for radious difference of less than 0.05 (i.e. very small!)

                        float r1 = (float)Math.Sqrt((double)(refarea * factor) / Math.PI);//radii of the big polygon
                        float r2 = (float)Math.Sqrt((double.Parse(currcrop.acres) * factor) / Math.PI);//radii of the small polygon
                        float dmax = (r1 + rbuffer + tolerance) + r2;
                        float d = distance(refcentroid.Lat, refcentroid.Lon, currcentroid.Lat, currcentroid.Lon);

                        if (d <= dmax)//first filter (check if the area is somewhere near)
                        {
                            if (pointInBuffer(refcoords, currcoords, rbuffer))//second check, any point inside the refpolygon
                            {
                                if (i == 0 || producid_locid == "")
                                {
                                    producid_locid = currcrop.usremail + "\t" + currcrop.id;
                                }
                                else
                                {
                                    if (currcrop.usremail != prevcrop.usremail)
                                    {
                                        producid_locid += "\n" + currcrop.usremail + "\t" + currcrop.id;
                                    }
                                    else
                                    {
                                        producid_locid += "," + currcrop.id;
                                    }
                                }
                                prevcrop = currcrop;
                            }
                            
                        }
                    }
                }

                retval[0] = "1";
                //retval[1] = JsonConvert.SerializeObject(locationArr);
                retval[1] = producid_locid;
                cmd.Dispose();
                reader.Dispose();
            }
        }
        catch (SqlException ex)
        {
            retval[0] = "0";
            //retval[1] = "Database Access Problem";
        }
        finally
        {
            conn.Close();
        }




        return retval;
    }


    public static float distance(float refLat, float refLon, float Lat, float Lon)
    {
        float d = 0;
        int earthRadius = 3959; // earth radius in miles

        double factor = Math.PI / 180;
        double dLat = ((double)Lat - (double)refLat) * factor;
        double dLon = ((double)Lon - (double)refLon) * factor;
        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) + Math.Cos(refLat * factor)
                   * Math.Cos(Lat * factor) * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        d = (float)(earthRadius * c);

        return d;
    }

    public static bool pointInBuffer(string[] refcoords, string[] currcoords, float dbuffer)
    {
        bool inBuffer = false;
        float d = 0.0f;
        for (int i = 0; i < currcoords.Length; i++)//loop trough each point in polygon C
        {
            PointC currP = new PointC(float.Parse(currcoords[i].Split(',')[0]), float.Parse(currcoords[i].Split(',')[1]));

            for (int j = 0; j < refcoords.Length; j++)//loop trough each point in polygon A
            {
                PointC refP = new PointC(float.Parse(refcoords[j].Split(',')[0]), float.Parse(refcoords[j].Split(',')[1]));
                d = distance(refP.Lat, refP.Lon, currP.Lat, currP.Lon);
                if (d < dbuffer)
                {
                    inBuffer = true;
                    break;
                }
            }
            if (inBuffer)
                break;
        }

        return inBuffer;
    }

    public static string getOffsetPolygon(string coordinates)
    {
        string offPoly = "";

        Polygons refPoly = new Polygons();
        Polygon Polypoints = new Polygon();
        int factor = 1000000;

        string[] latlon = coordinates.Split('\n');
        for (int i = 0; i < latlon.Length; i++)
        {
            if (latlon[i] != "")
            {
                float y = float.Parse(latlon[i].Split(',')[0]);
                float x = float.Parse(latlon[i].Split(',')[1]);
                Polypoints.Add(new IntPoint((Int32)(x * factor), (Int32)(y * factor)));
            }
        }
        
        if (Clipper.Orientation(Polypoints) == false)
        {
            Polygon copy = new Polygon();

            for (int x = Polypoints.Count - 1; x >= 0; x--)
            {
                copy.Add(Polypoints[x]);
            }
            Polypoints = copy;
        }

        refPoly.Add(Polypoints);
        double delta = 0.004787784;//interpolated average value from (http://www.offroaders.com/info/tech-corner/reading/GPS-Coordinates.htm) table using 0.25miles= 1320ft 
        Polygons buffPoly = Clipper.OffsetPolygons(refPoly, delta*factor, JoinType.jtRound);

        if (buffPoly.Count > 0)
        {
            for (int j = 0; j < buffPoly[0].Count; j++)
            {
                double y = (double)buffPoly[0][j].Y;
                double x = (double)buffPoly[0][j].X;
                offPoly += y/factor + "," + x/factor;
                if (j < buffPoly[0].Count - 1) { offPoly += "\n"; }
            }
        }
        

        return offPoly;
    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] GetCounty(string croplocation)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "no county found";
        croplocation crop = new croplocation();
        crop.coordinates = croplocation;
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

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string send(string email, string variable, string type)
    {
        string confMsg = null;
        string url = "http://queen.tamu.edu/tsc_dev/Account.aspx?ACTIVATEACCOUNT";
        string urlmain = "http://queen.tamu.edu/tsc_dev/";
        string hostMail = "kel.texas.sensitive.crops@gmail.com";
        string hosUsr = "kel.texas.sensitive.crops";
        string hostPwd = "tscr_kel_2012";
        string hostSMTP = "smtp.gmail.com";//gmail smtp 
        string subject = "Texas Crops " + type + " information";
        string body1 = "Dear User,\n\n\n" +
                      "Thank you for registering with Texas Crop Registry!.\n\n\n" +
                      "This email is automatically generated, please do not reply.\n\n\n\n" +
            //            "Welcome to PIDS. To complete your registration, please go to the registration page of the PIDS website, and change your automatic password:\n" +
            ////"Your user id: " + email + "\n\n" +
                                    "Your one time only password is: " + variable + "\n\n\n\n" +
                                    "To complete your registration, please go to the registration page of the Texas Crop Registry website, and change your automatic password: \n\n" + url + "\n\n\n\n" +
                                    "If you have trouble using the previous link, you can go to the main page: \n\n" + urlmain + "\n\n\n\n" +
                                    "and click on the 'Register' link, scroll to the bottom of the page and click the 'Change Password' link.\n\n\n\n" +
                                    "Thanks for working with us!\n\n\n" +
                                    "Texas Crop Registry Program";
        string body2 = "Texas Crop Registry Password recovery. This email is automatically generated, please do not reply.\n\n\n\n" +
                        "You have requested your password from Texas Crops Registry Program. Your current password is:\n" + variable + "\n\n\n\n" +
                        "As a security measure we encourage our users to change the password once you login." +
                        " To change your password just position the cursor over your user id(email), click on 'Edit Details' and 'Change Password' link.\n\n\n\n" +
                        "Thanks for working with us!\n\n\n" +
                        "Texas Crops Registry Program";
        string body3 = "Dear User,\n\n\n" +
                        "Texas Crop Registry email notifications setup.\n\n\n" +
                        "This email is automatically generated, please do not reply.\n\n\n\n" +
                        "You made some recent changes to your profile preferences. You select to receive email notifications when a new Crop is added to our database using the " + variable + " criteria.\n\n" +
                        "You can always modify your notifications by login into your account and specifying a new criteria.\n\n\n\n" +
                        "Thanks for working with us!\n\n\n" +
                        "Texas Crop Registry Program";
        MailMessage mail = new MailMessage();
        mail.To.Add(email);
        mail.From = new MailAddress(hostMail);//pecanipmpipe temporary email account
        mail.Subject = subject;
        if (type == "Registration") { mail.Body = body1; }
        else if (type == "Password") { mail.Body = body2; }
        else { mail.Body = body3; }
        SmtpClient smtp = new SmtpClient();
        NetworkCredential credentials = new NetworkCredential();

        try
        {
            //smtp.Host = ConfigurationManager.AppSettings["SMTP"];not working yet from Server email setup!
            credentials.UserName = hosUsr;
            credentials.Password = hostPwd;
            smtp.Host = hostSMTP;
            smtp.Port = 587;//It can be 25, so try both.
            smtp.Credentials = credentials;
            smtp.EnableSsl = true;
            smtp.Send(mail);
            confMsg = "sent";
        }
        catch (Exception err1)
        {
            confMsg = err1.Message.ToString();
        }
        finally
        {
            mail.Dispose();
        }
        return confMsg;
    }

}

