size(800, 600)
speed(30)
transform(CORNER)
import time
print transform()
nofill()
stroke(0)
from math import sin
from random import seed
import time
from AppKit import *


# loft init

LOFT_MIN_WIDTH  = 40 # absolute minimum for the font visual?
LOFT_MIN_HEIGHT = 40 # absolute minimum for the font visual?
MIN_FLOORS      = 4
MAX_FLOORS      = 22 # how many floors in a building? (+10)
LOFT_SIZE       = 6 # 1-6, loft size relative to the slot area
LOFT_ALPHA      = 0.4
LOFT_STROKE     = 0.05
LOFT_GRAVITY    = 1.22 # smaller is heavier
LOFT_BEND       = 0.2
FLOOR_HEIGHT    = 4 # base floor height, minimum
LOFT_SHAKE      = 24
LOFT_RND_HEIGHT = 32 # added to floor height, random


FONT        = "Meme city grid"
FONT_ACTIVE = True
FONT_SIZE   = 140

SPEAKER_FONT            = "Futura"
SPEAKER_FONT_SIZE       = 30
TEXT_X                  = 42
TEXT_Y                  = 124
SPEAKER_TXT_ALPHA       = 0.3
SPEAKER_FADE_SPEED      = -5
FADER_INIT              = 400
SPEAKER_WAIT            = 40 # amount of frames between sentences
SPEAKER_RANDOM_TIMING   = 120 

R = 0.5
G = 0
B = 0
A = 0.2

# city perspective

SKEW            = -35
SCALE_Y         = 0.72
SCALE_X         = 1 # always 1
X_PUSH          = 64

# grid init

LOFT_COUNT      = 5+random(4) # how many lofts in the grid

GRID_X          = 20+random(WIDTH/12)
GRID_Y          = 140+random(WIDTH/12)
#MIN_ROWS        = 2
MIN_COLUMNS     = 3
MAX_COLUMNS     = 5
GRID_SIZE       = WIDTH/8

GRID_X_SPACING = GRID_SIZE*1.6
GRID_Y_SPACING = GRID_SIZE*1.6

# slot graphics

SLOT_STROKE     = 0.2
SLOT_BUMPER     = 24 # pixels




# poem init

sentences = [
    "I sensed it in the streets.", 
    "Evolution can be physical, or cultural.",
    "Therefore, I do not talk about miims.",
    "Invisible things grow in silence.",
    "And so we become one.",
    "A shooting star, or an entire city.",
    "Miims are god.",
    "Non-existing, but all powerful.",
    "Of things you cannot talk about, you must remain quiet.",
    "A universe in a grain of sand.",
    "An idea can be a starting point, but it only ignites the miim.",
    "Fighting for survival.",
    "See it for yourself.",
    "Anything could be called a miim.",
    "Anything can be a miim.",
    "Miims do not exist.",
    "Religion is a power miim.",
    "Something you must be fast to forget."
    ]
         

scrape = NSSound.alloc().initWithContentsOfFile_byReference_("scrape.wav", True)
click = NSSound.alloc().initWithContentsOfFile_byReference_("click.wav", True)
can = NSSound.alloc().initWithContentsOfFile_byReference_("can.wav", True)
pickup = NSSound.alloc().initWithContentsOfFile_byReference_("pickup.wav", True)
chop = NSSound.alloc().initWithContentsOfFile_byReference_("chop.wav", True)

#key_map = {'a':scrape, 
#           'b':click, 
#           'c':can, 
#           'd':pickup, 
#           'e':chop}

key_map = [scrape, 
           click, 
           can, 
           pickup, 
           chop]


print 'IT BEGINS'


# THE GRID

class Grid:
    def __init__(self):
        
        # grid origin point
        self.x = GRID_X
        self.y = GRID_Y
        
                
        # init the first row
        self.rowNum = 0
        self.xpush = 0 # amount to translate the slot graphic
        self.initRow(self.rowNum)
        
        # for loft count, create coordinates and a slot for a character in every grid unit
        self.slots = []
    
        for i in range(LOFT_COUNT):
            self.slot = {}

            self.slot["x"] = self.x + GRID_X_SPACING*self.col+(self.xpush)
            self.slot["y"] = self.y + GRID_Y_SPACING*self.rowNum*SCALE_Y

            self.slot["w"] = GRID_X_SPACING
            self.slot["h"] = GRID_Y_SPACING
    
            self.slots.append(self.slot)
            
            if self.col >= self.newCols:
                self.col = 0
                self.rowNum += 1
                self.initRow(self.rowNum)
            else:
                self.col += 1
                
        #print self.slots
    
    def initRow(self, rowNum):
        self.row = rowNum
        # set new rox X bumper based on skew (let's fake it for now)
        self.xpush = (self.row-1) * X_PUSH
        self.newCols = MIN_COLUMNS+random(MAX_COLUMNS-MIN_COLUMNS)
        if rowNum == 0:
            self.newCols = int(self.newCols/2)
        if rowNum == 1:
            self.newCols = self.newCols
        if rowNum == 2:
            self.newCols = int(self.newCols/2)
        self.startColumn = random(MAX_COLUMNS-self.newCols)
        self.col = self.startColumn
        if self.newCols >= LOFT_COUNT and rowNum == 0:
            self(rowNum)            
            pass
        
    def update(self):
        pass

    def draw(self):
        stroke(SLOT_STROKE)
        for slot in self.slots:
            self.drawSlot(slot)
        
    def drawSlot(self, slot):
        # get slot coordinates for drawing
        push()
        skew(SKEW)
        scale(SCALE_X, SCALE_Y)
        self.sx = slot["x"]
        self.sy = slot["y"]
        self.sw = GRID_X_SPACING-SLOT_BUMPER
        self.sh = GRID_Y_SPACING-SLOT_BUMPER
        fill(1, 0.9, 0.9, self.sy/HEIGHT)
        rect(self.sx, self.sy, self.sw, self.sh)  
        pop()   
            
# WRITING THE CHARACTERS

class Typer:
    def __init__(self):
        self.textline = ""
        self.lastframe = -100
        self.empty = True
        
    def update(self):
        global lofts
        global city
        if keydown and FRAME - self.lastframe > 5:
            if keycode == 51: # backspace
                if not len(lofts) == 0:
                    # delete a loft and the last char
                    self.textline = self.textline[:-1]
                    lofts.pop()
                else:
                    if not self.empty:
                        # re-create the city shape and slots
                        city = Grid()
                        lofts = []
                        self.empty = True
                
            else:
                if len(self.textline) < LOFT_COUNT:
                    self.empty = False
                    if self.empty:
                        pass
                    self.textline += key
                    # build a loft for the new character (store inside the grid)
                    createLoft(key)
                    # play a sound
                    sound = choice(key_map)
                    if sound is not None:
                        sound.stop()
                        sound.play()

            self.lastframe = FRAME

def createLoft(key):
    global lofts
    
    # index: length of lofts
    index = len(lofts)
    
    # calculate w and h based on slot size and a random factor
    rnd = random(city.slots[index]["w"])
    w = h = city.slots[index]["w"]/2-(rnd/LOFT_SIZE)
    if w < LOFT_MIN_WIDTH:
        w = LOFT_MIN_WIDTH
    if h < LOFT_MIN_HEIGHT:
        h = LOFT_MIN_HEIGHT
        
        
    
    # calculate new pos inside the slot (center)

    x = city.slots[index]["x"]
    y = city.slots[index]["y"]
    slotW = city.slots[index]["w"]
    new_loft = Loft(key, x, y, w, h, slotW, index)
    lofts.append(new_loft)
    
    


# GROW BUILDINGS FROM THE CHARACTERS IN LIST

class Loft:
    def __init__(self, char, x, y, w, h, slotW, index):
        self.char = char
        self.startFrame = FRAME
        self.tg_height = MIN_FLOORS+random(MAX_FLOORS-MIN_FLOORS)
        self.rndShake = random(LOFT_SHAKE)
        self.rndVerticalHeight = random(LOFT_RND_HEIGHT)
        self.bend = random(LOFT_BEND)
        self.x = x - 36
        self.y = y + 72
        self.w = w
        self.h = h
        self.index = index
        self.height = 1
        self.growing = True
        self.slotW = slotW
        self.margin = (slotW-self.w)/2
        self.fontX = self.x+self.margin
        self.fontY = self.y+self.margin
        self.rndScaleX = random()/100*2
        self.rndScaleY = random()/100*2
        
        

    def update(self):
        # draw all the floors w. transformations
        if(self.height <= self.tg_height):
            self.height += 1
        else:
            if self.growing:
                self.growing = False
                self.lastFrame = FRAME
                    
    def draw(self):
        # draw the building floor elements for the loft
        
        push()
        scale(SCALE_X, SCALE_Y)
        stroke(LOFT_STROKE)
        self.a = time.time()*(self.index+1)
        for i in range(self.height):
            fill(0.5, 0, 0, (i*LOFT_ALPHA)/self.height)
            sine = sin(self.a)
            push()
            # "global perspective"
            skew(SKEW)
            scale(SCALE_X, SCALE_Y)
            
            if FONT_ACTIVE:
                self.floor = textpath(self.char, self.fontX, self.fontY)
                drawpath(self.floor)
            else:
                rect(self.fontX, self.fontY, self.w, self.h)
            pop()

            # grow building, bend with sine
            translate(sine*self.bend, -(FLOOR_HEIGHT+self.rndVerticalHeight)+(i/LOFT_GRAVITY))
            # scale adds tapering to the building
            self.scaleAdd = i/self.height
            scale(1+self.rndScaleX+self.scaleAdd, 1+self.rndScaleY+self.scaleAdd)


        #self.drawFloor()
        pop()        

    def drawFloor(self):
        pass
       
        
# SPEECH SYNTHESIZER -- MEME POETRY


from AppKit import NSSpeechSynthesizer 
from random import seed

class Speaker:
    def __init__(self, sentences):
        self.sentences = sentences
        self.synth = NSSpeechSynthesizer.alloc().initWithVoice_(NSSpeechSynthesizer.defaultVoice())
        self.wait_a_little = 0
        self.spoken = []
        self.seed = time.time()
        self.visible = ""
        self.fader = FADER_INIT
        self.alpha = SPEAKER_TXT_ALPHA
        self.fadeIn = True
        self.waitTime = SPEAKER_WAIT + random(SPEAKER_RANDOM_TIMING)
        
    def update(self):
        if not self.synth.isSpeaking():
            if self.wait_a_little > self.waitTime:
                self.wait_a_little = 0
                seed(time.time())
                txt = choice(self.sentences)
                self.sentences.remove(txt)
                self.synth.startSpeakingString_(txt)
                self.fader = 0
                self.spoken.append(txt)
                self.visible = txt
                self.fadeIn = True
                self.waitTime = SPEAKER_WAIT + random(SPEAKER_RANDOM_TIMING)
            else:
                self.wait_a_little += 1
                self.fader += SPEAKER_FADE_SPEED*2
        else:
            # test if fadein is complete
            if self.fader > FADER_INIT:
                self.alpha = SPEAKER_TXT_ALPHA
                self.fadeIn = False
                self.fader = FADER_INIT
            if self.fadeIn:
                self.fader += -SPEAKER_FADE_SPEED
            else:
                self.fader += SPEAKER_FADE_SPEED
            
    def draw_the_thing(self):
        seed(self.seed)
        #for txt in self.spoken:
        self.visible = self.visible.replace("iim", "eme")
        self.visible = self.visible.replace("iims", "emes")
        
        self.alpha = self.fader/1000.0
        if self.alpha >= SPEAKER_TXT_ALPHA:
            self.alpha = SPEAKER_TXT_ALPHA
        
        font(SPEAKER_FONT)
        push()
        fill(R, G, B, self.alpha)
        #print self.fader
        text(self.visible, TEXT_X, TEXT_Y)
        pop()
        font(FONT)       

def setup():
    global typer
    global loft, maxFloors
    global lofts
    global city
    global speaker
    
    # init meme poetry
    speaker = Speaker(sentences)

    # init the lofts array
    lofts = []

    # init the city grid
    city = Grid()

    # init the writing of characters    
    typer = Typer()
    
    
def draw():
    global typer 
    global loft, maxFloors
    global lofts
    global city
    global speaker
    
    # update the visible characters list (typer.textline)
    typer.update()
    
    # update the grid
    city.update()
    city.draw()
    
    # keep drawing all the buildings    
    nostroke()
    font(FONT)
    fontsize(FONT_SIZE)
    for loft in lofts:
        loft.update()
        loft.draw()
    
    # do the talking    
    font(SPEAKER_FONT)
    fontsize(SPEAKER_FONT_SIZE)
    speaker.update()
    speaker.draw_the_thing()
    
    global playing
    
    #if keydown:
        #sound = key_map.get(key) # or index?
                    
    





            
    
