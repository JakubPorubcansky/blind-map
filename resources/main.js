const numOfLevels = 1
const data = {"0" : {name: "name0", imgUrl: "resources/img/cinema0.jpg", longitude:17.1118991, latitude:48.150789, otherNames: ["a", "b", "c"]},
              "1" : {name: "name1", imgUrl: "resources/img/cinema1.jpg", longitude:-0.1280000, latitude:51.5050000, otherNames: ["a", "b", "c"]},
              "2" : {name: "name2", imgUrl: "resources/img/cinema2.jpg", longitude:-0.1290000, latitude:51.5060000, otherNames: ["a", "b", "c"]},
              "3" : {name: "name3", imgUrl: "resources/img/cinema3.jpg", longitude:-0.1300000, latitude:51.5030000, otherNames: ["a", "b", "c"]},
              "4" : {name: "name4", imgUrl: "resources/img/cinema4.jpg", longitude:-0.1310000, latitude:51.5032000, otherNames: ["a", "b", "c"]}
}
const numOfCinemas = Object.keys(data).length
const centerLatLon = new OpenLayers.LonLat(data["0"].longitude, data["0"].latitude)
const displayStates = {0:'start', 1:'question', 2:'result', 3:'total'}
const markerStates = {0:'without', 1:'true', 2:'false'}

var totalPoints = 0;
var level = 0;
var zoom = 16;
var display = displayStates[0]

///////////////////////

var fromProjection = new OpenLayers.Projection("EPSG:4326"); // transform from WGS 1984
var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
var extent = new OpenLayers.Bounds( -0.1315, 51.5029000, -0.1272688, 51.5079286).transform(fromProjection, toProjection);
var options = {restrictedExtent: extent};

map = new OpenLayers.Map("mapdiv", options);

stamenLayer = new OpenLayers.Layer.Stamen("toner");
map.addLayer(stamenLayer)

// map.addLayer(new OpenLayers.Layer.OSM.Hot("Hot"));

// map.addLayer(new OpenLayers.Layer.OSM("NewLayer", "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"))
    // {zoomOffset: 13, resolutions: [19.1092570678711,9.55462853393555,4.77731426696777,2.38865713348389]}));

var markers = new OpenLayers.Layer.Markers("Markers");
map.addLayer(markers);

for(var key in data){
    var lonLat = new OpenLayers.LonLat(data[key].longitude, data[key].latitude)
    .transform(
        fromProjection,
        toProjection
    );
    var marker = new OpenLayers.Marker(lonLat, new OpenLayers.Icon('resources/img/marker_inactive.png', new OpenLayers.Size(50,50)));
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
        fromProjection,
        toProjection
    );

map.setCenter(center, zoom);
// map.zoomToExtent(extent);

//////////////////////////////////////////////////////////////////////////////////

const startButton = document.getElementById('startButton');
const exitButton = document.getElementById('exitButton');
const confirmButton = document.getElementById('confirmButton');
const nextButton = document.getElementById('nextButton');
const backButton = document.getElementById('backButton');
const startPage = document.getElementById('startPage');
const quizPage = document.getElementById('quizPage');
const endPage = document.getElementById('endPage');
const endImg = document.getElementById('endImg');
const endInfo = document.getElementById('endInfo');
const questionResult = document.getElementById('questionResult');
const questionId = document.getElementById('questionId');
const totalResultText = document.getElementById('totalResultText');
const inputNickname = document.getElementById("inputLGEx")
const table = document.getElementById("myTable").getElementsByTagName("tbody")[0];

startButton.addEventListener('click', (event) => {
    display = displayStates[1]

    startPage.style.display = 'none';
    quizPage.style.display = 'block';
    confirmButton.style.display = 'inline-block';
    confirmButton.disabled = true;
    nextButton.style.display = 'none'
    questionResult.innerHTML = ''
    exitButton.style.visibility = "visible";

    nickname = inputNickname.value

    get_levels()
    update_question()

    level ++;
});

exitButton.addEventListener('click', (event) => {
    display = displayStates[0]

    startPage.style.display = 'block';
    quizPage.style.display = 'none';
    endPage.style.display = 'none';
    exitButton.style.visibility = "hidden";
    endInfo.innerHTML = ''
    endImg.src = ""
    
    level = 0;

    inputNickname.value = '';

    init_center();
    redraw_markers('all');
});

confirmButton.addEventListener('click', (event) => {
    display = displayStates[2]

    confirmButton.style.display = 'none';
    nextButton.style.display = 'inline-block'

    make_result();
    init_center();
});

nextButton.addEventListener('click', (event) => {
    if (cinemaOrder.length == level)
    {
        display = displayStates[3]

        quizPage.style.display = 'none';
        endPage.style.display = 'block';

        total_res = get_total_result()
        totalResultText.innerHTML = 'Congratulations '.concat(inputNickname.value).concat('. Your result: ')
            .concat(total_res.toString()).concat()
        totalResultText.innerHTML = 'Congratulations '.concat(inputNickname.value, '. Your result: ', total_res.toString(),
            ' points out of ', numOfLevels, '.')

        var row = table.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);

        // cell0.innerHTML = table.getElementsByTagName("tr").length;
        // cell1.innerHTML = inputNickname.value;
        // cell2.innerHTML = total_res;

        redraw_markers('some');

        $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust();

        $('#myTable').DataTable().row.add([
            table.getElementsByTagName("tr").length,
            inputNickname.value,
            total_res
        ]).draw(false);
    }
    else
    {
        display = displayStates[1]

        confirmButton.style.display = 'inline-block';
        confirmButton.disabled = true;
        nextButton.style.display = 'none'
        questionResult.innerHTML = ''

        redraw_markers('some');
        update_question();
        level ++;
    }
});

backButton.addEventListener('click', (event) => {
    exitButton.click()
});


$(document).ready(function () {
$('#myTable').DataTable(
    {
        // scrollY:        "200px",
scrollCollapse: true,
paging:         false,
scrollX: "100%",
searching: false,
info:false
    }
);
$('.dataTables_length').addClass('bs-select');
});
