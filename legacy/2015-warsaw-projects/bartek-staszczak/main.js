function changeSize(e) {
    if (!player) return;
    player.setValue('rect1', 'width', parseFloat(e.value));
    player.setValue('rect1', 'height', parseFloat(e.value));
}

function changeHue(e) {
    if (!player) return;
    player.setValue('hsbColor1', 'hue', parseFloat(e.value));
}
function ChangeRoundness(e) {
    if (!player) return;
    player.setValue('rect1', 'roundness', parseFloat(e.value));
}



function getMousePos(canvas,evt) {
    var rect = canvas.getBoundingClientRect();
    return {
     x: evt.clientX - rect.left,
     y: evt.clientY - rect.top 
    };
}




function onLoad() {
    
    window.player = app.embed({
        userId: 'aveBartek',
        projectId: 'uno',
        functionId: 'main',
        canvasId: 'c',
        animate: true
    });
    
    var canvas = document.getElementById('c');
var context = canvas.getContext('2d');

    
    canvas.addEventListener('mousemove',function(evt){
 var mousePos = getMousePos(canvas,evt);
        player.ndbx._mousePosition.x = mousePos.x - canvas.width / 2;;
        player.ndbx._mousePosition.y = mousePos.y - canvas.height / 2;

},false);

}


document.addEventListener('DOMContentLoaded', onLoad);
