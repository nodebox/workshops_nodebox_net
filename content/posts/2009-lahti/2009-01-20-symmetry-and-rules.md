---
title: Symmetry and rules
author: "Jonatan Hildén"
assets:
 - filename: gridconnect-pattern.gif
   type: image
 - filename: equilateral-tri-grid.png
   type: image
---
It seems I've decided a good basic rule for the genetic algorithm to work with: it should attempt to create a tiling pattern where the edges connect. Thus the pattern while running, will do something like this simplified version, which would eventually reach a checkerboard pattern:<a href="/media/2009-lahti/gridconnect-pattern.gif"><img class="alignnone size-full wp-image-891" title="gridconnect-pattern" src="/media/2009-lahti/gridconnect-pattern.gif" alt="gridconnect-pattern" width="556" height="261" /></a>

Another selection criteria would be the symmetry of the pattern inside the tiles, which might lead to interesting results  the patterns would become more regular. I also managed to create a simple grid of equilateral triangles which might or mightn't be useful.

<a href="/media/2009-lahti/equilateral-tri-grid.png"><img class="alignnone size-full wp-image-895" title="equilateral-tri-grid" src="/media/2009-lahti/equilateral-tri-grid.png" alt="equilateral-tri-grid" width="229" height="370" /></a>
