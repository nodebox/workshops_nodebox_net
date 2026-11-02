/*** BEGIN Cookie Functions ***/
//Expire date in days
function setCookie(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());

    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }

    var expires_date = new Date(today.getTime() + (expires));

    document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires_date.toGMTString() : "");
}

function getCookie(check_name) {
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f

    for (i = 0; i < a_all_cookies.length; i++) {
        // now we'll split apart each name=value pair
        a_temp_cookie = a_all_cookies[i].split('=');

        // and trim left/right whitespace while we're at it
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        // if the extracted name matches passed check_name
        if (cookie_name == check_name) {
            b_cookie_found = true;

            // we need to handle case where cookie has no value but exists (no = sign, that is):
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
            }

            // note that in cases where cookie is initialized but no value, null is returned
            return cookie_value;
            break;
        }
        a_temp_cookie = null;
        cookie_name = '';
    }

    if (!b_cookie_found) {
        return '';
    }
}
/*** END Cookie Functions ***/

/*** BEGIN Validation Functions ***/
function parseErrors(dataError, showCustomErrors) {
    var customErrorString = '';

    var dataError = dataError.replace(/<BR>/g, '|');
    errStr = dataError.split('|');

    for (var i = 0; i < errStr.length; i++) {
        var errorString = errStr[i];

        if (errorString != '') {
            var illegalCharacters = new RegExp(/[.,!;?@><]/);

            if (illegalCharacters.test(errorString)) {
                //Build custom error string
                customErrorString += errorString + '<br />'
            }
            else {
                errorString = errorString.replace('.', '');
                var errorElements = $('.' + errorString);

                if (errorElements.length != 0) {
                    //Add "error" class to element(s)
                    errorElements.addClass('error');
                }
                else {
                    //Build custom error string
                    customErrorString += errorString + '<br />'
                }
            }
        }
    }

    //Only show custom errors if specified
    if (showCustomErrors != null) {
        if (showCustomErrors) {
            $('#customErrors').html(customErrorString);
        }
    }
}
/*** END Validation Functions ***/

String.format = function () {
    var s = arguments[0];

    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

function isNumberKey(event) {
    var charCode = (event.which) ? event.which : event.keyCode

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}

/*** BEGIN Convert Date to String ***/
//source: http://blog.stevenlevithan.com/archives/date-time-format
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
} ();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
/*** END Convert Date to String ***/

/*** BEGIN Textarea limit counter ***/
// call inline as: limitText(document.getElementById('INFORMATION'), 'INFORMATION_AVAILABLE_CHARACTERS', 350);
function limitText(limitField, limitCountId, limitNum) {
    limitCount = document.getElementById(limitCountId);
    limitFieldText = limitField.value;

    /* Newline characters count as 2 characters in DB, so they should be counted twice instead of once
    /\n/g is a regular expression meaning 'look for the character \n (line break), and do it globally (across the whole string).
    The ||[] part is just in case there are no line breaks. Match will return null, so we test the length of an empty array instead to avoid errors.
    */
    totalNewlines = (limitFieldText.match(/\n/g) || []).length;
    limitFieldTextLength = limitFieldText.length + totalNewlines;

    if (limitFieldTextLength > limitNum) {
        limitField.value = limitFieldText.substring(0, limitNum - totalNewlines);

        //Recalculate textlength (with enter characters)
        limitFieldTextLength = limitField.value.length + totalNewlines;
    }

    limitCount.innerHTML = limitNum - limitFieldTextLength;
}
/*** END Textarea limit counter ***/


/**
* jQuery.browser.mobile (http://detectmobilebrowser.com/)
* jQuery.browser.mobile will be true if the browser is a mobile device
**/
(function (a) { (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent || navigator.vendor || window.opera);


function defaultHooks() {
    $("input[type=submit], button").button();
    $(".datepicker").datepicker();
    $(".buttonset").buttonset();
    $(".error-message").effect("highlight", {}, 7000);
    $("#mess-nav").addClass('buttons');
}

/*** BEGIN autocomplete for postal code + city ***/
function pcAutoComplete(ac_options) {
    items = ac_options.items;
    id_gemeente = ac_options.id_city;
    id_pc = ac_options.id_postal_code;
    id_country = ac_options.id_country;
    if (!ac_options || !items) {
        return false;
    }
    if (items.length && document.getElementById(id_gemeente) && document.getElementById(id_pc)) {
        id_gemeente = '#' + id_gemeente;
        id_pc = '#' + id_pc;
        id_country = '#' + id_country;
        $(id_gemeente).autocomplete({
            minLength: 2,
            source: items,
            focus: function (event, ui) {
                $(id_gemeente).val(ui.item.label);
                return false;
            },
            select: function (event, ui) {
                $(id_gemeente).val(ui.item.label);
                $(id_pc).val(ui.item.value);
                if ($(id_country)) { $(id_country).val("BE"); }
                return false;
            }
        })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
            .append("<a>" + item.label + "</a>")
            .appendTo(ul);
        };

        /* autocomplete initialiseren voor postcode met zelfde items */
        var pcitems = [];
        for (var i in items) {
            var x = {
                value: items[i].label,
                label: items[i].value
            }
            pcitems.push(x);
        }

        $(id_pc).autocomplete({
            minLength: 2,
            source: pcitems,
            focus: function (event, ui) {
                $(id_pc).val(ui.item.label);
                return false;
            },
            select: function (event, ui) {
                $(id_pc).val(ui.item.label);
                $(id_gemeente).val(ui.item.value);
                if ($(id_country)) { $(id_country).val("BE"); }
                return false;
            }
        })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
            .append("<a>(" + item.label + ") " + item.value + "</a>")
            .appendTo(ul);
        };
    }
}
/*** END autocomplete for postal code + city ***/

/*** BEGIN Mail transform ***/
function checkMail(elementId) {
    mail = document.getElementById(elementId).value;

    mail = mail.replace(/;/g, ".");
    mail = mail.replace(/,/g, ".");
    mail = mail.replace(/:/g, ".");
    mail = mail.replace(/\//g, ".");
    mail = mail.replace(/é/g, "e");
    mail = mail.replace(/è/g, "e");

    mail = mail.replace("..com", ".com");
    mail = mail.replace(".coml", ".com");
    mail = mail.replace(".ccom", ".com");
    mail = mail.replace(".comr", ".com");
    mail = mail.replace(".com.", ".com");

    mail = mail.replace("..be", ".be");

    mail = mail.replace("@hotmial.", "@hotmail.");
    mail = mail.replace("@hottmail.", "@hotmail.");
    mail = mail.replace("@htomail.", "@hotmail.");
    mail = mail.replace("@hotamail.", "@hotmail.");
    mail = mail.replace("@hotamil.", "@hotmail.");
    mail = mail.replace("@homail.", "@hotmail.");
    mail = mail.replace("@homtail.", "@hotmail.");
    mail = mail.replace("@hotail.", "@hotmail.");
    mail = mail.replace("@hhotmail.", "@hotmail.");
    mail = mail.replace("@hoitmail.", "@hotmail.");
    mail = mail.replace("@hormail.", "@hotmail.");
    mail = mail.replace("@hotail.", "@hotmail.");
    mail = mail.replace("@hotmai.", "@hotmail.");
    mail = mail.replace("@hotmael.", "@hotmail.");
    mail = mail.replace("@hotmaiil.", "@hotmail.");
    mail = mail.replace("@hotmal.", "@hotmail.");
    mail = mail.replace("@hoymail.", "@hotmail.");
    mail = mail.replace("@htmail.", "@hotmail.");
    mail = mail.replace("@htomail.", "@hotmail.");
    mail = mail.replace("@otmail.", "@hotmail.");

    mail = mail.replace("@andora.be", "@pandora.be");
    mail = mail.replace("@elenet.", "@telenet.");
    mail = mail.replace("@tekenet.", "@telenet.");
    mail = mail.replace("@telenen.", "@telenet.");
    mail = mail.replace("@tellenet.", "@telenet.");
    mail = mail.replace("@telrnet.", "@telenet.");
    mail = mail.replace("@tlelenet.", "@telenet.");
    mail = mail.replace("@trelenet.", "@telenet.");
    mail = mail.replace("@tzelenet.", "@telenet.");
    mail = mail.replace("@teleent.", "@telenet.");
    mail = mail.replace("@telene.", "@telenet.");
    mail = mail.replace("@telelenet.", "@telenet.");
    mail = mail.replace("@telent.", "@telenet.");
    mail = mail.replace("@telnet.", "@telenet.");
    mail = mail.replace("@telente.", "@telenet.");
    mail = mail.replace("@tlenet.", "@telenet.");
    mail = mail.replace("@teleet.", "@telenet.");
    mail = mail.replace("@trelenet.", "@telenet.");
    mail = mail.replace("@ttelenet.", "@telenet.");
    mail = mail.replace("@telenet.com", "@telenet.be");
    mail = mail.replace("@telenet.net", "@telenet.be");

    mail = mail.replace("@kynet.", "@skynet.");
    mail = mail.replace("@skunet.", "@skynet.");
    mail = mail.replace("@syknet.", "@skynet.");
    mail = mail.replace("@skeynet.", "@skynet.");
    mail = mail.replace("@skyet.", "@skynet.");
    mail = mail.replace("@skyne.", "@skynet.");
    mail = mail.replace("@skyner.", "@skynet.");
    mail = mail.replace("@skyney.", "@skynet.");
    mail = mail.replace("@skynnet.", "@skynet.");
    mail = mail.replace("@skynt.", "@skynet.");
    mail = mail.replace("@slynet.", "@skynet.");
    mail = mail.replace("@synet.", "@skynet.");
    mail = mail.replace("@skynet.com", "@skynet.be");

    mail = mail.replace("@gimail.", "@gmail.");
    mail = mail.replace("@g.mail.", "@gmail.");
    mail = mail.replace("@gail.", "@gmail.");
    mail = mail.replace("@gamail.", "@gmail.");
    mail = mail.replace("@gamil.", "@gmail.");
    mail = mail.replace("@gimal.", "@gmail.");
    mail = mail.replace("@gmai.", "@gmail.");
    mail = mail.replace("@gmaik.", "@gmail.");
    mail = mail.replace("@gmal.", "@gmail.");
    mail = mail.replace("@gmali.", "@gmail.");
    mail = mail.replace("@gmail.be", "@gmail.com");

    mail = mail.replace("@ahoo.", "@yahoo.");
    mail = mail.replace("@carlet.", "@scarlet.");

    if (mail != document.getElementById(elementId).value) {
        document.getElementById(elementId).value = mail;
        document.getElementById(elementId).style.backgroundColor = "#ffcccc";
        //document.getElementById(elementId).style.textTransform = "uppercase";
    }
}
/*** END Mail transform ***/
