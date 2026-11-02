/*global player, console, document, window, app */
'use strict';

function sort(e) {
    if (!player) {
        return;
    }
    player.setValue('sort1', 'key', e.value);
}


document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'verhoevenben',
        functionId: 'main',
        projectId: 'dhbenelux',
        canvasId: 'c'
    });

});
