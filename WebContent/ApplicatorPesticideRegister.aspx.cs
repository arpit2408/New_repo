using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebContent_ApplicatorPesticideRegister : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    [System.Web.Services.WebMethod(EnableSession = false)]
    public static string[] AddNewApplicationApplicatorArea(string userarea)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "error";
        DateTime date = new DateTime();
        date = DateTime.Now;
        string sql = "";
        SqlConnection conn = null;
        user auser = (user)HttpContext.Current.Session["user"];
        /*if (auser.email == "")
        {
            retval[0] = "0";
            retval[1] = "User not logged in.";
            return retval;

        }*/
        AppArea currappArea = JsonConvert.DeserializeObject<AppArea>(userarea);
        List<String> listforuncheckvalues = new List<string>();
        listforuncheckvalues.Add("comment");
        listforuncheckvalues.Add("license");
        //ValidatorCustom.validatefields();
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
                sql = sql.Replace("[EMAIL]", currappArea.usremail);
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
}