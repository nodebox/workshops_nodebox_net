/* global ndbx */
var options = {
    userId: 'Victoria',
    projectId: 'kiss',
    canvasId: 'c',
    autoplay: true
};

ndbx.embed(options, function (err, player) {
    window.player = player;
    window.addEventListener('scroll', onScroll);
});

var musicSadness = document.querySelector('#musicSadness');
var musicRomance = document.querySelector('#musicRomance');
var musicPassion = document.querySelector('#musicPassion');
musicSadness.volume = 1;
musicRomance.volume = 0;
musicPassion.volume = 0;

function onScroll(e) {
    var ratio = document.body.scrollTop / (document.body.scrollHeight - window.innerHeight);

    var sadness = 0;
    var romance = 0;
    var passion = 0;
    if (ratio <= 0.5) {
        ratio *= 2;
        sadness = 1.0 - ratio;
        romance = ratio;
    } else {
        ratio = (ratio * 2) - 1;
        romance = 1.0 - ratio;
        passion = ratio;
    }

    player.setValue('amtPassion', 'v', passion * 100);
    player.setValue('amtRomance', 'v', romance * 100);
    player.setValue('amtSadness', 'v', sadness * 100);
    musicSadness.volume = sadness;
    musicRomance.volume = romance;
    musicPassion.volume = passion;
}

function changeText(e) {
    if (window.player) {
        player.setValue('text', 's', e.value);
    }
}