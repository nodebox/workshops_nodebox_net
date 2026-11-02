/* global document, navigator, window */
/* jshint strict: false */

var video = {};

var VIDEO_WIDTH = 64;
var VIDEO_HEIGHT = 48;
var GLYPH_WIDTH = 10;
var GLYPH_HEIGHT = 10;
var GLYPH_SIZE = 0.1;
var GLYPH_COLORED = true;

function initVideo(callback) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    video.element = document.querySelector('video');
    video.canvas = document.querySelector('#c');
    video.canvas.width = VIDEO_WIDTH;
    video.canvas.height = VIDEO_HEIGHT;
    video.context = video.canvas.getContext('2d');

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, function(localMediaStream) {
            video.element.src = window.URL.createObjectURL(localMediaStream);
            callback();
        }, function(e) {
            var $type = document.getElementById('type');
            $type.innerHTML = '<h1>Please enable the camera for this to work.</h1>';
        });
    } else {
        var $type = document.getElementById('type');
        $type.innerHTML = '<p>This experiment requires a browser with web camera support, like Firefox or Chrome.</p>';
    }
}

function glyphId(x, y) {
    return 'g_' + x + '_' + y;
}

function randInt(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function choice(l) {
    var index = randInt(0, l.length - 1);
    return l[index];
}

function createTypeDivs(width, height, letters) {
    var x, y, $type, $glyph;
    $type = document.getElementById('type');
    $type.innerHTML = '';
    for (y = 0; y < height; y += 1) {
        for (x = 0; x < width; x += 1) {
            $glyph = document.createElement('div');
            $glyph.className = 'glyph';
            $glyph.style.left = (x * GLYPH_WIDTH) + 'px';
            $glyph.style.top = (y * GLYPH_HEIGHT) + 'px';
            $glyph.id = glyphId(x, y);
            $glyph.innerHTML = choice(letters);
            $type.appendChild($glyph);
        }
    }
}

function updateTypeDivs(width, height, letters) {
    var x, y, i, r, g, b, $glyph;
    for (y = 0; y < height; y += 1) {
        for (x = 0; x < width; x += 1) {
            $glyph = document.getElementById(glyphId(x, y));
            $glyph.innerHTML = choice(letters);
        }
    }
}

function imageToType(d, width, height) {
    var x, y, i, r, g, b, $glyph;
    for (y = 0; y < height; y += 1) {
        for (x = 0; x < width; x += 1) {
            i = (y * width + x) * 4;
            r = d[i];
            g = d[i + 1];
            b = d[i + 2];
            $glyph = document.getElementById(glyphId(x, y));
            $glyph.style.fontSize = Math.round((255-r) * GLYPH_SIZE) + 'px';
            if (GLYPH_COLORED) {
                $glyph.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
            } else {
                $glyph.style.color = 'black';
            }
        }
    }
}

function init () {
    initVideo(function () {
        createTypeDivs(VIDEO_WIDTH, VIDEO_HEIGHT, 'A');
        window.requestAnimationFrame(animate);
    });
}

function update() {
    var d, stats;
    try {
        video.context.drawImage(video.element, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        d = video.context.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT).data;
        imageToType(d, VIDEO_WIDTH, VIDEO_HEIGHT);
    } catch (e) {}
}

function draw() {
}

function animate() {
    update();
    draw();
    window.requestAnimationFrame(animate);
}

function onChangeLetters(e) {
    var letters = e.value;
    letters = letters.length === 0 ? ' ' : letters;
    updateTypeDivs(VIDEO_WIDTH, VIDEO_HEIGHT, letters);
}

function onChangeSize(e) {
    GLYPH_SIZE = e.value;
}

function onChangeColored(e) {
    GLYPH_COLORED = e.checked;
}

window.addEventListener('load', init, false);
