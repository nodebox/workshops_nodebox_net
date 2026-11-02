var capture;
var seg = 12;
var countX = 0;
var countY = 0;
var col, row;
var depth = 2;
var zoomIn = 1.5;

function setup() {
  createCanvas(640, 480, WEBGL);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  col = width / seg;
  row = height / seg;

  ambientLight(255);
}

function draw() {
  background(0);
  rotateX(radians(countY));
  rotateY(radians(countX));
  scale(zoomIn, zoomIn);
  capture.loadPixels();

  for (var i = 0; i < width; i += seg) {
    //beginShape(LINES);
    for (var j = 0; j < height; j += seg) {
      //var num = j * width + i; 
      var num = (width-1-i) + j * width; // horizontal flip
      var s = capture.pixels[num * 4];
      //var ps = capture.get(i,j);
      // var s = brightness(ps);
      /*
      fill(s,0,0);
      vertex(-width / 2 + i, -height / 2 + j, s);
      vertex(-width / 2 + (i+1), -height / 2 + j, s);
      vertex(-width / 2 + i, -height / 2 + (j+1), s);
      vertex(-width / 2 + (i+1), -height / 2 + (j+1), s);
      */
      push();
      translate(-width / 2 + i, -height / 2 + j, s / depth);
      ambientMaterial(s, s, s);
      box(seg/2, seg/2, seg*s/(depth*10));
      pop();
      //rect(-width / 2 + i, -height / 2 + j,seg,seg);
    }
    //camera(0, 0, 50);
    //endShape();
  }
}

function mouseDragged() {
  countX += (mouseX - pmouseX);
  countY += (mouseY - pmouseY);
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    depth += .5;
  } else if (keyCode == RIGHT_ARROW) {
    depth -= .5;
  }

  if (keyCode == UP_ARROW) {
    zoomIn += .1;
  } else if (keyCode == DOWN_ARROW) {
    zoomIn -= .1;
  }
}