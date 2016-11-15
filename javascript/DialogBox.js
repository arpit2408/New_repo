function DialogBox() {
    this.message = "";
    this.timer = 1000;
    this.styleoverlay = "background-color: black;opacity: 0.4;filter: alpha(opacity=40);position: absolute; top: 0; left: 0;width: 600px; height: 800px;z-index: 100000;";
    this.styledlg = "background-color: white;position: absolute; top: 0; left: 0;z-index: 100;vertical-align: middle;text-align: centre; border:solid 2px black;padding: 10px; z-index: 1000001";
    this.message = "Loading....";
    this.timeoutevent = 0;
}
DialogBox.prototype.CloseDialog = function (timer) {
    clearTimeout(this.timeoutevent);
    if (!timer) {
        var obj = this.CloseDialog.bind(this, true);
       this.timeoutevent = setTimeout(obj, this.timer);
       return;
    }
    
    var el = document.getElementById('dialogbox');
    if (el) {
        document.body.removeChild(el);
    }
    el = document.getElementById('dialogboxoverlay');
    if (el) {
        document.body.removeChild(el);
    }
    


}

DialogBox.prototype.CreateDialog = function(timer) {
   
    overlay = document.createElement('div');
    overlay.setAttribute('style', this.styleoverlay);
    overlay.setAttribute('id', 'dialogboxoverlay');
    var el = document.createElement('div');
    el.setAttribute('id', 'dialogbox');
    el.setAttribute('style', this.styledlg);
    var dlgwidth = 300;
    var dlgheight = 200;
    /////////place it in the midle of the page
    var tlx = (document.body.clientWidth/2)-(dlgwidth/2);
    var tly = (document.body.clientHeight/2)-(dlgheight/2);
    el.style.left = tlx + "px"
    el.style.top = tly + 'px';
    el.style.height = dlgheight + "px";
    el.style.width = dlgwidth + "px";
    //el.innerHTML = this.message;
    overlay.style.left = 0 + "px"
    overlay.style.top = 0 + 'px';
    overlay.style.width = document.body.clientWidth + "px";
    overlay.style.height = document.body.clientWidth + "px";
    document.body.appendChild(overlay);
    var div = document.createElement('table');
    div.setAttribute('style',  'width: 100%; height: 100%;font-size: 14px; text-align: center; vertical-align: middle; border: black: 1px;');
    var row = document.createElement('tr');
    var col = document.createElement('td');
    div.appendChild(row);
    row.appendChild(col);
    ///div.appendChild(row);
    col.setAttribute('style', 'font-size: 14px; text-align: center; vertical-align: middle; border: black: 1px;');
    col.innerHTML = this.message;
    el.appendChild(div);
    document.body.appendChild(el);
    if (timer) {
       
        var obj = this.CloseDialog.bind(this);
        this.timeoutevent = setTimeout(obj, timer);
    }
}