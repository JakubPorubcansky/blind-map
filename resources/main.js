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

function markerOnClick(id) {
    id_int = parseInt(id)

    if(level > 0)
    {   
        confirmButton.disabled = false;
        textSelection.innerHTML = "You have selected cinema with id: ".concat(id)

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

/////////////////////////////////////////////////////////////////////////////////

map = new OpenLayers.Map("mapdiv");
map.addLayer(new OpenLayers.Layer.OSM());

var lonLat = new OpenLayers.LonLat( -0.1279688 ,51.5077286 )
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );
var lonLat2 = new OpenLayers.LonLat( -0.1280000 ,51.5050000 )
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );    
    
var zoom = 16;

var markers = new OpenLayers.Layer.Markers("Markers");
map.addLayer(markers);

var marker = new OpenLayers.Marker(lonLat, new OpenLayers.Icon('resources/marker_inactive.png', new OpenLayers.Size(50,50)));
marker.id = "0";
marker.events.register("mousedown", marker, function() {
    markerOnClick(this.id);
});

var marker2 = new OpenLayers.Marker(lonLat2, new OpenLayers.Icon('resources/marker_inactive.png', new OpenLayers.Size(50,50)));
marker2.id = "1";
marker2.events.register("mousedown", marker2, function() {
    markerOnClick(this.id);
});

markers.addMarker(marker);
markers.addMarker(marker2);
map.setCenter(lonLat2, zoom);  

//////////////////////////////////////////////////////////////////////////////////

icon1 = new OpenLayers.Icon('resources/images.png', new OpenLayers.Size(50,50))
icon2 = new OpenLayers.Icon('resources/cinema-512.png', new OpenLayers.Size(50,50))

const startButton = document.getElementById('startButton');
const confirmButton = document.getElementById('confirmButton');
const startPage = document.getElementById('startPage');
const quizPage = document.getElementById('quizPage');
const textSelection = document.getElementById('textSelection');

var level = 0

startButton.addEventListener('click', (event) => {
    startPage.style.display = 'none';
    quizPage.style.display = 'block';
    level ++;
});



// markers[0].events.register("mousedown", marker, function() {
//     alert(this.id);
// });