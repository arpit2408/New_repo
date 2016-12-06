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

/// <summary>
/// Summary description for Class_Definitions
/// </summary>


public class user
{
    public string email = "";
    public string password = "";
    public string password2 = "";
    public string firstname = "";
    public string lastname = "";
    public string companyname = "";
    public string address = "";
    public string city = "";
    public string state = "";
    public string zip = "";
    public string website = "";
    public string phone1 = "";
    public string phone2 = "";
    //public string roles = "";
    public Boolean activated = false;
    public string preferences = "";
    public string prefoptions = "";
    
    
    public user()
    {

    }


}

public class AppArea
{
    public string id { get; set; }
    public string usremail { get; set; }
    public string appareaname { get; set; }
    public string county { get; set; }
    public string coordinates { get; set; }
    public string areacentroid { get; set; }
    public string buffercoords { get; set; }
    public string acres { get; set; }
    public string license { get; set; }
    public string pesticidename { get; set; }
    public string moddate { get; set; }
    public string comment { get; set; }
    
    public AppArea()
    {

    }
}
//public class CropLocations
//{
//    public string locationid = "";
//    public string email = "";
//    public string croptype = "";
//    public string cropyear = "";
//    public string comment = "";
//    public string county = "";
//    public string coordinates = "";
//    public string acres = "";
//    public string organiccrops = "";
//    public string certifier = "";
//    //public string firstName = "";
//    //public Boolean isRegistered = false;


//    public CropLocations()
//    {
//        //
//        // TODO: Add constructor logic here
//        //
//    }
//}

public class croplocation
{
    public string id = "";
    public string usremail = "";
    public string planttype = "";
    public string croptype = "";
    public string cropyear = "";
    public string comment = "";
    public string county = "";
    public string coordinates = "";
    public string loccentroid = "";
    public string acres = "";
    public string organiccrops = "";
    public string certifier = "";
    public string flagtype = "";
    //public string firstName = "";
    //public Boolean isRegistered = false;

     public croplocation()
    {
        //
        // TODO: Add constructor logic here
        //
    }
}

public class county
{
    public string name = "";
    public string coordinates = "";
    public string mapID = "";

    public county()
    {

    }
}

public class PointC
{
    public PointC(float latitude, float longitude)
    {
        Lat = latitude;
        Lon = longitude;
    }

    public float Lat { get; set; }

    public float Lon { get; set; }
}

public class PolygonC
{
    
    public ArrayList coordinates = new ArrayList();
    public PolygonC(string coords, string order)
    {
        
            coords = coords.Replace('[', ' ');
            coords = coords.Replace(']', ' ');
            string [] coordarr = coords.Split('\n');
            for (int x = 0; x < coordarr.Length-1; x++)
            {
                string[] latlon = coordarr[x].Split(',');
                if (latlon.Length == 2)
                {
                    if (order == "latlon")
                    {
                        PointC pt = new PointC(float.Parse(latlon[0]), float.Parse(latlon[1]));
                        coordinates.Add(pt);
                    }
                    else
                    {
                        PointC pt = new PointC(float.Parse(latlon[1]), float.Parse(latlon[0]));
                        coordinates.Add(pt);

                    }

                }
            }
        
    }
    public bool PointInside(PointC pt)
    {
        int   i, j=this.coordinates.Count-1 ;
        bool  oddNodes=false      ;
        double x, y;
        x = pt.Lon;
        y = pt.Lat;
        for (i=0; i<coordinates.Count; i++) 
        {
            PointC pti = (PointC)coordinates[i];
            PointC ptj = (PointC)coordinates[j];
            if ((pti.Lat < y && ptj.Lat >=y ||   ptj.Lat< y && pti.Lat>=y) &&  (pti.Lon<=x || ptj.Lon<=x)) 
            {
                //(pti.Lon+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x) 
                if (pti.Lon+(y-pti.Lat)/(ptj.Lat-pti.Lat)*(ptj.Lon-pti.Lon)<x) 
                {
                    oddNodes=!oddNodes; 
                }
            }
            j=i; 
        }

        return oddNodes; 
        


    }

}

public class conflictedcrop
{
    //public croplocation crop = new croplocation();
    public int cropid = 0;
    public float distance = 0;
    public int conflictflag = 0;
    public string appareaname = "";
    public conflictedcrop()
    {
    }

}

public class distancecomparer : System.Collections.Generic.IComparer<conflictedcrop>
{
   //public conflictedcrop distancecomparer(); 
    
       

    public int Compare(conflictedcrop x, conflictedcrop y)
    {
        conflictedcrop a = (conflictedcrop)x;
        conflictedcrop b = (conflictedcrop)y;

        if (a.conflictflag >= b.conflictflag)
        {

            if (a.distance < b.distance)
                return -1;
            else if (b.distance < a.distance)
                return 1;
            else
                return 0;

        }
        else if (b.conflictflag < a.conflictflag)
        {
            return -1;
        }
        else
            return 0;

    }

}
