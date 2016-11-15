// overlay.js//
//Creates overlays for different uses//

var HelpOverlay = function(parent, parentID) {
    var _parentID = parentID;
    var divIDsArr = new Array();

    this.Create = function() {
        var defaultOverlay = parent.getElementById('overlay');
        if (!defaultOverlay) {
            //alert(parent);
            var defaultOverlay = parent.createElement('div');
            defaultOverlay.setAttribute('id', 'overlay');
            defaultOverlay.setAttribute('class', 'overlay');

            var closeoverlay = parent.createElement('div')
            closeoverlay.setAttribute('id', 'closeoverlay');
            closeoverlay.setAttribute('class', 'closeoverlay');

            var closebutton = parent.createElement('a');
            closebutton.setAttribute('id', 'boxclose');
            closebutton.setAttribute('class', 'boxclose');
            closebutton.setAttribute('onclick', 'Javascript:CloseHelpOverlay();');
            closebutton.innerHTML = "bt";

            closeoverlay.appendChild(closebutton);
            defaultOverlay.appendChild(closeoverlay);
            //parent.body.appendChild(closeoverlay);

            var imagesDiv = parent.createElement('div');
            imagesDiv.setAttribute('id', 'imagesoverlay');

            switch (_parentID) {
                case 1: //home page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'imgoverlay');
                        img.setAttribute('class', 'imgoverlay');
                        imagesDiv.appendChild(img);
                    }
                    break;
                case 2: //register page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box1');
                        img.setAttribute('class', 'box1');
                        img.setAttribute('src', 'images/register_box1.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box2');
                        img.setAttribute('class', 'box2');
                        img.setAttribute('src', 'images/register_box2.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box3');
                        img.setAttribute('class', 'box3');
                        img.setAttribute('src', 'images/register_box3.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer');
                        img.setAttribute('class', 'pointer');
                        img.setAttribute('src', 'images/register_pointer.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                    }
                    break;
                case 3: //producer main page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box1');
                        img.setAttribute('class', 'box1');
                        img.setAttribute('src', 'images/producer_box1.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer1');
                        img.setAttribute('class', 'pointer1');
                        img.setAttribute('src', 'images/producer_pointer1.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box2');
                        img.setAttribute('class', 'box2');
                        img.setAttribute('src', 'images/producer_box2.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer2');
                        img.setAttribute('class', 'pointer2');
                        img.setAttribute('src', 'images/producer_pointer2.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box3');
                        img.setAttribute('class', 'box3');
                        img.setAttribute('src', 'images/producer_box3.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer3');
                        img.setAttribute('class', 'pointer3');
                        img.setAttribute('src', 'images/producer_pointer3.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        
                    }
                    break;
                case 4: //producer new crop page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box1');
                        img.setAttribute('class', 'box1');
                        img.setAttribute('src', 'images/producer_add_box1.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box2');
                        img.setAttribute('class', 'box2');
                        img.setAttribute('src', 'images/producer_add_box2.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer1');
                        img.setAttribute('class', 'pointer1');
                        img.setAttribute('src', 'images/producer_add_pointer1.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box3');
                        img.setAttribute('class', 'box3');
                        img.setAttribute('src', 'images/producer_add_box3.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box4');
                        img.setAttribute('class', 'box4');
                        img.setAttribute('src', 'images/producer_add_box4.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer2');
                        img.setAttribute('class', 'pointer2');
                        img.setAttribute('src', 'images/producer_add_pointer2.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box5');
                        img.setAttribute('class', 'box5');
                        img.setAttribute('src', 'images/producer_add_box5.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer3');
                        img.setAttribute('class', 'pointer3');
                        img.setAttribute('src', 'images/producer_add_pointer3.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                    }
                    break;
                case 5: //applicator main page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box1');
                        img.setAttribute('class', 'box1');
                        img.setAttribute('src', 'images/applicator_box1.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer1');
                        img.setAttribute('class', 'pointer1');
                        img.setAttribute('src', 'images/applicator_pointer1.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box2');
                        img.setAttribute('class', 'box2');
                        img.setAttribute('src', 'images/applicator_box2.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer2');
                        img.setAttribute('class', 'pointer2');
                        img.setAttribute('src', 'images/applicator_pointer2.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box3');
                        img.setAttribute('class', 'box3');
                        img.setAttribute('src', 'images/applicator_box3.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer3');
                        img.setAttribute('class', 'pointer3');
                        img.setAttribute('src', 'images/applicator_pointer3.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box4');
                        img.setAttribute('class', 'box4');
                        img.setAttribute('src', 'images/applicator_box4.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer4');
                        img.setAttribute('class', 'pointer4');
                        img.setAttribute('src', 'images/applicator_pointer4.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box5');
                        img.setAttribute('class', 'box5');
                        img.setAttribute('src', 'images/applicator_box5.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer5');
                        img.setAttribute('class', 'pointer5');
                        img.setAttribute('src', 'images/applicator_pointer5.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box6');
                        img.setAttribute('class', 'box6');
                        img.setAttribute('src', 'images/applicator_box6.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer6');
                        img.setAttribute('class', 'pointer6');
                        img.setAttribute('src', 'images/applicator_pointer6.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                    }
                    break;
                case 6: //aplicator new area page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box1');
                        img.setAttribute('class', 'box1');
                        img.setAttribute('src', 'images/applicator_add_box1.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box2');
                        img.setAttribute('class', 'box2');
                        img.setAttribute('src', 'images/applicator_add_box2.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer1');
                        img.setAttribute('class', 'pointer1');
                        img.setAttribute('src', 'images/applicator_add_pointer1.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box3');
                        img.setAttribute('class', 'box3');
                        img.setAttribute('src', 'images/applicator_add_box3.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box4');
                        img.setAttribute('class', 'box4');
                        img.setAttribute('src', 'images/applicator_add_box4.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer2');
                        img.setAttribute('class', 'pointer2');
                        img.setAttribute('src', 'images/applicator_add_pointer2.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box5');
                        img.setAttribute('class', 'box5');
                        img.setAttribute('src', 'images/applicator_add_box5.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer3');
                        img.setAttribute('class', 'pointer3');
                        img.setAttribute('src', 'images/applicator_add_pointer3.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                    }
                    break;
                case 7: //public map page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box1');
                        img.setAttribute('class', 'box1');
                        img.setAttribute('src', 'images/publicmap_box1.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer');
                        img.setAttribute('class', 'pointer');
                        img.setAttribute('src', 'images/publicmap_pointer.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box2');
                        img.setAttribute('class', 'box2');
                        img.setAttribute('src', 'images/publicmap_box2.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box3');
                        img.setAttribute('class', 'box3');
                        img.setAttribute('src', 'images/publicmap_box3.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer2');
                        img.setAttribute('class', 'pointer2');
                        img.setAttribute('src', 'images/publicmap_pointer2.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'box4');
                        img.setAttribute('class', 'box4');
                        img.setAttribute('src', 'images/publicmap_box4.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'pointer3');
                        img.setAttribute('class', 'pointer3');
                        img.setAttribute('src', 'images/publicmap_pointer3.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                    }
                    break;
                case 8: //public table page
                    {
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'tbox1');
                        img.setAttribute('class', 'tbox1');
                        img.setAttribute('src', 'images/publicmap_table_box1.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'tbox2');
                        img.setAttribute('class', 'tbox2');
                        img.setAttribute('src', 'images/publicmap_table_box2.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'tpointer');
                        img.setAttribute('class', 'tpointer');
                        img.setAttribute('src', 'images/publicmap_table_pointer.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'tbox3');
                        img.setAttribute('class', 'tbox3');
                        img.setAttribute('src', 'images/publicmap_table_box3.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'tpointer2');
                        img.setAttribute('class', 'tpointer2');
                        img.setAttribute('src', 'images/publicmap_table_pointer2.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                        
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'tbox4');
                        img.setAttribute('class', 'tbox4');
                        img.setAttribute('src', 'images/publicmap_table_box4.png');
                        img.setAttribute('alt', 'help description');
                        imagesDiv.appendChild(img);
                        
                        var img = parent.createElement('img');
                        img.setAttribute('id', 'tpointer3');
                        img.setAttribute('class', 'tpointer3');
                        img.setAttribute('src', 'images/publicmap_table_pointer3.png');
                        img.setAttribute('alt', 'highlight');
                        imagesDiv.appendChild(img);
                    }
                    break;
            }
        }
        //add default layer and images layer to the document body
        parent.body.appendChild(defaultOverlay);
        
        parent.body.appendChild(imagesDiv);
    }
} 
