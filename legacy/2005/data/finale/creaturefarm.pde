
BFont creatureFont;
BImage titleImage, foodchainImage;
//BSound tuneSound;

int  gridheight = 10;
int gridwidth = 10;

boolean active = false;

int TITLE_STATE = 0;
int FOODCHAIN_STATE = 1;
int WORK_STATE = 2;

int globalstate = TITLE_STATE;

BSound tuneSound;
Creature[][] grid = new Creature[gridheight][gridwidth];
Creature[] creatures = new Creature[10000];
int crlen = 0;

Cursor cursor;

int cellsize = 40;
float rx, ry, rz = 0.0F;

void setup() {
  size(450,450);

  framerate(30);
  creatureFont = loadFont("creatures.vlw");
  titleImage = loadImage("creaturestitle.gif");
  foodchainImage = loadImage("foodchain.gif");
  tuneSound  = loadSound("creaturessong.wav");

  repeat (tuneSound);

  fill(255, 204, 0);
  textFont(creatureFont,48);
  cursor = new Cursor(0,0);
  noStroke();

}

void loop() {

  if (globalstate == TITLE_STATE) {
    title();
  } else if (globalstate == FOODCHAIN_STATE) {
    foodchain();
  } else {
    work();
  }

}

void title() {
  image(titleImage, 0, 0);
}

void foodchain() {
  image(foodchainImage, 0, 0);
}

void work() {

  background(0);
  fill(0);
  rect(4,8,width-8,height-20);
  translate(30,10);
  //rotateX(rx);
  //rotateY(ry);
  //rotateZ(rz);
  //rx = sin(crlen/100.0F);
  for (int i=0; i < crlen; i++) {
    Creature c = creatures[i];
    if (c != null) {
      c.update();
      c.draw();
    }
  }
  cursor.update();
  cursor.draw();
}

boolean empty(int x, int y) {
  return grid[x][y] == null;
}

void mouseReleased() {
  if (globalstate != WORK_STATE) {
    globalstate++;
  }
}



void keyPressed() {
  switch((char)key) {
    case 10: // enter key
    active = !active;
    for (int i=0; i < crlen; i++) {
      Creature c = creatures[i];
      if (c != null && ! (c instanceof Carrot)) {
        c.active = active;
      }
    }
    break;
    case 8: // backspace key
    cursor.back();
    Creature c = grid[cursor.x][cursor.y];
    if (c != null) {
      c.die();
    }
    break;
    case ' ':
    cursor.forward();
    break;
    case 'i':
    case 'c':
    case 'f':
    case 'k':
    case 'j':
    case 'l':
    case 's':
    case 'z':
    case 'v':
    case 'x':
    Predator newPredator = new Predator((char)key, cursor.x, cursor.y);
    newPredator.active = active;
    creatures[crlen++] = newPredator;
    cursor.forward();
    break;
    case '!':
    SuperPredator superPredator = new SuperPredator((char)key, cursor.x, cursor.y);
    superPredator.active = active;
    creatures[crlen++] = superPredator;
    cursor.forward();
    break;
    case 'a':
    case 'm':
    case 'e':
    case 'b':
    case 'd':
    case 'g':
    case 'h':
    case 'n':
    case 'o':
    case 'q':
    case 'r':
    case 't':
    case 'u':
    case 'w':
    case 'y':
    case 'Š':
    Vegetarian newVeggie = new Vegetarian((char)key, cursor.x, cursor.y);
    newVeggie.active = active;
    creatures[crlen++] = newVeggie;
    cursor.forward();
    break;
    case '.':
    case ',':
    Carrot newCarrot = new Carrot((char)key, cursor.x, cursor.y);
    creatures[crlen++] = newCarrot;
    cursor.forward();
    break;
    case 'p':
    case 'Œ':
    case 'š':
    Omnivar omnivar = new Omnivar((char)key, cursor.x, cursor.y);
    omnivar.active = active;
    creatures[crlen++] = omnivar;
    cursor.forward();
    break;

  }
  if (crlen >= 10000) {
    crlen = 0;
  }
}

class Creature {
  char name;
  int x,y;
  float screenx, screeny;
  boolean moving;
  boolean active;
  float life;
  boolean dying;
  Creature target;
  int _id;

  public Creature(char name, int x, int y) {
    this._id = crlen;
    this.name = name;
    this.life = 1.0;
    this.x = x;
    this.y = y;
    this.screenx = this.x * cellsize;
    this.screeny = (this.y+1) * cellsize;
    this.active = true;
    if (grid[x][y] != null) {
      grid[x][y].die();
    }
    grid[x][y] = this;
  }

  public void update() {
    if (moving) {
      screenx += (target.screenx-screenx) / 10;
      screeny += (target.screeny-screeny) / 10;
      if (abs(screenx - target.screenx) <= 10 && abs(screeny - target.screeny) <= 10) {
        target.die();
      }
      if (abs(screenx - target.screenx) <= 8 && abs(screeny - target.screeny) <= 8) {
        moving=false;
        x = target.x;
        y = target.y;
        grid[x][y] = this;
        screenx = x * cellsize;
        screeny = (y+1) * cellsize;
      }
    } else if (active) {
      // go look for something to eat!
      int radius = 2;
      int dx = (int) random(-radius,radius);
      int dy = (int) random(-radius,radius);
      if (x+dx >= 0 && x+dx < gridwidth && y+dy >= 0 && y+dy < gridheight) {
        if (canEat(grid[x+dx][y+dy])) {
          attack(grid[x+dx][y+dy]);
        }
      }
    }
    if (dying) {
      life = life / 1.2F;
      if (life < 0.1) {
        creatures[_id] = null;
        if (grid[x][y] == this) {
          grid[x][y] = null;
        }
      }
    }
  }

  public void attack(Creature c) {
    target = c;
    target.moving = false;
    moving = true;
  }

  public void die() {
    dying = true;
  }

  public void draw() {
    //println(this.name +":" + this.x + "," + this.y );

    if (!dying) {
      text(name, screenx,screeny);
    } else {
      push();
      translate(screenx+20,screeny);
      scale(life);
      //rotate(life*TWO_PI);
      text(name,-10, 0);
      pop();
    }
  }

  public boolean canEat(Creature target) {
    return false;
  }

}

class Predator extends Creature {
  public Predator(char name, int x, int y) {
    super(name, x, y);
  }

  public void draw() {
    fill(40,40,200, life*255);
    super.draw();
  }

  public boolean canEat(Creature target) {
    if (target != null && target != this) {
      if (name == 'i' && target.name == 'm') return true;
      if (name == 'i' && target.name == 'z') return true;
      if (name == 'i' && target.name == 'n') return true;
      if (name == 'i' && target.name == 'a') return true;
      if (name == 'i' && target.name == 'r') return true;
      if (name == 'i' && target.name == 'y') return true;
      if (name == 'i' && target.name == 'g') return true;
      if (name == 'c' && target.name == 'g') return true;
      if (name == 'c' && target.name == 'w') return true;
      if (name == 'c' && target.name == 'f') return true;
      if (name == 'c' && target.name == 'h') return true;
      if (name == 'c' && target.name == 'p') return true;
      if (name == 'c' && target.name == 'r') return true;
      if (name == 'z' && target.name == 'h') return true;
      if (name == 'z' && target.name == 'q') return true;
      if (name == 'z' && target.name == 'p') return true;
      if (name == 'k' && target.name == 'e') return true;
      if (name == 'k' && target.name == 't') return true;
      if (name == 'k' && target.name == 'š') return true;
      if (name == 'k' && target.name == 'd') return true;
      if (name == 'k' && target.name == 'Œ') return true;
      if (name == 'k' && target.name == 'o') return true;
      if (name == 'v' && target.name == 'w') return true;
      if (name == 'v' && target.name == 'd') return true;
      if (name == 'v' && target.name == 'e') return true;
      if (name == 'v' && target.name == 't') return true;
      if (name == 'v' && target.name == 'o') return true;
      if (name == 'v' && target.name == 'p') return true;
      if (name == 'j' && target.name == 'e') return true;
      if (name == 'j' && target.name == 'a') return true;
      if (name == 'j' && target.name == 't') return true;
      if (name == 'j' && target.name == 'o') return true;
      if (name == 'j' && target.name == 'n') return true;
      if (name == 'j' && target.name == 'p') return true;
      if (name == 'i' && target.name == 'e') return true;
      if (name == 'i' && target.name == 'š') return true;
      if (name == 'i' && target.name == 'o') return true;
      if (name == 'i' && target.name == 'b') return true;
      if (name == 'c' && target.name == 'g') return true;
      if (name == 'c' && target.name == 'w') return true;
      if (name == 'c' && target.name == 'f') return true;
      if (name == 'c' && target.name == 'o') return true;
      if (name == 'z' && target.name == 'h') return true;
      if (name == 'z' && target.name == 'q') return true;
      if (name == 'z' && target.name == 'o') return true;
      if (name == 'z' && target.name == 'a') return true;
      if (name == 'z' && target.name == 'e') return true;
      if (name == 'z' && target.name == 'p') return true;
      if (name == 'x' && target.name == 'y') return true;
      if (name == 'x' && target.name == 'r') return true;
      if (name == 'x' && target.name == 'p') return true;
      if (name == 'x' && target.name == 'o') return true;
      if (name == 's' && target.name == 'y') return true;
      if (name == 's' && target.name == 'a') return true;
      if (name == 's' && target.name == 'e') return true;
      if (name == 's' && target.name == 'p') return true;
      if (name == 's' && target.name == 'Š') return true;
      if (name == 's' && target.name == 't') return true;
      if (name == 's' && target.name == 'h') return true;
      if (name == 's' && target.name == 'o') return true;
      if (name == 'l' && target.name == 'a') return true;
      if (name == 'l' && target.name == 'e') return true;
      if (name == 'l' && target.name == 'Š') return true;
      if (name == 'l' && target.name == 'h') return true;
      if (name == 'l' && target.name == 'p') return true;
      if (name == 'l' && target.name == 't') return true;
      if (name == 'l' && target.name == 'o') return true;
      if (name == 'f' && target.name == 'a') return true;
      if (name == 'f' && target.name == 'e') return true;
      if (name == 'f' && target.name == 'Š') return true;
      if (name == 'f' && target.name == 'h') return true;
      if (name == 'f' && target.name == 'p') return true;
      if (name == 'f' && target.name == 't') return true;
      if (name == 'f' && target.name == 'o') return true;

      return target instanceof Predator && random(190)>189;
    } else {
      return false;
    }
  }
}

class Omnivar extends Creature {
  public Omnivar(char name, int x, int y) {
    super(name, x, y);
  }

  public void draw() {
    fill(214,216,20, life*255);
    super.draw();
  }

  public boolean canEat(Creature target) {
    if (target != null && target != this) {
      if (name == 'p' && target.name == 'n') return true;
      if (name == 'p' && target.name == 't') return true;
      if (name == 'p' && target.name == 'u') return true;
      if (name == 'p' && target.name == 'a') return true;
      if (name == 'p' && target.name == '.') return true;
      if (name == 'p' && target.name == ',') return true;
      if (name == 'š' && target.name == 'n') return true;
      if (name == 'š' && target.name == 't') return true;
      if (name == 'š' && target.name == 'u') return true;
      if (name == 'š' && target.name == 'a') return true;
      if (name == 'š' && target.name == ',') return true;
      if (name == 'š' && target.name == '.') return true;
      if (name == 'Œ' && target.name == 'n') return true;
      if (name == 'Œ' && target.name == 't') return true;
      if (name == 'Œ' && target.name == 'u') return true;
      if (name == 'Œ' && target.name == 'a') return true;
      if (name == 'Œ' && target.name == '.') return true;
      if (name == 'Œ' && target.name == ',') return true;

      return target instanceof Vegetarian && random(200)>199;
    } else {
      return false;
    }
  }
}

class SuperPredator extends Creature {
  public SuperPredator(char name, int x, int y) {
    super(name, x, y);
  }
  public void draw() {
    fill(255, life*255);
    super.draw();
  }

  public boolean canEat(Creature target) {
    if (target != null && target != this) {

      if (! (target instanceof SuperPredator)) {
        return true;
      } else {
        return random(150)>149;
      }
    }
    return false;
  }
}

class Vegetarian extends Creature {
  public Vegetarian(char name, int x, int y) {
    super(name, x, y);
  }

  public void update() {
    super.update();
    if(active) {
      if (random(4000)>3999) {
        this.die();
      }
    }
  }

  public void draw() {
    fill(200,20,20, life*255);
    super.draw();
  }

  public boolean canEat(Creature target) {
    if (target != null) {

      if (name == 'a' && target.name == '.') return true;
      if (name == 'a' && target.name == ',') return true;
      if (name == 'e' && target.name == '.') return true;
      if (name == 'e' && target.name == ',') return true;
      if (name == 'm' && target.name == '.') return true;
      if (name == 'm' && target.name == ',') return true;
      if (name == 'b' && target.name == '.') return true;
      if (name == 'b' && target.name == ',') return true;
      if (name == 'd' && target.name == '.') return true;
      if (name == 'd' && target.name == ',') return true;
      if (name == 'g' && target.name == '.') return true;
      if (name == 'g' && target.name == ',') return true;
      if (name == 'h' && target.name == '.') return true;
      if (name == 'h' && target.name == ',') return true;
      if (name == 'n' && target.name == '.') return true;
      if (name == 'n' && target.name == ',') return true;
      if (name == 'o' && target.name == '.') return true;
      if (name == 'o' && target.name == ',') return true;
      if (name == 'p' && target.name == '.') return true;
      if (name == 'p' && target.name == ',') return true;
      if (name == 'q' && target.name == '.') return true;
      if (name == 'q' && target.name == ',') return true;
      if (name == 'r' && target.name == '.') return true;
      if (name == 'r' && target.name == ',') return true;
      if (name == 't' && target.name == '.') return true;
      if (name == 't' && target.name == ',') return true;
      if (name == 'u' && target.name == '.') return true;
      if (name == 'u' && target.name == ',') return true;
      if (name == 'w' && target.name == '.') return true;
      if (name == 'w' && target.name == ',') return true;
      if (name == 'y' && target.name == '.') return true;
      if (name == 'y' && target.name == ',') return true;
      if (name == 'Œ' && target.name == '.') return true;
      if (name == 'Œ' && target.name == ',') return true;
      if (name == 'Š' && target.name == '.') return true;
      if (name == 'Š' && target.name == ',') return true;
      if (name == 'š' && target.name == '.') return true;
      if (name == 'š' && target.name == ',') return true;
      return false;
    } else {
      return false;
    }
  }
}

class Carrot extends Creature {
  public Carrot(char name, int x, int y) {
    super(name, x, y);
    active = false;
  }

  public void draw() {
    fill(200,100,20, life*255);
    super.draw();
  }
}

class Cursor {
  int x,y;
  int i;
  public Cursor(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public void update() {
    i++;
  }

  public void draw() {
    fill(255, 140+sin(i/10.0)*120);
    rect(x*cellsize+10,y*cellsize, 3, cellsize);
  }

  void forward() {
    x++;
    if (x >= gridwidth) {
      x = 0;
      y++;
      if (y >= gridheight) {
        y = 0;
      }
    }
  }

  void back() {
    x--;
    if (x < 0) {
      x = gridwidth-1;
      y--;
      if (y < 0) {
        y = gridheight-1;
      }
    }
  }
}

