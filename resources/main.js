// const circ = document.querySelector('circle');
// const output = document.getElementById('output');
// const btn = document.querySelector('button');
// const toggle = document.querySelector('#togglefill');
// const img1 = document.getElementById('img1');


// const useEventType = (typeof window.PointerEvent === 'function') ? 'pointer' : 'mouse';
// const listeners = ['click','touchstart','touchend', 'touchmove',`${useEventType}enter`,`${useEventType}leave`, `${useEventType}move`];

// const pointerHandler = (event) => {
//   event.preventDefault();

//   const evtype = document.createTextNode(event.type + "\n");
//   output.appendChild(evtype);
// }

// listeners.map((etype) => {
//    circ.addEventListener(etype, pointerHandler);
// });

// btn.addEventListener('click', (event) => {
//   output.innerHTML = '';
// });

// toggle.addEventListener('change', (event) => {
//   event.target.checked ? circ.setAttribute('fill', '#D79CFD') : circ.setAttribute('fill', 'none');
// });

// img1.addEventListener('click', (event) => {
//     img1.setAttribute('display', 'none');
//   });

// var fromProjection = new OpenLayers.Projection("EPSG:4326"); // transform from WGS 1984
// var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
// var extent = new OpenLayers.Bounds(-1.32,51.71,-1.18,51.80).transform(fromProjection,toProjection);

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

const numOfLevels = 3
const data = {"0" : {name: "name0", imgUrl: "resources/cinema0.jpg", longitude:-0.1279688, latitude:51.5077286}, 
            "1" : {name: "name1", imgUrl: "resources/cinema1.jpg", longitude:-0.1280000, latitude:51.5050000},
            "2" : {name: "name2", imgUrl: "resources/cinema2.jpg", longitude:-0.1290000, latitude:51.5060000}
}
const numOfCinemas = Object.keys(data).length

function markerOnClick(id) {
    id_int = parseInt(id)

    if(level > 0)
    {   
        confirmButton.disabled = false;
        textSelection.innerHTML = "You have selected ".concat(data[id].name).concat(" cinema")

        map.layers[1].markers[id_int].icon.setUrl("resources/marker_active.png")

        for(var i = 0; i < map.layers[1].markers.length; i++)
        {
            if(i != id_int) 
            {
                map.layers[1].markers[i].icon.setUrl("resources/marker_inactive.png")
            }
        }
    }
}

map = new OpenLayers.Map("mapdiv");
map.addLayer(new OpenLayers.Layer.OSM());
    
var zoom = 16;

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
    markers.addMarker(marker);
}

var center = new OpenLayers.LonLat(data["0"].longitude, data["0"].latitude)
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );

map.setCenter(center, zoom); 

function map_init() {
    map.setCenter(center, zoom);

    for(var i = 0; i < map.layers[1].markers.length; i++)
    {
        map.layers[1].markers[i].icon.setUrl("resources/marker_inactive.png")
    } 
}

function get_levels() {
    cinemaOrder = [...Array(numOfCinemas).keys()]
    shuffle(cinemaOrder)
    cinemaOrder = cinemaOrder.slice(0, numOfLevels)

    answers = {}
    for(var i = 0; i < cinemaOrder.length; i++)
    {
        answers[cinemaOrder[i]] = 'without'
    }
}

function update_question(){
    questionId.innerHTML='Where is the cinema '.concat(data[cinemaOrder[level].toString()].name).concat(' located?')
}

//////////////////////////////////////////////////////////////////////////////////

const startButton = document.getElementById('startButton');
const exitButton = document.getElementById('exitButton');
const confirmButton = document.getElementById('confirmButton');
const startPage = document.getElementById('startPage');
const quizPage = document.getElementById('quizPage');
const textSelection = document.getElementById('textSelection');
const questionId = document.getElementById('questionId');
const inputNickname = document.getElementById("inputNickname")

var level = 0

startButton.addEventListener('click', (event) => {
    startPage.style.display = 'none';
    quizPage.style.display = 'block';
    nickname = inputNickname.value

    get_levels()
    update_question()

    level ++;
});

exitButton.addEventListener('click', (event) => {
    startPage.style.display = 'block';
    quizPage.style.display = 'none';
    nickname = "";
    level = 0;
    confirmButton.disabled = true;
    textSelection.innerHTML = '';
    inputNickname.value = '';

    map_init();
});

confirmButton.addEventListener('click', (event) => {
    confirmButton.disabled = true;
    textSelection.innerHTML = '';
    
    map_init();
    update_question()

    level ++;
});

