'use strict';

function getScriptText(id) {
    var scriptElement = document.getElementById(id);
    var source = '';
    var k = scriptElement.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            source += k.textContent;
        }
        k = k.nextSibling;
    }
    return source;
}


var amountTexts = ['a few', 'several', 'a dozen of', 'a huge bucket of'];
var sizeTexts = ['fatally tiny', 'small', 'average', 'astronomically big'];
var typeTexts = ['ordinary carps', 'common roaches', 'pike-perches', 'herrings'];


var fishTypes = ['Ordinary Carp', 'Common Roacher', 'Pike-perch', 'Herring'];

var compassChoice = 0;
var weatherChoice = 0;
var timeChoice = 0;

function makePrediction() {
    var prediction = 'The eye of the Fisherman\'s Oracle profoundly envisions that You will catch ';
    prediction += amountTexts[compassChoice];
    prediction += ' ';
    prediction += sizeTexts[weatherChoice];
    prediction += ' ';
    prediction += typeTexts[timeChoice];
    prediction += '. ';

    var sentences = getScriptText('sentences');
    sentences = sentences.split('\n');
    sentences = sentences.filter(function (s) {
        return s.trim().length > 0;
    });
    var sentence = sentences[Math.floor(Math.random() * sentences.length)];
    var randomText = unspin(sentence);

    prediction += randomText;

    document.getElementById('fish-type').innerText = fishTypes[timeChoice];
    document.getElementById('prediction').innerText = prediction;

    switchScreen('predictions-screen');
}

function switchScreen(screenName) {
    var currentScreen = screenName;
    $('.screen').hide();
    $('#' + screenName).show();
}

var timeInactives = [
    'buttons/morning%20calm.svg',
    'buttons/day%20calm.svg',
    'buttons/evening%20calm.svg',
    'buttons/night%20calm.svg'
];

var timeActives = [
    'buttons/morning%20click.svg',
    'buttons/day%20click.svg',
    'buttons/evening%20click.svg',
    'buttons/night%20click.svg'
];

var weatherInactives = [
    'buttons/sun%20calm.svg',
    'buttons/cloud%20calm.svg',
    'buttons/rain%20calm.svg',
    'buttons/storm%20calm.svg'
];

var weatherActives = [
    'buttons/sun%20click.svg',
    'buttons/cloud%20click.svg',
    'buttons/rain%20click.svg',
    'buttons/storm%20click.svg'
];
var compasses = [
    'buttons/compass%20north.svg',
    'buttons/compass%20east.svg',
    'buttons/compass%20south.svg',
    'buttons/compass%20west.svg'
];

function setTime(index) {
    timeChoice = index;
    for (var i = 0; i < 4; i++) {
        var src = i === index ? timeActives[i] : timeInactives[i];
        $('#time' + i + ' img').attr('src', src);
    }
    // $('.timeButton').removeClass('active');
    // $('#time' + index).addClass('active');
        return false;

}

function setWeather(index) {
    weatherChoice = index;

    for (var i = 0; i < 4; i++) {
        var src = i === index ? weatherActives[i] : weatherInactives[i];
        $('#weather' + i + ' img').attr('src', src);
    }

    $('.weatherButton').removeClass('active');
    $('#weather' + index).addClass('active');
        return false;

}

function clickCompass(index) {
    compassChoice++;
    if (compassChoice >= 4) {
        compassChoice = 0;
    }

    $('.compassButton').removeClass('active');
    $('#compass img').attr('src', compasses[compassChoice]);
    return false;
}

switchScreen('loading-screen');
