function changeSize(e) {
    if (!player) return;
    player.setValue('add1', 'b', parseFloat(e.value));
}

function toggleTranslation(e) {
    player.setValue('showTranslation', 'v', e.checked ? 1 : 0);
}

document.addEventListener('DOMContentLoaded', function () {

    window.player = app.embed({
        userId: 'yooha',
        projectId: 'dataViz',
        canvasId: 'c'
    });

});
