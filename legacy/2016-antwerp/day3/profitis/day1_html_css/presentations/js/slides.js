/* global console */

var gCurrentSlide = -1;
var gStartY;
var gEndY;
var gT;

function quadEaseOut(t) {
    return -(t * (t - 2));
}

function execCallback(eventName) {
  var sections = document.getElementsByTagName('section');
  if (window.SLIDE_CALLBACKS) {
    var section = sections[gCurrentSlide];
    var obj = window.SLIDE_CALLBACKS[section.id];
    if (obj && typeof obj[eventName] === 'function') {
      obj[eventName](section);
    }
  }
}

function changeSlide(newSlide) {
  if (gCurrentSlide === newSlide) { return; }
  var sections = document.getElementsByTagName('section');
  if (gCurrentSlide >= 0) {
    execCallback('leave');
  }
  console.assert(newSlide >= 0 && newSlide < sections.length);
  gCurrentSlide = newSlide;
  execCallback('enter');
}

function animateScroll() {
  gT += 0.05;
  var dt = quadEaseOut(gT);
  var pos = (1 - dt) * gStartY + dt * gEndY;
  window.scroll(0, pos);
  if (gT < 1.0) {
    window.requestAnimationFrame(animateScroll);
  }
}

function scrollToSlide() {
  var sections = document.getElementsByTagName('section');
  var section = sections[gCurrentSlide];
  gStartY = window.scrollY;
  gEndY = section.offsetTop;
  gT = 0.0;
  animateScroll();
}

function onKeyDown(e) {
  if (e.keyCode === 40) {
    e.preventDefault();
    var sections = document.getElementsByTagName('section');
    if (gCurrentSlide + 1 < sections.length) {
      changeSlide(gCurrentSlide + 1);
      scrollToSlide();
    }
  } else if (e.keyCode === 38) {
    e.preventDefault();
    if (gCurrentSlide > 0) {
      changeSlide(gCurrentSlide - 1);
      scrollToSlide();
    }
  }
}

function findCurrentSlide() {
  var sections = document.getElementsByTagName('section');
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var r = section.getBoundingClientRect();
    if ((section.offsetTop + r.height / 2) >= window.scrollY) {
      changeSlide(i);
      return;
    }
  }
}

function trimPreBlocks() {
  var pres = document.getElementsByTagName('pre');
  for (var i = 0; i < pres.length; i++) {
    var pre = pres[i];
    pre.innerHTML = pre.innerHTML.trim();
  }
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('mousewheel', findCurrentSlide);
window.addEventListener('DOMContentLoaded', findCurrentSlide);

// Show the speaker notes.
if (document.location.search.search('notes') >= 0) {
  document.body.classList.add('show-notes');
}

document.addEventListener('DOMContentLoaded', trimPreBlocks);
