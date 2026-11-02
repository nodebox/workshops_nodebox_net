/* global app, GIF */
'use strict';


function changeName(e) {
    player.setValue('string1', 's', e.value);
}


function changeFX01(e) {
    player.setValue('fxOverride', 'v', parseInt(e.value));
}

function changeColor(e) {
    player.setValue('number1', 'v', parseFloat(e.value));
}

function makeGIF() {

    document.getElementById('makeGIFButton').innerHTML = 'Making...';

    var canvas = document.getElementById('c');

    var NUMBER_OF_FRAMES = 65;

    var gif = new GIF({
        workers: 4,
        quality: 10,
        width: 500,
        height: 500
    });

    player.stop();
    player.ndbx._currentFrame = 1;
    for (var i = 0; i < NUMBER_OF_FRAMES; i++) {
        player.draw();
        gif.addFrame(canvas, {copy: true, delay: 30});
        player.ndbx._currentFrame += 1;
    }

    gif.on('finished', function(blob) {
        var url = URL.createObjectURL(blob);

         var img = document.createElement('img');
         img.src = url;
         document.body.appendChild(img);

        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.gif';
        a.click();

        player.start();

            document.getElementById('makeGIFButton').innerHTML = 'Make GIF';

    });

    gif.render();
}

document.addEventListener('DOMContentLoaded', function () {

    window.player = app.embed({userId: 'Alterative', projectId: 'vigProject', canvasId: 'c'});
    window.player.start();


});