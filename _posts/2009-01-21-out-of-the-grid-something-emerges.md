---
layout: post
title: "Out of the grid, something emerges"
workshop_name: 2009 Lahti
workshop_slug: 2009-lahti
categories: [2009-lahti]
author: Jonatan Hildén
assets:
  -
    filename: toms_geneticpattern_lines_fastfit.png
    type: image
  -
    filename: toms_geneticpattern_lines_largegrid03.png
    type: image
  -
    filename: toms_geneticpattern_lines_largegrid02.png
    type: image
  -
    filename: toms_geneticpattern_lines_largegrid01.png
    type: image
  -
    filename: toms_geneticpattern_lines01.png
    type: image
  -
    filename: spaceinvader.png
    type: image
---
Changing the genetic carpet from drawing pixels to drawing connected lines produce some exciting webs. A smaller interspaced  5 × 5  grid creates some fun space invaders. The fitness function quite quickly decides on a best fit for symmetry. All the images here display the best child of each generation.

<a href="http://workshops.nodebox.net/2009/wp-content/uploads/spaceinvader.png"><img class="alignnone size-full wp-image-1098" title="spaceinvader" src="http://workshops.nodebox.net/2009/wp-content/uploads/spaceinvader.png" alt="spaceinvader" width="377" height="548" /></a>

Some webbed carpets, 5 × 5  grid.

<a href="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines01.png"><img class="alignnone size-medium wp-image-1097" title="toms_geneticpattern_lines01" src="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines01-230x300.png" alt="toms_geneticpattern_lines01" width="230" height="300" /></a>

<a href="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_fastfit.png"><img class="alignnone size-medium wp-image-1093" title="toms_geneticpattern_lines_fastfit" src="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_fastfit-230x300.png" alt="toms_geneticpattern_lines_fastfit" width="230" height="300" /></a>

Single "best offspring" of the algorithm, with constrained connector length.

<a href="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_largegrid01.png"><img class="alignnone size-medium wp-image-1115" title="toms_geneticpattern_lines_largegrid01" src="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_largegrid01-276x300.png" alt="toms_geneticpattern_lines_largegrid01" width="276" height="300" /></a>

A larger grid; the length of the connectors is constrained to one tenth of the gridwidth:

<a href="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines01.png"></a><a href="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_largegrid02.png"><img class="alignnone size-medium wp-image-1095" title="toms_geneticpattern_lines_largegrid02" src="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_largegrid02-230x300.png" alt="toms_geneticpattern_lines_largegrid02" width="230" height="300" /></a>

This is the result of the same 30 × 30  grid as above, but with a pathlength of one fifth of the element width. If the length of the connectors are not constrained, the final generation for a large grid will generally be filled with white lines when all the different points are connected.

<a href="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_largegrid03.png"><img class="alignnone size-medium wp-image-1094" title="toms_geneticpattern_lines_largegrid03" src="http://workshops.nodebox.net/2009/wp-content/uploads/toms_geneticpattern_lines_largegrid03-230x300.png" alt="toms_geneticpattern_lines_largegrid03" width="230" height="300" /></a>

So far, these results are really fascinating. Next on the schedule is more experimenting with the parameters of the genetic algorithm, and trying different ways of displaying the output, like coloring. It would also be neat to try outputting not only the best candidate, but the entire population for the algorithm. I'm also curious to see what more Tom comes up with from looking at the genetic algorithms  I hope I'm able to pick up some understanding from all of this too, so that I eventually can work with the genetic algorithms myself.
