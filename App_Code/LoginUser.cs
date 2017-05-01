using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;

// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "LoginUser" in code, svc and config file together.
[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class LoginUser
{
    [OperationContract]
    public string[] AuthenticateUser(string id, string pwd)
    {
        string[] retval = new string[3];
        retval[0] = "0";
        retval[1] = "Authentication Failed";
        retval[2] = "";
        SqlConnection conn = null;
        user auser=null;
        if (id==null || id.Equals("") || pwd==null || pwd.Equals(""))
        {
            return retval;
        }
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];//@"Data Source = 128.194.196.150\SQLEXPRESS;Initial Catalog=TXSCrops;Integrated Security=false;User ID=aspnet;Password=kelab";
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "SELECT [email],[firstname],[password] FROM  user_details  where email = '[EMAIL]'"; // string sql = "select password, salt from test_table where Username = '[ID]'";
                sql = sql.Replace("[EMAIL]", id);//
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                string authpwd = "";
                string firstname = "";
                while (reader.Read())
                {
                    authpwd = reader.GetString(2);
                    firstname = reader.GetString(1);
                }

                if (!authpwd.Equals(pwd))//
                {
                    retval[1] = "Authentication Failed";
                }
                else
                {
                    retval[0] = "1";
                    retval[1] = firstname + " Successfully LoggedIn";
                    GetUserDetails(id);
                }
                
            }
        }
        catch (SqlException ex)
        {
            retval[1] = "Database Access Problem";
            return retval;

        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
    [OperationContract]
    [WebGet()]
    public string[] GetUserDetails(string id)
    {
        string[] retval = new string[2];// "";
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "select * from user_details where email = '[EMAIL]'";
                sql = sql.Replace("[EMAIL]", id);
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                user auser = new user();

                while (reader.Read())
                {
                    if (!reader.IsDBNull(0))
                    {
                        auser.email = reader.GetString(0);
                    }
                    if (!reader.IsDBNull(1))
                    {
                        auser.firstname = reader.GetString(1);
                    }
                    if (!reader.IsDBNull(2))
                    {
                        auser.lastname = reader.GetString(2);
                    }
                    if (!reader.IsDBNull(3))
                    {
                        auser.companyname = reader.GetString(3);
                    }
                    if (!reader.IsDBNull(4))
                    {
                        auser.address = reader.GetString(4);
                    }
                    if (!reader.IsDBNull(5))
                    {
                        auser.city = reader.GetString(5);
                    }
                    if (!reader.IsDBNull(6))
                    {
                        auser.state = reader.GetString(6);
                    }
                    if (!reader.IsDBNull(7))
                    {
                        auser.zip = reader.GetString(7);
                    }
                    if (!reader.IsDBNull(8))
                    {
                        auser.website = reader.GetString(8);
                    }
                    if (!reader.IsDBNull(9))
                    {
                        auser.phone = reader.GetString(9);
                    }
                    if (!reader.IsDBNull(12))
                    {
                        auser.activated = reader.GetBoolean(12);////////here
                    }
                    if (!reader.IsDBNull(15))
                    {
                        auser.usertype = reader.GetString(15);
                    }
                    if (!reader.IsDBNull(16))
                    {
                        auser.user_id = reader.GetInt32(16).ToString();
                    }
                    if (!reader.IsDBNull(18))
                    {
                        auser.identification = reader.GetString(18);
                    }
                    retval[0] = "1";
                }
                HttpContext.Current.Session["loggedon"] = 1;
                HttpContext.Current.Session["user"] = auser;
            }

        }
        catch (SqlException ex)
        {
            retval[0] = "0";
            retval[1] = "Database Access Problem";
            return retval;

        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
    [OperationContract]
    [WebGet()]
    public string[] CheckLogin()
    {
        //HttpContext.Current.Session["dummy"] = 0;
        string[] retval = new string[3];
        retval[1] = "";
        retval[0] = "0";
        user usercheck = (user)HttpContext.Current.Session["user"];
        if (usercheck!=null)
        {
            retval[1] = JsonConvert.SerializeObject(usercheck);
            retval[0] = "1";
        }
        return retval;
    }
    [OperationContract]
    [WebGet()]
    public string[] Logoff()
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "Logoff Failed";
        user auser = (user)HttpContext.Current.Session["user"];
        HttpContext.Current.Session.Clear();
        retval[0] = "1";
        retval[1] = "Logoff Success";
        /*if (auser != null)
        {
            EventLog event1 = new EventLog();
            event1.InsertSuccessfullLogoff(auser.email);
        }*/
        return retval;
    }
    public static string send(string email, string link, string type)
    {
        
        string confMsg = null;
        try
        {
            MailMessage mail = new MailMessage();
            mail.IsBodyHtml = true;
            var baseurl=HttpContext.Current.Server.MapPath("/");
            string relativeurl=HttpContext.Current.Request.Url.Authority.ToString();
            string resetlink = "http://" + relativeurl + "/WebContent/PasswordReset.aspx?username=" + email + "&token=" + link;
            var body = new StringBuilder();
            //body.AppendFormat("Hello, {0}\n", email);
            body.AppendLine(@"Your Password link is here");
            body.AppendLine("<a href='"+resetlink+"'>Reset Password</a>");
            string htmlBody = "<html><body><br><img src=\"cid:filename\">"
                +"<h4>You recently requested a Password change form our website. Please click the below link to reset the password.<h4>"
                + "</body></html>"+body;
            AlternateView avHtml = AlternateView.CreateAlternateViewFromString
               (htmlBody, null, MediaTypeNames.Text.Html);

            LinkedResource inline = new LinkedResource(HttpContext.Current.Server.MapPath("/") + "/WebContent/Images/HomePage/LogoTX_header.png", MediaTypeNames.Image.Jpeg);
            inline.ContentId = Guid.NewGuid().ToString();
            avHtml.LinkedResources.Add(inline);
            mail.AlternateViews.Add(avHtml);
            var client = new SmtpClient("smtp.gmail.com", 587){
                Credentials = new NetworkCredential("HittheTarget.KEL@gmail.com", "Crop$@KEL_2017"),
                EnableSsl = true
            };
            mail.From = new MailAddress("HittheTarget.KEL@gmail.com", "Hit the Target: The Crop Registry System");
            mail.To.Add(email);
            mail.Subject = "HittheTarget password reset link";

            client.Send(mail);

            confMsg = "sent";
        }
        catch (Exception e)
        {
            confMsg = e.Message.ToString();
        }
        return confMsg;
    }
    [OperationContract]
    public string[] ForgotPassGenerate(string email){
        string[] retval = new string[2];// "";
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                StringBuilder sql = new StringBuilder("select email from user_details where email = '[EMAIL]'");
                sql.Replace("[EMAIL]", email.Trim());
                SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                user auser = new user();
                while (reader.Read()){
                    if (!reader.IsDBNull(0))
                        auser.email = reader.GetString(0);
                }
                cmd.Dispose();
                reader.Close();
                if (auser.email == null || auser.email =="")
                {
                    retval[0] = "0";
                    retval[1] = "Don't have this email id registered. Please signup.";
                    return retval;
                }
                else
                {
                    sql.Clear();
                    int saltSize = 7;
                    string hashString=Guid.NewGuid().ToString();

                    byte[] tokenHash = new byte[saltSize];
                    RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
                    rng.GetNonZeroBytes(tokenHash);
                    DateTime date = new DateTime();
                    date = DateTime.Now.AddDays(1);
                    int tknUsed = 0;
                    string tokenhashstr = Convert.ToBase64String(tokenHash, 0, tokenHash.Length);
                    sql.Append("INSERT INTO ResetTickets" +
                        "([email]" +
                        ",[tokenHash]" +
                        ",[expirationDate]" +
                        ",[tokenUsed])" +
                        " VALUES" +
                        " ('[EMAIL]'" +
                        ",'[TOKENHASH]'" +
                        ",'[EXPIRATIONDATE]'" +
                        ",'[TOKENUSED]')");
                    sql.Replace("[EMAIL]", auser.email.Trim());
                    sql.Replace("[TOKENHASH]", tokenhashstr);
                    sql.Replace("[EXPIRATIONDATE]", date.ToString());
                    sql.Replace("[TOKENUSED]", tknUsed.ToString());
                    cmd = new SqlCommand(sql.ToString(), conn);
                    reader = cmd.ExecuteReader();
                    if (reader.RecordsAffected == 1)
                    {
                        string email_result = send(email, tokenhashstr, "Registration");
                        if (email_result == "sent")
                        {
                            retval[1] += "Password reset link has bee sent to " + auser.email + ".Please visit you email to follow futher instructions";
                            retval[0] = "1";
                            return retval;
                        }
                        else
                        {
                            retval[1] += "Password link could not be sent to above email address.";
                            retval[0] = "0";
                            return retval;
                        }
                    }
                    cmd.Dispose();
                    reader.Close();
                }
            }
        }
        catch (Exception ex)
        {
            retval[0] = "0";
            retval[1] = "Database Access Problem"+ex.Message;
            return retval;
        }
        finally{
            if(conn!=null)
            conn.Close();
        }
        return retval;
    }
    public static string[] CheckPasswordResetLink(string email,string token)
    {
        string[] retval = new string[2];// "";
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                StringBuilder sql = new StringBuilder("SELECT TOP 1 [email],[tokenHash],[expirationDate],[tokenUsed]");
                sql.Append(" FROM [TX_CROPS].[dbo].[ResetTickets]");
                sql.Append(" where email = '[EMAIL]'");
                sql.Append(" order by expirationDate desc");
                sql.Replace("[EMAIL]", email.Trim());
                SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                user auser = new user();
                string tokenHash = "";
                DateTime expirationDate = DateTime.Now;
                int tokenUsed=0;
                while (reader.Read())
                {
                    if (!reader.IsDBNull(0))
                    {
                        tokenHash = reader.GetString(1);
                        expirationDate= DateTime.Parse(reader["expirationDate"].ToString());
                        tokenUsed = (reader.GetBoolean(3) ? 1 : 0);
                    }
                }
                cmd.Dispose();
                reader.Close();
                DateTime compareDateWithToday=expirationDate.AddDays(-1);
                int result = DateTime.Compare(compareDateWithToday, DateTime.Now);
                if (!tokenHash.Equals(token) || result > 0 || tokenUsed == 1)
                {
                    retval[0] = "0";
                    retval[1] = "Link is broken or expired. Please visit the website again to sent another link";
                }
                else
                {
                    retval[0] = "1";
                    retval[1] = "Link Success";
                }
            }
        }
        catch (Exception ex)
        {
            retval[0] = "0";
            retval[1] = "Database Access Problem" + ex.Message;
            return retval;
        }
        finally
        {
            if (conn != null)
                conn.Close();
        }
        return retval;
    }
    [OperationContract]
    public string[] ResetPassForgotLink(string email, string token, string newPass)
    {
        SqlConnection conn = null;
        DateTime dt = DateTime.Now;
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        retval = CheckPasswordResetLink(email, token.Replace("#",""));
        if (retval[0].Equals("0"))
            return retval;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("UPDATE user_details SET");
                    sql.Append(" password =  '[PASSWORD]'");
                    sql.Append(" where email = '[EMAIL]'");
                    sql.Replace("[EMAIL]", email.Trim());
                    sql.Replace("[PASSWORD]", newPass.Trim());
                    SqlCommand cmd = new SqlCommand(sql.ToString(), conn);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.RecordsAffected == 1)
                    {
                        sql.Clear();
                        cmd.Dispose();
                        reader.Close();
                        sql.Append("delete from ResetTickets ");
                        sql.Append(" where email = '[EMAIL]'");
                        sql.Replace("[EMAIL]", email.Trim());
                        cmd = new SqlCommand(sql.ToString(), conn);
                        reader = cmd.ExecuteReader();
                        retval[0] = "1";
                        retval[1] = "Password Updated Successfully.Redirecting you to Login Page";
                        return retval;
                    }
                    sql.Clear();
                    cmd.Dispose();
                    reader.Close();
            }
        }
        catch (Exception errReader)
        {
            retval[0] = "0";
            retval[1] = "Database Access Problem";
            retval[1] += errReader.Message;
        }
        finally
        {
            if (conn != null)
                conn.Close();
        }
        return retval;
    }
}
