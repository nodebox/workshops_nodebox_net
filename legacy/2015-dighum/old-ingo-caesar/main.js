/*global player, console, document, window, app */
'use strict';


function changeSize(e) {
    if (!player) {
        return;
    }
    player.setValue('number4', 'v', parseFloat(e.value));
}

document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'ingo',
        projectId: 'test2',
        canvasId: 'c',
		functionId: 'testtimeline',
    });

});
