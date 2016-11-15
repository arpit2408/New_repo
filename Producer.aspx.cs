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


public partial class Producer : System.Web.UI.Page
{
    public static user auser = null;
    protected void Page_Load(object sender, EventArgs e)
    {
        EventLog event1 = new EventLog();
        string page = HttpContext.Current.Request.Url.AbsoluteUri;
        event1.InsertPageVisitEvent(page);
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
            Response.Write("User Not logged on");
            Response.Redirect("Home.aspx");

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
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser == null | auser.email != email)
        {
            retval[1] = "Authentication error";
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
                string sql = "select * from producer_locations where email = '[EMAIL]' and year = '[YEAR]' and deleted = 0 order by modifieddate desc";
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

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] AddNewLocation(string userlocation, string email)
    //{
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "error";
    //    DateTime date = new DateTime();
    //    date = DateTime.Now;
    //    SqlConnection conn = null;

    //    croplocation obj = JsonConvert.DeserializeObject<croplocation>(userlocation);

    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            SqlCommand cmd = null;
    //            SqlDataReader reader;
    //            string sql = "INSERT INTO producer_locations (email, id, planttype, croptype, cropyear, comment, county, coordinates, loccentroid, acres, organiccrops, certifier, modifieddate, year, deleted) ";
    //            sql += "VALUES ('[EMAIL]', '[ID]', '[PTYPE]', '[CTYPE]', '[CYEAR]', '[COMMENT]', '[COUNTY]', '[COORDINATES]', '[LOCCENTR]', '[ACRES]', '[ORGCROP]', '[CERTIF]', '[DATE1]', '[YEAR]', 0);";
    //            sql = sql.Replace("[EMAIL]", obj.usremail);
    //            sql = sql.Replace("[ID]", obj.id);
    //            sql = sql.Replace("[PTYPE]", obj.planttype);
    //            sql = sql.Replace("[CTYPE]", obj.croptype);
    //            sql = sql.Replace("[CYEAR]", obj.cropyear);
    //            sql = sql.Replace("[COMMENT]", obj.comment);
    //            sql = sql.Replace("[COUNTY]", obj.county);
    //            sql = sql.Replace("[COORDINATES]", obj.coordinates);
    //            sql = sql.Replace("[LOCCENTR]", obj.loccentroid);
    //            sql = sql.Replace("[ACRES]", obj.acres);
    //            sql = sql.Replace("[ORGCROP]", obj.organiccrops.ToString());
    //            sql = sql.Replace("[CERTIF]", obj.certifier);
    //            sql = sql.Replace("[DATE1]", date.ToString());
    //            sql = sql.Replace("[YEAR]", date.Year.ToString());

    //            cmd = new SqlCommand(sql, conn);
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Add Location successful";
    //            }
    //            else
    //            {
    //                retval[0] = "0";
    //                retval[1] = "Add Location failed. User does not exist.";
    //            }
    //            cmd.Dispose();
    //            reader.Dispose();
    //        }
    //    }
    //    catch (SqlException e)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Add Location failed. Data base error";
    //        retval[1] += e.Message;
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }

    //    PointF[] xy = null;
    //    string[] yx = obj.coordinates.Split('\n');
    //    xy = new PointF[yx.Length];
    //    for (int p = 0; p < yx.Length; p++)
    //    {
    //        string[] curryx = yx[p].Split(',');
    //        PointF currxy = new PointF(float.Parse(curryx[1]), float.Parse(curryx[0]));
    //        xy[p] = currxy;
    //    }

    //    return retval;
    //}

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] EditLocation(string userlocation, string email)
    //{
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "error";
    //    DateTime date = new DateTime();
    //    date = DateTime.Now;

    //    SqlConnection conn = null;

    //    croplocation obj = JsonConvert.DeserializeObject<croplocation>(userlocation);

    //    try
    //    {
    //        retval = DeleteLocation(email, obj.id);
    //        if (retval[0] == "0")
    //        {
    //            return retval;
    //        }
    //         string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            SqlCommand cmd = null;
    //            SqlDataReader reader;
    //            string sql = "INSERT INTO producer_locations (email, id, planttype, croptype, cropyear, comment, county, coordinates, loccentroid, acres, organiccrops, certifier, modifieddate, year, deleted) ";
    //            sql += "VALUES ('[EMAIL]', '[ID]', '[PTYPE]', '[CTYPE]', '[CYEAR]', '[COMMENT]', '[COUNTY]', '[COORDINATES]', '[LOCCENTR]', '[ACRES]', '[ORGCROP]', '[CERTIF]', '[DATE1]', '[YEAR]', 0);";
    //            sql = sql.Replace("[EMAIL]", obj.usremail);
    //            sql = sql.Replace("[ID]", obj.id);
    //            sql = sql.Replace("[PTYPE]", obj.planttype);
    //            sql = sql.Replace("[CTYPE]", obj.croptype);
    //            sql = sql.Replace("[CYEAR]", obj.cropyear);
    //            sql = sql.Replace("[COMMENT]", obj.comment);
    //            sql = sql.Replace("[COUNTY]", obj.county);
    //            sql = sql.Replace("[COORDINATES]", obj.coordinates);
    //            sql = sql.Replace("[LOCCENTR]", obj.loccentroid);
    //            sql = sql.Replace("[ACRES]", obj.acres);
    //            sql = sql.Replace("[ORGCROP]", obj.organiccrops.ToString());
    //            sql = sql.Replace("[CERTIF]", obj.certifier);
    //            sql = sql.Replace("[DATE1]", date.ToString());
    //            sql = sql.Replace("[YEAR]", date.Year.ToString());

    //            cmd = new SqlCommand(sql, conn);
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Edit Location successful";
    //            }
    //            else
    //            {
    //                retval[0] = "0";
    //                retval[1] = "Edit Location failed. User does not exist.";
    //            }
    //            cmd.Dispose();
    //            reader.Dispose();
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Edit Location failed. Data base error";
    //        retval[1] += ex.Message;
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;
    //}


    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] DeleteLocation(string email, string locid)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser == null | auser.email != email)
        {
            retval[1] = "Authentication error";
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
                string sql = "update producer_locations set deleted = 1 where email = '[EMAIL]' and id = '[LOCID]' ";
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

    public static bool PointInPolygon(PointF p, PointF[] poly)
    {

        PointF p1, p2;

        

        bool inside = false;



        if (poly.Length < 3)
        {

            return inside;

        }



        PointF oldPoint = new PointF(

            poly[poly.Length - 1].X, poly[poly.Length - 1].Y);



        for (int i = 0; i < poly.Length; i++)
        {

            PointF newPoint = new PointF(poly[i].X, poly[i].Y);



            if (newPoint.X > oldPoint.X)
            {

                p1 = oldPoint;

                p2 = newPoint;

            }

            else
            {

                p1 = newPoint;

                p2 = oldPoint;

            }



            if ((newPoint.X < p.X) == (p.X <= oldPoint.X)

                && ((long)p.Y - (long)p1.Y) * (long)(p2.X - p1.X)

                 < ((long)p2.Y - (long)p1.Y) * (long)(p.X - p1.X))
            {

                inside = !inside;

            }



            oldPoint = newPoint;

        }



        return inside;

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

    
}
