---
layout: post
title: "Kalle's data visualisation idea"
workshop_name: 2011 Helsinki
workshop_slug: 2011-helsinki
categories: [2011-helsinki]
author: kalle 
---
Sorry, I won't be able to make it today as I have to be here at the workshop. However, please find below my data visualisation idea.

<strong>Super size usIn a variety of countries, how much weight will a typical earner gain if during one month, he consumes his entire income in Big Macs</strong>
<strong>Data sets:</strong>

UBS survey having a variation of the Big Mac index:
How many minutes must a median earner work in order to be able to afford one Big Mac, in 71 countries
http://www.ubs.com/1/ShowMedia/media_overview/media_global/releases?contentId=170255&amp;name=P+L_2009_e.pdf

National colours or flags:
http://en.wikipedia.org/wiki/National_colours
(Colours can be parsed from the table by assigning an rgb value to each colour term used. National flags are available as svg files.)

Data from the documentary 'Super Size Me':
The subject consumed 5000 kcals a day for 30 days
One Big Mac has 540 kcals
He gained 11.1 kg during the month, a 13 % increase in body mass

Average calorie intake per day (male, 30 yrs, 70 kg, 5'10'', basic metabolic rate): 1666 kcals
http://www.freedieting.com/tools/calorie_calculator.htm:

With these data we can calculate how much excess calories a median earner accrues during a month. This amount will be translated to tentative weight gains using the results from Super Size Me.
<strong>Visualisation:</strong>

Possibly a set of human figures whose corpulence increases as a function of the excess calorie intake (nb. mass ~ volume ~ radius²). A sofisticated algorith needs to be construed so as to maintain a level of naturality in the effects of obesity: e.g. the waist circumference will increase most rapidly, eyes will not be spread further apart although cheeks will get fatter, etc. This can be accomplished, for example, by manipulating path points directly in predrawn vector shapes for different body parts and translating dependent parts correspondingly (the arms must move when the torso gets thicker).

The figures will be either coloured with the national colours obtained from the second data set or overlayed with the national flags.

Informative labels (such as country, Big Macs eaten, minutes to work / Big Mac) will be shown, too.
