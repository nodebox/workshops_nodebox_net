// Dit bestand bevat een aantal hulpfuncties om te werken met de canvas.

/* jshint node: true, unused: false */
/* global Promise, alert, console, ctx */

'use strict';

//// TEKENEN
//// Nuttige functies om lijnen en cirkels te tekenen.

function strokeLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// https://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
function addEllipse(x, y, w, h) {
    var kappa = 0.5522848;
    var ox = (w / 2) * kappa; // control point offset horizontal
    var oy = (h / 2) * kappa; // control point offset vertical
    var xe = x + w; // x-end
    var ye = y + h; // y-end
    var xm = x + w / 2; // x-middle
    var ym = y + h / 2; // y-middle
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
}

function strokeEllipse(x, y, w, h) {
    ctx.beginPath();
    addEllipse(x, y, w, h);
    ctx.stroke();
}

function fillEllipse(x, y, w, h) {
    ctx.beginPath();
    addEllipse(x, y, w, h);
    ctx.fill();
}

//// EVENTS
//// Automatisch beschikbaar maken van mouseX, mouseY, pmouseX, pmouseY
window.mouseX = 0;
window.mouseY = 0;
window.pmouseX = 0;
window.pmouseY = 0;
window.mouseDown = false;

window.addEventListener('mousemove', function (e) {
    window.pmouseX = window.mouseX;
    window.pmouseY = window.mouseY;
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
});

window.addEventListener('mousedown', function () {
    window.mouseDown = true;
});

window.addEventListener('mouseup', function () {
    window.mouseDown = false;
});

//// KLEUREN
//// Manipulatie van kleur: hsv naar rgb en omgekeerd.

// Based on https://github.com/bgrins/TinyColor/blob/master/tinycolor.js
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = max;
    var v = max;

    var d = max - min;
    var s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // Achromatic
    } else {
        switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function hsvToRgb(h, s, v) {
    h *= 6;
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];

    return {
        r: r * 255,
        g: g * 255,
        b: b * 255
    };
}

function compareHue(a, b) {
    return a.h - b.h;
}

function compareSaturation(a, b) {
    return a.s - b.s;
}

function compareValue(a, b) {
    return a.v - b.v;
}

function sortPixels(pixels, method) {
    var i;
    var l;
    var hsv = [];
    hsv.length = pixels.data.length / 4;
    var j = 0;
    for (i = 0, l = pixels.data.length; i < l; i += 4) {
        var r = pixels.data[i];
        var g = pixels.data[i + 1];
        var b = pixels.data[i + 2];
        hsv[j] = rgbToHsv(r, g, b);
        j++;
    }

    if (method === 'hue') {
        hsv.sort(compareHue);
    } else if (method === 'saturation') {
        hsv.sort(compareSaturation);
    } else if (method === 'value') {
        hsv.sort(compareValue);
    } else {
        throw new Error('Unknown sort method ' + method);
    }

    j = 0;
    for (i = 0, l = pixels.data.length; i < l; i += 4) {
        var hsvObj = hsv[j];
        var rgb = hsvToRgb(hsvObj.h, hsvObj.s, hsvObj.v);
        j++;

        pixels.data[i] = rgb.r;
        pixels.data[i + 1] = rgb.g;
        pixels.data[i + 2] = rgb.b;
    }
}

//// VIDEO
//// Functies om het video beeld te laden.

function videoPromise(constraints) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(constraints);
    } else if (navigator.webkitGetUserMedia) {
        return new Promise(function (y, n) {
            navigator.webkitGetUserMedia(constraints, y, n);
        });
    } else if (navigator.mozGetUserMedia) {
        return new Promise(function (y, n) {
            navigator.mozGetUserMedia(constraints, y, n);
        });
    } else {
        alert('Video is not supported in this browser.');
    }
}

function loadVideo(options, callback) {
    console.assert(arguments.length >= 1);
    if (arguments.length === 1) {
        callback = options;
        options = {};
    }
    var videoWidth = options.width || 640;
    var videoHeight = options.height || 480;
    var audio = options.audio || false;
    var constraints = {
        audio: audio,
        video: true
    };
    videoPromise(constraints)
        .then(function (stream) {
            var video = document.createElement('video');
            video.style.display = 'none';
            video.width = videoWidth;
            video.height = videoHeight;
            video.src = window.URL.createObjectURL(stream);
            video.onloadedmetadata = function (e) {
                video.play();
                setInterval(function () {
                    callback(video);
                }, 30);
            };
            document.body.appendChild(video);
        })
        .catch(function (err) {
            console.error(err.name + ': ' + err.message);
        });
}

//// RANDOM
//// Dit stukje code hieronder maakt Math.seedrandom beschikbaar.

function random(min, max) {
    return min + Math.random() * (max - min);
}

/* jshint ignore:start */
! function (a, b) {
    function c(c, j, k) {
        var n = [];
        j = 1 == j ? {
            entropy: !0
        } : j || {};
        var s = g(f(j.entropy ? [c, i(a)] : null == c ? h() : c, 3), n),
            t = new d(n),
            u = function () {
                for (var a = t.g(m), b = p, c = 0; q > a;) a = (a + c) * l, b *= l, c = t.g(1);
                for (; a >= r;) a /= 2, b /= 2, c >>>= 1;
                return (a + c) / b
            };
        return u.int32 = function () {
            return 0 | t.g(4)
        }, u.quick = function () {
            return t.g(4) / 4294967296
        }, u["double"] = u, g(i(t.S), a), (j.pass || k || function (a, c, d, f) {
            return f && (f.S && e(f, t), a.state = function () {
                return e(t, {})
            }), d ? (b[o] = a, c) : a
        })(u, s, "global" in j ? j.global : this == b, j.state)
    }

    function d(a) {
        var b, c = a.length,
            d = this,
            e = 0,
            f = d.i = d.j = 0,
            g = d.S = [];
        for (c || (a = [c++]); l > e;) g[e] = e++;
        for (e = 0; l > e; e++) g[e] = g[f = s & f + a[e % c] + (b = g[e])], g[f] = b;
        (d.g = function (a) {
            for (var b, c = 0, e = d.i, f = d.j, g = d.S; a--;) b = g[e = s & e + 1], c = c * l + g[s & (g[e] = g[f = s & f + b]) + (g[f] = b)];
            return d.i = e, d.j = f, c
        })(l)
    }

    function e(a, b) {
        return b.i = a.i, b.j = a.j, b.S = a.S.slice(), b
    }

    function f(a, b) {
        var c, d = [],
            e = typeof a;
        if (b && "object" == e)
            for (c in a) try {
                d.push(f(a[c], b - 1))
            } catch (g) {}
        return d.length ? d : "string" == e ? a : a + "\0"
    }

    function g(a, b) {
        for (var c, d = a + "", e = 0; e < d.length;) b[s & e] = s & (c ^= 19 * b[s & e]) + d.charCodeAt(e++);
        return i(b)
    }

    function h() {
        try {
            if (j) return i(j.randomBytes(l));
            var b = new Uint8Array(l);
            return (k.crypto || k.msCrypto).getRandomValues(b), i(b)
        } catch (c) {
            var d = k.navigator,
                e = d && d.plugins;
            return [+new Date, k, e, k.screen, i(a)]
        }
    }

    function i(a) {
        return String.fromCharCode.apply(0, a)
    }
    var j, k = this,
        l = 256,
        m = 6,
        n = 52,
        o = "random",
        p = b.pow(l, m),
        q = b.pow(2, n),
        r = 2 * q,
        s = l - 1;
    if (b["seed" + o] = c, g(b.random(), a), "object" == typeof module && module.exports) {
        module.exports = c;
        try {
            j = require("crypto")
        } catch (t) {}
    } else "function" == typeof define && define.amd && define(function () {
        return c
    })
}([], Math);
/* jshint ignore:end */