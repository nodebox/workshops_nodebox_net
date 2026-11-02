function changeStep(e) {
    if (!player) return;
    player.setValue('edgedetect1', 'step', parseFloat(e.value));

}
function changeEdgelength(e) {
    if (!player) return;
    player.setValue('edgedetect1', 'edge', parseFloat(e.value));

}
function changeAmountofborderpoints(e) {
    if (!player) return;
    player.setValue('pick1', 'amount', parseFloat(e.value));

}
/* global app, console, document, window, FileReader */

var $dragTarget;

function onFileDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  if ($dragTarget.style.display !== 'block') {
    $dragTarget.style.display = 'block';
  }
}

function onFileDragLeave() {
  //$dragTarget.style.display = 'none';
}

function onFileDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  $dragTarget.style.display = 'none';
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length >= 1) {
    var firstFile = e.dataTransfer.files[0];
    console.log(firstFile);
    var reader = new FileReader();
    reader.onload = function(data) {
      var dataUri = data.target.result;
      //console.log(dataUri);
      //var img = document.createElement('img');
      //img.src = dataUri;
      //img.width = 100;
      //document.body.appendChild(img);
      window.player.setValue('dataImage1', 'uri', dataUri);
    };
    reader.readAsDataURL(firstFile);


  }
}

function onLoad() {
  $dragTarget = document.getElementById('dragTarget');
  window.addEventListener('dragover', onFileDragOver);
  window.addEventListener('dragleave', onFileDragLeave);
  window.addEventListener('drop', onFileDrop);
  window.player = app.embed({userId: 'Aleksandra', projectId: 'triangulate', canvasId: 'c'});
}

document.addEventListener('DOMContentLoaded', onLoad);

