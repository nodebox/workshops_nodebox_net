import java.applet.*; import java.awt.*; import java.awt.image.*; import java.awt.event.*; import java.io.*; import java.net.*; import java.text.*; import java.util.*; import java.util.zip.*; import netscape.javascript.*; import gnu.io.*; import javax.sound.midi.*; import javax.sound.midi.spi.*; import javax.sound.sampled.*; import javax.sound.sampled.spi.*; public class creaturefarm1 extends BApplet {
Creature a,b,c;
Vector creatures;
BFont creatureFont;

int currentx;

void setup() {
  size(400,400);
  creatures = new Vector();
  creatureFont = loadFont("creatures.vlw");  
  textFont(creatureFont, 48);
  currentx = 0;
}

void loop() {
  background(0);
  for (int i=0; i < creatures.size(); i++) {
    Creature c = (Creature) creatures.get(i);
    c.step();
    c.draw();
  }
}


void keyPressed() {
   Creature newCreature = new Creature((char)key);
  creatures.addElement(newCreature);
}

class Creature {
  char name;
  int x,y;

  public Creature(char name) {
    this.name = name;
    this.x = currentx; // (int) random(400);
    currentx += 48;
    this.y = 200; // (int) random(400);
  }

  public void step() {
    x += 1; // (int) random(-5,5);
    if (x > width) {
    x = 0;
    }
    y += (int) random(-10, 10);
  }

  public void draw() {
    text(name, x, y);
  }
}


}