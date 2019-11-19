---
layout: post
title: "Third day, Team JAJ"
workshop_name: 2013 Vilnius
workshop_slug: 2013-vilnius
categories: [2013-vilnius]
author: JAJ 
assets:
  -
    filename: Graph.png
    type: image
  -
    filename: skecas.png
    type: image
  -
    filename: top_movies.png
    type: image
  -
    filename: Screen Shot 2013-03-14 at 4.14.06 PM.png
    type: image
---
Over the last day, we gathered the data and tried to come up with good ways to visualize the complexity of it. We wanted to measure the change in usage of certain words in cinema. To get the best results, we decided to:<div><ol><li>Find the most popular movies in the last 50 years. IMDb lists the <a href="http://www.imdb.com/year/1962/">most</a> <a href="http://www.imdb.com/year/1994/">popular</a> <a href="http://www.imdb.com/year/1997/">movies</a> <a href="http://www.imdb.com/year/2004/">for</a> <a href="http://www.imdb.com/year/2012/">every</a> <a href="http://www.imdb.com/year/1981/">year</a>. Jonas wrote a <a href="https://gist.github.com/lekevicius/5161415">script to crawl IMDb and find top movies with their IMDb ids</a> (needed for later). The results can be seen in one of the pictures.</li><li>Download subtitles for every movie. As was expected, this was far from easy. Luckily, <a href="http://trac.opensubtitles.org/projects/opensubtitles/wiki/XMLRPC">OpenSubtitles has an API</a> and some <a href="https://github.com/byroot/ruby-osdb">command-line tools</a> for it. Sadly, they block IPs after a few hundred requests, so we had to change IPs three times. Anyway, in the end we had 500 hundred subtitle files, 10 for every year. To download and process all the subtitles we used <a href="https://gist.github.com/lekevicius/5161526">another script</a> Jonas wrote. Sample data is attached.</li><li>Then we&nbsp;<a href="https://gist.github.com/lekevicius/5161561">cleaned and merged the subtitles</a>, and <a href="https://gist.github.com/lekevicius/5161577">analysed it</a>&nbsp;with <a href="http://www.clips.ua.ac.be/pages/pattern">Python patterns library</a>.</li><li>Finally, we <a href="https://gist.github.com/lekevicius/5161594">calculated frequencies for interesting words</a> and <a href="https://gist.github.com/lekevicius/5161604">converted the data to CSV</a>.</li><li>With CSV, we were able to graph the output and see the early results. The first graph is attached.</li></ol><div>On visualisation side, we came up with an idea of sound wave. That would mean splitting every line into its own graph and generating a sound-wave-looking vibration, that corresponds with the word usage frequency throughout 50 years of cinema.</div></div>
