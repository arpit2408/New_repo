using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Collections;

using ConsoleApplication2.conflictSVC;


namespace Console
{
    class Program
    {
        
        static void Main(string[] args)
        {
            ConflictChecker check = new ConflictChecker();
            check.DailyNotification();
        }

    }

public class ConflictChecker
{
    public string connection = "Data Source = 128.194.196.239;Initial Catalog=TX_Crops;Integrated Security=false;User ID=aspnet;Password=kelab";
    public string websiteurl = "http://kel.tamu.edu/TexasCropRegistry/TexasCropRegistry.aspx";
    public ArrayList administrators = new ArrayList();
    public ConflictChecker()
    {
        ////ADD and remove system administartors here
        administrators.Add("abirt@tamu.edu");
        administrators.Add("mtchakerian@tamu.edu");
        administrators.Add("dking@ag.tamu.edu");
        administrators.Add("rfris@tamu.edu");

    }
    public void DailyNotification()
    {
        
            ArrayList applicators = GetAllApplicators();
            ArrayList newcrops = GetAllNewCrops();
            ConflictCheck sv = new ConflictCheck();
            int applicatornotifications = 0;
            for (int x = 0; x < applicators.Count; x++)
            {
                //////check conflicts
                //sv.RealTimeConflictCheck((ConsoleApplication2.conflictSVC.user) applicators[x]);
                ConsoleApplication2.conflictSVC.conflictedcrop [] conflicts = sv.CheckApplicatorNotification((ConsoleApplication2.conflictSVC.user)applicators[x]);
                List <ConsoleApplication2.conflictSVC.conflictedcrop> conflictarr = new List<ConsoleApplication2.conflictSVC.conflictedcrop>(conflicts);
                int length = conflicts.GetLength(0);
                int countcrops = 0;
                for (int y = 0; y < conflictarr.Count; y++)///go through conflicting crops. If any match crop id, then trigger a notify event
                {
                   if (CheckMatchingCropId(conflictarr[y].cropid, newcrops))
                    {   ///send conflict message
                        countcrops++;
                        
                    }
                }
                if (countcrops > 0)
                {
                    CreateDailyNotification((ConsoleApplication2.conflictSVC.user)applicators[x], newcrops.Count, countcrops);
                    applicatornotifications++;
                }
            }
        for (int x = 0; x < administrators.Count; x++)
        {
            AddAdministratorNotificationToDatabase("DAILY_NOTIFICATION_END", (string)administrators[x], applicatornotifications);
        }
    }
    public void CreateDailyNotification(ConsoleApplication2.conflictSVC.user applicator, int numberofnewcrops, int numberofconflicting)
    {
            string str = "Dear " + applicator.firstname + " " + applicator.lastname + ",\n";
            if (numberofnewcrops > 1)
            {
                str += numberofnewcrops.ToString() + " new crops were added to the Texas Crops Registry today.\n";

            }
            else
            {
                str += "A new crop was added to the Texas Crops Registry today.\n";
            }
            if (applicator.preferences == "state")
            {
                str += "Your notification settings asked us to notify whenever new crops were added within the state of Texas.\n";
            }
            else if (applicator.preferences == "counties")
            {
                str += "Your notification settings asked us to notify whenever new crops were added within the following counties:\n";
                string[] counties = applicator.prefoptions.Split(',');
                for (int y = 0; y < counties.GetLength(0); y++)
                {
                    if (counties[y] != "")
                    {
                        str += counties[y] + "\n";
                    }
                }
            }
            else if (applicator.preferences == "area")
            {
                str += "Your notification settings asked us to notify whenever new crops were added within " + applicator.prefoptions + " miles of any of your application areas.\n";
            }
            else
            {
                str += "error";
            }
            str += "\nOur system has detected " + numberofconflicting + " notification instances between your application areas and the newly added crops.\n";
            str += "Please visit the Texas Crop Registry Website " + websiteurl + " to review crops of interest.\n\n";
            str += "Thank-you for using the Texas Crops Registry\n";
            //////put the string in the notification database
            AddDailyNotificationToDatabase(applicator.email, str);
    }



    /// <summary>
    /// Sends email message and stores the sent message in the db
    /// </summary>
    /// <param name="useremail"></param>
    /// <param name="message"></param>
    /// <returns></returns>
    public bool AddDailyNotificationToDatabase(string useremail, string message)
    {
            SqlConnection conn = null;
            DateTime dt = DateTime.Now;
            string sentsuccess = Send(useremail, message);
            bool retval = false;
            try
            {
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader;
                    string sql = "insert into Notifications  values ('DAILY_NOTIFICATION', '[DATE]', '[USERID]', '[MESSAGE]', '[SENT]');";
                    sql = sql.Replace("[DATE]", dt.ToShortDateString() + " " + dt.ToLongTimeString());
                    sql = sql.Replace("[USERID]", useremail);
                    sql = sql.Replace("[MESSAGE]", message);
                    sql = sql.Replace("[SENT]", sentsuccess );
                        cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    if (reader.RecordsAffected > 0)
                    {
                        retval = true;
                    }
                    cmd.Dispose();
                    reader.Dispose();
                }
            }
            catch (SqlException ex)
            {
                string err = ex.Message;
            }
            finally
            {
                conn.Close();
            }
            return retval;
        }
        public bool CheckMatchingCropId(int targetid, ArrayList newcrops)
        {
            for (int x = 0; x < newcrops.Count; x++)
            {
                if ((long)newcrops[x] == targetid)
                {
                    return true;
                }
            }
            return false;
        }
        //Add a notification to the database to say notification tool ran
        public bool AddAdministratorNotificationToDatabase(string type, string useremail, int usersnotified)
        {
            string message = "Dear TSC Administrator,\nThis is an automated message to notify you that the daily TSC notification procedure took place.\n";
            message += usersnotified.ToString() + " users were notified today";
            SqlConnection conn = null;
            DateTime dt = DateTime.Now;
            string sentsuccess = Send(useremail, message);;
            bool retval = false;
            try
            {
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader;
                    string sql = "insert into Notifications  values ('[TYPE]', '[DATE]', '[USERID]', '[MESSAGE]', '[SENT]');";
                    sql = sql.Replace("[DATE]", dt.ToShortDateString() + " " + dt.ToLongTimeString());
                    sql = sql.Replace("[USERID]", useremail);
                    sql = sql.Replace("[MESSAGE]", message);
                    sql = sql.Replace("[SENT]", sentsuccess.ToString());
                    sql = sql.Replace("[TYPE]", type);
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    if (reader.RecordsAffected > 0)
                    {
                        retval = true;
                    }
                    cmd.Dispose();
                    reader.Dispose();
                }
            }
            catch (SqlException ex)
            {
                string err = ex.Message;
            }
            finally
            {
                conn.Close();
            }
            return retval;
        }
        
        /// <summary>
        /// gets all aplicators
        /// </summary>
        /// <returns></returns>
        public ArrayList GetAllApplicators()
        {
            ArrayList applicators = new ArrayList();
            SqlConnection conn = null;
            DateTime dt = DateTime.Now;
            try
            {
            
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader;
                    string sql = "select * from user_details where preferences != 'none'";
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    string email = "";
                    while (reader.Read() && reader.HasRows)
                    {
                        ConsoleApplication2.conflictSVC.user auser = new ConsoleApplication2.conflictSVC.user();
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
                            auser.phone1 = reader.GetString(9);
                        }
                        if (!reader.IsDBNull(10))
                        {
                            auser.phone2 = reader.GetString(10);
                        }
                        if (!reader.IsDBNull(13))
                        {
                            auser.activated = reader.GetBoolean(13);////////here
                        }
                        if (!reader.IsDBNull(14))
                        {
                            auser.preferences = reader.GetString(14);
                        }
                        if (!reader.IsDBNull(15))
                        {
                            auser.prefoptions = reader.GetString(15);
                        }
                        applicators.Add(auser);
                     
                        
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
        
            return applicators;
       }
        
        public ArrayList GetAllNewCrops()
        {
            ArrayList newcrops = new ArrayList();
            SqlConnection conn = null;
            DateTime dateto = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
            DateTime datefrom = dateto - new TimeSpan(1,0,0,0);
            long cropid = -1;
            try
            {
                conn = new SqlConnection(connection);
                conn.Open();
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    SqlCommand cmd = null;
                    SqlDataReader reader;
                    string sql = "select * from producer_locations where modifieddate > '[DATEFROM]' and modifieddate <= '[DATETO]' AND deleted = 0";
                    sql = sql.Replace("[DATEFROM]", datefrom.ToShortDateString());
                    sql = sql.Replace("[DATETO]", dateto.ToShortDateString());
                    cmd = new SqlCommand(sql, conn);
                    reader = cmd.ExecuteReader();
                    while (reader.Read() && reader.HasRows)
                    {
                        if (!reader.IsDBNull(14))
                            {
                                cropid= (long)reader.GetDecimal(14);
                                newcrops.Add(cropid);
                                
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
        
            return newcrops;
     }
        public string Send(string email, string body)
        {
            
            string confMsg = null;
            //string hostMail = "kel.texas.sensitive.crops@gmail.com";
            //string hosUsr = "kel.texas.sensitive.crops";
            //string hostPwd = "tscr_kel_2012";
            string hostMail = "texascropregistry@gmail.com";
            string hosUsr = "texascropregistry";
            string hostPwd = "Regi$tryKEL";
            string hostSMTP = "smtp.gmail.com";//gmail smtp 
            string subject = "Texas Crop Registry Daily Notification";
            //string body = "";
            MailMessage mail = new MailMessage();
            mail.To.Add(email);
            mail.From = new MailAddress(hostMail);//pecanipmpipe temporary email account
            mail.Subject = subject;
            mail.Body = body;
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
        
}///end class

}


