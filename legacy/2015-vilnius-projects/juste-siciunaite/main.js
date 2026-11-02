/* global app */
'use strict';

// function changeSize(e) {
//     if (!player) return;
//     player.setValue('rect1', 'width', parseFloat(e.value));
//     player.setValue('rect1', 'height', parseFloat(e.value));
// }

// function changeHue(e) {
//     if (!player) return;
//     player.setValue('hsb1', 'hue', parseFloat(e.value));
// }


var events = [];



function addEvent() {
    var year = document.getElementById('yearField').value;
    var month = document.getElementById('monthField').value;
    var day = document.getElementById('dayField').value;
    var type = document.getElementById('typeField').value;
    events.push({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        type: type
    });

    console.log(JSON.stringify(events));

    var newRow = document.createElement('tr');
    newRow.innerHTML = '<td>' + year + '</td><td>' + month + '</td><td>' + day + '</td><td>' + type + '</td>';

    document.getElementById('eventsTable').appendChild(newRow);

    player.setValue('eventString', 's', JSON.stringify(events));
}


// document.addEventListener('DOMContentLoaded', function () {

//     window.player = app.embed({
//         userId: 'fdb',
//         projectId: 'embedTest',
//         canvasId: 'c'
//     });

//     player.start();

// });
