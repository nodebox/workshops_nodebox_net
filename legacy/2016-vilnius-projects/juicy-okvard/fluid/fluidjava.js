$(document).ready(function () {
    $('.about').hide()
});
$('.trigger').on('click', function () {
    $('.about').show(100)
});
$(document).mouseup(function (e) {
    var popup = $(".about");
    if (!$('.trigger').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
        popup.hide(100);
    }
});



var options = {
    userId: 'veliute',
    projectId: 'fluids',
    functionId: 'main',
    canvasId: 'mycanvas',
    autoplay: true
};

    // Initialize the NodeBox player object
    ndbx.embed(options, function(err, player) {
      if (err) {
        throw new Error(err);
      } else {
        window.player = player;
      }
    });

    // This function is called when the size slider is dragged.
    function changeSize(e) {
      window.player.setValue('text1', 'fontSize', e.value);
      // window.player.stop();
      // window.player.start();
      ndbx.clearState();

    }

    // This function is called when the hue slider is dragged.
    function changeText(e) {
      window.player.setValue('text1', 'text', e.value);
      //window.player.stop();
      //window.player.start();
      ndbx.clearState();
    }

/////////////

    function changeDecibels(e) {
      window.player.setValue ('number1', 'v', e.value);
    }

    var analyser;

    var samples = [];
    samples.length = 1;
    var sampleIndex = 0;
    var sampleCount = 0;

    function onAudioSample() {
      var times= new Uint8Array(32);
      analyser.getByteFrequencyData(times);
      var sample = times [16];
      samples[sampleIndex] = sample;
      sampleIndex++;
      if (sampleIndex >= samples.length) {
        sampleIndex = 0;
      }
      sampleCount = Math.min(sampleCount + 3, samples.length);

      var sum = 0;
      for (var i=0; i< sampleCount; i++) {
        sum += samples[i];
      }

      var volume = sum / sampleCount;
      volume = volume / 255 * 100;

      document.querySelector('#decibels').value = volume;
      if (window.player) {
        window.player.setValue('number1', 'v', volume);
      }
      requestAnimationFrame(onAudioSample);
    }

    function onAudioError(e) {
      console.error('audio error', e);
    }



function loadMusic(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      //dogBarkingBuffer = buffer;
      initMusic(buffer);

    }, onError);
  }
  request.send();
}

function onError(err){
  console.error(err);

}


function initMusic(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);


                                             analyser = context.createAnalyser();
                                             analyser.fftSize = 64;

                                             //var input = audioContext.createMediaStreamSource(stream);
                                             source.connect(analyser);
                                             requestAnimationFrame(onAudioSample);
}




  //  changing node parameters
  //window.player.setValue('node', 'parameter', e.value);
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  loadMusic("../music/Pablo.mp3")
