var divClone = "";
var plant_arr = new Array("Field Crops", "Honeybees", "Vegetables", "Fruits and Nuts", "Greenhouse and Nursery", "Forage, Grassland");

var s_a1 = new Array();
s_a1[0] = "";
s_a1[1] = "Barley|Beans, dry|Biofuels, sorghums, switchgrass, oilseeds, etc.|Canola/rapeseed|Castor|Corn|Cotton|Guar|Millets|Mungbeans|Oats |Peanuts|Peas, dry|Rice|Rye|Safflower|Sesame|Sorghum|Soybeans|Sugarcane|Sugar beets|Sunflower|Wheat|Fallow";
s_a1[2] = "Bee-yard|Bee-pollination|Bee-honey foraging|Other";
s_a1[3] = "Amaranths,Chinesecabbage|Artichokes|Asparagus|Beans,|Beets|Broccoli|Brusselssprouts|Cabbage|Cantaloupes|Carrots|Cauliflower|Celeriac,celeryroot|Celery|Chickpeas|Chinesebeans|Chinesecabbage|Chineseokra|Chineseradish|Cilantro|Collards|Cucumbers|Edibleflowers|Ediblepoddedpeas|Ediblesoybeans|Eggplant|Escarole/Endive|Garlic|Ginger|Honeydewmelons|Horseradish|Jerusalemartichoke|Jicama|Kale|Kohrirabi|Leeks|Lentils|Lettuce|Melons,specialty|Mushrooms|Mustardgreens|Okra|Onions,dry|Onions,green|Parsley|Parsnip|Peas,Chinese-sugar|Peas,green|Peas,greensouthern,blackeyed,crowder,etc.|Peas,pigeon|Peppers,bell|Peppers,Jalapenoandother|Potatoes|Pumpkins|Radishes|Rhubarb|Rutabaga|Salisfy|Shallots|Spinach|Squash|Sweetcorn|Sweetpotatoes|Taro|Tomatoes|Tomatillos|Turnips|Watermelons|Other|Fallow";
s_a1[4] = "Almonds|Apples|Apricots|Avocados|Bananas|Blackberries/dewberries|Blueberries|Cherries|Chestnuts|Figs|Grapefruit|Grapes-wine(Vinifera)|Grapes-other|Guavas|Hazelnuts(Filberts)|Kumquats|Lemons|Limes|Mangoes|Nectarines|Olives|Oranges|Papayas|Peaches|Pears|Pecans|Persimmons|Pistachios|Plumes|Pomegranates|Raspberries|Strawberries|Tangelos|Tangerines|Walnuts|Other";
s_a1[5] = "Bedding plants|Container nursery|Flowering plants|Foliage plants|Turf/Sod|Vegetables-greenhouse|Other|Fallow";
s_a1[6] = "Alfalfa|Austrian winter pea|Bahia grass|Bermuda grass|Forage sorghum|Kline grass|Native grasses|Prairie hay|Ryegrass|Seed crops, field and grass |Small grain hay|Sorghum sudangrass|Other grass hay|Fallow";

function print_plant(plant_id) {
    // given the id of the <select> tag as function argument, it inserts <option> tags
    var option_str = document.getElementById(plant_id);
    option_str.length = 0;
    option_str.options[0] = new Option('Select Plant type', '');
    option_str.selectedIndex = 0;
    for (var i = 0; i < plant_arr.length; i++) {
        option_str.options[option_str.length] = new Option(plant_arr[i], plant_arr[i]);
    }
}

function print_crop(crop_id, plant_index) {
    //alert(crop_id + "_" + plant_index);
    var option_str = document.getElementById(crop_id);
    option_str.length = 0;
    option_str.options[0] = new Option('Select Crop', '');
    option_str.selectedIndex = 0;
    var crop_arr = s_a1[plant_index].split("|");
    for (var i = 0; i < crop_arr.length; i++) {
        option_str.options[option_str.length] = new Option(crop_arr[i], crop_arr[i]);
    }
    return crop_arr;
}

function convertmeterToAcres(meterArea)
{
    var areatoAcres = 0.000247105 * meterArea;
    return areatoAcres.toFixed(2);
}

function centeroid() {
    this.x = "";
    this.y = "";
}

function calccentroid(cordinateslist) {
    var bounds = new google.maps.LatLngBounds();
    var polygonCoords = [];
    for (var i = 0;i<cordinateslist.length;i++)
    {
        var coordinate=cordinateslist[i].split(",");
        polygonCoords.push(new google.maps.LatLng(coordinate[0], coordinate[1]));
    }

    for (i = 0; i < polygonCoords.length; i++) {
        bounds.extend(polygonCoords[i]);
    }

    // The Center of the Bermuda Triangle - (25.3939245, -72.473816)
    return bounds.getCenter();
}
$(document).ready(function () {
    $(function () {
        $('input[type="checkbox"]').on('change', function (e) {
            divClone = $("#trythis").clone();
            if (e.target.checked) {
                if (e.currentTarget.name == "flagoptions"){
                    $('#flagtechModal').modal('show');
                    $("#flagtechModal").draggable({ handle: ".modal-header" });
                }
            }
        });
    });
    //Very important for modal display edit and remove with caution
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    $(document).on('hidden.bs.modal', '.modal', function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });
});
function checkforflag(ele) {
    var atLeastOneIsChecked =  $('input:checkbox:checked').map(function() {
        return this.value;
    }).get();
    //$("input:checkbox").prop('checked', $(this).prop("checked"));
    $('#flagoptions').empty();
    $('#flagoptions').append(atLeastOneIsChecked);
    alert(atLeastOneIsChecked);
    var checkboxes = document.getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
    }
    var checkbox = document.getElementsByName('flagoptions');
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].checked = true;
    }
    $('#flagtechModal').modal('hide');
}
function buildvaluesforDropDown(planttype, croptype) {
    $('#plant').val(planttype);
    var plant_index = 0;
    for (var i = 0; i < plant_arr.length; i++) {
        if (planttype === plant_arr[i])
            plant_index = i + 1;
    }
    var croptypeValues = print_crop('crop', plant_index);
    var selectedIndex=0;
    for (var i = 0; i < croptypeValues.length; i++) {
        if (croptypeValues[i] === croptype)
            selectedIndex = i + 1;
    }
    var option_str = document.getElementById('crop');
    option_str.selectedIndex = selectedIndex;
}