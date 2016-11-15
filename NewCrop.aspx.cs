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
using System.Drawing;
using System.Net;
using System.Net.Mail;

public partial class NewCrop : System.Web.UI.Page
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
    public static string[] LoadUserLocations(string email)
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
                string sql = "select * from producer_locations where email = '[EMAIL]' and year = '[YEAR]' and deleted = 0 order by modifieddate;";
                sql = sql.Replace("[EMAIL]", email);
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
                            croploc.organiccrops = (reader.GetBoolean(9) ? 1: 0).ToString();
                        }
                        if (!reader.IsDBNull(10))
                        {
                            croploc.certifier = reader.GetString(10);
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

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] AddNewLocation(string userlocation, string email)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        DateTime date = new DateTime();
        date = DateTime.Now;
        SqlConnection conn = null;
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser == null | auser.email != email)
        {
            retval[1] = "Authentication error";
            return retval;
        }
        croplocation obj = JsonConvert.DeserializeObject<croplocation>(userlocation);
    
        
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
                //sql = sql.Replace("[ID]", obj.id);
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
                    retval[1] = "Add Location successful.";
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
                    retval[1] = "Add Location failed. User does not exist.";
                }
                cmd.Dispose();
                reader.Dispose();
                bool notify = NotifyApplicators(obj);///agb added 6th April 20013
                //update applicators list
                //string[] result = GetApplicators(obj);
                if (notify==true)//if at least one applicator area is related, send email
                {
                    //string emaillist = result[1];
                    //string email_result = null;
                    //string pref_counties = "";

                    //email_result = send(emaillist, pref_counties, "New Crop Alert");
                    //if (email_result == "sent")
                    {
                        retval[1] += " Applicators in our system will be notified. Thank you!";
                    }
                }
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

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] EditLocation(string userlocation, string email)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        DateTime date = new DateTime();
        date = DateTime.Now;
        SqlConnection conn = null;
        croplocation obj = JsonConvert.DeserializeObject<croplocation>(userlocation);
        retval = DeleteLocation(email, obj.id);
        if (retval[0] == "0")
        {
            return retval;
        }
        try
        {
            //retval = DeleteLocation(email, obj.id);
            //if (retval[0] == "0")
            //{
            //    return retval;
            //}
             string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "INSERT INTO producer_locations (email, planttype, croptype, cropyear, comment, county, coordinates, loccentroid, acres, organiccrops, certifier, modifieddate, year, deleted) ";
                sql += "VALUES ('[EMAIL]', '[PTYPE]', '[CTYPE]', '[CYEAR]', '[COMMENT]', '[COUNTY]', '[COORDINATES]', '[LOCCENTR]', '[ACRES]', '[ORGCROP]', '[CERTIF]', '[DATE1]', '[YEAR]', 0);";
                sql += "SELECT SCOPE_IDENTITY()";
                //string sql = "Update producer_locations set email =  '[EMAIL]', planttype = '[PTYPE]', croptype = '[CTYPE]', cropyear ='[CYEAR]' , comment = '[COMMENT]' , county = '[COUNTY]', coordinates = '[COORDINATES]',  ";
                //sql += "  loccentroid = '[LOCCENTR]', acres = '[ACRES]', organiccrops = '[ORGCROP]', certifier = '[CERTIF]', modifieddate = '[DATE1]', year = '[YEAR]' , deleted = '0' Where producerID = '[producerid]';";
                sql = sql.Replace("[EMAIL]", obj.usremail);
                sql = sql.Replace("[producerid]", obj.id);
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
                    string extrainfo = "";
                    if (reader.IsDBNull(0) == false)
                    {
                        extrainfo = (reader.GetDecimal(0).ToString());
                    }
                    EventLog e = new EventLog();
                    e.InsertEditCrop(extrainfo);
                    retval[0] = "1";
                    retval[1] = "Edit Location successful";
                   
                }
                else
                {
                    retval[0] = "0";
                    retval[1] = "Edit Location failed. User does not exist.";
                }
                cmd.Dispose();
                reader.Dispose();
            }
        }
        catch (Exception ex)
        {
            retval[0] = "0";
            retval[1] = "Edit Location failed. Data base error";
            retval[1] += ex.Message;
        }
        finally
        {
            conn.Close();
        }
        return retval;
    }


    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] DeleteLocation(string email, string locid)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";

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
                string sql = "update producer_locations set deleted = 1 where email = '[EMAIL]' and producerID = '[LOCID]' ";
                sql = sql.Replace("[EMAIL]", email);
                sql = sql.Replace("[LOCID]", locid);

                cmd = new SqlCommand(sql, conn);
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


    public static string[] GetApplicators(croplocation crop)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        ArrayList appareaArr = new ArrayList();
        ArrayList applicators = new ArrayList();
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "select * from user_details where preferences != 'none';";
                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                user applicator = null;

                while (reader.Read())//get all applicator with preferences
                {
                    applicator = new user();
                    if (!reader.IsDBNull(0))
                    {
                        applicator.email = reader.GetString(0);
                    }
                    if (!reader.IsDBNull(1))
                    {
                        applicator.firstname = reader.GetString(1);
                    }
                    if (!reader.IsDBNull(2))
                    {
                        applicator.lastname = reader.GetString(2);
                    }
                    if (!reader.IsDBNull(3))
                    {
                        applicator.companyname = reader.GetString(3);
                    }
                    if (!reader.IsDBNull(4))
                    {
                        applicator.address = reader.GetString(4);
                    }
                    if (!reader.IsDBNull(5))
                    {
                        applicator.city = reader.GetString(5);
                    }
                    if (!reader.IsDBNull(6))
                    {
                        applicator.state = reader.GetString(6);
                    }
                    if (!reader.IsDBNull(7))
                    {
                        applicator.zip = reader.GetString(7);
                    }
                    if (!reader.IsDBNull(8))
                    {
                        applicator.website = reader.GetString(8);
                    }
                    if (!reader.IsDBNull(9))
                    {
                        applicator.phone1 = reader.GetString(9);
                    }
                    if (!reader.IsDBNull(10))
                    {
                        applicator.phone2 = reader.GetString(10);
                    }
                    if (!reader.IsDBNull(13))
                    {
                        applicator.activated = reader.GetBoolean(13);
                    }
                    if (!reader.IsDBNull(14))
                    {
                        applicator.preferences = reader.GetString(14);
                    }
                    if (!reader.IsDBNull(15))
                    {
                        applicator.prefoptions = reader.GetString(15);
                    }
                    applicators.Add(applicator);
                }
                cmd.Dispose();
                reader.Dispose();
                string newprefusers = "";
                string emaillist = "";
                string[] updtresult = new string[2];
                updtresult[0] = "0";
                updtresult[1] = "";
                for (int i = 0; i < applicators.Count; i++)
                {
                    user currApplicator = (user)applicators[i];
                    string currpreferences = currApplicator.preferences;
                    string currprefusers = currApplicator.prefoptions;
                    if (currpreferences == "area")
                    {
                        string[] result = GetAppAreaID(currApplicator.email, crop);
                        if (result[0] == "1" && result[1] != "")
                        {
                            if (currprefusers.IndexOf(crop.usremail) != -1)//producer exist so add to the end of its list
                            {
                                string[] prodid_locid = currprefusers.Split('\n');
                                for (int j = 0; j < prodid_locid.Length; j++)
                                {
                                    if (prodid_locid[j].Split('\t')[0] == crop.usremail)
                                    {
                                        prodid_locid[j] += "," + crop.id;
                                    }
                                    newprefusers += prodid_locid[j];
                                    //emaillist += "," + currApplicator.email;
                                    if (j != prodid_locid.Length - 1) { newprefusers += "\n"; }
                                }
                            }
                            else//add at the end of the prefusers
                            {
                                if (currprefusers != "")
                                {
                                    newprefusers = currprefusers + "\n" + crop.usremail + "\t" + crop.id;
                                }
                                else
                                {
                                    newprefusers = crop.usremail + "\t" + crop.id;
                                }
                            }
                            if (emaillist != "")
                            {
                                emaillist += "," + currApplicator.email;
                            }
                            else
                            {
                                emaillist += currApplicator.email;
                            }
                        }
                    }
                    else if (currpreferences == "state")
                    {
                        newprefusers = "All";
                    }
                    else//applicator preferences = counties
                    {
                        if (currpreferences.IndexOf(crop.county) != -1)
                        {
                            if (currprefusers.IndexOf(crop.usremail) != -1)//producer exist so add to the end of its list
                            {
                                string[] prodid_locid = currprefusers.Split('\n');
                                for (int j = 0; j < prodid_locid.Length; j++)
                                {
                                    if (prodid_locid[j].Split('\t')[0] == crop.usremail)
                                    {
                                        prodid_locid[j] += "," + crop.id;
                                    }
                                    newprefusers += prodid_locid[j];
                                    //emaillist += "," + currApplicator.email;
                                    if (j != prodid_locid.Length - 1) { newprefusers += "\n"; }
                                }
                            }
                            else//add at the end of the prefusers
                            {
                                if (currprefusers != "")
                                {
                                    newprefusers = currprefusers + "\n" + crop.usremail + "\t" + crop.id;
                                }
                                else
                                {
                                    newprefusers = crop.usremail + "\t" + crop.id;
                                }
                                //newprefusers += currprefusers + "\n" + crop.usremail + "\t" + crop.id;
                                //emaillist += "," + currApplicator.email;
                            }
                            if (emaillist != "")
                            {
                                emaillist += "," + currApplicator.email;
                            }
                            else
                            {
                                emaillist += currApplicator.email;
                            }
                        }
                    }
                    //update current applicator producer_location list
                    if (newprefusers != "" && currpreferences != "state")
                    {
                        updtresult = UpdateApplicatorList(currApplicator.email, newprefusers);
                    }
                    newprefusers = "";
                }

                retval[0] = updtresult[0];
                retval[1] = emaillist;
             
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
    
    /// AGB Added
    public static user CheckApplicatorNotification(user applicator, croplocation crop)
    {
        user retval = new user();
        retval = null;
        if (applicator.preferences == "area")
        {
            AppArea app = null;
            float distance = -1;
            if (GetClosestAppArea(applicator.email, crop, ref distance, ref app))
            {
                if (distance < 5)
                {
                    retval= applicator;
                 }
            }
        }
        else if (applicator.preferences == "state")
        {
            retval = applicator;
        }
        else ///counties
        {
            ////get list of counties for notification
            string[] countypreferences = applicator.preferences.Split('\t');
            if (countypreferences.Length == 2)
            {
                string[] counties = countypreferences[1].Split(',');
                for (int x = 0; x < counties.Length; x++)
                {
                    ArrayList countiesarr = CheckCropCounty(crop);
                    for (int y = 0; y < countiesarr.Count; y++)
                    {
                        string target = (string)countiesarr[y];
                        string test = counties[x];

                        if (target == test)
                        {
                            retval = applicator;
                        }
                    }
                }
            }
            
        }
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
    //agb added
    public static bool GetClosestAppArea(string email, croplocation newcrop, ref float distance, ref AppArea app)
    {
        bool retval = false;
        DateTime dt = DateTime.Now;
        ArrayList appAreaArr = new ArrayList();
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
                string sql = "select * from applicator_areas where email = '[EMAIL]' and year = '[YEAR]' and deleted = 0 order by modifieddate;";
                sql = sql.Replace("[EMAIL]", email);
                sql = sql.Replace("[YEAR]", dt.Year.ToString());

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                AppArea apparea = null;
                while (reader.Read())
                {
                    try
                    {
                        apparea = new AppArea();
                        if (!reader.IsDBNull(12))
                        {
                            apparea.id = reader.GetDecimal(12).ToString();
                        }
                        if (!reader.IsDBNull(0))
                        {
                            apparea.usremail = reader.GetString(0);
                        }
                        if (!reader.IsDBNull(1))
                        {
                            apparea.comment = reader.GetString(1);
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
                        appAreaArr.Add(apparea);
                    }
                    catch (Exception errReader)
                    {
                        retval = false;
                        
                    }
                }
                cmd.Dispose();
                reader.Dispose();
                ///get the crop centroid
                PointC cropcentroid = new PointC(float.Parse(newcrop.loccentroid.Split(',')[0]), float.Parse(newcrop.loccentroid.Split(',')[1]));
                if (appAreaArr.Count == 0)
                {
                    retval = false;

                }
                else
                {
                    float dmax = 0;
                    for (int x = 0; x < appAreaArr.Count; x++)
                    {

                        AppArea currApparea = (AppArea)appAreaArr[x];
                        string[] refcoords = currApparea.coordinates.Split('\n');
                        string[] currcoords = newcrop.coordinates.Split('\n');
                        ////get app centroid
                        PointC appcentroid = new PointC(float.Parse(currApparea.areacentroid.Split(',')[0]), float.Parse(currApparea.areacentroid.Split(',')[1]));
                        //area 
                        float refarea = float.Parse(currApparea.acres);
                      //  float dmax = 0;
                        float d = GetDistance(appcentroid.Lat, appcentroid.Lon, cropcentroid.Lat, cropcentroid.Lon);
                        if (d <= dmax || x == 0)//is application nearest
                        {
                            dmax = d;
                            app = (AppArea) appAreaArr[x];
                            distance = d;
                            retval = true;
                        }
                        
                    }
                    
                    
                }
            }
        }
        catch (SqlException ex)
        {
            retval = false;
            
        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
    public static bool AddActionToDB(string notification, string email)
    {
        //This function will go through all the producers and if notification criterions match, send them a notification email
        bool retval = false;
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "insert into Notifications values('[NOTIFICATION]', '[DATE]', '[ID]');";
                sql = sql.Replace("[NOTIFICATION]", notification);
                sql = sql.Replace("[DATE]", dt.ToShortDateString() + " " + dt.ToShortTimeString());
                sql = sql.Replace("[ID]", email);
                cmd = new SqlCommand(sql, conn);
                cmd.ExecuteNonQuery();
               
                //if (reader.RecordsAffected > 0)//get all applicator with preferences
                //{
                    retval = true;
               // }
                
                cmd.Dispose();
               // reader.Dispose();
            }
        }///end try
        catch (Exception e)
        {
            string ret = e.Message;

        }
        finally
        {
            conn.Close();

        }

        return retval;
    }
    //AGB added 6th April 2013
    public static bool NotifyApplicators(croplocation newcrop)
    {
        //This function will go through all the producers and if notification criterions match, send them a notification email
        bool retval = false;
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        ArrayList appareaArr = new ArrayList();
        ArrayList applicators = new ArrayList();
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "select * from user_details where preferences != 'none';";
                cmd = new SqlCommand(sql, conn);
                ArrayList applicatorlist = new ArrayList();
                reader = cmd.ExecuteReader();
                user applicator = null;
                user checkifnull = null;
                while (reader.Read())//get all applicator with preferences
                {
                   
                    applicator = new user();
                    if (!reader.IsDBNull(0))
                    {
                        applicator.email = reader.GetString(0);
                    }
                    if (!reader.IsDBNull(1))
                    {
                        applicator.firstname = reader.GetString(1);
                    }
                    if (!reader.IsDBNull(2))
                    {
                        applicator.lastname = reader.GetString(2);
                    }
                    if (!reader.IsDBNull(3))
                    {
                        applicator.companyname = reader.GetString(3);
                    }
                    if (!reader.IsDBNull(4))
                    {
                        applicator.address = reader.GetString(4);
                    }
                    if (!reader.IsDBNull(5))
                    {
                        applicator.city = reader.GetString(5);
                    }
                    if (!reader.IsDBNull(6))
                    {
                        applicator.state = reader.GetString(6);
                    }
                    if (!reader.IsDBNull(7))
                    {
                        applicator.zip = reader.GetString(7);
                    }
                    if (!reader.IsDBNull(8))
                    {
                        applicator.website = reader.GetString(8);
                    }
                    if (!reader.IsDBNull(9))
                    {
                        applicator.phone1 = reader.GetString(9);
                    }
                    if (!reader.IsDBNull(10))
                    {
                        applicator.phone2 = reader.GetString(10);
                    }
                    if (!reader.IsDBNull(13))
                    {
                        applicator.activated = reader.GetBoolean(13);
                    }
                    if (!reader.IsDBNull(14))
                    {
                        applicator.preferences = reader.GetString(14);
                    }
                    if (!reader.IsDBNull(15))
                    {
                        applicator.prefoptions = reader.GetString(15);
                    }
                    checkifnull = CheckApplicatorNotification(applicator, newcrop);

                    if(checkifnull != null)
                    {
                        applicatorlist.Add(checkifnull);

                        ////send an email to the applicator and update db
                    //    AddActionToDB(newcrop.county, applicator.email);
                    }

                }
                
                cmd.Dispose();
                reader.Dispose();
            }
        }///end try
        catch (Exception e)
        {


        }
        finally
        {
            conn.Close();

        }

        return retval;



    }

    public static string[] GetAppAreaID(string email, croplocation newcrop)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        DateTime dt = DateTime.Now;
        ArrayList appAreaArr = new ArrayList();
        string appareaid = "";
        
        //bool isInside = false;

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
                string sql = "select * from applicator_areas where email = '[EMAIL]' and year = '[YEAR]' and deleted = 0 order by modifieddate;";
                sql = sql.Replace("[EMAIL]", email);
                sql = sql.Replace("[YEAR]", dt.Year.ToString());
                
                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                
                AppArea apparea = null;
                while (reader.Read())
                {
                    try
                    {
                        apparea = new AppArea();
                        if (!reader.IsDBNull(1))
                        {
                            apparea.id = reader.GetString(1);
                        }
                        if (!reader.IsDBNull(0))
                        {
                            apparea.usremail = reader.GetString(0);
                        }
                        if (!reader.IsDBNull(2))
                        {
                            apparea.comment = reader.GetString(2);
                        }
                        if (!reader.IsDBNull(3))
                        {
                            apparea.county = reader.GetString(3);
                        }
                        if (!reader.IsDBNull(4))
                        {
                            apparea.coordinates = reader.GetString(4);
                        }
                        if (!reader.IsDBNull(5))
                        {
                            apparea.areacentroid = reader.GetString(5);
                        }
                        if (!reader.IsDBNull(6))
                        {
                            apparea.buffercoords = reader.GetString(6);
                        }
                        if (!reader.IsDBNull(7))
                        {
                            apparea.acres = reader.GetString(7);
                        }
                        if (!reader.IsDBNull(8))
                        {
                            apparea.license = reader.GetString(8);
                        }
                        //if (!reader.IsDBNull(9))
                        //{
                        //    apparea.producersloc = reader.GetString(9);
                        //}
                        appAreaArr.Add(apparea);

                    }
                    catch (Exception errReader)
                    {
                        retval[0] = "0";
                        retval[1] = "Database Access Problem";
                        retval[1] += errReader.Message;
                    }
                }
                cmd.Dispose();
                reader.Dispose();
                int index = 0; 
                bool end = false;
                if (appAreaArr != null)
                {
                     ////THIS NEEDS TO GO ON A WEBSERVICE BETTER???
                    while (!end)
                    {
                        
                        AppArea currApparea = (AppArea)appAreaArr[index];
                        string[] refcoords = currApparea.coordinates.Split('\n');
                        string[] currcoords = newcrop.coordinates.Split('\n');
                        
                        PointC refcentroid = new PointC(float.Parse(currApparea.areacentroid.Split(',')[0]), float.Parse(currApparea.areacentroid.Split(',')[1]));
                        PointC currcentroid = new PointC(float.Parse(newcrop.loccentroid.Split(',')[0]), float.Parse(newcrop.loccentroid.Split(',')[1]));
                        
                        //area 
                        float refarea = float.Parse(currApparea.acres);
                        
                        
                        float factor = (float)0.0015625;// conversion factor from acres to square-miles
                        float rbuffer = (float)0.28;//buffer distance is 1/4 of a mile
                        float tolerance = (float)0.05;//tolerance for radious difference of less than 0.05 (i.e. very small!)
                        
                        float r1 = (float)Math.Sqrt((double)(refarea * factor) / Math.PI);//radii of the big polygon
                        float r2 = (float)Math.Sqrt((double.Parse(newcrop.acres) * factor) / Math.PI);//radii of the small polygon
                        float dmax = (r1 + rbuffer + tolerance) + r2;
                        float d = GetDistance (refcentroid.Lat, refcentroid.Lon, currcentroid.Lat, currcentroid.Lon);

                        if (d <= dmax)//first filter (check if the area is somewhere near)
                        {
                            end = pointInBuffer(refcoords, currcoords, rbuffer);//second check, any point inside the refpolygon
                            if (end) { appareaid = currApparea.id; }
                        }
                        index++;
                        if (index >= appAreaArr.Count) { end = true; }
                    }
                    //}
                    retval[0] = "1";
                    retval[1] = appareaid;
                }
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

    public static string[] UpdateApplicatorList(string email, string prefusers)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";

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
                string sql = "update user_details set prefusers = '[PREFUSERS]', lastchange = '[DATE]' where email = '[EMAIL]';";
                
                sql = sql.Replace("[PREFUSERS]", prefusers);
                sql = sql.Replace("[DATE]", dt.ToString());
                sql = sql.Replace("[EMAIL]", email);


                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                if (reader.RecordsAffected > 0)
                {
                    retval[1] = "Preferences Successfully Updated.";
                   
                    retval[0] = "1";
                    
                }
                else
                {
                    retval[0] = "0";
                    retval[1] = "Update Preferences Failed. User does not exist.";
                }
                cmd.Dispose();
                reader.Dispose();
            }


        }
        catch (Exception ex)
        {
            string err = ex.Message;
            retval[1] = "Change Details Failed. Database error! ";
            retval[0] = "0";
            retval[1] += err;

        }
        finally
        {
            conn.Close();
        }

        return retval;
    }

    public static float GetDistance(float refLat, float refLon, float Lat, float Lon)
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
                d = GetDistance(refP.Lat, refP.Lon, currP.Lat, currP.Lon);
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

    public static bool pointInPolygon(PointF[] poly, PointF p)
    {
        int i = 0;
        int j = poly.Length - 1;
        bool inPoly = false;

        for (i = 0; i < poly.Length; i++)
        {
            if (poly[i].X < p.X && poly[j].X >= p.X
                || poly[j].X < p.X && poly[i].X >= p.X)
            {
                if (poly[i].Y + (p.X - poly[i].X) /
                  (poly[j].X - poly[i].X) * (poly[j].Y - poly[i].Y) < p.Y)
                {
                    inPoly = !inPoly;
                }
            }
            j = i;
        }

        return inPoly;
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
        string subject = "Texas Crop Registry " + type + " information";
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
                                    "Texas Crops Registry Program";
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
                        "Texas Crops Registry Program";
        string body4 = "Dear Applicator,\n\n\n" +
                        "Texas Crops email notifications.\n\n\n" +
                        "This email is automatically generated, please do not reply.\n\n\n\n" +
                        "There was a new Crop addition to our database that matches your preferences criteria.\n\n" +
                        "You can view this new crop area when you log in and click on the 'Map' link on the menu bar.\n\n"+
                        "You can always modify your notifications by login into your account and specifying a new criteria.\n\n\n\n" +
                        "Thanks for working with us!\n\n\n" +
                        "Texas Crops Registry Program";
        MailMessage mail = new MailMessage();
        mail.To.Add(email);
        mail.From = new MailAddress(hostMail);//pecanipmpipe temporary email account
        mail.Subject = subject;
        if (type == "Registration") { mail.Body = body1; }
        else if (type == "Password") { mail.Body = body2; }
        else if (type == "Notifications") { mail.Body = body3; }
        else { mail.Body = body4; }
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

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] GetCounty(string croplocation)
    {
        string [] retval = new string[2];
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
   
}
