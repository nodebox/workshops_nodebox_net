   function changeForm(e) {
    if (!player) return;
    player.setValue('freedom', 'v', parseFloat(e.value));
}
   function changeForm1(e) {
    if (!player) return;
    player.setValue('frightess', 'v', parseFloat(e.value));
}

   function changeForm2(e) {
    if (!player) return;
    player.setValue('frustration', 'v', parseFloat(e.value));
}

  function changeForm3(e) {
    if (!player) return;
    player.setValue('guilty', 'v', parseFloat(e.value));
}

function changeForm4(e) {
    if (!player) return;
    player.setValue('injured', 'v', parseFloat(e.value));
}
function changeForm5(e) {
    if (!player) return;
    player.setValue('dizziness', 'v', parseFloat(e.value));
}

document.addEventListener('DOMContentLoaded', function () {

    window.player = app.embed({
        userId: 'neodoze',
        projectId: 'codeDesease',
        canvasId: 'c'
    });

    player.start();

  

});