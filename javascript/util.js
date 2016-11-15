//Switch Soil Webservice Type (point, polygon, Rectangle)
function GetMenu(val) {
    var frame = getElement("contentIframe");
    var frameDoc = getIFrameDocument("contentIframe");
    var vSrc = val + ".aspx";
    /*
    if (val == "Home")
        vSrc = "Home.aspx";
    else if (val == 2)
        vSrc = "Map_Rec.aspx";
    else
        vSrc = "Map_Poly.aspx";
        */
    frame.src = vSrc;
}
//Iframe utility function for broswer compatibility
function getElement(aID) 
{
    return (document.getElementById) ? document.getElementById(aID) : document.all[aID];
}

function adjustFrameHeight() {
    //closeProgressIndicator();
    var frame = getElement("contentIframe");
    var frameDoc = getIFrameDocument("contentIframe");
    frame.height = frameDoc.body.offsetHeight;
}
function getIFrameDocument(aID) {
    var rv = null;
    var frame = getElement(aID);
    // if contentDocument exists, W3C  compliant(e.g.Mozilla)
    if (frame.contentDocument)
        rv = frame.contentDocument;
    else // bad Internet Explorer  ;)
        rv = document.frames[aID].document;
    return rv;
}
function getIFrameContent() {
    var elc = null;
    var el = document.getElementById('contentIframe');
    if (el.contentWindow) {
        //el.contentWindow.targetFunction(); 
        elc = el.contentWindow;
    }
    else if (el.contentDocument) {
        //el.contentDocument.targetFunction(); 
        elc = el.contentDocument;
    }
    return elc;
}




