---
layout: post
title: "Text scaling to page width"
workshop_name: 2009 Lahti
workshop_slug: 2009-lahti
categories: [2009-lahti]
author: tom 
---
This script will make the text as big as possible, in relation to the canvas width:

<pre>
grid = ximport("grid")

size(470, 430)

fill(0)

txt = "hello"

x = 20 # text position from the left edge
y = 45 # text position from the top

# Draws the text as wide as possible:
p = textpath(txt, 0, y)
p.fit(x, y, WIDTH-x*2, 1000)
drawpath(p)
</pre>
