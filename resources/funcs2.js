function displayPage() {
  exitButton.style.visibility = "visible";
  introPage.style.display = 'none';
  startPage.style.display = 'none';
  quizPage.style.display = 'none';
  summaryPage.style.display = 'none';

  switch(display) {
  case displayStates[0]:
    introPage.style.display = 'block';
    exitButton.style.visibility = "hidden";
    break;
  case displayStates[1]:
    startPage.style.display = 'block';
    break;
  case displayStates[2]:
    quizPage.style.display = 'block';

    confirmButton.style.display = 'inline-block';
    confirmButton.disabled = true;
    nextButton.style.display = 'none'
    questionResult.innerHTML = ''
    break;
  case displayStates[3]:
    quizPage.style.display = 'block';

    confirmButton.style.display = 'none';
    nextButton.style.display = 'inline-block'
    questionResult.style.height = "65%";
    break;
  case displayStates[4]:
    summaryPage.style.display = 'block';
    break;
  }
}

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

function redrawMarker(id) {
  switch(markerStateValues[id]) {
  case markerStates[0]:
    map.layers[1].markers[id].icon.setUrl("resources/img/marker_dot.png")
    break;
  case markerStates[1]:
    map.layers[1].markers[id].icon.setUrl("resources/img/marker_dot_green.png")
    break;
  case markerStates[2]:
    map.layers[1].markers[id].icon.setUrl("resources/img/marker_dot_red.png")
    break;
  case markerStates[3]:
    map.layers[1].markers[id].icon.setUrl("resources/img/marker_dot_yellow.png")
    break;
  case markerStates[4]:
    map.layers[1].markers[id].icon.setUrl("resources/img/marker_dot_sel.png")
    break;
  }
}

function markerOnClick(id) {
    id_marker = parseInt(id)

    if(level > 0 && markerStateValues[id_marker] == markerStates[0] && display == displayStates[2])
    {
        confirmButton.disabled = false;

        for(var i = 0; i < map.layers[1].markers.length; i++)
        {
            if(markerStateValues[i] == markerStates[4])
            {
              markerStateValues[i] = markerStates[0]
              redrawMarker(i)
            }
        }

        markerStateValues[id_marker] = markerStates[4]
        redrawMarker(id_marker)
    }
}

function resetMarkers(p) {
    for(var i = 0; i < map.layers[1].markers.length; i++)
    {
        if (p == 'all' || (p == 'some' && (markerStateValues[i] == markerStates[2] || markerStateValues[i] == markerStates[4])))
        {
            markerStateValues[i] = markerStates[0]
            redrawMarker(i)
        }
    }
}

function getCinemaOrder() {
    var cinemaOrder = shuffle([...Array(numOfCinemas).keys()])
    cinemaOrder = cinemaOrder.slice(0, numOfLevels)

    return cinemaOrder
}

function initMarkerStates() {
  var markerStateValues = {}
  for(var i = 0; i < numOfCinemas; i++)
  {
      markerStateValues[i] = markerStates[0]
  }

  return markerStateValues
}

function newQuestion(){
    questionId.innerHTML='Najdi kino <font size="+20"><b>'.concat(data[cinemaOrder[level].toString()].name).concat('</b></font>')

    if (data[cinemaOrder[level].toString()].otherNames.length > 0)
    {
        questionId.innerHTML = questionId.innerHTML.concat('<br>jehož další názvy byli:<br>',
        data[cinemaOrder[level].toString()].otherNames.join(', '))
    }

    var img = document.getElementById("questionImg");
    img.src = data[cinemaOrder[level].toString()].imgUrl

}

function makeResult(){
    var id = -1
    for(var i = 0; i < map.layers[1].markers.length; i++)
    {
      if(markerStateValues[i] == markerStates[4]) id = i
    }

    if (id == cinemaOrder[level - 1])
    {
        markerStateValues[id] = markerStates[1]
        redrawMarker(id)
        questionResult.innerHTML = '<font size="+20"><b>Správně!</b></font>'
    }
    else
    {
        markerStateValues[id] = markerStates[2]
        markerStateValues[cinemaOrder[level - 1]] = markerStates[3]
        redrawMarker(id)
        redrawMarker(cinemaOrder[level - 1])

        questionResult.innerHTML = '<font size="+20"><b>Chyba!</b></font><br>'.concat("Toto je kino ", data[id].name,'')
    }
}

function getTotalResult() {
    pts = 0
    for(var key in markerStateValues)
    {
        if(markerStateValues[key] == markerStates[1]){
            pts ++;
        }
    }
    return pts
}

function mapRecenter(map) {
    map.setCenter(map_center_transformed, map_zoom);
    // map.zoomToExtent(extent);
}

function mapInit() {
  var map = new OpenLayers.Map("map-container", options);

  // stamenLayer = new OpenLayers.Layer.Stamen("toner");
  // map.addLayer(stamenLayer)

  // map.addLayer(new OpenLayers.Layer.OSM.Hot("Hot"));

  map.addLayer(new OpenLayers.Layer.OSM())
      // {zoomOffset: 13, resolutions: [19.1092570678711,9.55462853393555,4.77731426696777,2.38865713348389]}));

  var markers = new OpenLayers.Layer.Markers("Markers");
  map.addLayer(markers);

  for(var key in data){
      var lonLat = new OpenLayers.LonLat(data[key].longitude, data[key].latitude)
      .transform(
          fromProjection,
          toProjection
      );
      var marker = new OpenLayers.Marker(lonLat, new OpenLayers.Icon('resources/img/marker_dot.png', new OpenLayers.Size(15,15)));
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

  mapRecenter(map)
  // map.zoomToExtent(extent);

  return map
}

// Script that removes Open Layers 2 "Prevent Default ..." error. Script occured when zooming in the map.
function scriptPrevendDefaultError() {
  const eventListenerOptionsSupported = () => {
    let supported = false;

    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supported = true;
        }
      });

      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {}

    return supported;
  }

  const defaultOptions = {
    passive: false,
    capture: false
  };
  const supportedPassiveTypes = [
    'scroll', 'wheel',
    'touchstart', 'touchmove', 'touchenter', 'touchend', 'touchleave',
    'mouseout', 'mouseleave', 'mouseup', 'mousedown', 'mousemove', 'mouseenter', 'mousewheel', 'mouseover'
  ];
  const getDefaultPassiveOption = (passive, eventName) => {
    if (passive !== undefined) return passive;

    return supportedPassiveTypes.indexOf(eventName) === -1 ? false : defaultOptions.passive;
  };

  const getWritableOptions = (options) => {
    const passiveDescriptor = Object.getOwnPropertyDescriptor(options, 'passive');

    return passiveDescriptor && passiveDescriptor.writable !== true && passiveDescriptor.set === undefined
      ? Object.assign({}, options)
      : options;
  };

  const overwriteAddEvent = (superMethod) => {
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      const usesListenerOptions = typeof options === 'object' && options !== null;
      const useCapture          = usesListenerOptions ? options.capture : options;

      options         = usesListenerOptions ? getWritableOptions(options) : {};
      options.passive = getDefaultPassiveOption(options.passive, type);
      options.capture = useCapture === undefined ? defaultOptions.capture : useCapture;

      superMethod.call(this, type, listener, options);
    };

    EventTarget.prototype.addEventListener._original = superMethod;
  };

  const supportsPassive = eventListenerOptionsSupported();

  if (supportsPassive) {
    const addEvent = EventTarget.prototype.addEventListener;
    overwriteAddEvent(addEvent);
  }
}
