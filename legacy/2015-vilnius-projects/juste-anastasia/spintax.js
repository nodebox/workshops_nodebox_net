
    var SPINTAX_PATTERN = /\{[^"\r\n\}]*\}/;
    function unspin (spun){
        var match;
        while(match = spun.match(SPINTAX_PATTERN)){
            match = match[0];
            var candidates = match.substring(1,match.length-1).split("|");
            spun = spun.replace(match,candidates[Math.floor(Math.random() * candidates.length)])
        }
        return spun;
    }

    /*
     * @param {string} spun
     * @return {Number}
     */
    function countVariations (spun){
        spun = spun.replace(/[^{|}]+/g,'1');
        spun = spun.replace(/\{/g,'(');
        spun = spun.replace(/\|/g,'+');
        spun = spun.replace(/\}/g,')');
        spun = spun.replace(/\)\(/g,')*(');
        spun = spun.replace(/\)1/g,')*1');
        spun = spun.replace(/1\(/g,'1*(');
        return eval(spun);
    }
