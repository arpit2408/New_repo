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

[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class Login
{
	// Add [WebGet] attribute to use HTTP GET
    [OperationContract]
    [WebGet()]
    public string[] Logoff()
    {
        string[] retval = new string[2];
        retval[0] = "0";
        retval[1] = "Logoff Failed";
        user auser = (user)HttpContext.Current.Session["user"];
        //shalini tharavanat 
        //creating event
        if(auser != null)
        {
        EventLog event1 = new EventLog();
        //inserting event in DB
        event1.InsertSuccessfullLogoff(auser.email);
        HttpContext.Current.Session.Clear();



        retval[0] = "1";
        retval[1] = "Logoff Success";
        }
            
       
        return retval;
    }
   
    [OperationContract]
    [WebGet()]
    public string[] Authenticate(string id, string pwd)
    {
        string[] retval = new string[3];
        retval[0] = "0";
        retval[1] = "Authentication Failed";
        retval[2] = "";
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];//@"Data Source = 128.194.196.150\SQLEXPRESS;Initial Catalog=TXSCrops;Integrated Security=false;User ID=aspnet;Password=kelab";
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "select password, salt, valid_flag from user_validation where email = '[EMAIL]'"; // string sql = "select password, salt from test_table where Username = '[ID]'";
                sql = sql.Replace("[EMAIL]", id);//
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                string authpwd = "";
                string salt = "";
                //int valid_flag = 0;
                bool isactivate = false;
                string[] checkHash = new string[2];
                checkHash[0] = "0";

                while (reader.Read())
                {
                    authpwd = reader.GetString(0);
                    salt = reader.GetString(1);
                    isactivate = reader.GetBoolean(2); 
                    
                    //valid_flag = 1;

                }
              //  string pwd = obj.pwd;
                byte[] saltbytes = Convert.FromBase64String(salt);
                checkHash = Hashfunction(pwd, saltbytes);
                if (checkHash[0] != authpwd)//
                {
                    retval[1] = "Authentication Failed: Username/Password mismatch";

                    //shalini tharavanat 
                    //creating event
                    EventLog event1 = new EventLog();
                    //inserting event in DB
                    event1.InsertFailedLoginEvent(id, pwd);

                }
                else
                {
                    if (isactivate)//valid_flag == 1
                    {
                        retval[0] = "1";//
                        retval[1] = retrieveAccessToken(id);
                        retval[2] = GetUserDetails(id)[1];//
                        ///////now put object in session
                        if (retval[2] != "")
                        {
                            user usr = JsonConvert.DeserializeObject<user>(retval[2]);
                            
                            
                            //shalini tharavanat 
                            //creating event
                            //EventLog event1 = new EventLog();
                            ////inserting event in DB
                            //event1.InsertSuccessfullLoginEvent(id);

                        }
                    }
                    else
                    {
                        retval[1] = "Inactive Account: Please change your one time password!";
                    }
                    
                    
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
    public string[] AuthenticateCookie(string id, string pwd)
    {
        string[] retval = new string[3];
        retval[0] = "0";
        retval[1] = "Authentication Failed";
        retval[2] = "";
        SqlConnection conn = null;
        try
        {
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];//@"Data Source = 128.194.196.150\SQLEXPRESS;Initial Catalog=TXSCrops;Integrated Security=false;User ID=aspnet;Password=kelab";
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {

                string sql = "select accesscode from user_validation where email = '[EMAIL]'"; // string sql = "select password, salt from test_table where Username = '[ID]'";
                sql = sql.Replace("[EMAIL]", id);//
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader;
                reader = cmd.ExecuteReader();
                string currentcookie = "";
              //  string salt = "";
                while (reader.Read())
                {
                    currentcookie = reader.GetString(0);
               //     salt = reader.GetString(1);
                 //   isactivate = reader.GetBoolean(2);

                    //valid_flag = 1;

                }
                if (currentcookie == pwd)
                {
                    retval[0] = "1";
                    retval[1] = "Authentication Successful";
                    retval[2] = GetUserDetails(id)[1];//
                    ///////now put object in session
                    if (retval[2] != "")
                    {
                        user usr = JsonConvert.DeserializeObject<user>(retval[2]);
                    }
                    //EventLog event1 = new EventLog();
                    ////inserting event in DB
                    //event1.InsertSuccessfullLoginEvent(id);
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
    public string retrieveAccessToken(string email)
    {
        string retval = "False";

        SqlConnection conn = null;
        try
        {
            //string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            string connection = System.Configuration.ConfigurationManager.AppSettings["connection_string"];
            conn = new SqlConnection(connection);
            conn.Open();
            if (conn.State == System.Data.ConnectionState.Open)
            {
                SqlCommand cmd = null;
                SqlDataReader reader = null;
                //    SqlDataReader reader = null;
                string sql = "select  Accesscode from user_validation where email = '[Username]'";
                sql = sql.Replace("[Username]", email);
                cmd = new SqlCommand(sql, conn);
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {

                    try
                    {
                        if (!reader.IsDBNull(0))
                        {
                            retval = reader.GetString(0);
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
        return retval;
    }

    [OperationContract]
    [WebGet()]
    public string[] CheckLogin()
    {
        //HttpContext.Current.Session["dummy"] = 0;
        string[] retval = new string[3];
        retval[2] = HttpContext.Current.Session.SessionID.ToString();
        retval[1] = "";
        retval[0] = "0";

        if (HttpContext.Current.Session.Count > 2)
        {
            user auser = (user)HttpContext.Current.Session["user"];
            retval[1] = JsonConvert.SerializeObject(auser);
            retval[0] = "1";
        }
        
        return retval;
    }
    [OperationContract]
    [WebGet()]
    public string [] GetUserDetails(string id)
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
                    retval[0] = "1";
                }
                HttpContext.Current.Session["loggedon"] = 1;
                HttpContext.Current.Session["user"] = auser;
                
               
                /////////////////////////////////
                retval[1] = JsonConvert.SerializeObject(auser); 
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

  

    //-----------------------Rama Changes end -------------------------------

    //// Add more operations here and mark them with [OperationContract]
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


    //// -----------------------------Rama Changes end---------------------------------------------------
    ////---------------------------------------------------------------------------------------------------------

   
}
