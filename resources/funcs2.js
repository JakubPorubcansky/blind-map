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

    if(level > 0 && answers[id_marker_sel] == markerStates[0] && display == displayStates[1])
    {
        confirmButton.disabled = false;
        // textSelection.innerHTML = "You have selected ".concat(data[id].name).concat(" cinema")

        map.layers[1].markers[id_marker_sel].icon.setUrl("resources/img/marker_dot_sel.png")
        // map.layers[1].markers[id_marker_sel].inflate(1.1)

        for(var i = 0; i < map.layers[1].markers.length; i++)
        {
            if(i != id_marker_sel && answers[i] == markerStates[0])
            {
                map.layers[1].markers[i].icon.setUrl("resources/img/marker_dot.png")
                // map.layers[1].markers[id_marker_sel].inflate(0.9)
            }
        }
    }
    if(display == displayStates[3])
    {
        endInfo.innerHTML = 'Toto je kino '.concat(data[id].name, '<br>Další názvy: ', data[id].otherNames.join(', '))
        endImg.src = data[id].imgUrl
    }
}

function init_center() {
    map.setCenter(center, zoom);
    // map.zoomToExtent(extent);
}

function redraw_markers(p) {
    for(var i = 0; i < map.layers[1].markers.length; i++)
    {
        if (p == 'all' || (p == 'some' && answers[i] == markerStates[0]))
        {
            map.layers[1].markers[i].icon.setUrl("resources/img/marker_dot.png")
        }
    }
}

function get_levels() {
    cinemaOrder = [...Array(numOfCinemas).keys()]
    answers = {}
    for(var i = 0; i < cinemaOrder.length; i++)
    {
        answers[cinemaOrder[i]] = markerStates[0]
    }
    cinemaOrder = [0,2,3,4,7,8,9,10,11,12,17,18,21,22,23,24,26,27,31,32,33]
    shuffle(cinemaOrder)
    cinemaOrder = cinemaOrder.slice(0, numOfLevels)
}

function update_question(){
    questionId.innerHTML='Najdi kino <font size="+20"><b>'.concat(data[cinemaOrder[level].toString()].name)

    if (data[cinemaOrder[level].toString()].otherNames.length > 0)
    {
        questionId.innerHTML = questionId.innerHTML.concat('</b></font><br> <font size="30"><font size="5">jehož další názvy byli:<br>',
        data[cinemaOrder[level].toString()].otherNames.join(', '))
    }

    var img = document.getElementById("questionImg");
    img.src = data[cinemaOrder[level].toString()].imgUrl

}

function make_result(){
    success = false
    if (id_marker_sel == cinemaOrder[level - 1])
    {
        success = true
        map.layers[1].markers[id_marker_sel].icon.setUrl("resources/img/marker_dot_green.png")
        answers[id_marker_sel] = markerStates[1]
        questionResult.innerHTML = '<font size="30"><b>Správně!</b></font>'
    }
    else
    {
        map.layers[1].markers[id_marker_sel].icon.setUrl("resources/img/marker_dot_red.png")
        map.layers[1].markers[cinemaOrder[level - 1]].icon.setUrl("resources/img/marker_dot_yellow.png")
        answers[cinemaOrder[level - 1]] = markerStates[2]
        questionResult.innerHTML = '<font size="30"><b>Chyba!</b></font><br>'.concat("Toto je kino ", data[id_marker_sel].name,'')
    }
}

function get_total_result(){
    pts = 0
    for(var key in answers)
    {
        if(answers[key] == markerStates[1]){
            pts ++;
        }
    }
    return pts
}
