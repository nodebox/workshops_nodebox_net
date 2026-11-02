function changeYear(e) {
    if (!player) return;
    player.setValue('years', 'v', parseFloat(e.value));
}


document.addEventListener('DOMContentLoaded', function () {

    window.player = app.embed({
        userId: 'Daria',
        projectId: 'hofatimeline',
        canvasId: 'c',
        animate: true
    });

});
