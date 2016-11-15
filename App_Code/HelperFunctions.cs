using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Mail;

/// <summary>
/// Summary description for Class1
/// </summary>
/// 
public class Helper
{

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

    //NEGLECTED!...BUT WILL BE GOOD FOR DIFFERENT APPLICATION
    //public static bool pointInPolygon(PointF[] poly, PointF p)
    //{
    //    int i = 0;
    //    int j = poly.Length - 1;
    //    bool inPoly = false;

    //    for (i = 0; i < poly.Length; i++)
    //    {
    //        if (poly[i].X < p.X && poly[j].X >= p.X
    //            || poly[j].X < p.X && poly[i].X >= p.X)
    //        {
    //            if (poly[i].Y + (p.X - poly[i].X) /
    //              (poly[j].X - poly[i].X) * (poly[j].Y - poly[i].Y) < p.Y)
    //            {
    //                inPoly = !inPoly;
    //            }
    //        }
    //        j = i; 
    //    }

    //    return inPoly;
    //}

    //[System.Web.Services.WebMethod(EnableSession = true)]
    //public static string send(string email, string variable, string type)
    //{
    //    string confMsg = null;
    //    string url = "http://queen.tamu.edu/tsc_dev/Account.aspx?ACTIVATEACCOUNT";
    //    string urlmain = "http://queen.tamu.edu/tsc_dev/";
    //    //string hostMail = "kel.texas.sensitive.crops@gmail.com";
    //    //string hosUsr = "kel.texas.sensitive.crops";
    //    //string hostPwd = "tscr_kel_2012";
    //    string hostMail = "texascropregistry@gmail.com";
    //    string hosUsr = "texascropregistry";
    //    string hostPwd = "Regi$tryKEL";
    //    string hostSMTP = "smtp.gmail.com";//gmail smtp
 
    //    string subject = "Texas Crop Registry " + type + " information";
    //    string body1 = "Dear User,\n\n\n" +
    //                  "Thank you for registering with the Texas Crop Registry!.\n\n\n" +
    //                  "This email is automatically generated, please do not reply.\n\n\n\n" +
    //        //            "Welcome to PIDS. To complete your registration, please go to the registration page of the PIDS website, and change your automatic password:\n" +
    //        ////"Your user id: " + email + "\n\n" +
    //                                "Your one time only password is: " + variable + "\n\n\n\n" +
    //                                "To complete your registration, please go to the registration page of the Texas Crop Registry website, and change your automatic password: \n\n" + url + "\n\n\n\n" +
    //                                "If you have trouble using the previous link, you can go to the main page: \n\n" + urlmain + "\n\n\n\n" +
    //                                "and click on the 'Register' link, scroll to the bottom of the page and click the 'Change Password' link.\n\n\n\n" +
    //                                "Thanks for working with us!\n\n\n" +
    //                                "Texas Crop Registry Program";
    //    string body2 = "Texas Crop Registry Password recovery. This email is automatically generated, please do not reply.\n\n\n\n" +
    //                    "You have requested your password from Texas Crop Registry Program. Your current password is:\n" + variable + "\n\n\n\n" +
    //                    "As a security measure we encourage our users to change the password once you login." +
    //                    " To change your password just position the cursor over your user id(email), click on 'Edit Details' and 'Change Password' link.\n\n\n\n" +
    //                    "Thanks for working with us!\n\n\n" +
    //                    "Texas Crop Registry Registry Program";
    //    string body3 = "Dear User,\n\n\n" +
    //                    "Texas Crop Registry email notifications setup.\n\n\n" +
    //                    "This email is automatically generated, please do not reply.\n\n\n\n" +
    //                    "You made some recent changes to your profile preferences. You select to receive email notifications when a new  Crop is added to our database using the " + variable + " criteria.\n\n" +
    //                    "You can always modify your notifications by login into your account and specifying a new criteria.\n\n\n\n" +
    //                    "Thanks for working with us!\n\n\n" +
    //                    "Texas Crop Registry Program";
    //    MailMessage mail = new MailMessage();
    //    mail.To.Add(email);
    //    mail.From = new MailAddress(hostMail);//pecanipmpipe temporary email account
    //    mail.Subject = subject;
    //    if (type == "Registration") { mail.Body = body1; }
    //    else if (type == "Password") { mail.Body = body2; }
    //    else { mail.Body = body3; }
    //    SmtpClient smtp = new SmtpClient();
    //    NetworkCredential credentials = new NetworkCredential();

    //    try
    //    {
    //        //smtp.Host = ConfigurationManager.AppSettings["SMTP"];not working yet from Server email setup!
    //        credentials.UserName = hosUsr;
    //        credentials.Password = hostPwd;
    //        smtp.Host = hostSMTP;
    //        smtp.Port = 587;//It can be 25, so try both.
    //        smtp.Credentials = credentials;
    //        smtp.EnableSsl = true;
    //        smtp.Send(mail);
    //        confMsg = "sent";
    //    }
    //    catch (Exception err1)
    //    {
    //        confMsg = err1.Message.ToString();
    //    }
    //    finally
    //    {
    //        mail.Dispose();
    //    }
    //    return confMsg;
    //}
}

