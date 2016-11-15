using System;
using System.Collections;
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

using System.Drawing;
using System.Collections.Generic;




public partial class Applicator : System.Web.UI.Page
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
            ////////////test email fucntionality
            //string email_result = send(auser.email, "test", "Notifications");
        }
        else
        {
            Response.Write("User Not logged on");
            Response.Redirect("Home.aspx");

        }

        EventLog event1 = new EventLog();
        string page = HttpContext.Current.Request.Url.AbsoluteUri;
        event1.InsertPageVisitEvent(page);
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

    // shalini code
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string GetUserIP()
    {
        try
        {
            string ip = (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null) ?
            HttpContext.Current.Request.UserHostAddress :
            HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            return ip;
        }
        catch (Exception errR)
        {

            return "Error written by shalini";
        }
    }
    //end of shalini code



    ///// AGB Added
    //public static bool CheckApplicatorNotification(user applicator, croplocation crop)
    //{
    //    bool retval = false;
    //    if (applicator.preferences == "area")
    //    {
    //        AppArea app = null;
    //        float distance = -1;
    //        if (GetClosestAppArea(applicator.email, crop, ref distance, ref app))
    //        {
    //            if (distance < 1)
    //            {
    //                return true;

    //            }
    //        }
    //    }
    //    else if (applicator.preferences == "state")
    //    {
    //        return true;
    //    }
    //    else ///counties
    //    {
    //        ////get list of counties for notification
    //        string[] countypreferences = applicator.preferences.Split('\t');
    //        if (countypreferences.Length == 2)
    //        {
    //            string[] counties = countypreferences[1].Split(',');
    //            for (int x = 0; x < counties.Length; x++)
    //            {
    //                ArrayList countiesarr = CheckCropCounty(crop);
    //                for (int y = 0; y < countiesarr.Count; y++)
    //                {
    //                    string target = (string)countiesarr[y];
    //                    string test = counties[x];

    //                    if (target == test)
    //                    {
    //                        retval = true;
    //                    }
    //                }
    //            }
    //        }
    //   }
    //    return retval;
    //}

    //returns all crops
    //[System.Web.Services.WebMethod(EnableSession = true)]
    public static ArrayList GetCropLocations()
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        ArrayList locationArr;
        locationArr = (ArrayList)HttpContext.Current.Session["allcrops"];
        if (locationArr != null)
        {
            //return locationArr;
        }
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
                string sql = "select * from producer_locations where  cropyear = '[YEAR]' and deleted = 0;";
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
        HttpContext.Current.Session["allcrops"] =locationArr;
        return locationArr;

    }

    /// <summary>
    /// LOADS user areas and the crops that affect them according to preferences
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] LoadApplicatorAreas(user user)
    {
        /////loads app areas for a user
        //user thisuser = (user)HttpContext.Current.Session["user"];
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        
        DateTime dt = DateTime.Now;
        ArrayList locationArr = new ArrayList();
        locationArr = ConflictCheck.GetApplicatorAreas(user);
        //HttpContext.Current.Session["applicatorlocations"] = locationArr;
        //ArrayList croplocations = new ArrayList();
        //croplocations = GetCropLocations();// (ArrayList)HttpContext.Current.Session["croplocations"];
        //HttpContext.Current.Session["croplocations"] = croplocations;
        retval[0] = "1";
        retval[1] = JsonConvert.SerializeObject(locationArr);
        
        return retval;
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] LoadCropAreas(user user)
    {
        /////loads app areas for a user
        //user thisuser = (user)HttpContext.Current.Session["user"];
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        
        DateTime dt = DateTime.Now;
        //ArrayList locationArr = new ArrayList();
        //locationArr = ConflictCheck.GetApplicatorAreas(user);
        //HttpContext.Current.Session["applicatorlocations"] = locationArr;
        ArrayList croplocations = new ArrayList();
        croplocations = GetCropLocations();// (ArrayList)HttpContext.Current.Session["croplocations"];
        //HttpContext.Current.Session["croplocations"] = croplocations;
        retval[0] = "1";
        retval[1] = JsonConvert.SerializeObject(croplocations);
        //retval[2] = JsonConvert.SerializeObject(croplocations);
        return retval;
    }



    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] SaveUsrPreferences(string email, string preferences, string prefoptions)
    {
        string[] retval = new string[3];
        retval[0] = "0";
        retval[1] = "";
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser != null && auser.email == email)
        {
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
                    string sql = "update user_details set preferences = '[PREFERENCES]', prefoptions = '[PREFOPTIONS]', lastchange = '[DATE]' where email = '[EMAIL]';";
                    sql = sql.Replace("[PREFERENCES]", preferences);
                    sql = sql.Replace("[PREFOPTIONS]", prefoptions);
                    sql = sql.Replace("[DATE]", dt.ToString());
                    sql = sql.Replace("[EMAIL]", email);
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    if (reader.RecordsAffected > 0)
                    {
                        retval[1] = "Preferences Successfully Updated.";
                        
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
        }
        else
        {
            retval[0] = "0";
            retval[1] = "Invalid Session ID";
        }
        Login log = new Login();
        log.GetUserDetails(email);///function will update the user
        auser = (user)HttpContext.Current.Session["user"];
        if (auser!=null)
        {
            retval[1] = JsonConvert.SerializeObject(auser);
        }
        retval[0] = "1";
        return retval;
    }
    // function that is called to do realtime conflict check for all crops
    

    //-----------------------------Rama Changes ----------------------------------
    // Function that would check for conflict between area of an applicator and crops present in the counties where the applicator
    // areas
    //  [System.Web.Services.WebMethod(EnableSession = true)]
    //  public static ArrayList checknotificationcrops(user appuser, int eventtype)
    //  {

    //      string apppreference = appuser.preferences.Substring(0, 4);
    //      if (apppreference == "counti")
    //      {
    //          apppreference = "county";
    //      }
    //      if (apppreference == "stat")
    //      {
    //          apppreference = "state";
    //      }

    //      ArrayList finallist = new ArrayList();
    //      ArrayList croplist = new ArrayList();
    //      ArrayList applicationlist = new ArrayList();
    //      ArrayList interimlist = new ArrayList();

    //                  string retval = "";
    //                  ArrayList locationArr = new ArrayList();
    //                   croplocation newcroploc = new croplocation();
    //                  // check if the producer crop is close to the applicator's application for potential conflict
    //                   if (apppreference == "area")
    //                  {
    //                      double tempdistance = getnotificationdistance(appuser.email);
    //                      float comparedistance = (float)tempdistance;
    //                      locationArr = (ArrayList)HttpContext.Current.Session["croplocations"];
    //                      AppArea app = null;
    //                      float distance = -1;
    //                      for (int j = 0; j < locationArr.Count; j++)
    //                      {
    //                          newcroploc = (croplocation)locationArr[j];

    //                          if (GetClosestAppArea(appuser.email, newcroploc, ref distance, ref app))
    //                          {
    //                              if (distance < comparedistance)
    //                              {
    //                                  conflictedcrop conflictcrop = new conflictedcrop();
    //                                  conflictcrop.cropid = Convert.ToInt32(newcroploc.id);
    //                                  conflictcrop.distance = distance;
    //                                  conflictcrop.conflictflag = 1;
    //                                  conflictcrop.appareaname = app.appareaname;
    //                                  finallist.Add(conflictcrop);
    //                              }
    //                              else
    //                              {
    //                                  conflictedcrop conflictcrop = new conflictedcrop();
    //                                  conflictcrop.cropid = Convert.ToInt32(newcroploc.id);
    //                                  conflictcrop.distance = distance;
    //                                  conflictcrop.conflictflag = 0;
    //                                  conflictcrop.appareaname = app.appareaname;
    //                                  finallist.Add(conflictcrop);
    //                              }
    //                          }
    //                      }
    //                      //  call the event function that shall use the applicator id and crop id
    //                      EventLog newevent = new EventLog();
    //                      newevent.InsertConflictevent(appuser.email, retval, 1);
    //                  }
    //                  /// based on the applicator's preferred counties, all crop id's in those counties are retrieved
    //                   if (apppreference == "counties") 
    //                  {
    //                      applicationlist = (ArrayList)HttpContext.Current.Session["applicatorlocations"];

    //                       for (int i = 0; i < applicationlist.Count; i++)
    //                       {
    //                           interimlist = checkappareamain((AppArea)applicationlist[i], appuser);

    //                           for (int j = 0; j < interimlist.Count; j++)
    //                           {
    //                               finallist.Add(interimlist[j]);
    //                           }
    //                       }
    //                      for (int j = 0; j < locationArr.Count; j++)
    //                      {
    //                          newcroploc = newcroploc = (croplocation)locationArr[j];
    //                          retval = retval + ","+newcroploc.id;
    //                      }
    //                      EventLog newevent = new EventLog();
    //                      newevent.InsertConflictevent(appuser.email, retval, 2);
    //                  }

    //              // all the crop id's that are active are retrieved as the applicator preference is state
    //                   if (apppreference == "state")
    //              {
    //                      applicationlist = (ArrayList) HttpContext.Current.Session["applicatorlocations"];
    //                      for (int i = 0; i < applicationlist.Count; i++)
    //                      {
    //                          interimlist = checkappareamain((AppArea)applicationlist[i], appuser);

    //                          for (int j = 0; j < interimlist.Count; j++)
    //                          {
    //                              finallist.Add(interimlist[j]);
    //                          }
    //                      }
    //                  EventLog newevent = new EventLog();
    //                  newevent.InsertConflictevent(appuser.email, retval, 3);
    //            }

    //      if (retval == "")
    //      {
    //          retval = "False";
    //      }

    //      // to sort the array by distance with conflict flag = 1
    //      distancecomparer comparer = new distancecomparer();
    //    finallist.Sort(comparer);

    //      return finallist;
    //}

    // Function called when real time check is done for a single crop

    



    // get producer crop details






    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] DeleteArea(string email, string locid)
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
                string sql = "update applicator_areas set deleted = 1 where email = '[EMAIL]' and id = '[LOCID]' ";
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
}


    //public static string[] GetProducers(string criteria, string arg1, AppArea currApparea)
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
    //            string sql = "select * from producer_locations where ";
    //            if (criteria == "counties")
    //            {
    //                string[] counties = arg1.Split(',');

    //                for (int i = 0; i < counties.Length; i++)
    //                {
    //                    sql += "county = '" + counties[i] + "' ";
    //                    if (i != counties.Length - 1) { sql += "OR "; }
    //                }
    //                sql += " AND ";
    //            }
    //            //else if (criteria == "area")
    //            //{
    //            //    sql += "county = '" + arg1 + "' AND ";
    //            //}
    //            sql += "year = '" + dt.Year.ToString() + "' AND deleted = 0 order by email;";

    //            cmd = new SqlCommand(sql, conn);
    //            reader = cmd.ExecuteReader();
    //            croplocation croploc = null;
    //            AppArea apparea = null;
    //            while (reader.Read())
    //            {
    //                try
    //                {
    //                    croploc = new croplocation();
    //                    if (!reader.IsDBNull(1))
    //                    {
    //                        croploc.id = reader.GetString(1);
    //                    }
    //                    if (!reader.IsDBNull(0))
    //                    {
    //                        croploc.usremail = reader.GetString(0);
    //                    }
    //                    if (!reader.IsDBNull(2))
    //                    {
    //                        croploc.planttype = reader.GetString(2);
    //                    }
    //                    if (!reader.IsDBNull(3))
    //                    {
    //                        croploc.croptype = reader.GetString(3);
    //                    }
    //                    if (!reader.IsDBNull(4))
    //                    {
    //                        croploc.cropyear = reader.GetString(4);
    //                    }
    //                    if (!reader.IsDBNull(5))
    //                    {
    //                        croploc.comment = reader.GetString(5);
    //                    }
    //                    if (!reader.IsDBNull(6))
    //                    {
    //                        croploc.county = reader.GetString(6);
    //                    }
    //                    if (!reader.IsDBNull(7))
    //                    {
    //                        croploc.coordinates = reader.GetString(7);
    //                    }
    //                    if (!reader.IsDBNull(8))
    //                    {
    //                        croploc.loccentroid = reader.GetString(8);
    //                    }
    //                    if (!reader.IsDBNull(9))
    //                    {
    //                        croploc.acres = reader.GetString(9);
    //                    }
    //                    if (!reader.IsDBNull(10))
    //                    {
    //                        croploc.organiccrops = (reader.GetBoolean(10) ? 1 : 0).ToString();
    //                    }
    //                    locationArr.Add(croploc);

    //                }
    //                catch (Exception errReader)
    //                {
    //                    retval[0] = "0";
    //                    //retval[1] = "Database Access Problem";
    //                    //retval[1] += errReader.Message;
    //                }
    //            }
    //            string producid_locid = "";
    //            croplocation prevcrop = new croplocation();
    //            for (int i = 0; i < locationArr.Count; i++)
    //            {
    //                croplocation currcrop = (croplocation)locationArr[i];
    //                //if (i == 0) { prevcrop = currcrop; }
    //                if (criteria != "area" && arg1 != null)
    //                {
    //                    if (i == 0 || producid_locid == "")
    //                    {
    //                        producid_locid = currcrop.usremail + "\t" + currcrop.id;
    //                    }
    //                    else
    //                    {
    //                        if (currcrop.usremail != prevcrop.usremail)
    //                        {
    //                            producid_locid += "\n" + currcrop.usremail + "\t" + currcrop.id;
    //                        }
    //                        else
    //                        {
    //                            producid_locid += "," + currcrop.id;
    //                        }
    //                    }
    //                    //producid_locid += currcrop.id;
    //                    //if (i != locationArr.Count - 1 && prevcrop == currcrop) { producid_locid += ","; }
    //                    prevcrop = currcrop;
    //                }
    //                else if (currApparea != null)//preferences = area
    //                {
    //                    //PointF[] refpolygon = null;//polygon points
    //                    //string[] yx = currApparea.buffercoords.Split('\n');
    //                    string[] refcoords = currApparea.coordinates.Split('\n');
    //                    string[] currcoords = currcrop.coordinates.Split('\n');
    //                    //refpolygon = new PointF[yx.Length];
    //                    //for (int p = 0; p < yx.Length; p++)
    //                    //{
    //                    //    string[] curryx = yx[p].Split(',');
    //                    //    PointF currxy = new PointF(float.Parse(curryx[1]), float.Parse(curryx[0]));
    //                    //    refpolygon[p] = currxy;
    //                    //}
    //                    PointC refcentroid = new PointC(float.Parse(currApparea.areacentroid.Split(',')[0]), float.Parse(currApparea.areacentroid.Split(',')[1]));
    //                    PointC currcentroid = new PointC(float.Parse(currcrop.loccentroid.Split(',')[0]), float.Parse(currcrop.loccentroid.Split(',')[1]));
    //                    //centroid points
    //                    //PointF refcentroidF = new PointF(float.Parse(currApparea.areacentroid.Split(',')[1]), float.Parse(currApparea.areacentroid.Split(',')[0]));
                        
    //                    //area 
    //                    float refarea = float.Parse(currApparea.acres);

    //                    float factor = (float)0.0015625;// conversion factor from acres to square-miles
    //                    float rbuffer = (float)0.28;//buffer distance is 1/4 of a mile
    //                    float tolerance = (float)0.05;//tolerance for radious difference of less than 0.05 (i.e. very small!)

    //                    float r1 = (float)Math.Sqrt((double)(refarea * factor) / Math.PI);//radii of the big polygon
    //                    float r2 = (float)Math.Sqrt((double.Parse(currcrop.acres) * factor) / Math.PI);//radii of the small polygon
    //                    float dmax = (r1 + rbuffer + tolerance) + r2;
    //                    float d = distance(refcentroid.Lat, refcentroid.Lon, currcentroid.Lat, currcentroid.Lon);

    //                    if (d <= dmax)//first filter (check if the area is somewhere near)
    //                    {
    //                        if (pointInBuffer(refcoords, currcoords, rbuffer))
    //                        {
    //                            if (i == 0 || producid_locid == "")
    //                            {
    //                                producid_locid = currcrop.usremail + "\t" + currcrop.id;
    //                            }
    //                            else
    //                            {
    //                                if (currcrop.usremail != prevcrop.usremail)
    //                                {
    //                                    producid_locid += "\n" + currcrop.usremail + "\t" + currcrop.id;
    //                                }
    //                                else
    //                                {
    //                                    producid_locid += "," + currcrop.id;
    //                                }
    //                            }
    //                            prevcrop = currcrop;
    //                        }
    //                    }
    //                    //if (IsInsideBuffer(currcrop, refpolygon, refcentroidF, refarea))
    //                    //{
    //                    //    if (i == 0 || producid_locid == "")
    //                    //    {
    //                    //        producid_locid = currcrop.usremail + "\t" + currcrop.id;
    //                    //    }
    //                    //    else
    //                    //    {
    //                    //        if (currcrop.usremail != prevcrop.usremail)
    //                    //        {
    //                    //            producid_locid += "\n" + currcrop.usremail + "\t" + currcrop.id;
    //                    //        }
    //                    //        else
    //                    //        {
    //                    //            producid_locid += "," + currcrop.id;
    //                    //        }
    //                    //    }
    //                    //    prevcrop = currcrop;
    //                    //}
    //                }
    //            }

    //            retval[0] = "1";
    //            //retval[1] = JsonConvert.SerializeObject(locationArr);
    //            retval[1] = producid_locid;
    //            cmd.Dispose();
    //            reader.Dispose();
    //        }
    //    }
    //    catch (SqlException ex)
    //    {
    //        retval[0] = "0";
    //        //retval[1] = "Database Access Problem";
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }

    //    return retval;
    //}

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] LoadUserLocations(string email)
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
    //            string sql = "select * from producer_locations where email = '[EMAIL]' and year = '[YEAR]' and deleted = 0 order by modifieddate asc";
    //            sql = sql.Replace("[EMAIL]", email);
    //            sql = sql.Replace("[YEAR]", dt.Year.ToString());

    //            cmd = new SqlCommand(sql, conn);
    //            reader = cmd.ExecuteReader();
    //            croplocation croploc = null;
    //            while (reader.Read() && reader.HasRows)
    //            {
    //                try
    //                {
    //                    croploc = new croplocation();
    //                    if (!reader.IsDBNull(14))
    //                    {
    //                        croploc.id = reader.GetDecimal(14).ToString();
    //                    }
    //                    if (!reader.IsDBNull(0))
    //                    {
    //                        croploc.usremail = reader.GetString(0);
    //                    }
    //                    if (!reader.IsDBNull(1))
    //                    {
    //                        croploc.planttype = reader.GetString(1);
    //                    }
    //                    if (!reader.IsDBNull(2))
    //                    {
    //                        croploc.croptype = reader.GetString(2);
    //                    }
    //                    if (!reader.IsDBNull(3))
    //                    {
    //                        croploc.cropyear = reader.GetString(3);
    //                    }
    //                    if (!reader.IsDBNull(4))
    //                    {
    //                        croploc.comment = reader.GetString(4);
    //                    }
    //                    if (!reader.IsDBNull(5))
    //                    {
    //                        croploc.county = reader.GetString(5);
    //                    }
    //                    if (!reader.IsDBNull(6))
    //                    {
    //                        croploc.coordinates = reader.GetString(6);
    //                    }
    //                    if (!reader.IsDBNull(7))
    //                    {
    //                        croploc.loccentroid = reader.GetString(7);
    //                    }
    //                    if (!reader.IsDBNull(8))
    //                    {
    //                        croploc.acres = reader.GetString(8);
    //                    }
    //                    if (!reader.IsDBNull(9))
    //                    {
    //                        croploc.organiccrops = (reader.GetBoolean(9) ? 1 : 0).ToString();
    //                    }
    //                    if (!reader.IsDBNull(10))
    //                    {
    //                        croploc.certifier = reader.GetString(10);
    //                    }
    //                    locationArr.Add(croploc);

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

    //public static bool IsInsideBuffer(croplocation currcrop, PointF[] refcoords, PointF refcentroid, float refarea)
    //{
    //    bool IsInside = false;
    //    float factor = (float)0.0015625;// conversion factor from acres to square-miles
    //    float rbuffer = (float)0.25;//buffer distance is 1/4 of a mile
    //    float tolerance = (float)0.05;//tolerance for radious difference of less than 0.05 (i.e. very small!)
    //    string[] currcoords = currcrop.coordinates.Split('\n');
    //    float centlat = float.Parse(currcrop.loccentroid.Split(',')[0]);
    //    float centlon = float.Parse(currcrop.loccentroid.Split(',')[1]);
    //    float r1 = (float)Math.Sqrt((double)(refarea*factor) / Math.PI);//radii of the big polygon
    //    float r2 = (float)Math.Sqrt((double.Parse(currcrop.acres)*factor) / Math.PI);//radii of the small polygon
    //    float dmax = (r1 + rbuffer + tolerance) + r2;
    //    float d = distance(refcentroid.Y, refcentroid.X, centlat, centlon);

    //    if (d <= dmax)//first filter (check if the area is somewhere near)
    //    {
    //        for (int j = 0; j < currcoords.Length; j++)
    //        {
    //            PointF currxy = new PointF(float.Parse(currcoords[j].Split(',')[1]), float.Parse(currcoords[j].Split(',')[0]));
    //            //if (PointInPolygon(currxy, refcoords))//check if point is in polygon
    //            //{
    //            //    IsInside = true;
    //            //    break;//once at least one point inside is found, exit the inner loop and go to next area
    //            //}
    //            if (pointInPolygon(refcoords, currxy))//check if point is in polygon
    //            {
    //                IsInside = true;
    //                break;//once at least one point inside is found, exit the inner loop and go to next area
    //            }
    //        }
    //    }

    //    return IsInside;
    //}

    