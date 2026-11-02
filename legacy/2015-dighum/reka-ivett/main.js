/*global player, console, document, window, app */
'use strict';

function changeDate(e) {
    if (!player) {
        return;
    }
    player.setValue('number1', 'v', parseFloat(e.value));
}



document.addEventListener('DOMContentLoaded', function () {
    window.player = app.embed({
        userId: 'rekusz',
        projectId: 'fbhelyesiras',
        canvasId: 'c'
    });

});
