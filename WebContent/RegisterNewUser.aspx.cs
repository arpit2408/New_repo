using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
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
       
        string confMsg = null;
        try
        {
            MailMessage mail = new MailMessage();
            mail.IsBodyHtml = true;
            string htmlBody = "<html><body><h2>&nbsp;</h2><h2><strong>Welcome!</strong></h2>"+
                "<h4>Thank you for registering with Hit the Target!</h4><p>You have successfully created an account with "
                +"Hit the Target!</p><p>What's next? &nbsp;You may now login&nbsp;with your credentials to start using "
                +"the application.</p><p>If you have any questions, please take a look at the FAQ section.</p><p>&nbsp;"
                +"</p><p>&nbsp;</p><img src=\"cid:filename\">"
                +"<a href='http://hitthetarget.tamu.edu'>Visit the website here</a></body></html>";
            AlternateView avHtml = AlternateView.CreateAlternateViewFromString
               (htmlBody, null, MediaTypeNames.Text.Html);

            LinkedResource inline = new LinkedResource(HttpContext.Current.Server.MapPath("/") + "/WebContent/Images/HomePage/LogoTX_header.png", MediaTypeNames.Image.Jpeg);
            inline.ContentId = Guid.NewGuid().ToString();
            avHtml.LinkedResources.Add(inline);
            mail.AlternateViews.Add(avHtml);
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("HittheTarget.KEL@gmail.com", "Crop$@KEL_2017"),
                EnableSsl = true
            };
            mail.From = new MailAddress("HittheTarget.KEL@gmail.com", "Hit the Target: The Crop Registry System");
            mail.To.Add(email);
            mail.Subject = "Welcome to Crop Registry System";

            client.Send(mail);
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
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        user obj = JsonConvert.DeserializeObject<user>(userdetails);
        retval = checkForValidLicense(obj.identification, obj.firstname, obj.lastname);
        if (retval[0].Equals("0"))
        {
            retval[1] = retval[1].Equals("") ? "Please enter a valid registration number." : retval[1];
            return retval;
        }
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
                      "'[PHONE]', '[DATE1]', '[DATE2]', '[ACTIVE]', '[PREFERENCES]', '[PREFUSERS]','[USERTYPE]', '[PASSWORD]','[identification]');";
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
                sql = sql.Replace("[identification]", obj.identification);
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
                    retval[1] += " An email has been sent to " + obj.email;// +" to email address";
                    retval[0] = "1";
                }
                else
                {
                    retval[1] += " User registration failed: " + email_result;
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
    public static string[] checkForValidLicense(string registrationNumber,string firstname,string lastname)
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "";
        try
        {
            var date = DateTime.Now.ToString("yyyy-MM-dd");
            bool checkFileFlag = false;
            var directoryPath = HttpContext.Current.Server.MapPath("/") + "WebContent\\RecurringResources\\";
            /*var newfile = directoryPath + date + ".xls";
            string[] files = Directory.GetFiles(directoryPath);
            foreach (string file in files)
            {
                checkFileFlag = true;
                newfile = directoryPath + Path.GetFileName(file);
                DateTime fileDate = DateTime.Parse(Path.GetFileName(file).Replace(".xls", ""));
                if (fileDate < DateTime.Now.AddDays(-7))
                {
                    System.IO.DirectoryInfo di = new DirectoryInfo(directoryPath);
                    foreach (FileInfo Dfile in di.GetFiles())
                    {
                        Dfile.Delete();
                    }
                    newfile = directoryPath + date + ".xls";
                    using (var client = new WebClient())
                    {
                        client.DownloadFile("http://texasagriculture.gov/Portals/0/Reports/PIR/pesticide_applicator_pir.xls", newfile);
                    }
                    break;
                }
            }
            if (!checkFileFlag)
            {
                using (var client = new WebClient())
                {
                    client.DownloadFile(new Uri("http://texasagriculture.gov/Portals/0/Reports/PIR/pesticide_applicator_pir.xls"), newfile);
                }
            }*/
            string PATH_TO_FILE = HttpContext.Current.Server.MapPath("/") + "WebContent\\PropertiesResources\\datafileforResources.txt";
            var newfile = directoryPath + "pesticide_applicator_pir.xls";
            var datafromfile = new Dictionary<string, string>();
            foreach (var row in File.ReadAllLines(PATH_TO_FILE))
                datafromfile.Add(row.Split('=')[0], string.Join("=", row.Split('=').Skip(1).ToArray()));
            var fileName = string.Format(newfile, Directory.GetCurrentDirectory());
            var connectionString = string.Format(datafromfile["connectionString"], fileName);
            var adapter = new OleDbDataAdapter(datafromfile["sheetreadingstring"], connectionString);
            var ds = new DataSet();

            adapter.Fill(ds, "dataFromSheet");
            
            var data = ds.Tables["dataFromSheet"].AsEnumerable();
            ArrayList licenselist = new ArrayList();
            foreach (var row in data)
            {
                PesticideApplicatorLicense license=new PesticideApplicatorLicense();
                        license.Account = row.ItemArray[0].ToString();
                        license.Contact_First_Name = row.ItemArray[5].ToString();
                        license.Contact_Last_Name = row.ItemArray[7].ToString();
                licenselist.Add(license);
            }
            foreach (PesticideApplicatorLicense eachitem in licenselist)
            {
                if (eachitem.Account.Equals(registrationNumber.Trim()))
                {
                    if (eachitem.Contact_First_Name.ToLower().Trim().Equals(firstname.ToLower().Trim()) && eachitem.Contact_Last_Name.ToLower().Trim().Equals(lastname.ToLower().Trim()))
                    {
                        retval[1] = "Successfully Read";
                        retval[0] = "1";
                        return retval;
                    }
                }
            }
            /*var query = data.Select(x =>
                    new PesticideApplicatorLicense
                    {
                        Account = x.Field<string>("Account"),
                        Account_Type = x.Field<string>("Account Type"),
                        Expiration = x.Field<string>("Expiration"),
                        Legal_Name = x.Field<string>("Legal Name"),
                        DBA = x.Field<string>("DBA"),
                        Contact_First_Name = x.Field<string>("Contact First Name"),
                        Contact_Middle_Name = x.Field<string>("Contact Middle Name"),
                        Contact_Last_Name = x.Field<string>("Contact Last Name"),
                        Facility = x.Field<string>("Facility"),
                        Region = x.Field<string>("Region"),
                        County = x.Field<string>("County"),
                        Address = x.Field<string>("Address"),
                        City = x.Field<string>("City"),
                        State = x.Field<string>("State"),
                        Zip = x.Field<string>("Zip"),
                        Phone = x.Field<string>("Phone"),
                    });
            foreach (var element in query)
            {
                if (element.Account.Equals(registrationNumber.Trim()))
                {
                    if (element.Contact_First_Name.ToLower().Trim().Equals(firstname.ToLower().Trim()) && element.Contact_Last_Name.ToLower().Trim().Equals(lastname.ToLower().Trim()))
                    {
                        retval[1] = "Successfully Read";
                        retval[0] = "1";
                        return retval;
                    }
                }
            }*/
            
        }
        catch (Exception e)
        {
            retval[1] = e.Message;
            return retval;
        }
        return retval;
    }
}