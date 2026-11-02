/*global player, console, document, window, app */
'use strict';


function changeRange(e) {
    if (!player) {
        return;
    }
    player.setValue('number5', 'v', parseFloat(e.value));
}

function changeByPlay(e) {
    if (!player) {
        return;
    }
    player.setValue('scale4', 'scale', parseFloat(e.value));
   
}

document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'ingo',
        projectId: 'test2',
        canvasId: 'c',
		functionId: 'salamantica',
    });

});
