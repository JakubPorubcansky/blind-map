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

function markerOnClick(id) {
    id_marker_sel = parseInt(id)

    if(level > 0 && answers[id_marker_sel] == 'without')
    {
        confirmButton.disabled = false;
        textSelection.innerHTML = "You have selected ".concat(data[id].name).concat(" cinema")

        map.layers[1].markers[id_marker_sel].icon.setUrl("resources/marker_active.png")

        for(var i = 0; i < map.layers[1].markers.length; i++)
        {
            if(i != id_marker_sel && answers[i] == 'without')
            {
                map.layers[1].markers[i].icon.setUrl("resources/marker_inactive.png")
            }
        }
    }
}

function init_center() {
    map.setCenter(center, zoom);
}

function redraw_markers(p) {
    for(var i = 0; i < map.layers[1].markers.length; i++)
    {
        if (p == 'all' || (p == 'some' && answers[i] == 'without'))
        {
            map.layers[1].markers[i].icon.setUrl("resources/marker_inactive.png")
        }
    }
}

function get_levels() {
    cinemaOrder = [...Array(numOfCinemas).keys()]
    answers = {}
    for(var i = 0; i < cinemaOrder.length; i++)
    {
        answers[cinemaOrder[i]] = 'without'
    }
    shuffle(cinemaOrder)
    cinemaOrder = cinemaOrder.slice(0, numOfLevels)
}

function update_question(){
    questionId.innerHTML='Where is the cinema '.concat(data[cinemaOrder[level].toString()].name).concat(' located?')

    var img = document.getElementById("questionImg");
    img.src = data[cinemaOrder[level].toString()].imgUrl

}

function make_result(){
    success = false
    if (id_marker_sel == cinemaOrder[level - 1])
    {
        success = true
        map.layers[1].markers[id_marker_sel].icon.setUrl("resources/marker_green.png")
        answers[id_marker_sel] = 'true'
    }
    else
    {
        map.layers[1].markers[id_marker_sel].icon.setUrl("resources/marker_red.png")
        map.layers[1].markers[cinemaOrder[level - 1]].icon.setUrl("resources/marker_yellow.png")
        answers[cinemaOrder[level - 1]] = 'false'
    }
}
