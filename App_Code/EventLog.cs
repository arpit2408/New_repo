using System;
using System.Collections;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.Text;
using System.Data.SqlClient;
using System.Drawing;
using System.Net;
using System.Net.Mail;
using System;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections;
using System.Xml;
using System.IO;
using System.Web;
using System.Security.Cryptography;
using System.Text;

/// <summary>
/// All event notification functions
/// </summary>

public class EventLog
{
    string eventcode;
    String email;
    String ipAddress;
    String extraInfo;

    public EventLog()
    {
        this.eventcode = "DEFAULTCODE";
        this.email = "DEFAULTEMAIL";
        this.ipAddress = "DEFAULTipaddress";
        this.extraInfo = "DEFAULTextrainfo";
    }

    public bool setIPAddressandEmail()
    {
    try
        {
            this.ipAddress= (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null) ? HttpContext.Current.Request.UserHostAddress : HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            this.email = ((user)HttpContext.Current.Session["user"]).email;
        }
        catch 
        {
            return false;
        }
        return true;
    }
    public bool InsertChangeDetails(string email)
    {
        bool execution = true;
        this.extraInfo = email;
        this.eventcode = "CHANGED_DETAILS";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertFailedChangeDetails(string email, string details)
    {
        bool execution = true;
        this.extraInfo = email + ", " + details;
        this.eventcode = "CHANGED_DETAILS_FAIL";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertPasswordFail(string email, string details)
    {
        bool execution = true;
        this.extraInfo = email + "," + details;
        this.eventcode = "SENT_PASSWORD";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertSendPasswordSuccess(string email)
    {
        bool execution = true;
        this.extraInfo = email;
        this.eventcode = "SENT_PASSWORD";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertChangePasswordSuccess(string email)
    {
        bool execution = true;
        this.extraInfo = email;
        this.eventcode = "CHANGED_PASSWORD";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertRequestChangePassword(string email)
    {
        bool execution = true;
        this.extraInfo = email;
        this.eventcode = "REQUEST_PASSWORDCHANGE";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertRequestSendPassword(string email)
    {
        bool execution = true;
        this.extraInfo = email;
        this.eventcode = "REQUEST_PASSWORDSEND";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertPageVisitEvent(string pageName)
    {
        bool execution = true;
        this.extraInfo=pageName;
        this.eventcode = "PAGE_VISIT";
        execution=this.setIPAddressandEmail();
        execution =this.InsertEvent();
        return execution;
    }
    public bool InsertSuccessfullLoginEvent(string user)
    {
        bool execution = true;
        this.extraInfo = user;
        this.eventcode = "SUCCESSFULL_LOGIN";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }

    public bool InsertFailedLoginEvent(string username,string password)
    {
        bool execution = true;
        this.extraInfo = "username->"+username+": password->"+password;
        this.eventcode = "FAILED LOGIN";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertSuccessfullLogoff(string username)
    {
        bool execution = true;
        this.extraInfo = username;
        this.eventcode = "SUCCESSFULL LOGOFF";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertChangeCrop(string user)
    {
        bool execution = true;
        this.extraInfo = user;
        this.eventcode = "ADD_CROP";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertAddCrop(string ID)
    {
        bool execution = true;
        this.extraInfo = ID;
        this.eventcode = "ADD_CROP";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertEditCrop(string ID)
    {
        bool execution = true;
        this.extraInfo = ID;
        this.eventcode = "EDIT_CROP";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertAddAppArea(string user)
    {
        bool execution = true;
        this.extraInfo = user;
        this.eventcode = "ADD_APPAREA";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertEditAppArea(string user)
    {
        bool execution = true;
        this.extraInfo = user;
        this.eventcode = "EDIT_APPAREA";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }
    public bool InsertDeleteAppArea(string user)
    {
        bool execution = true;
        this.extraInfo = user;
        this.eventcode = "ADD_APPAREA";
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }

    public bool InsertConflictEvent(string username, string extrainfo)
    {
        bool execution = true;
        this.eventcode = "CHECK_CONFLICT";
        this.extraInfo = extrainfo;
        execution = this.setIPAddressandEmail();
        execution = this.InsertEvent();
        return execution;
    }

    public bool InsertEvent()
    {
        DateTime date = new DateTime();
        date = DateTime.Now;
        SqlConnection conn1 = null;

        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn1 = new SqlConnection(connection);
            conn1.Open();
            if (conn1.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader;
                string sql = "INSERT INTO Event_Log (eventCode, email, IPAddress, eventdate, extraInfo) ";
                sql += "VALUES ('[EVENTCODE]', '[EMAIL]', '[IPADDRESS]', '[DATE1]', '[EXTRAINFO]');";
                sql = sql.Replace("[EVENTCODE]", this.eventcode);
                sql = sql.Replace("[EMAIL]", this.email);
                sql = sql.Replace("[IPADDRESS]", this.ipAddress);
                sql = sql.Replace("[EXTRAINFO]", this.extraInfo);
                sql = sql.Replace("[DATE1]", date.ToString());
    
                cmd = new SqlCommand(sql, conn1);
                reader = cmd.ExecuteReader();

                //Change return value to boolean
                if (reader.RecordsAffected == 1)
                {
                    return true;

                }
                else
                {
                    return false;
                }
                cmd.Dispose();
                reader.Dispose();
                
            }
        }
        catch  (Exception e)
        {
            return false;
        }
        finally
        {
            conn1.Close();
        }
        return true;
    }// end of InsertEvent




   
}//end of class