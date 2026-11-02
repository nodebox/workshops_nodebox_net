
Creature a,b,c;

void setup() {
  size(400,400);
  a = new Creature("a");
  b = new Creature("b");
  c = new Creature("c");
  
  
}

void loop() {
  background(0);
  BFont creatureFont;
  creatureFont = loadFont("creatures.vlw");
  textFont(creatureFont, 48);
  //text("hello", 15, 90);
  a.step();
  b.step();
  c.step();
  a.draw();
  b.draw();
  c.draw();
}

class Creature {
  String name;
  int x,y;

  public Creature(String name) {
    this.name = name;
    this.x = (int) random(400);
    this.y = (int) random(400);
  }

  public void step() {
    x += (int) random(-5,5);
    y += (int) random(-5, 5);
  }

  public void draw() {
    text(name, x, y);
  }
}
