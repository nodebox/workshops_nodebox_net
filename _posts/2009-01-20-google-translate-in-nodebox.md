---
layout: post
title: "Google Translate in NodeBox"
workshop_name: 2009 Lahti
workshop_slug: 2009-lahti
categories: [2009-lahti]
author: tom 
---
A little NodeBox script to translate languages:

<pre>
q = "your mother smells of elderberry"

from urllib import urlopen, quote
class TranslationError(Exception): 
    pass
def google_translate(q, input="en", output="fi"):
    q = quote(q)
    url  = "http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&"
    url += "q="+q+"&langpair="+input+"%7C"+output
    response = urlopen(url).read()
    head, tail = '{"responseData": {"translatedText":"', '"}'
    i = response.find(head)
    j = response.find(tail, i)
    txt = response[i+len(head):j]
    if "invalid translation" in txt:
        raise TranslationError
    try: txt = txt.decode("utf-8")
    except:
        pass
    return txt
 
txt = google_translate(q, input="en", output="fi")
print txt
text(txt, 25, 80)
</pre>

Output: <em>äitisi haiseekin seljapensaan</em>
