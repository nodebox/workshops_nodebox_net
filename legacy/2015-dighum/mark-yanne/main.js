/*global player, console, document, window, app */
'use strict';


function changeSize(e) {
    if (!player) {
        return;
    }
    player.setValue('divide1', 'b', parseFloat(e.value));
    player.setValue('rect1', 'height', parseFloat(e.value));
}

function changeHue(e) {
    if (!player) {
        return;
    }
    player.setValue('rgbColor1', 'red', parseFloat(e.value));
}

document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'fatberry',
        projectId: 'testbuildings',
        functionId: 'editorstest',
        canvasId: 'c'
    });

});
