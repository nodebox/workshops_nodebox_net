var bs = 100;
var cs = 100;
var countx = 0;
var county = 0;
var counter = 0;
var secondAni= 0;

function setup() {
  createCanvas(800,800,WEBGL);
}

function draw() {
  bs = mouseX/4;
  cs = mouseY/4;
  
  var c = color(0,20,200);
  fill(c);
  background(0);
  var dirY = (mouseY / height - 0.5) *2;
  var dirX = (mouseX / width - 0.5) *2;
  directionalLight(250, 250, 250, dirX, -dirY, 0.25);
  ambientMaterial(150);
  
  rotateX(radians(county));
  rotateY(radians(countx));
  
  
  if(frameCount%1==0){
    counter++
  }
  //var frame = frameCount;
  if(secondAni==0){
  rotateX(counter*.05);
  }else{
      rotateY(counter*.05);
  }
  
  if(counter%120 == 0){
    secondAni++;

    secondAni = secondAni%2;
  }
     // print(secondAni+);
  
  
  
  box(bs,bs,bs);
  cones();
  push();
  translate(0,bs*2,0);
  rotateZ(radians(90));
  cones();
  pop();
  
  
    push();
  translate(0,bs*2,0);
  rotateX(radians(90));
  cones();
  pop();
  

}

function cones(){
    translate(0,-bs*2,0);
  cone(bs/2,cs);
  push();
    translate(0,bs*4,0);
    rotateX(degrees(21));
    //print(mouseX);
  cone(bs/2,cs);
  pop();
}

function mouseDragged(){
  countx+=(mouseX-pmouseX);
  county+=(mouseY-pmouseY);
  
}