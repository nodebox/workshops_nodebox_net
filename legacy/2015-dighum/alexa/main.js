/*global player, console, document, window, app */
'use strict';


function changeSize(e) {
    if (!whichplayer) {
        return;
    }
    player.setValue('rect1', 'width', parseFloat(e.value));
    player.setValue('rect1', 'height', parseFloat(e.value));
}

function changeHue(e) {
    if (!whichplayer) {
        return;
    }
    player.setValue('hsbColor1', 'hue', parseFloat(e.value));
}

document.addEventListener('DOMContentLoaded', function () {
    /*those arguments appear in the url of the nodebox project */
    window.player = app.embed({
        userId: 'Alexa',
        projectId: 'tutorial',
        functionId: 'segmentedRifleAllYears',
        canvasId: 'c',
        animate: false
    });
});
