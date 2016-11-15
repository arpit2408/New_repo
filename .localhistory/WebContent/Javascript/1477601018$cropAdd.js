var plant_arr = new Array("Field Crops", "Honeybees", "Vegetables", "Fruits and Nuts", "Greenhouse and Nursery", "Forage, Grassland");

var s_a = new Array();
s_a[0] = "";
s_a[1] = "Barley|Beans, dry|Biofuels, sorghums, switchgrass, oilseeds, etc.|Canola/rapeseed|Castor|Corn|Cotton|Guar|Millets|Mungbeans|Oats |Peanuts|Peas, dry|Rice|Rye|Safflower|Sesame|Sorghum|Soybeans|Sugarcane|Sugar beets|Sunflower|Wheat|Fallow";
s_a[2] = "Bee-yard|Bee-pollination|Bee-honey foraging|Other";
s_a[3] = "Amaranths,Chinesecabbage|Artichokes|Asparagus|Beans,|Beets|Broccoli|Brusselssprouts|Cabbage|Cantaloupes|Carrots|Cauliflower|Celeriac,celeryroot|Celery|Chickpeas|Chinesebeans|Chinesecabbage|Chineseokra|Chineseradish|Cilantro|Collards|Cucumbers|Edibleflowers|Ediblepoddedpeas|Ediblesoybeans|Eggplant|Escarole/Endive|Garlic|Ginger|Honeydewmelons|Horseradish|Jerusalemartichoke|Jicama|Kale|Kohrirabi|Leeks|Lentils|Lettuce|Melons,specialty|Mushrooms|Mustardgreens|Okra|Onions,dry|Onions,green|Parsley|Parsnip|Peas,Chinese-sugar|Peas,green|Peas,greensouthern,blackeyed,crowder,etc.|Peas,pigeon|Peppers,bell|Peppers,Jalapenoandother|Potatoes|Pumpkins|Radishes|Rhubarb|Rutabaga|Salisfy|Shallots|Spinach|Squash|Sweetcorn|Sweetpotatoes|Taro|Tomatoes|Tomatillos|Turnips|Watermelons|Other|Fallow";
s_a[4] = "Almonds|Apples|Apricots|Avocados|Bananas|Blackberries/dewberries|Blueberries|Cherries|Chestnuts|Figs|Grapefruit|Grapes-wine(Vinifera)|Grapes-other|Guavas|Hazelnuts(Filberts)|Kumquats|Lemons|Limes|Mangoes|Nectarines|Olives|Oranges|Papayas|Peaches|Pears|Pecans|Persimmons|Pistachios|Plumes|Pomegranates|Raspberries|Strawberries|Tangelos|Tangerines|Walnuts|Other";
s_a[5] = "Bedding plants|Container nursery|Flowering plants|Foliage plants|Turf/Sod|Vegetables-greenhouse|Other|Fallow";
s_a[6] = "Alfalfa|Austrian winter pea|Bahia grass|Bermuda grass|Forage sorghum|Kline grass|Native grasses|Prairie hay|Ryegrass|Seed crops, field and grass |Small grain hay|Sorghum sudangrass|Other grass hay|Fallow";

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
    var crop_arr = s_a[plant_index].split("|");
    for (var i = 0; i < city_arr.length; i++) {
        option_str.options[option_str.length] = new Option(crop_arr[i], crop_arr[i]);
    }
}