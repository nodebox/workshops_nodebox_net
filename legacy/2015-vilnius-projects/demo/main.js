function changeSize(e) {
    if (!player) return;
    player.setValue('rect1', 'width', parseFloat(e.value));
    player.setValue('rect1', 'height', parseFloat(e.value));
}

function changeHue(e) {
    if (!player) return;
    player.setValue('hsb1', 'hue', parseFloat(e.value));
}

document.addEventListener('DOMContentLoaded', function () {

    window.player = app.embed({
        userId: 'fdb',
        projectId: 'embedTest',
        canvasId: 'c'
    });

    player.start();

});
