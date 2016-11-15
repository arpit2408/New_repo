var plant_arr = new Array();

var s_a = new Array();
s_a[0] = "";
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
    var option_str = document.getElementById(crop_id);
    option_str.length = 0;
    option_str.options[0] = new Option('Select Crop', '');
    option_str.selectedIndex = 0;
    var city_arr = s_a[state_index].split("|");
    for (var i = 0; i < city_arr.length; i++) {
        option_str.options[option_str.length] = new Option(city_arr[i], city_arr[i]);
    }
}