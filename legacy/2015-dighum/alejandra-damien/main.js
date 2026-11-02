/*global player, console, document, window, app */
'use strict';


function changeActor(e) {
    if (!player) {
        return;
    }
    player.setValue('get1', 'index', parseFloat(e.value));
    //player.setValue('stats', 'index', parseFloat(e.value));
}

function changeHue(e) {
    if (!player) {
        return;
    }
    player.setValue('hsbColor1', 'hue', parseFloat(e.value));
}
// Actor Body Count
document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'damienpierre',
        projectId: 'movie',
        functionId: 'main',
        canvasId: 'c',
        animate: true
    });
   

});

