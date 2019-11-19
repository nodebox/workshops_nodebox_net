---
layout: post
title: "6th day. National romanticism."
workshop_name: 2009 Lahti
workshop_slug: 2009-lahti
categories: [2009-lahti]
author: Juhani 
assets:
  -
    filename: landskeip400.png
    type: image
---
<a href="http://workshops.nodebox.net/2009/wp-content/uploads/landskeip400.png"><img class="aligncenter size-full wp-image-747" title="landskeip400" src="http://workshops.nodebox.net/2009/wp-content/uploads/landskeip400.png" alt="landskeip400" width="600" height="424" /></a>

size(600, 424)
from math import sin

fill(0, 0, 0)
for i in range(200):
rect(0, 180+3*i*i*i*0.0011, 600, 0.5)

rotate(-60)
for i in range(49):
rect(-391+i*12, -120, 0.5, 850)
rotate(i*0.051)
reset()

rotate(60)
for i in range(61):
rect(558-i*6, -320, 0.5, 900)
rotate(-i*0.034)
reset()

fill(1, 1, 1)
rect(0, 0, 600, 180)

fill(0, 0, 0)
for i in range(300):
rect(i*2, 0, 0.3, 180)

fill(1, 1, 1)
oval(170, 100, 50, 50)

fill(0, 0, 0)
for i in range(450):
rect(-152+i*2, 180, 0.5, random(4,9)*-sin(i/15.0)-40)
for i in range(450):
rect(-150+1+i*2, 180, 0.5, random(5,15)*-sin(i/30.0)-35)
for i in range(450):
rect(-150+i*2, 180, 0.5, random(10,30)*-sin(i/30.0)-30)
