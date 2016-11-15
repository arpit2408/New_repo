using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;



public partial class _Default : System.Web.UI.Page 
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
           //Response.Write("User Not logged on");

        }
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] GetUser()
    {
        //HttpContext.Current.Session["dummy"] = 0;
        string[] retval = new string[3];
        retval[2] = HttpContext.Current.Session.SessionID.ToString();
        retval[1] = "";
        retval[0] = "0";

        //if (HttpContext.Current.Session.Count > 2)
        //{
        //user auser = (user)HttpContext.Current.Session["user"];
        if (auser != null)
        {
            retval[1] = JsonConvert.SerializeObject(auser);
            retval[0] = "1";
        }
        else
        {
            retval[1] = "User not loaded by the session";
            retval[0] = "0";
        }
        //}

        return retval;
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] ChangeUserDetails(string userdetails)
    {
        //////check to see whether the user is logged in or not
        
        /////////////////////////////////////////////////////////
        
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        SqlConnection conn = null;
        user obj = JsonConvert.DeserializeObject<user>(userdetails);
        user auser = (user)HttpContext.Current.Session["user"];
        if (auser == null | auser.email != obj.email)
        {
            retval[1] = "User Not Logged In. Please Login or Register to change user settings";
            return retval;
        }
        
        DateTime date2 = new DateTime();
        date2 = DateTime.Now;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "UPDATE user_details Set firstname = '[FIRST]', lastname = '[LAST]', companyname = '[CONAME]', "+
                            "address = '[ADDRESS]', City = '[CITY]',  State = '[STATE]', Zip = '[ZIP]', website = '[WEB]', "+
                    //---------------Rama Changes Begin -----------------------
                            "phoneBusiness = '[PHONE1]', phoneMobile = '[PHONE2]', lastchange = '[DATE2]' " +
                    //---------------Rama Changes End -----------------------
                            "where email = '[EMAIL]';";
                sql = sql.Replace("[FIRST]", obj.firstname);
        //---------------Rama Changes Begin -----------------------
                sql = sql.Replace("[EMAIL]", obj.email);
        //---------------Rama Changes End -----------------------
                sql = sql.Replace("[LAST]", obj.lastname);
                sql = sql.Replace("[CONAME]", obj.companyname);
                sql = sql.Replace("[ADDRESS]", obj.address);
                sql = sql.Replace("[CITY]", obj.city);
                sql = sql.Replace("[STATE]", obj.state);
                sql = sql.Replace("[ZIP]", obj.zip);
                sql = sql.Replace("[WEB]", obj.website);
                sql = sql.Replace("[PHONE1]", obj.phone1);
                sql = sql.Replace("[PHONE2]", obj.phone2);
                sql = sql.Replace("[DATE2]", date2.ToString());
                
                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                if (reader.RecordsAffected > 1)
                {
                    retval[1] = "Details Successfully Changed. ";
                    retval[0] = "1";
                    EventLog event1 = new EventLog();
                    event1.InsertChangeDetails(obj.email);
                    
                    
                }
                else
                {
                    retval[1] = "Change Details Failed. User does not exist.";
                    retval[0] = "0";
                    EventLog event1 = new EventLog();
                    event1.InsertFailedChangeDetails(obj.email, "User Does not exist");
                }
                cmd.Dispose();
                reader.Dispose();
            }
        }
        catch (SqlException ex)
        {

                retval[1] = "Change Details Failed. Database error";
                retval[0] = "0";
            
        }
        finally
        {
            conn.Close();
        }
        return retval;
    }
   // [System.Web.Services.WebMethod(EnableSession = true)]
    //public static string [] RegisterUser(string userdetails)
    //{
    //    /////parse theJSON
    //    user obj = JsonConvert.DeserializeObject<user>(userdetails);
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "";
    //    string firts = (obj).firstname;
    //    DateTime date1 = new DateTime();
    //    DateTime date2 = new DateTime();
    //    date1 = DateTime.Now;
    //    date2 = DateTime.Now;
    //    string startcode = "";
    //    Random rand = new Random();
    //    bool fail_newuser = false;

    //    for (int x = 0; x < 10; x++)
    //    {
    //        char num = (char)(65 + (rand.NextDouble() * 26));
    //        startcode += num.ToString();

    //    }
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {

    //            string sql = "INSERT INTO user_validation VALUES ('[EMAIL]', '[PWD]', '[DATE1]', '[DATE2]', '[VALID]');";
    //            sql = sql.Replace("[EMAIL]", obj.email);
    //            sql = sql.Replace("[PWD]", startcode);
    //            sql = sql.Replace("[DATE1]", date1.ToString());
    //            sql = sql.Replace("[DATE2]", date2.ToString());
    //            sql = sql.Replace("[VALID]", "0");
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Registration Successful!";
    //                fail_newuser = false;
    //            }
    //            else
    //            {
    //                retval[0] = "0";
    //                retval[1] = "User not registered";
    //                fail_newuser = true;
    //            }

    //            //modify user details
    //            sql = "INSERT INTO user_details VALUES ('[EMAIL]', '[FIRST]', '[LAST]', '[CONAME]', '[ADDRESS]', '[CITY]', '[STATE]', '[ZIP]', '[WEB]', " +
    //                  "'[PHONE1]', '[PHONE2]', '[DATE1]', '[DATE2]', '[ACTIVE]', '[PREFERENCES]', '[PREFUSERS]');";
    //            sql = sql.Replace("[EMAIL]", obj.email);
    //            sql = sql.Replace("[FIRST]", obj.firstname);
    //            sql = sql.Replace("[LAST]", obj.lastname);
    //            sql = sql.Replace("[CONAME]", obj.companyname);
    //            sql = sql.Replace("[ADDRESS]", obj.address);
    //            sql = sql.Replace("[CITY]", obj.city);
    //            sql = sql.Replace("[STATE]", obj.state);
    //            sql = sql.Replace("[ZIP]", obj.zip);
    //            sql = sql.Replace("[WEB]", obj.website);
    //            sql = sql.Replace("[PHONE1]", obj.phone1);
    //            sql = sql.Replace("[PHONE2]", obj.phone2);
    //            sql = sql.Replace("[DATE1]", date1.ToString());
    //            sql = sql.Replace("[DATE2]", date2.ToString());
    //            sql = sql.Replace("[ACTIVE]", "0");
    //            sql = sql.Replace("[PREFERENCES]", "none");
    //            sql = sql.Replace("[PREFUSERS]", "");

    //            cmd.Dispose();
    //            reader.Close();
    //            cmd = new SqlCommand(sql, conn);
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                retval[1] = "User Registration Successful. ";
    //                retval[0] = "1";
    //            }
    //        }
    //        string email_result = null;
    //        if (!fail_newuser)
    //        {
    //            email_result = send(obj.email.ToString(), startcode, "Registration");
    //            if (email_result == "sent")
    //            {
    //                retval[1] += "Password " + email_result + " to email address";
    //                retval[0] = "1";
    //            }
    //            else
    //            {
    //                retval[1] += "User registration failed: " + email_result;
    //                retval[0] = "0";
    //            }
    //        }

    //    }
    //    catch (SqlException ex)
    //    {
    //        if (ex.Number == 2627)
    //        {
    //            retval[1] = "User Registration Failed. User already exists.";
    //            retval[0] = "0";
    //        }
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    //retval[0] = "1";
    //    //retval[1] = "Registration Successful!";
    //    return retval;
    //}

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static  string [] ChangePassword(string userdetails)
    //{
    //    /////parse theJSON
    //    string[] retval = new string[2];
    //    user obj = JsonConvert.DeserializeObject<user>(userdetails);
    //    retval[0] = "0";
    //    retval[1] = "no data";
    //    string firts = (obj).firstname;
    //    DateTime date1 = new DateTime();
    //    DateTime date2 = new DateTime();
    //    date1 = DateTime.Now;
    //    date2 = DateTime.Now;
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        string authpwd = "";
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            string sql = "SELECT * from user_validation where email = '[EMAIL]'";
    //            sql = sql.Replace("[EMAIL]", obj.email);
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            while (reader.Read())
    //            {
    //                authpwd = reader.GetString(1);

    //            }
    //            if (authpwd != obj.password)
    //            {
    //                retval[1] = "User Validation Failed: Username/Password mismatch";
    //            }
    //            else
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Authentication Successful!";
    //                retval = ChangePasswordII(obj.email, obj.password2);
    //            }

    //        }

    //    }
    //    catch (SqlException ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Operation Failed";

    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;
    //}

    

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string [] ChangePasswordII(string email, string newpassword)
    //{
    //    /////changes the password and sets status flag to account active after usre authenticated
    //    DateTime date1 = new DateTime();
    //    date1 = DateTime.Now;
    //    string [] retval = new string[2];
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            string sql = "update user_validation set password = '[PWD]', lastchange = '[DATE]', valid_flag = 1 where user_validation.email = '[EMAIL]'";
    //            sql = sql.Replace("[EMAIL]", email);
    //            sql = sql.Replace("[PWD]", newpassword);
    //            sql = sql.Replace("[DATE]", date1.ToShortDateString());
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                ///////success
    //                retval[0] = "1";
    //                retval[1] = "Password successfully changed";
    //           }
    //        }
    //    }
    //    catch (SqlException ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Password not changed";

    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;


    //}
    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] RequestPassword(string email)
    //{
    //    string[] retval = new string[2];
        
    //    retval[0] = "0";
    //    retval[1] = "no data";
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        string authpwd = "";
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            string sql = "SELECT * from user_validation where email = '[EMAIL]'";
    //            sql = sql.Replace("[EMAIL]", email);
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            int counter = 0;
    //            while (reader.Read())
    //            {
    //                authpwd = reader.GetString(1);
    //                counter++;

    //            }
    //            if (counter == 1)
    //            {
    //                string result = send(email, authpwd, "Password");
    //                if (result == "sent")
    //                {
    //                    retval[1] = "Password " + result + " to email address";
    //                    retval[0] = "1";
    //                }
    //                else
    //                {
    //                    retval[1] = "Failed to retrieve password: " + result;
    //                    retval[0] = "0";
    //                }

    //            }
    //            else
    //            {
    //                retval[0] = "0";
    //                retval[1] = "User name does not exist";

    //            }
    //        }

    //    }
    //    catch (SqlException ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Operation Failed";

    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;

    //}
    

    

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string send(string email, string variable, string type)
    {
        string confMsg = null;
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
        string body1 = "Dear User,\n\n\n"+
                      "Thank you for registering with Texas Crop Registry!.\n\n\n" + 
                      "This email is automatically generated, please do not reply.\n\n" +
            //            "Welcome to PIDS. To complete your registration, please go to the registration page of the PIDS website, and change your automatic password:\n" +
            ////"Your user id: " + email + "\n\n" +
                                    "Your one time only password is:\n\n" + variable + "\n\n" +
                                    "To complete your registration, please go to the registration page of the Texas Crop registry website, and change your automatic password: \n\n" + url + "\n\n" +
                                    "If you have trouble using the previous link, you can go to the main page: \n\n" + urlmain + "\n\n\n\n" +
                                    "and click on the 'Register' link, scroll to the bottom of the page and click the 'Change Password' link.\n\n"+
                                    "Thanks for working with us!\n\n\n" +
                                    "Texas Crop Registry Program";
        string body2 = "Texas Crop Registry Password recovery. This email is automatically generated, please do not reply.\n\n" +
                        "You have requested your password from Texas Crops Registry. Your new password is:\n\n" + variable + "\n\n" +
                        "We encourage you to change the password to something more memorable once you have retrieved it."+
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
        return confMsg;
    }
    //// -----------------------------Rama Changes begin---------------------------------------------------
    ////---------------------------------------------------------------------------------------------------------
    public static string[] Hashfunction(string pwd, byte[] saltBytes)
    {
        if (saltBytes == null)
        {
            int saltSize = 7;
            saltBytes = new byte[saltSize];
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetNonZeroBytes(saltBytes);
        }

        // Convert plain text into a byte array.
        byte[] plainTextBytes = Encoding.UTF8.GetBytes(pwd);

        // Allocate array, which will hold plain text and salt.
        byte[] plainTextWithSaltBytes =
                new byte[plainTextBytes.Length + saltBytes.Length];

        // Copy plain text bytes into resulting array.
        for (int i = 0; i < plainTextBytes.Length; i++)
            plainTextWithSaltBytes[i] = plainTextBytes[i];

        // Append salt bytes to the resulting array.
        for (int i = 0; i < saltBytes.Length; i++)
            plainTextWithSaltBytes[plainTextBytes.Length + i] = saltBytes[i];

        HashAlgorithm hash = new SHA256Managed();

        // Compute hash value of our plain text with appended salt.
        byte[] hashBytes = hash.ComputeHash(plainTextWithSaltBytes);

        // Create array which will hold hash and original salt bytes.
        byte[] hashWithSaltBytes = new byte[hashBytes.Length +
                                            saltBytes.Length];

        // Copy hash bytes into resulting array.
        for (int i = 0; i < hashBytes.Length; i++)
            hashWithSaltBytes[i] = hashBytes[i];

        // Append salt bytes to the result.
        for (int i = 0; i < saltBytes.Length; i++)
            hashWithSaltBytes[hashBytes.Length + i] = saltBytes[i];

        // Convert result into a base64-encoded string.
        string hashValue = Convert.ToBase64String(hashWithSaltBytes);
        string saltValue = Convert.ToBase64String(saltBytes);

        string[] hashdetail = new string[2];
        hashdetail[0] = hashValue;
        hashdetail[1] = saltValue;
        return hashdetail;

    }

    //-----------------------Rama Changes Begin -------------------------------
    //------------Access code generation that shall be used in cookies of the user-------------------
    public static string GenerateAccessToken(string cookie_login, string actionType)
    {
        string accessToken = "";
        string retval = "";
        SqlConnection conn = null;
        string username = cookie_login;
        if (actionType == "login"|| actionType== "register")
        {
            try
            {
                //string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
        //        string connection = "Data Source = RAMA-PC;Initial Catalog=test;Integrated Security=false;User ID=sa;Password=tamumis";
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader = null;
                    //    SqlDataReader reader = null;
                    string sql = "select  Accesscode from user_validation where email = '[Username]'";
                    sql = sql.Replace("[Username]", username);
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader(); ;

                    while (reader.Read())
                    {
                        try
                        {
                            if (!reader.IsDBNull(0))
                            {
                                if (reader.GetString(0) != "None")
                                {
                                    accessToken = reader.GetString(0);
                                    return accessToken;
                                }
                            }

                        }
                        catch (SqlException sqlerr)
                        {
                            retval = "Database error: " + sqlerr.Message;
                            return retval;
                        }

                    }
                }
            }

            catch (SqlException sqlerr)
            {
                retval = "Database error: " + sqlerr.Message;
                return retval;
            }
        }
        if (actionType == "register" && accessToken =="" )

        { 
        
        Random newran = new Random();
            for (int x = 0; x < 15; x++)
            {
                int ran = newran.Next(65, 122);
                accessToken += (char)ran;
            }
            return accessToken;          
            
          }
        
        if (actionType == "forgot pwd"|| accessToken=="")
        {
            Random newran = new Random();
            for (int x = 0; x < 15; x++)
            {
                int ran = newran.Next(65, 122);
                accessToken += (char)ran;
            }

            try
            {
                string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
                //string connection = "Data Source = RAMA-PC;Initial Catalog=test;Integrated Security=false;User ID=sa;Password=tamumis";
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    string sql = "update user_validation set Accesscode = '[accessToken]' where email = '[Username]'";
                    sql = sql.Replace("[accessToken]", accessToken);
                    sql = sql.Replace("[Username]", username);
                    cmd = new SqlCommand(sql, conn);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SqlException sqlerr)
            {
                retval = "Database error: " + sqlerr.Message;
                return retval;
            }
          }
        return accessToken;

    }


    //// -----------------------------Rama Changes end---------------------------------------------------
    ////---------------------------------------------------------------------------------------------------------
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
                string sql = "select * from user_validation where email = UPPER('[EMAIL]');";
                sql = sql.Replace("[EMAIL]", userid.ToUpper());
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                if (reader.HasRows == true)
                {
                    retval = true;
                }
                else
                {
                    retval = false;
                }


            }
        }
        catch (Exception e)
        {
        }

        return retval;
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] RegisterUser(string userdetails)
    {
        /////parse theJSON
        user obj = JsonConvert.DeserializeObject<user>(userdetails);
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        string firts = (obj).firstname;
        DateTime date1 = new DateTime();
        DateTime date2 = new DateTime();
        date1 = DateTime.Now;
        date2 = DateTime.Now;
        string startcode = "";
        Random rand = new Random();
        bool fail_newuser = false;
        if (CheckUserExists(obj.email) == true)
        {
            retval[0] = "0";
            retval[1] = "A user with this email is already registered with the system. Please click the 'Forgotten Password' link to retrieve your password.";
            return retval;
        }
        for (int x = 0; x < 10; x++)
        {
            char num = (char)(65 + (rand.NextDouble() * 26));
            startcode += num.ToString();

        }
        
        //    // --------------------------------------------------------------------------------------------------------
        //    // -----------------------------Rama Changes begin---------------------------------------------------
        string[] hashdetail = new string[2];
        hashdetail = Hashfunction(startcode, null);
        //    // -----------------------------Rama Changes end---------------------------------------------------
        //    //---------------------------------------------------------------------------------------------------------
        SqlConnection conn = null;
        try
        {
            string accesscode = GenerateAccessToken(obj.email, "register");
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                //            // --------------------------------------------------------------------------------------------------------
                //            // -----------------------------Rama Changes begin---------------------------------------------------
                
                string sql = "INSERT INTO user_validation VALUES ('[EMAIL]', '[PWD]', '[SALT]','[DATE1]', '[DATE2]', '[VALID]','[Accesscode]','[TextPwd]');";
                sql = sql.Replace("[EMAIL]", obj.email);
                sql = sql.Replace("[PWD]", hashdetail[0]);
                sql = sql.Replace("[SALT]", hashdetail[1]);
                //            // -----------------------------Rama Changes end---------------------------------------------------
                //            //---------------------------------------------------------------------------------------------------------
                sql = sql.Replace("[DATE1]", date1.ToString());
                sql = sql.Replace("[DATE2]", date2.ToString());
                sql = sql.Replace("[VALID]", "0");
                sql = sql.Replace("[Accesscode]", accesscode);
                sql = sql.Replace("[TextPwd]", startcode);
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
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

                //modify user details
                sql = "INSERT INTO user_details VALUES ('[EMAIL]', '[FIRST]', '[LAST]', '[CONAME]', '[ADDRESS]', '[CITY]', '[STATE]', '[ZIP]', '[WEB]', " +
                      "'[PHONE1]', '[PHONE2]', '[DATE1]', '[DATE2]', '[ACTIVE]', '[PREFERENCES]', '[PREFUSERS]');";
                sql = sql.Replace("[EMAIL]", obj.email);
                sql = sql.Replace("[FIRST]", obj.firstname);
                sql = sql.Replace("[LAST]", obj.lastname);
                sql = sql.Replace("[CONAME]", obj.companyname);
                sql = sql.Replace("[ADDRESS]", obj.address);
                sql = sql.Replace("[CITY]", obj.city);
                sql = sql.Replace("[STATE]", obj.state);
                sql = sql.Replace("[ZIP]", obj.zip);
                sql = sql.Replace("[WEB]", obj.website);
                sql = sql.Replace("[PHONE1]", obj.phone1);
                sql = sql.Replace("[PHONE2]", obj.phone2);
                sql = sql.Replace("[DATE1]", date1.ToString());
                sql = sql.Replace("[DATE2]", date2.ToString());
                sql = sql.Replace("[ACTIVE]", "0");
                sql = sql.Replace("[PREFERENCES]", "none");
                sql = sql.Replace("[PREFUSERS]", "");

                cmd.Dispose();
                reader.Close();
                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                if (reader.RecordsAffected == 1)
                {
                    retval[1] = "You have successfully registered with the system. Please check your email for a message from Texas Crop Registry. The message will include a onetime only password that must be used to log you in to the system.<br>";
                    retval[0] = "1";
                }
            }
            string email_result = null;
            if (!fail_newuser)
            {
                email_result = send(obj.email.ToString(), startcode, "Registration");
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
        //retval[0] = "1";
        //retval[1] = "Registration Successful!";
        return retval;
    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] RequestPassword(string email)
    {
        string[] retval = new string[2];

        retval[0] = "0";
        retval[1] = "no data";
        SqlConnection conn = null;
        EventLog event1 = new EventLog();
        event1.InsertRequestSendPassword(email);

        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            //        // -----------------------------Rama Changes begin---------------------------------------------------
            //        //---------------------------------------------------------------------------------------------------------
            //        //    string authpwd = "";
            DateTime date1 = new DateTime();
            date1 = DateTime.Now;
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "SELECT email from user_validation where email = '[EMAIL]'";
                //            // -----------------------------Rama Changes end---------------------------------------------------
                //            //---------------------------------------------------------------------------------------------------------
                sql = sql.Replace("[EMAIL]", email);
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                int counter = 0;
                while (reader.Read())
                {
                    //                // -----------------------------Rama Changes begin---------------------------------------------------
                    //                //---------------------------------------------------------------------------------------------------------
                    //                //      authpwd = reader.GetString(1);
                    counter++;
                    //                // -----------------------------Rama Changes end---------------------------------------------------
                    //                //---------------------------------------------------------------------------------------------------------
                }
                cmd.Dispose();
                reader.Close();
                if (counter > 0)
                {
                    //                // -----------------------------Rama Changes begin---------------------------------------------------
                    //                //---------------------------------------------------------------------------------------------------------
                    
                    string pwd = "";
                    Random newran = new Random();
                    for (int x = 0; x < 8; x++)//sends a random password
                    {
                        int ran = newran.Next(65, 90);
                        pwd += (char)ran;
                    }
                    string[] hashdetail = new string[2];
                    hashdetail = Hashfunction(pwd, null);
                    string sql1 = "update user_validation set password = '[PWD]', salt = '[SALT]', lastchange = '[DATE]', valid_flag = 1, textpassword = '[TextPwd]' where user_validation.email = '[EMAIL]'";
                    sql1 = sql1.Replace("[EMAIL]", email);
                    sql1 = sql1.Replace("[PWD]", hashdetail[0]);
                    sql1 = sql1.Replace("[SALT]", hashdetail[1]);
                    sql1 = sql1.Replace("[DATE]", date1.ToString());
                    sql1 = sql1.Replace("[TextPwd]", pwd);
                    cmd = new SqlCommand(sql1, conn);
                    cmd.ExecuteNonQuery();
                    string result = send(email, pwd, "Password");
                    if (result == "sent")
                    {
                        string res = "A new autogenerated password has been sent to your email address. <br>We recommend that you change the new password to something more memorable using the 'Change Password' link below: <br>";
                        res += "<ol style='text-align:left'><li>Please visit your email inbox, look for the message from Texas Crop Registry, and select and copy the password we have sent you.</li>";
                        res += "<li>Return to this page, click the 'Change Password link below'</li>";
                        res += "<li>Paste the password we sent you in the 'Old Password' field.'</li>";
                        res += "<li>Enter your email, and a new password then press submit'</li></ol>";
                        retval[1] = res;
                        retval[0] = "1";
                        event1.InsertSendPasswordSuccess(email);

                    }
                    else
                    {
                        //                    // -----------------------------Rama Changes end---------------------------------------------------------
                        //                    //---------------------------------------------------------------------------------------------------------
                        retval[1] = "Failed to send password: " + result;
                        //                    // -----------------------------Rama Changes end---------------------------------------------------------
                        //                    //---------------------------------------------------------------------------------------------------------
                        retval[0] = "0";
                        event1.InsertPasswordFail(email, "Failed to send password");
                    }

                }
                else
                {
                    retval[0] = "0";
                    retval[1] = "User name does not exist";
                    event1.InsertPasswordFail(email, "User name does not exist");

                }
            }

        }
        catch (SqlException ex)
        {
            retval[0] = "0";
            retval[1] = "Operation Failed";

        }
        finally
        {
            conn.Close();
        }
        return retval;

    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] ChangePassword(string userdetails)
    {
        /////parse theJSON
        string[] retval = new string[2];
        user obj = JsonConvert.DeserializeObject<user>(userdetails);
        retval[0] = "0";
        retval[1] = "no data";
        //user auser = (user)HttpContext.Current.Session["user"];
        //if (auser == null | auser.email != obj.email)
        //{
        //    retval[1] = "Authentication error";
        //    return retval;
        //}
        string firts = (obj).firstname;
        DateTime date1 = new DateTime();
        DateTime date2 = new DateTime();
        date1 = DateTime.Now;
        date2 = DateTime.Now;
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            //        // --------------------------------------------------------------------------------------------------------
            //        // -----------------------------Rama Changes begin---------------------------------------------------
            string password = "";
            string salt = "";
            string[] hashdetail = new string[2];

            //        // --------------------------------------------------------------------------------------------------------
            //        // -----------------------------Rama Changes end---------------------------------------------------
            if (conn.State == System.Data.ConnectionState.Open)
            {
                //            // --------------------------------------------------------------------------------------------------------
                //            // -----------------------------Rama Changes begin---------------------------------------------------
                string sql = "SELECT password, salt from user_validation where email = '[EMAIL]'";
                //            // --------------------------------------------------------------------------------------------------------
                //            // -----------------------------Rama Changes end---------------------------------------------------
                sql = sql.Replace("[EMAIL]", obj.email);
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    //                // --------------------------------------------------------------------------------------------------------
                    //                // -----------------------------Rama Changes begin---------------------------------------------------
                    password = reader.GetString(0);
                    salt = reader.GetString(1);

                }
                byte[] saltbytes = Convert.FromBase64String(salt);
                hashdetail = Hashfunction(obj.password, saltbytes);


                if (password != hashdetail[0])
                //            // --------------------------------------------------------------------------------------------------------
                //            // -----------------------------Rama Changes end---------------------------------------------------
                {
                    retval[1] = "User Validation Failed: Username/Password mismatch";
                    EventLog event1 = new EventLog();
                    event1.InsertPasswordFail(obj.email, "User validation failed");
                }
                else
                {
                    retval[0] = "1";
                    retval[1] = "Authentication Successful!";
                    retval = ChangePassword_HELPER(obj.email, obj.password2);
                }

            }

        }
        catch (SqlException ex)
        {
            retval[0] = "0";
            retval[1] = "Operation Failed";

        }
        finally
        {
            conn.Close();
        }
        return retval;
    }



    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string[] ChangePassword_HELPER(string email, string newpassword)
    {
        /////changes the password and sets status flag to account active after usre authenticated
        DateTime date1 = new DateTime();
        date1 = DateTime.Now;
        string[] retval = new string[2];
        SqlConnection conn = null;
        //    // --------------------------------------------------------------------------------------------------------
        //    // -----------------------------Rama Changes begin---------------------------------------------------
        string[] hashdetail = new string[2];
        hashdetail = Hashfunction(newpassword, null);
        //    // -----------------------------Rama Changes end---------------------------------------------------
        //    //---------------------------------------------------------------------------------------------------------
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                //            // --------------------------------------------------------------------------------------------------------
                //            // -----------------------------Rama Changes begin---------------------------------------------------
                string sql = "update user_validation set password = '[PWD]', salt = '[SALT]', lastchange = '[DATE]', valid_flag = 1, textpassword = '[TextPwd]' where user_validation.email = '[EMAIL]'";
                sql = sql.Replace("[EMAIL]", email);
                sql = sql.Replace("[PWD]", hashdetail[0]);
                sql = sql.Replace("[SALT]", hashdetail[1]);
                //            // -----------------------------Rama Changes end---------------------------------------------------
                //            //---------------------------------------------------------------------------------------------------------
                sql = sql.Replace("[DATE]", date1.ToString());
                sql = sql.Replace("[TextPwd]", newpassword);
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                if (reader.RecordsAffected == 1)
                {
                    ///////success
                    retval[0] = "1";
                    retval[1] = "Password successfully changed";
                    EventLog event1 = new EventLog();
                    event1.InsertChangePasswordSuccess(email);
                }
            }
        }
        catch (SqlException ex)
        {
            retval[0] = "0";
            retval[1] = "Password not changed";

        }
        finally
        {
            conn.Close();
        }
        return retval;


    }




    #region Erased/Obsolete methods
    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] RegisterApplicator(string userdetails)
    //{
    //    applicator obj = JsonConvert.DeserializeObject<applicator>(userdetails);
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "";
    //    string firts = (obj).firstname;
    //    DateTime date1 = new DateTime();
    //    DateTime date2 = new DateTime();
    //    date1 = DateTime.Now;
    //    date2 = DateTime.Now;
    //    string startcode = "";
    //    Random rand = new Random();
    //    for (int x = 0; x < 10; x++)
    //    {
    //        char num = (char)(65 + (rand.NextDouble() * 26));
    //        startcode += num.ToString();

    //    }
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {

    //            string sql = "INSERT INTO [USER] VALUES ('[UID]', '[PWD]', '[EMAIL]', '[FIRST]', '[LAST]', '[CONAME]', '[LICENSE]', '[ADDRESS]', '[CITY]', '[STATE]', '[ZIP]', '[WEB]', '[PHONE1]', '[PHONE2]', '[AREA]', '[ROLE]', '[ACTIVE]');";
    //            sql = sql.Replace("[USER]", obj.roles + "s");
    //            sql = sql.Replace("[UID]", Guid.NewGuid().ToString());
    //            sql = sql.Replace("[PWD]", startcode);
    //            sql = sql.Replace("[EMAIL]", obj.email);
    //            sql = sql.Replace("[FIRST]", obj.firstname);
    //            sql = sql.Replace("[LAST]", obj.lastname);
    //            sql = sql.Replace("[CONAME]", obj.companyname);
    //            sql = sql.Replace("[LICENSE]", obj.license);
    //            sql = sql.Replace("[ADDRESS]", obj.address);
    //            sql = sql.Replace("[CITY]", obj.city);
    //            sql = sql.Replace("[STATE]", obj.state);
    //            sql = sql.Replace("[ZIP]", obj.zip);
    //            sql = sql.Replace("[WEB]", obj.website);
    //            sql = sql.Replace("[PHONE1]", obj.phone1);
    //            sql = sql.Replace("[PHONE2]", obj.phone2);
    //            sql = sql.Replace("[AREA]", obj.alertArea);
    //            sql = sql.Replace("[ROLE]", obj.roles);
    //            sql = sql.Replace("[ACTIVE]", "0");
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Registration Successful!";
    //            }
    //            else
    //            {
    //                retval[0] = "0";
    //                retval[1] = "User not registered";
    //            }
    //            //sql = "INSERT INTO User_Details VALUES ('[EMAIL]', '[FIRST]', '[LAST]', '[ZIP]', '[PROFESSION]',  '[CITY]',  '[STATE]', '[DATE1]', '[DATE2]');";
    //            //sql = sql.Replace("[EMAIL]", obj.email);
    //            //sql = sql.Replace("[FIRST]", obj.firstname);
    //            //sql = sql.Replace("[LAST]", obj.lastname);
    //            //sql = sql.Replace("[ZIP]", obj.zip);
    //            ////sql = sql.Replace("[PROFESSION]", obj.profession);
    //            //sql = sql.Replace("[CITY]", obj.city);
    //            //sql = sql.Replace("[STATE]", obj.state);
    //            //sql = sql.Replace("[DATE1]", date1.ToString());
    //            //sql = sql.Replace("[DATE2]", date2.ToString());
    //            cmd.Dispose();
    //            reader.Close();
    //            //cmd = new SqlCommand(sql, conn);
    //            //reader = cmd.ExecuteReader();
    //            //if (reader.RecordsAffected == 1)
    //            //{
    //            //    retval[1] = "User Registration Successful. ";
    //            //    retval[0] = "1";
    //            //}
    //        }
    //        string result = send(obj.email.ToString(), startcode, "Registration");
    //        if (result == "sent")
    //        {
    //            retval[1] += "Password " + result + " to email address";
    //            retval[0] = "1";
    //        }
    //        else
    //        {
    //            retval[1] += "User registration failed: " + result;
    //            retval[0] = "0";
    //        }

    //        //string subject = "PIDS user registration";
    //        //string body = "Welcome to PIDS. To complete your registration, please go to the registration page of the PIDS website, and change your automatic password:\n";
    //        //body += "http://http://pecan.ipmpipe.org/\n";
    //        //body += "Your one time only password is:\n";
    //        //body += startcode;
    //        //if (SendCodeEmail(obj.email, subject, body))
    //        //{
    //        //    retval[1] += "Password sent to email address.";
    //        //    retval[0] = "1";
    //        //}
    //        //else
    //        //{
    //        //    retval[1] += "User Registration Failed. Failed to send password.";
    //        //    retval[0] = "0";
    //        //}

    //    }
    //    catch (SqlException ex)
    //    {
    //        if (ex.Number == 2627)
    //        {
    //            retval[1] = "User Registration Failed. User already exists.";
    //            retval[0] = "0";
    //        }
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;
    //}

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] RegisterProducer(string userdetails)
    //{
    //    user obj = JsonConvert.DeserializeObject<user>(userdetails);
    //    string[] retval = new string[2];
    //    retval[0] = "0";
    //    retval[1] = "";
    //    string firts = (obj).firstname;
    //    DateTime date1 = new DateTime();
    //    DateTime date2 = new DateTime();
    //    date1 = DateTime.Now;
    //    date2 = DateTime.Now;
    //    string startcode = "";
    //    Random rand = new Random();
    //    for (int x = 0; x < 10; x++)
    //    {
    //        char num = (char)(65 + (rand.NextDouble() * 26));
    //        startcode += num.ToString();

    //    }
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {

    //            string sql = "INSERT INTO [USER] VALUES ('[UID]', '[PWD]', '[EMAIL]', '[FIRST]', '[LAST]', '[CONAME]', '[ADDRESS]', '[CITY]', '[STATE]', '[ZIP]', '[WEB]', '[PHONE1]', '[PHONE2]', '[ROLE]', '[ACTIVE]');";
    //            sql = sql.Replace("[USER]", obj.roles + "s");
    //            sql = sql.Replace("[UID]", Guid.NewGuid().ToString());
    //            sql = sql.Replace("[PWD]", startcode);
    //            sql = sql.Replace("[EMAIL]", obj.email);
    //            sql = sql.Replace("[FIRST]", obj.firstname);
    //            sql = sql.Replace("[LAST]", obj.lastname);
    //            sql = sql.Replace("[CONAME]", obj.companyname);
    //            sql = sql.Replace("[ADDRESS]", obj.address);
    //            sql = sql.Replace("[CITY]", obj.city);
    //            sql = sql.Replace("[STATE]", obj.state);
    //            sql = sql.Replace("[ZIP]", obj.zip);
    //            sql = sql.Replace("[WEB]", obj.website);
    //            sql = sql.Replace("[PHONE1]", obj.phone1);
    //            sql = sql.Replace("[PHONE2]", obj.phone2);
    //            sql = sql.Replace("[ROLE]", obj.roles);
    //            sql = sql.Replace("[ACTIVE]", "0");
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            if (reader.RecordsAffected == 1)
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Registration Successful!";
    //            }
    //            else
    //            {
    //                retval[0] = "0";
    //                retval[1] = "User not registered";
    //            }
    //            //sql = "INSERT INTO User_Details VALUES ('[EMAIL]', '[FIRST]', '[LAST]', '[ZIP]', '[PROFESSION]',  '[CITY]',  '[STATE]', '[DATE1]', '[DATE2]');";
    //            //sql = sql.Replace("[EMAIL]", obj.email);
    //            //sql = sql.Replace("[FIRST]", obj.firstname);
    //            //sql = sql.Replace("[LAST]", obj.lastname);
    //            //sql = sql.Replace("[ZIP]", obj.zip);
    //            ////sql = sql.Replace("[PROFESSION]", obj.profession);
    //            //sql = sql.Replace("[CITY]", obj.city);
    //            //sql = sql.Replace("[STATE]", obj.state);
    //            //sql = sql.Replace("[DATE1]", date1.ToString());
    //            //sql = sql.Replace("[DATE2]", date2.ToString());
    //            cmd.Dispose();
    //            reader.Close();
    //            //cmd = new SqlCommand(sql, conn);
    //            //reader = cmd.ExecuteReader();
    //            //if (reader.RecordsAffected == 1)
    //            //{
    //            //    retval[1] = "User Registration Successful. ";
    //            //    retval[0] = "1";
    //            //}
    //        }
    //        string result = send(obj.email.ToString(), startcode, "Registration");
    //        if (result == "sent")
    //        {
    //            retval[1] += "Password " + result + " to email address";
    //            retval[0] = "1";
    //        }
    //        else
    //        {
    //            retval[1] += "User registration failed: " + result;
    //            retval[0] = "0";
    //        }

    //        //string subject = "PIDS user registration";
    //        //string body = "Welcome to PIDS. To complete your registration, please go to the registration page of the PIDS website, and change your automatic password:\n";
    //        //body += "http://http://pecan.ipmpipe.org/\n";
    //        //body += "Your one time only password is:\n";
    //        //body += startcode;
    //        //if (SendCodeEmail(obj.email, subject, body))
    //        //{
    //        //    retval[1] += "Password sent to email address.";
    //        //    retval[0] = "1";
    //        //}
    //        //else
    //        //{
    //        //    retval[1] += "User Registration Failed. Failed to send password.";
    //        //    retval[0] = "0";
    //        //}

    //    }
    //    catch (SqlException ex)
    //    {
    //        if (ex.Number == 2627)
    //        {
    //            retval[1] = "User Registration Failed. User already exists.";
    //            retval[0] = "0";
    //        }
    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;
    //}
    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static bool SendCodeEmail(string email, string subject, string body)
    //{
    //    try
    //    {
    //        string SMTP_SERVER = "http://schemas.microsoft.com/cdo/configuration/smtpserver";
    //        string SMTP_SERVER_PORT = "http://schemas.microsoft.com/cdo/configuration/smtpserverport";
    //        string SEND_USING = "http://schemas.microsoft.com/cdo/configuration/sendusing";
    //        string SMTP_USE_SSL = "http://schemas.microsoft.com/cdo/configuration/smtpusessl";
    //        string SMTP_AUTHENTICATE = "http://schemas.microsoft.com/cdo/configuration/smtpauthenticate";
    //        string SEND_USERNAME = "http://schemas.microsoft.com/cdo/configuration/sendusername";
    //        string SEND_PASSWORD = "http://schemas.microsoft.com/cdo/configuration/sendpassword";
    //        System.Web.Mail.MailMessage mail = new System.Web.Mail.MailMessage();
    //        mail.Fields[SMTP_SERVER] = "smtp.gmail.com";
    //        mail.Fields[SMTP_SERVER_PORT] = 587;//It can be 25, so try both.
    //        mail.Fields[SEND_USING] = 2;
    //        mail.Fields[SMTP_USE_SSL] = true;
    //        mail.Fields[SMTP_AUTHENTICATE] = 1;
    //        mail.Fields[SEND_USERNAME] = "abirt";
    //        mail.Fields[SEND_PASSWORD] = "";
    //        mail.From = "abirt@tamu.edu";
    //        mail.To = "abirt@tamu.edu";
    //        mail.Body = body;
    //        mail.Subject = subject;
    //        System.Web.Mail.SmtpMail.Send(mail);


    //    }
    //    catch (System.Exception e)
    //    {
    //        string msg = e.Message;
    //        return false;
    //    }
    //    return true;
    //}
    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] ChangePwdProducer(string userdetails, string usrtype)
    //{
    //    /////parse theJSON
    //    string[] retval = new string[2];
    //    user obj = JsonConvert.DeserializeObject<user>(userdetails);
    //    retval[0] = "0";
    //    retval[1] = "no data";
    //    string firts = (obj).firstname;
    //    DateTime date1 = new DateTime();
    //    DateTime date2 = new DateTime();
    //    date1 = DateTime.Now;
    //    date2 = DateTime.Now;
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        string authpwd = "";
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            string sql = "SELECT * from " + usrtype + "s where email = '[EMAIL]'";
    //            sql = sql.Replace("[EMAIL]", obj.email);
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            while (reader.Read())
    //            {
    //                authpwd = reader.GetString(1);

    //            }
    //            if (authpwd != obj.password)
    //            {
    //                retval[1] = "User Validation Failed: Username/Password mismatch";
    //            }
    //            else
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Authentication Successful!";
    //                retval = ChangePasswordII(obj.email, obj.password2, obj.roles);
    //            }

    //        }

    //    }
    //    catch (SqlException ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Operation Failed";

    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;
    //}

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string[] ChangePwdApplicator(string userdetails, string usrtype)
    //{
    //    /////parse theJSON
    //    string[] retval = new string[2];
    //    applicator obj = JsonConvert.DeserializeObject<applicator>(userdetails);
    //    retval[0] = "0";
    //    retval[1] = "no data";
    //    string firts = (obj).firstname;
    //    DateTime date1 = new DateTime();
    //    DateTime date2 = new DateTime();
    //    date1 = DateTime.Now;
    //    date2 = DateTime.Now;
    //    SqlConnection conn = null;
    //    try
    //    {
    //        string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
    //        conn = new SqlConnection(connection);
    //        conn.Open();
    //        string authpwd = "";
    //        if (conn.State == System.Data.ConnectionState.Open)
    //        {
    //            string sql = "SELECT * from " + usrtype + "s where email = '[EMAIL]'";
    //            sql = sql.Replace("[EMAIL]", obj.email);
    //            SqlCommand cmd = new SqlCommand(sql, conn);
    //            SqlDataReader reader;
    //            reader = cmd.ExecuteReader();
    //            while (reader.Read())
    //            {
    //                authpwd = reader.GetString(1);

    //            }
    //            if (authpwd != obj.password)
    //            {
    //                retval[1] = "User Validation Failed: Username/Password mismatch";
    //            }
    //            else
    //            {
    //                retval[0] = "1";
    //                retval[1] = "Authentication Successful!";
    //                retval = ChangePasswordII(obj.email, obj.password2, usrtype);
    //            }

    //        }

    //    }
    //    catch (SqlException ex)
    //    {
    //        retval[0] = "0";
    //        retval[1] = "Operation Failed";

    //    }
    //    finally
    //    {
    //        conn.Close();
    //    }
    //    return retval;
    //}
    #endregion
}


