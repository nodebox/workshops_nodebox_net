---
layout: post
title: "Course Material"
workshop_name: 2011 Torino
workshop_slug: 2011-torino
categories: [2011-torino]
author: Frederik De Bleser
assets:
  -
    filename: pattern.pdf
    type: file
  -
    filename: ows-sample.txt
    type: file
  -
    filename: 12_17_no_RT.csv.zip
    type: file
  -
    filename: 12_17_RT_count.csv.zip
    type: file
  -
    filename: total.csv.zip
    type: file
  -
    filename: gruppo-2e3 (age,gender,education_level,institution,profession,count).csv
    type: file
  -
    filename: gruppo-1 (Region,age,gender,edcation,count).csv
    type: file
  -
    filename: arc-1.0.zip
    type: file
  -
    filename: ows.csv.zip
    type: file
  -
    filename: gruppo-1-solo-aosta.csv
    type: file
  -
    filename: gruppo-1.csv
    type: file
  -
    filename: phyllotaxis.ndbx
    type: file
  -
    filename: node-logo-1.zip
    type: file
---
<b>Pattern Slides<br /></b><ul><li><a href="http://workshops.nodebox.net/2011-torino/course-material/pattern.pdf">pattern.pdf</a></li></ul><div><b>Lorenzo (open data) presentation</b></div><div><ul><li><a href="http://www.slideshare.net/lorenzobenussi/what-is-opendata">http://www.slideshare.net/lorenzobenussi/what-is-opendata</a></li></ul></div><div><b><br /></b></div><div><b><span class="Apple-style-span" style="font-weight: normal; "><div><b>Occupy Wall Street Historical Twitter Data</b></div><div>1) Annotated data</div><div>Each row has:&nbsp;<i>tweet</i>,&nbsp;<i>date</i>,&nbsp;<i>time</i>,&nbsp;<i>language</i>,&nbsp;<i>keyword</i>,&nbsp;<i>keyword score</i>,&nbsp;<i>polarity</i>,&nbsp;<i>subjectivity</i>,&nbsp;<i>profanity</i>,&nbsp;<i>retweets</i>.&nbsp;The RT set contains English tweets that have been retweeted at least once, it is only 4MB and ideal for testing. The file "ows.py" is a Pattern script with a couple of examples of how to mine the data (for example, top negative tweets, top dirty tweets, tweets containing "arrest", ...)&nbsp;The keyword score can be used to interpret the "uniqueness" of the tweet.&nbsp;The&nbsp;<i>polarity</i>&nbsp;is based on positive/negative adjectives. However, since each Occupy Wall Street tweet could be seen as somewhat negative/revolutionary, you might experiment with only considering&nbsp;<i>polarity</i>&nbsp;&gt; 0.5 as being positive.</div><div><ul style="margin-top: 0px; margin-right: 0px; margin-bottom: 0.75em; margin-left: 20px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; list-style-type: disc; list-style-position: outside; list-style-image: initial; background-repeat: no-repeat repeat; "><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://organisms.be/downloads/OWS-sentiment.csv.zip" style="text-decoration: underline; ">OWS-sentiment.csv.zip</a>&nbsp;(full, 300,000 tweets, 2011/11/12 - 2011/11/17)</li><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://workshops.nodebox.net/2011-torino/course-material/OWS-RT-sentiment.csv.zip" style="text-decoration: underline; ">OWS-RT-sentiment.csv.zip</a></li><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://workshops.nodebox.net/2011-torino/ows.py.zip" style="text-decoration: underline; ">ows.py.zip</a></li></ul><div><br /></div></div><div>2) Raw data</div><ul style="margin-top: 0px; margin-right: 0px; margin-bottom: 0.75em; margin-left: 20px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; list-style-type: disc; list-style-position: outside; list-style-image: initial; background-repeat: no-repeat repeat; "><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://workshops.nodebox.net/2011-torino/2011/12/14/ows.csv.zip" style="text-decoration: underline; ">ows.csv.zip</a>&nbsp;-&gt; last version (it works with Pattern)</li><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://workshops.nodebox.net/2011-torino/2011/12/14/ows-days-retweet.csv" style="text-decoration: underline; ">ows-days-retweet.csv</a>&nbsp;-&gt; number of total retweets per day</li><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://workshops.nodebox.net/2011-torino/2011/12/14/12_17_no_RT.csv.zip">12_17_no_RT.csv.zip</a></li><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://workshops.nodebox.net/2011-torino/2011/12/14/12_17_RT_count.csv.zip" style="text-decoration: underline; ">12_17_RT_count.csv.zip</a>&nbsp;-&gt; Number of retweets for each tweet</li><li style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; font-size: 1em; font-weight: normal; "><a href="http://workshops.nodebox.net/2011-torino/course-material/ows-sample.txt" style="text-decoration: underline; ">ows-sample.txt</a>&nbsp;-&gt; raw data sample from&nbsp;<a href="http://montera34.com/occupyresearch/" style="text-decoration: underline; ">OccupyResearch Collective</a></li></ul></span></b></div><div><b><br /></b></div><div><b>Custom Nodes</b></div><div><ul><li><a href="http://workshops.nodebox.net/2011-torino/arc-1.0.zip">Arc</a></li><li><a href="http://workshops.nodebox.net/2011-torino/phyllotaxis.ndbx">phyllotaxis.ndbx</a></li><li><a href="http://workshops.nodebox.net/2011-torino/node-logo-1.zip">NodeBox Logo</a></li></ul><div><br /></div></div><div><b>OpenPolis Data</b></div><div><ul><li><a href="http://workshops.nodebox.net/2011-torino/2011/12/14/openpolis_csv/gruppo-1%20%28Region%2Cage%2Cgender%2Cedcation%2Ccount%29.csv">gruppo-1 (Region,age,gender,edcation,count).csv</a></li><li><a href="http://workshops.nodebox.net/2011-torino/2011/12/14/gruppo-2e3%20%28age%2Cgender%2Ceducation_level%2Cinstitution%2Cprofession%2Ccount%29.csv">gruppo-2e3 (age,gender,education_level,institution,profession,count).csv</a></li><li><a href="http://workshops.nodebox.net/2011-torino/total.csv.zip">total.csv.zip</a></li><li><a href="http://workshops.nodebox.net/2011-torino/gruppo-1.csv">gruppo-1.csv</a></li><li><a href="http://workshops.nodebox.net/2011-torino/gruppo-1-solo-aosta.csv">gruppo-1-solo-aosta.csv</a></li></ul></div><div><br /></div>
