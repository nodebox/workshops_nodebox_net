/*global player, console, document, window, app */
'use strict';


function changeSize(e) {
    if (!player) {
        return;
    }
    player.setValue('number1', 'v', parseFloat(e.value));
}
function changePosition(e) {
    if (!player) {
        return;
    }
    player.setValue('number2', 'v', parseFloat(e.value));
}
function changeHue(e) {
    if (!player) {
        return;
    }
    player.setValue('add1', 'b', parseFloat(e.value));
}


var tx = 0;
var ty = 0;
var px = 0;
var py = 0;

function onMouseMove(e) {
    var dx = e.clientX - px;
    var dy = e.clientY - py;
    tx += dx;
    ty += dy;
    player.setValue('makePoint2', 'x', tx);
    player.setValue('makePoint2', 'y', ty);
    px = e.clientX;
    py = e.clientY;
}

function onMouseUp(e) {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
}

function onMouseDown(e) {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

        px = e.clientX;
        py = e.clientY;
}

document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'depauw',
        projectId: 'welcome',
        canvasId: 'c'
    });

var canvas = document.getElementById('c');
    canvas.addEventListener('mousedown', onMouseDown);

});
