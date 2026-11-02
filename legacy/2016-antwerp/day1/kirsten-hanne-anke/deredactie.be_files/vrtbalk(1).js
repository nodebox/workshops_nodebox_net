function VrtBalkWidget(position) {

	var _self = this;
	this.myVrtBalkObject = WidgetLoader.widgetConfigs[position];

	this.identifier = this.myVrtBalkObject.id;
	this.links = VrtBalkWidgetConfig.links;
	this.leftMargin = this.myVrtBalkObject.leftMargin;
	this.site = (this.myVrtBalkObject.site) ? this.myVrtBalkObject.site : "www.vrt.be";
	this.comScoreSiteName = "vrtbe";
	if (VrtBalkWidgetConfig[this.site] && VrtBalkWidgetConfig[this.site].siteName) {
		this.comScoreSiteName = VrtBalkWidgetConfig[this.site].siteName;
	}

	this.radiospelerFullScreen = true;
	if (VrtBalkWidgetConfig[this.site] && typeof VrtBalkWidgetConfig[this.site].radiospelerFullScreen !== 'undefined') {
		this.radiospelerFullScreen = VrtBalkWidgetConfig[this.site].radiospelerFullScreen;
	}

	//private vars
	this.bar = null;
	this.inner = null;
	this.menu = null;
	this.body = vrtWidgets("body").eq(0);

	this.init = function() {
		this.bar = vrtWidgets("<div/>").attr("id", "widget-vrtbalk-container").prependTo(this.body);
		this.inner = vrtWidgets("<div/>").attr("id", "widget-vrtbalk-menu").appendTo(this.bar);
		if (this.leftMargin) this.inner.css("margin-left", this.leftMargin);

		this.menu = vrtWidgets("<ul/>").appendTo(this.inner);
		for(var i=0; i<this.links.length; i++){
			var item = this.links[i];
			var li = vrtWidgets("<li/>").attr("id", "widget-vrtbalk-nav-"+item.title).appendTo(this.menu);
			if (i == 0) {
				li.addClass("widget-vrtbalk-nav-first-li");
			}
			var a = vrtWidgets("<a/>").addClass("widget-vrtbalk").attr({
				"title":item.title,
				"href":item.href
			}).html(item.title).appendTo(li);
			if (item.comScoreCounter) {
				a.attr('data-comScoreCounter',item.comScoreCounter);
				a = this.addHiddenComScoreURL(a, item.href, item.comScoreCounter);
			}
			var targetParam = (CommonUtils.isSameHost(item.href)) ? "_self" : "_blank";
			a.attr("target", targetParam);
		}
		if (VrtBalkWidgetConfig[this.site] && VrtBalkWidgetConfig[this.site].radiospeler) {
			this.loadRadioPlayerURL(VrtBalkWidgetConfig[this.site].radiospeler);
		}

		vrtWidgets("body").addClass("widget-vrtbalk");
	}

	this.addHiddenComScoreURL = function(a, url, comScoreCounter) {
		// Doing this with the jQuery methods .mousedown() and .mouseout() doesn't work
		var comScoreURL = "http://be.sitestat.com/vrt/"+this.comScoreSiteName+"/s?clickout.VAN.navigatiebalk.NAAR."+comScoreCounter+"&ns_type=clickout&ns_url="+url;
		var onmousedown = "this.hrefTemp = this.href; this.href = '"+comScoreURL+"'";
		a.attr("onmousedown", onmousedown);
		var onmouseout = "if(this.hrefTemp) this.href = this.hrefTemp;";
		a.attr("onmouseout", onmouseout);
		return a;
	}

	this.loadRadioPlayerURL = function(channelCode) {
		vrtWidgets.ajax({
			url: WidgetLoader.serviceBaseUrl + '/epg/channels/'+channelCode+'?' + VrtBalkWidget.channelAcceptType,
			dataType: 'jsonp',
			jsonp: 'f',
			jsonpCallback: this.identifier + '.parseRadioPlayerChannel'
		});
	}

	this.parseRadioPlayerChannel = function(data) {
		var $a = vrtWidgets("#widget-vrtbalk-nav-radiospeler a");
		if (_self.radiospelerFullScreen) {
			$a.attr("href",data.channel.radioPlayerURL);
			$a.attr("target", '_blank');
			if ($a.attr('data-comScoreCounter')) {
				_self.addHiddenComScoreURL($a, data.channel.radioPlayerURL, $a.attr('data-comScoreCounter'));
			}
		} else {
		    $a.click(function(event) {
                    event.preventDefault();
                    window.open(data.channel.radioPlayerURL, 'Radiospeler','location=0,scrollbars=0,resizable=1,width=800,height=443');
            });
            $a.attr("href","#");
            $a.attr("title",data.channel.radioPlayerURL);
		}
	}

	this.loadVrtCookieBalk = function() {
		var conf = {
	            'id': this.identifier+"_cookie",
	            'type': 'vrtcookiebalk_1.0',
	            'leftMargin': this.leftMargin
		}
		WidgetLoader.widgetConfigs.push(conf);
	}

	this.loadVrtCookieBalk();
	this.init();
}

VrtBalkWidget.channelAcceptType = "accept=application%2Fvnd.epg.vrt.be.channel_2.0%2Bjson";
