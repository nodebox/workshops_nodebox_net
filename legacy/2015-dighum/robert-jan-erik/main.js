/*global player, console, document, window, app */
'use strict';


function changeSize(e) {
    if (!player) {
        return;
    }
    player.setValue('rect5', 'width', parseFloat(e.value));
    player.setValue('rect5', 'height', parseFloat(e.value));
}

function changeHue(e) {
    if (!player) {
        return;
    }
    player.setValue('hsbColor1', 'hue', parseFloat(e.value));
}

document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'Zaturrby',
        projectId: 'voc',
        canvasId: 'c'
    });

});
