using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Script.Services;
using System.Web.UI;
using System.Web.UI.WebControls;


public partial class WebContent_RegisterNewUser : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    public static bool CheckUserExists(string userid)
    {
        bool retval = true;
        SqlConnection conn = null;
        try
        {

            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                string sql = "select * from user_details where email = UPPER('[EMAIL]');";
                sql = sql.Replace("[EMAIL]", userid.ToUpper());
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                if (reader.HasRows == true)
                    retval = true;
                else
                    retval = false;
            }
        }
        catch (Exception e)
        {
        }

        return retval;
    }
    private static AlternateView getEmbeddedImage(String filePath)
    {
        LinkedResource inline = new LinkedResource(filePath);
        inline.ContentId = Guid.NewGuid().ToString();
        string htmlBody = @"<img src='cid:" + inline.ContentId + @"'/>";
        AlternateView alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, System.Net.Mime.MediaTypeNames.Text.Html);
        alternateView.LinkedResources.Add(inline);
        return alternateView;
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string send(string email, string variable, string type)
    {
        /*string confMsg = null;
        //-- ---------------Rama Changes Begin -------------------------
        string url = "http://kel.tamu.edu/TexasCropRegistry/TexasCropRegistry.aspx?page=Account&type=ACTIVATEACCOUNT";
        //-- ---------------Rama Changes End -------------------------
        string urlmain = "http://kel.tamu.edu/TexasCropRegistry/TexasCropRegistry.aspx";
        //string hostMail = "kel.texas.sensitive.crops@gmail.com";
        //string hosUsr = "kel.texas.sensitive.crops";
        //string hostPwd = "tscr_kel_2012";
        string hostMail = "texascropregistry@gmail.com";
        string hosUsr = "texascropregistry";
        string hostPwd = "Regi$tryKEL";
        string hostSMTP = "smtp.gmail.com";//gmail smtp 
        string subject = "Texas Crop Registry " + type + " information";
        string body1 = "Dear User,\n\n\n" +
                      "Thank you for registering with Texas Crop Registry!.\n\n\n" +
                      "This email is automatically generated, please do not reply.\n\n" +
            //            "Welcome to PIDS. To complete your registration, please go to the registration page of the PIDS website, and change your automatic password:\n" +
            ////"Your user id: " + email + "\n\n" +
                                    "Your one time only password is:\n\n" + variable + "\n\n" +
                                    "To complete your registration, please go to the registration page of the Texas Crop registry website, and change your automatic password: \n\n" + url + "\n\n" +
                                    "If you have trouble using the previous link, you can go to the main page: \n\n" + urlmain + "\n\n\n\n" +
                                    "and click on the 'Register' link, scroll to the bottom of the page and click the 'Change Password' link.\n\n" +
                                    "Thanks for working with us!\n\n\n" +
                                    "Texas Crop Registry Program";
        string body2 = "Texas Crop Registry Password recovery. This email is automatically generated, please do not reply.\n\n" +
                        "You have requested your password from Texas Crops Registry. Your new password is:\n\n" + variable + "\n\n" +
                        "We encourage you to change the password to something more memorable once you have retrieved it." +
                        " To change your password go to the Texas Crop Registry web site and click the Registration/Account tab. Then follow the 'Change Password' link.\n\n" +
                        "Thank you for working with us!\n\n" +
                        "Texas Crop Registry";
        //string body3 = "Dear User,\n\n\n"+
        //                "Thank you for your continuing collaboration with Pecan ipmPIPE program.\n\n\n"+
        //                "This email is automatically generated, please do not reply.\n\n\n\n" +
        //                "You made some recent changes to your profile preferences. You select to receive email notifications when a new crop is added to our database using the "+ variable + "criteria.\n\n"+
        //                "You can always modify your notifications by login into your account and specifying a new criteria.\n\n\n\n"+
        //                "Thank you for working with us!\n\n\n" +
        //                "Texas Crop Registry Program";
        MailMessage mail = new MailMessage();
        mail.To.Add(email);
        mail.From = new MailAddress(hostMail);//pecanipmpipe temporary email account
        mail.Subject = subject;
        if (type == "Registration") { mail.Body = body1; }
        else if (type == "Password") { mail.Body = body2; }
        //else { mail.Body = body3; }
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
        return confMsg;*/
        string confMsg = null;
        try
        {
            MailMessage mail = new MailMessage();
            mail.IsBodyHtml = true;
            mail.AlternateViews.Add(getEmbeddedImage("C:/Users/arpit2408/Documents/TSC_TDA_RELEASE_Jan_29_2014_AGB/WebContent/Images/HomePage/Logo.jpg"));
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("netflix240890@gmail.com", "Arpit@240890"),
                EnableSsl = true
            };
            mail.From = new MailAddress("netflix240890@gmail.com");
            mail.To.Add(email);
            mail.Subject = "yourSubject";

            client.Send(mail);
           
            /*MailMessage mail = new MailMessage("netflix240890@gmail.com", email);
            SmtpClient client = new SmtpClient();
            client.Port = 587;
            client.Credentials = new System.Net.NetworkCredential("netflix240890@gmail.com", "Arpit@240890");
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Host = "smtp.gmail.com";
            client.EnableSsl = true;
            mail.Subject = "this is a test email.";
            mail.Body = "this is my test email body";
            
            client.Send(mail);*/
            confMsg = "sent";
        }
        catch (Exception e)
        {
            confMsg = e.Message.ToString();
        }
        return confMsg;
    }

    [System.Web.Services.WebMethod()]
    [System.Web.Script.Services.ScriptMethod()]
    public static string[] RegisterUserDetails(string userdetails)
    {
        user obj = JsonConvert.DeserializeObject<user>(userdetails);
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        string firts = (obj).firstname;
        DateTime date1 = new DateTime();
        DateTime date2 = new DateTime();
        date1 = DateTime.Now;
        date2 = DateTime.Now;
       
        Random rand = new Random();
        bool fail_newuser = false;
        if (CheckUserExists(obj.email) == true)
        {
            retval[0] = "0";
            retval[1] = "A user with this email is already registered with the system. ";
            return retval;
        }
        SqlConnection conn = null;
        try
        {
            // string accesscode = GenerateAccessToken(obj.email, "register");
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                string sql = "INSERT INTO user_details VALUES ('[EMAIL]', '[FIRST]', '[LAST]', '[CONAME]', '[ADDRESS]', '[CITY]', '[STATE]', '[ZIP]', '[WEB]', " +
                      "'[PHONE]', '[DATE1]', '[DATE2]', '[ACTIVE]', '[PREFERENCES]', '[PREFUSERS]','[USERTYPE]', '[PASSWORD]');";
                sql = sql.Replace("[EMAIL]", obj.email);
                sql = sql.Replace("[FIRST]", obj.firstname);
                sql = sql.Replace("[LAST]", obj.lastname);
                sql = sql.Replace("[CONAME]", obj.companyname);
                sql = sql.Replace("[ADDRESS]", obj.address);
                sql = sql.Replace("[CITY]", obj.city);
                sql = sql.Replace("[STATE]", obj.state);
                sql = sql.Replace("[ZIP]", obj.zip);
                sql = sql.Replace("[WEB]", obj.website);
                sql = sql.Replace("[PHONE]", obj.phone);
                
                sql = sql.Replace("[DATE1]", date1.ToString());
                sql = sql.Replace("[DATE2]", date1.ToString());
                sql = sql.Replace("[ACTIVE]", "0");
                sql = sql.Replace("[PREFERENCES]", "none");
                sql = sql.Replace("[PREFUSERS]", "");
                sql = sql.Replace("[USERTYPE]", obj.usertype);
                sql = sql.Replace("[PASSWORD]", obj.password);
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.RecordsAffected == 1)
                {
                    retval[0] = "1";
                    retval[1] = "Registration Successful!";
                    fail_newuser = false;
                }
                else
                {
                    retval[0] = "0";
                    retval[1] = "User not registered";
                    fail_newuser = true;
                }
                cmd.Dispose();
                reader.Close();
                if (reader.RecordsAffected == 1)
                {
                    retval[1] = "You have successfully registered with the system.";
                    retval[0] = "1";
                }
            }
            string email_result = null;
            if (!fail_newuser)
            {
                email_result = send(obj.email.ToString(), "0", "Registration"); ;
               
                if (email_result == "sent")
                {
                    retval[1] += "Password sent to " + obj.email;// +" to email address";
                    retval[0] = "1";
                }
                else
                {
                    retval[1] += "User registration failed: " + email_result;
                    retval[0] = "0";
                }
            }

        }
        catch (SqlException ex)
        {
            if (ex.Number == 2627)
            {
                retval[1] = "User Registration Failed. User already exists.";
                retval[0] = "0";
            }
        }
        finally
        {
            conn.Close();
        }
        
        return retval;
    }
}