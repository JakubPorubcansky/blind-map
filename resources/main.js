const numOfLevels = 3
const data = {"0" : {name: "name0", imgUrl: "resources/cinema0.jpg", longitude:-0.1279688, latitude:51.5077286},
              "1" : {name: "name1", imgUrl: "resources/cinema1.jpg", longitude:-0.1280000, latitude:51.5050000},
              "2" : {name: "name2", imgUrl: "resources/cinema2.jpg", longitude:-0.1290000, latitude:51.5060000},
              "3" : {name: "name3", imgUrl: "resources/cinema3.jpg", longitude:-0.1300000, latitude:51.5030000},
              "4" : {name: "name4", imgUrl: "resources/cinema4.jpg", longitude:-0.1310000, latitude:51.5032000}
}
const numOfCinemas = Object.keys(data).length
const centerLatLon = new OpenLayers.LonLat(data["0"].longitude, data["0"].latitude)

var totalPoints = 0;
var level = 0;
var zoom = 16;

///////////////////////

map = new OpenLayers.Map("mapdiv");
map.addLayer(new OpenLayers.Layer.OSM());

var markers = new OpenLayers.Layer.Markers("Markers");
map.addLayer(markers);

for(var key in data){
    var lonLat = new OpenLayers.LonLat(data[key].longitude, data[key].latitude)
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );
    var marker = new OpenLayers.Marker(lonLat, new OpenLayers.Icon('resources/marker_inactive.png', new OpenLayers.Size(50,50)));
    marker.id = key;
    marker.events.register("mousedown", marker, function() {
        markerOnClick(this.id);
    });
    marker.events.register("mouseover", marker, function() {
        this.inflate(1.1)
    });
    marker.events.register("mouseout", marker, function() {
        this.inflate(0.9)
    });
    markers.addMarker(marker);
}

var center = centerLatLon
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );

map.setCenter(center, zoom);

//////////////////////////////////////////////////////////////////////////////////

const startButton = document.getElementById('startButton');
const exitButton = document.getElementById('exitButton');
const confirmButton = document.getElementById('confirmButton');
const nextButton = document.getElementById('nextButton');
const startPage = document.getElementById('startPage');
const quizPage = document.getElementById('quizPage');
const textSelection = document.getElementById('textSelection');
const questionResult = document.getElementById('questionResult');
const questionId = document.getElementById('questionId');
const inputNickname = document.getElementById("inputNickname")

startButton.addEventListener('click', (event) => {
    startPage.style.display = 'none';
    quizPage.style.display = 'block';
    nickname = inputNickname.value

    console.log(nickname)

    get_levels()
    update_question()

    level ++;
});

exitButton.addEventListener('click', (event) => {
    startPage.style.display = 'block';
    quizPage.style.display = 'none';
    confirmButton.style.display = 'inline-block';
    nickname = "";
    level = 0;
    confirmButton.disabled = true;
    textSelection.innerHTML = '';
    inputNickname.value = '';

    init_center();
    redraw_markers('all');
});

confirmButton.addEventListener('click', (event) => {
    confirmButton.style.display = 'none';
    nextButton.style.display = 'inline-block'
    textSelection.innerHTML = '';

    make_result();
    init_center();

    questionResult.innerHTML = success ? 'Success!' : 'FAIL :('
});

nextButton.addEventListener('click', (event) => {
    confirmButton.style.display = 'inline-block';
    nextButton.style.display = 'none'
    questionResult.innerHTML = ''

    redraw_markers('some');
    update_question();
    level ++;
});
