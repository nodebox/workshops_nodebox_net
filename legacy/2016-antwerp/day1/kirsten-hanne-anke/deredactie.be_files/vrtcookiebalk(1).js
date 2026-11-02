function VrtCookieBalkWidget(position){

    var _self = this;
    this.myVrtCookieBalkObject = WidgetLoader.widgetConfigs[position];

    // Cookie vars
    this.cookieUrl = VrtCookiesConfig.url;
    this.cookieName = VrtCookiesConfig.cookie_name;
    this.cookieUrlText = VrtCookiesConfig.url_text;
    this.cookieDescription = VrtCookiesConfig.description;
    this.cookieCloseText = VrtCookiesConfig.close_text;

    this.leftMargin = this.myVrtCookieBalkObject.leftMargin;
    this.cookiePrependTo = (this.myVrtCookieBalkObject.prepend_to) ? this.myVrtCookieBalkObject.prepend_to : 'body';

    this.cookiemessage = null;

    this.init = function(){
        if (!this.cookieExists(this.cookieName)) {
            this.cookiemessage = vrtWidgets("<div/>").attr("id", "widget-vrtcookiebalk");
            this.cookiemessagewrapper = vrtWidgets("<div/>").attr("class", "widget-vrtcookiebalk-wrapper").appendTo(this.cookiemessage);
            if (this.leftMargin) this.cookiemessagewrapper.css("margin-left", this.leftMargin);
            this.cookietext = vrtWidgets("<span/>").html(this.cookieDescription).appendTo(this.cookiemessagewrapper);
            this.cookielink = vrtWidgets("<a/>").addClass("info").attr({"href" : this.cookieUrl, "title":this.cookieUrlText, "target":"_blank"}).html(this.cookieUrlText).appendTo(this.cookiemessagewrapper);
            this.cookiecloselink = vrtWidgets("<a/>").addClass("close").attr({"href" : "#", "title":this.cookieCloseText}).html(this.cookieCloseText).appendTo(this.cookiemessagewrapper);

            var that = this;
            this.cookiecloselink.click(function(event) {
                // Get root domain.
                // Only works for single tld\'s. vrt.co.uk will return .co.uk as root domain.
                var s = window.location.hostname.split('.').slice(-2).join('.');

                _self.createCookie(_self.cookieName, "true", 3333, "."+s);
                that.cookiemessage.slideUp(300, function() {
                    vrtWidgets("body").removeClass("widget-vrtcookiebalk");
                    vrtWidgets("body").addClass("widget-vrtbalk");
                });

                event.preventDefault();
            });
            
            vrtWidgets(this.cookiePrependTo).eq(0).prepend(this.cookiemessage);
            vrtWidgets("body").removeClass("widget-vrtbalk");
            vrtWidgets("body").addClass("widget-vrtcookiebalk");
        }
    }

    this.createCookie = function(name,value,days,domain) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/; domain="+domain+"";
    }

    this.cookieExists = function(name) {
        return (document.cookie.indexOf(name) != -1);
    }

    this.init();

}