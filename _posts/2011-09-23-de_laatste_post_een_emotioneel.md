---
layout: post
title: "<No Title>"
workshop_name: 2011 Mad Faculty
workshop_slug: 2011-mad-fac
categories: [2011-mad-fac]
author: joren_paul 
assets:
  -
    filename: CodeKleuren1.JPG
    type: image
  -
    filename: CodeInf.JPG
    type: image
  -
    filename: CodeBody.JPG
    type: image
  -
    filename: CodeKleuren2.JPG
    type: image
  -
    filename: CodeKleuren3.JPG
    type: image
  -
    filename: CodeLichaam.JPG
    type: image
  -
    filename: CodeSnor.JPG
    type: image
  -
    filename: CodeSnorModel.JPG
    type: image
  -
    filename: ExpressionsFinal.JPG
    type: image
  -
    filename: NodesFinal_Joren.JPG
    type: image
  -
    filename: PosterSnor.jpg
    type: image
  -
    filename: Render1-1.png
    type: image
  -
    filename: Render2-1.png
    type: image
  -
    filename: renderfail_joren.JPG
    type: image
  -
    filename: snor1-1.png
    type: image
  -
    filename: snor2-1.png
    type: image
  -
    filename: SnorFinaal_Joren.JPG
    type: image
  -
    filename: 6 brillen met snus.JPG
    type: image
  -
    filename: neus en bril.JPG
    type: image
---
De laatste post, een emotioneel moment voor ons allemaal..<div>Er zijn nog heel wat aanpassingen uitgevoerd voor de laatste versie van ons design. Zo zijn de variabele brillen verwijderd, wegens het te druk worden van het geheel. Het aantal amoebes is ook toegenomen, maar daarover later meer. Door die toename bleken enkele strokes ook niet meer in verhouding. We hebben deze dan smaller gemaakt. Daarnaast hadden we nog een probleem met de variabele kleuren van de amoebes. Die functie hadden we al wel geschreven, maar nog niet in werking gesteld, om rendertijd te besparen. Het probleem bestond eruit dat we een Color Node hadden gebruikt, waaruit alle generators (van vormen binnen in de amoebe en de amoebe zelf) hun variabelen putten voor de kleur. Die variabelen werden echter pas gevormd in de laatste Place node. Daardoor moesten we eigenlijk de Color node met variabelen eigenlijk in het netwerk includen, maar daarop was ons netwerk niet berekend. We hebben het uiteindelijk opgelost door de generators naar elkaar te verwijzen, en de eerste generator rechtstreeks de variabelen van de laatste Place node te laten halen.</div><div><br /><div>Na heel wat renderproblemen hebben we het (dankzij de hulp van de docenten) met een toevoeging onze amoebe-snus met heel veel amoebes toch kunnen renderen. De volgende regels code hebben hier mede voor gezorgd. Ze bieden een oplossing voor het infinity probleem.</div><div><br /></div><div>try:</div><div>&nbsp; &nbsp; &nbsp; p = supershape.path(x, y, w, h, m, n1, n2, n3)</div><div>&nbsp; &nbsp; &nbsp; p.fillColor = self.color</div><div>except:</div><div>&nbsp; &nbsp; &nbsp; return None</div><div><br /></div><div>Een 600 tal amoebes renderen behoorde plots tot de mogelijkheden.</div><div><br /></div><div>Ondertussen kregen we het idee om voor het posterdesign een achtergrond, neus en deel van een bril toe te voegen. Deze hebben we in Illustrator gemaakt en nadat de amoebe-snor in pdf&nbsp;geÃ«xporteerd&nbsp;was konden we alles samenvoegen.</div></div><div><br /></div><div>Bij het exporteren van het geheel hadden we nog een probleem: de kleuren die vanuit Illustrator naar Photoshop waren doorgevoerd bleken niet CMYK compatible te zijn. De afbeelding in Photoshop zag er veel minder goed uit. We hebben uiteindelijk de Photoshop afbeelding toch maar in RGB gezet, en gehoopt dat de uiteindelijk print niet te ver ging afwijken van de oorspronkelijke afbeelding.</div><div><br /></div><div>En toen was het klaar, iedereen was gelukkig, en het project won.</div><div>Groetjes,</div><div>Joren en Paul</div><div><br /></div><div><br /></div><div>Extraatje:</div><div>Een lijst met variabelen:</div><div><br /></div><div>Amoebe - lichaam:</div><div>Grootte</div><div>Vorm</div><div>Kleur</div><div>Textuur (patronen+vlekken binnen)</div><div>Kleur Textuur</div><div><br /></div><div>Amoebe - tanden:</div><div>Aantal</div><div>Grootte</div><div>Startpunt</div><div><br /></div><div>Amoebe - Snorren:</div><div>Vorm</div><div>Positie op Amoebe</div><div><br /></div><div>Amoebe - Ogen:</div><div>Positie op Amoebe</div><div>Kijkrichting</div><div>Grootte</div><div>Aantal (2-4)</div><div><br /></div><div>Totaal snor:</div><div>Positie amoebes</div><div><br /></div><div><br /></div><div><br /></div><div><br /></div>
