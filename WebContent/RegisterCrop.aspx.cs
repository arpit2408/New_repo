using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
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
}