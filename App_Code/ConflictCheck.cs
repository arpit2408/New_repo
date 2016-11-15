using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Collections;
using Newtonsoft.Json;
using System.Text;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Drawing;
using System.Collections;
/// <summary>
/// Summary description for ConflictCheck
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
 [System.Web.Script.Services.ScriptService]
public class ConflictCheck : System.Web.Services.WebService {

    
    [System.Web.Services.WebMethod(EnableSession = true)]
    public string [] RealTimeConflictCheck(user appuser)
    {
        string [] retval= new string[2];
        retval[0] = "0";
        retval[1] = "error";
        List<conflictedcrop> finallist = new List<conflictedcrop>();
        ArrayList counties = new ArrayList();
        //HttpContext.Current.Session["croplocations"] = GetCropsByApplicator(appuser.email, counties);
        finallist = CheckApplicatorNotification(appuser);
        retval[0] = "1";
        retval[1] = JsonConvert.SerializeObject(finallist);
        string extrainfo = "All crop conflict check";
        EventLog newevent = new EventLog();
        newevent.InsertConflictEvent(appuser.email, extrainfo);
        HttpContext.Current.Session["crops"] = null;
        return retval;
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public string[] RealTimeConflictCheckArea(AppArea userapparea, user user)
    {
        string [] retval = new string[2];
        retval[0] = "0";
        retval[1] = "Error";
        List<conflictedcrop> finallist = new List<conflictedcrop>();
        finallist = CheckAppAreaForNotification(userapparea, user);
        // to sort the array by distance with conflict flag = 1
        distancecomparer comparer = new distancecomparer();
        finallist.Sort(comparer);
        retval[0] = "1";
        retval[1] = JsonConvert.SerializeObject(finallist);
        string extrainfo = "Single crop conflict check";
        EventLog newevent = new EventLog();
        newevent.InsertConflictEvent(user.email, extrainfo);
        HttpContext.Current.Session["crops"] = null;
        return retval;
    }
    // Function that actually provides a list of crops that conflict with an application area
    //Main function that does the work
    public List<conflictedcrop> CheckAppAreaForNotification(AppArea userapparea, user user)
    {
        // string retval = "false";
        string apppreference = user.preferences;
        float comparedistance = 0;
        List<conflictedcrop> finalcroplist = new List<conflictedcrop>();
        ArrayList locationArr = new ArrayList();
        croplocation newcrop = new croplocation();
        string[] counties = new string[0];
        ArrayList countyArr = new ArrayList();
        if (user.preferences == "counties")
        {
            counties =  user.prefoptions.Split(',');
        }
        for (int x = 0; x < counties.GetLength(0); x++)
        {
            if (counties[x] != "")
            {
                countyArr.Add(counties[x]);
            }
        }
        locationArr = GetCropsByApplicator(user.email, countyArr);
        float dmax = 0;
        if (apppreference == "area")
        {
            comparedistance = float.Parse(user.prefoptions);
        }
        ///go through all the crops and set conflict flag and distance
        for (int j = 0; j < locationArr.Count; j++)
        {
            newcrop = (croplocation)locationArr[j];
            PointC cropcentroid = new PointC(float.Parse(newcrop.loccentroid.Split(',')[0]), float.Parse(newcrop.loccentroid.Split(',')[1]));
            string[] refcoords = userapparea.coordinates.Split('\n');
            string[] currcoords = newcrop.coordinates.Split('\n');
            ////get app centroid
            PointC appcentroid = new PointC(float.Parse(userapparea.areacentroid.Split(',')[0]), float.Parse(userapparea.areacentroid.Split(',')[1]));
            //area 
            float refarea = float.Parse(userapparea.acres);
            float d = Helper.GetDistance(appcentroid.Lat, appcentroid.Lon, cropcentroid.Lat, cropcentroid.Lon);
            if (apppreference == "area")
            {

                if (d <= dmax || d <= comparedistance)//is application nearest
                {
                    dmax = d;
                    conflictedcrop conflictcrop = new conflictedcrop();
                    conflictcrop.cropid = Convert.ToInt32(newcrop.id);
                    conflictcrop.distance = d;
                    conflictcrop.conflictflag = 1;
                    conflictcrop.appareaname = userapparea.appareaname;
                    finalcroplist.Add(conflictcrop);
                }
            }
            else //county or state preferences
            {

                conflictedcrop conflictcrop = new conflictedcrop();
                conflictcrop.cropid = Convert.ToInt32(newcrop.id);
                conflictcrop.distance = d;
                conflictcrop.conflictflag = 1;
                conflictcrop.appareaname = userapparea.appareaname;
                finalcroplist.Add(conflictcrop);

            }
        }
        return finalcroplist;
    }
    //returns an array of crops according to whether the applicator is interested in selected counties

    public ArrayList GetCropsByApplicator(string appuseremail, ArrayList counties)
    {
        
        SqlConnection conn = null;
        SqlCommand cmd = null;
        SqlDataReader reader;
        ArrayList appareas = new ArrayList();
        ArrayList locationArr; 
        string producersql = "";
        locationArr = (ArrayList) HttpContext.Current.Session["crops"];
        if (locationArr != null)
        {
            return locationArr; ///if crops already been queried in this session
        }
        locationArr = new ArrayList(); ///session will return null if no 'crops' entry!
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            producersql = "Select * from producer_locations where deleted = '0' and cropyear = [YEAR]";
            if (counties.Count > 0)
            {
                string whereclause = "";
                for (int i = 0; i < counties.Count; i++)
                {
                    if (i < counties.Count - 1)
                    {
                        whereclause = whereclause + " county =" + "'" + counties[i] + "'" + " or";
                        
                    }
                    else
                    {
                        whereclause = whereclause + " county =" + "'" + counties[i] + "'";
                    }
                }
                producersql += " and (" + whereclause + ")";
                
            }
            else
            {
                
            }
            producersql = producersql.Replace("[YEAR]", DateTime.Now.Year.ToString());
            cmd = new SqlCommand(producersql, conn);
            croplocation croploc = null;
            reader = cmd.ExecuteReader();
            while (reader.Read())
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
                locationArr.Add(croploc);
            }

        }
        catch (Exception errReader)
        {

        }
        finally
        {
            conn.Close();
        }
        HttpContext.Current.Session["crops"] = locationArr;
        return locationArr;
    }
    
    public static ArrayList GetApplicatorAreas(user user)
    {
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
                string sql = "select * from applicator_areas where email = '[EMAIL]' and year = '[YEAR]' and deleted = 0 order by modifieddate desc";
                sql = sql.Replace("[EMAIL]", user.email);
                sql = sql.Replace("[YEAR]", dt.Year.ToString());

                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                AppArea apparea = null;
                while (reader.Read() && reader.HasRows)
                {
                    try
                    {
                        apparea = new AppArea();
                        if (!reader.IsDBNull(11))
                        {
                            apparea.id = reader.GetDecimal(11).ToString();
                        }
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
                        if (!reader.IsDBNull(9))
                        {
                            apparea.moddate = reader.GetDateTime(9).ToString("MM/dd/yyyy");
                        }
                        if (!reader.IsDBNull(12))
                        {
                            apparea.comment = reader.GetString(12);
                        }
                        locationArr.Add(apparea);

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
    
    //service that can be called to get notification information. ONE FUNCTION that is called by web-site AND daily scheduler
    [System.Web.Services.WebMethod(EnableSession = true)]
    public List<conflictedcrop> CheckApplicatorNotification(user appuser)
    {
        
        ///service retrieves list of applicator areas and stores them in an array.
        //Then works through each applicator area and gets conflicts
        ///then sorts by distance
        ArrayList finallist = new ArrayList(); ///stores the conflicted crops
        ArrayList appareas = new ArrayList();
        List<conflictedcrop> conflictareas = new List<conflictedcrop>();
        List<conflictedcrop> temp_conflictareas = new List<conflictedcrop>();
        appareas = GetApplicatorAreas(appuser);
        for (int x = 0; x < appareas.Count; x++)
        {
            temp_conflictareas = CheckAppAreaForNotification((AppArea) appareas[x], appuser);
            conflictareas.AddRange(temp_conflictareas);
        }
        // to sort the array by distance with conflict flag = 1
        distancecomparer comparer = new distancecomparer();
        conflictareas.Sort(comparer);
        return conflictareas;
    }
    public bool GetClosestAppArea(string email, croplocation newcrop, ref float distance, ref AppArea app)
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
                        if (!reader.IsDBNull(11))
                        {
                            apparea.id = reader.GetDecimal(11).ToString();
                        }
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
                        if (!reader.IsDBNull(12))
                        {
                            apparea.comment = reader.GetString(12);
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
                        float d = Helper.GetDistance(appcentroid.Lat, appcentroid.Lon, cropcentroid.Lat, cropcentroid.Lon);
                        if (d <= dmax || x == 0)//is application nearest
                        {
                            dmax = d;
                            app = (AppArea)appAreaArr[x];
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

    
    // Function that gets the notification distance that the applicator has entered in the system
    public static double GetNotificationDistance(string appuseremail)
    {

        SqlConnection conn = null;
        SqlCommand cmd = null;
        SqlDataReader reader;
        double retval = 0;
        string preference = "";
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                string applicatorsql = "Select preferences from user_details where email = '[EMAIL]'";
                applicatorsql = applicatorsql.Replace("[EMAIL]", appuseremail);
                cmd = new SqlCommand(applicatorsql, conn);
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    try
                    {
                        if (!reader.IsDBNull(0))
                        {
                            preference = reader.GetString(0);
                        }
                    }
                    catch (Exception e)
                    {
                    }
                }
            }

            cmd.Dispose();
        }
        catch (Exception e)
        {
            string ch = e.ToString();
            int dummy = 0;
        }
        preference = preference.Substring(5);
        retval = Convert.ToDouble(preference);
        return retval;
    }
    
    
}
