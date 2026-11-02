/*global player, console, document, window, app */
'use strict';

function sort(e) {
    if (!player) {
        return;
    }
    player.setValue('sort1', 'key', e.value);
}

function zoom(e) {
    if (!player) {
        return;
    }
    player.setValue('scale_number', 'v', parseFloat(e.value));
}

var tx = 0;
var ty = 0;
var px = 0;
var py = 0;

function onMouseMove(e) {
    var dx = e.clientX - px;
    var dy = e.clientY - py;
    tx += 3 * dx;
    ty += 3 * dy;
    player.setValue('move_mouse', 'x', tx);
    player.setValue('move_mouse', 'y', ty);
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
        userId: 'verhoevenben',
        functionId: 'main',
        projectId: 'dhbenelux',
        canvasId: 'c',
        animate: 'True',
    });

var canvas = document.getElementById('c');
    canvas.addEventListener('mousedown', onMouseDown);

});
