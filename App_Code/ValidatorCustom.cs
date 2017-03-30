using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Web;

/// <summary>
/// Summary description for ValdiatorCustom
[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class ValidatorCustom
{
    public ValidatorCustom()
	{
		//
		// TODO: Add constructor logic here
		//
	}
    public static string validatefields(Object obj, List<String> listforuncheckvalues)
    {
        var fieldValues = obj.GetType()
                     .GetFields()
                     .Select(field => field.GetValue(obj))
                     .ToList();
        List<string> fieldNames=new List<string>();
        if(obj.GetType().ToString().Equals("croplocation")){
        fieldNames = typeof(croplocation).GetFields()
                            .Select(field => field.Name)
                            .ToList();
        }
        if(obj.GetType().ToString().Equals("user")){
            fieldNames = typeof(user).GetFields()
                            .Select(field => field.Name)
                            .ToList();
        }
        TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
        for (int i = 0; i < fieldValues.Count; i++)
        {
            if (!listforuncheckvalues.Contains(fieldNames.ElementAtOrDefault(i).ToString()))
            {
                bool flagforcheck = String.IsNullOrWhiteSpace((string)fieldValues.ElementAtOrDefault(i));
                if (flagforcheck)
                {
                    var field = textInfo.ToTitleCase(fieldNames.ElementAtOrDefault(i).ToString());
                    return field + " has incorrect value";
                }
            }
        }
        return null;
    }
}