// function init() {
//     var map = new OpenLayers.Map("mapdiv");
//     map.addLayer(new OpenLayers.Layer.OSM());

//     var lonLat = new OpenLayers.LonLat( -0.1279688 ,51.5077286 )
//         .transform(
//             new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
//             map.getProjectionObject() // to Spherical Mercator Projection
//         );
//     var lonLat2 = new OpenLayers.LonLat( -0.1280000 ,51.5050000 )
//         .transform(
//             new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
//             map.getProjectionObject() // to Spherical Mercator Projection
//         );    
        
//     var zoom=16;

//     var markers = new OpenLayers.Layer.Markers("Markers");
//     map.addLayer(markers);

//     var marker = new OpenLayers.Marker(lonLat, new OpenLayers.Icon('resources/cinema-512.png', new OpenLayers.Size(50,50)));
//     marker.id = "1";
//     marker.events.register("mousedown", marker, function() {
//         markerOnClick(this.id);
//     });

//     var marker2 = new OpenLayers.Marker(lonLat2, new OpenLayers.Icon('resources/cinema-512.png', new OpenLayers.Size(50,50)));
//     marker2.id = "2";
//     marker2.events.register("mousedown", marker2, function() {
//         markerOnClick(this.id);
//     });

//     markers.addMarker(marker);
//     markers.addMarker(marker2);
//     map.setCenter(lonLat2, zoom);   
// }

