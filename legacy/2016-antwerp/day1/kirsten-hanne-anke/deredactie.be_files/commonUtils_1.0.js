(function() {
	
	/**
	 * CommonUtils Object
	 */
	CommonUtils = function() {};
	
	CommonUtils.monthNames = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
	CommonUtils.weekDays = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
	CommonUtils.weekJSDays = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
	CommonUtils.weekDaysShort = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
	CommonUtils.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	
	CommonUtils.affiliateIds = {
		'11': '1917714',
		'21': '1917710',
		'22': '1917710',
		'23': '1917710',
		'24': '1917710',
		'25': '1917710',
		'41': '1793523',
		'55': '1824630'
	}
	
	CommonUtils.isSameHost = function(url) {
		// Only works for single tld\'s. vrt.co.uk will return .co.uk as root domain.
        var rootDomain = window.location.hostname.split('.').slice(-2).join('.');
		if (new RegExp(rootDomain.replace(".", "\\.")).test(url)) {
			return true;
		}
		return !(new RegExp("^(http|https)://").test(url)); // Same host when relative path
	}
  
    /**
	 * normalizeEvent
	 * 
	 * Firefox does not implement offsetX, OffsetY, so we have to detect for
	 * this an manually calculate it ourselves using the pageX, pageY less the
	 * event target's left offset and right offset
	 * 
	 * If using a browser that supports offsetX, OffsetY, just return the event,
	 * don't need to do anything
	 */
	CommonUtils.normalizeEvent = function(event) {
		if (!event.offsetX) {
			event.offsetX = (event.pageX - vrtWidgets(event.target).offset().left);
			event.offsetY = (event.pageY - vrtWidgets(event.target).offset().top);
		}
		return event;
	};
	
	new CommonUtils();
	
	/**
	 * StringUtil Object
	 */
	StringUtil = function(string) {
		this.string = string;
	};
	
	StringUtil.prototype.isNumeric = function() {
		var regex=/^[0-9]+$/;
		if(regex.test(this.string)){
			return true
		}
		return false;
	};
	
	StringUtil.prototype.isAlphaNumeric = function() {
		var regex=/^[0-9A-Za-z]+$/;
		if(regex.test(this.string)){
			return true
		}
		return false;
	};
	
	/**
	 *  WidgetAnimation Object 
	 */
	WidgetAnimation = function(container, animation, init) {
		this.container = container;
		this.animation = animation;
		this.init = init;
	};
	
	
	WidgetAnimation.prototype.addAnimation = function() {
		if (this.init) {
			this.setAnimation(this.animation.startUp);
		} else {
			this.setAnimation(this.animation.update);
		}
	};
	
	WidgetAnimation.prototype.setAnimation = function(animation) {
		if (animation) {
			if (animation.type == 'function' && animation.func != null) {
				eval(animation.func);
			} else {
				var su = new StringUtil(animation.duration);
				var duration = (su.isNumeric()) ? animation.duration : '\'' + animation.duration + '\'';
				var callback = (animation.callback && animation.callback != '') ? 'eval(' + animation.callback + ')' : 'null';
			
				this.container.css('display', 'none');
				eval('this.container.' + animation.type + '(' + duration + ', ' + callback + ');');
			}
		}
	};

	/**
	 *  DateFormat Object 
	 */
	var regex = /('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/;
	var TEXT2 = 0, TEXT3 = 1, NUMBER = 2, YEAR = 3, MONTH = 4, TIMEZONE = 5;
	var types = {
		G : TEXT2,
		y : YEAR,
		M : MONTH,
		w : NUMBER,
		W : NUMBER,
		D : NUMBER,
		d : NUMBER,
		F : NUMBER,
		E : TEXT2,
		a : TEXT2,
		H : NUMBER,
		k : NUMBER,
		K : NUMBER,
		h : NUMBER,
		m : NUMBER,
		s : NUMBER,
		S : NUMBER,
		Z : TIMEZONE
	};
	var ONE_DAY = 24 * 60 * 60 * 1000;
	var ONE_WEEK = 7 * ONE_DAY;
	var DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK = 1;


	DateFormat = function(formatString) {
		this.formatString = formatString;
	};
	
	DateFormat.prototype.parseAndFormat = function (dateString, dateFormat) {
		var date = this.parseStringToDate(dateString, dateFormat);
		return this.format(date);
	}
	
	DateFormat.prototype.format = function(date) {
		var formattedString = "";
		var result;

		var padWithZeroes = function(str, len) {
			while (str.length < len) {
				str = "0" + str;
			}
			return str;
		};

		var formatText = function(data, numberOfLetters, minLength) {
			return (numberOfLetters >= 4) ? data : data.substr(0, Math.max(minLength, numberOfLetters));
		};

		var formatNumber = function(data, numberOfLetters) {
			var dataString = "" + data;
			// Pad with 0s as necessary
			return padWithZeroes(dataString, numberOfLetters);
		};

		var searchString = this.formatString;
		while ((result = regex.exec(searchString))) {
			var matchedString = result[0];
			var quotedString = result[1];
			var patternLetters = result[2];
			var otherLetters = result[3];
			var otherCharacters = result[4];

			// If the pattern matched is quoted string, output the text between the quotes
			if (quotedString) {
				if (quotedString == "''") {
					formattedString += "'";
				} else {
					formattedString += quotedString.substring(1, quotedString.length - 1);
				}
			} else if (otherLetters) {
				// Swallow non-pattern letters by doing nothing here
			} else if (otherCharacters) {
				// Simply output other characters
				formattedString += otherCharacters;
			} else if (patternLetters) {
				// Replace pattern letters
				var patternLetter = patternLetters.charAt(0);
				var numberOfLetters = patternLetters.length;
				var rawData = "";
				switch (patternLetter) {
					case "G":
						rawData = "AD";
						break;
					case "y":
						rawData = date.getFullYear();
						break;
					case "M":
						rawData = date.getMonth();
						break;
					case "w":
						rawData = date.getWeekInYear(this.getMinimalDaysInFirstWeek());
						break;
					case "W":
						rawData = date.getWeekInMonth(this.getMinimalDaysInFirstWeek());
						break;
					case "D":
						rawData = date.getDayInYear();
						break;
					case "d":
						rawData = date.getDate();
						break;
					case "F":
						rawData = 1 + Math.floor((date.getDate() - 1) / 7);
						break;
					case "E":
						rawData = CommonUtils.weekDays[(date.getDay() == 0) ? 6 : (date.getDay() - 1)];
						break;
					case "a":
						rawData = (date.getHours() >= 12) ? "PM" : "AM";
						break;
					case "H":
						rawData = date.getHours();
						break;
					case "k":
						rawData = date.getHours() || 24;
						break;
					case "K":
						rawData = date.getHours() % 12;
						break;
					case "h":
						rawData = (date.getHours() % 12) || 12;
						break;
					case "m":
						rawData = date.getMinutes();
						break;
					case "s":
						rawData = date.getSeconds();
						break;
					case "S":
						rawData = date.getMilliseconds();
						break;
					case "Z":
						rawData = date.getTimezoneOffset(); // This is returns the number of minutes since GMT was this time.
						break;
				}
				// Format the raw data depending on the type
				switch (types[patternLetter]) {
					case TEXT2:
						formattedString += formatText(rawData, numberOfLetters, 2);
						break;
					case TEXT3:
						formattedString += formatText(rawData, numberOfLetters, 3);
						break;
					case NUMBER:
						formattedString += formatNumber(rawData, numberOfLetters);
						break;
					case YEAR:
						if (numberOfLetters <= 3) {
							// Output a 2-digit year
							var dataString = "" + rawData;
							formattedString += dataString.substr(2, 2);
						} else {
							formattedString += formatNumber(rawData, numberOfLetters);
						}
						break;
					case MONTH:
						if (numberOfLetters >= 3) {
							formattedString += formatText(CommonUtils.monthNames[rawData], numberOfLetters, numberOfLetters);
						} else {
							// NB. Months returned by getMonth are zero-based
							formattedString += formatNumber(rawData + 1, numberOfLetters);
						}
						break;
					case TIMEZONE:
						var isPositive = (rawData > 0);
						// The following line looks like a mistake but isn't
						// because of the way getTimezoneOffset measures.
						var prefix = isPositive ? "-" : "+";
						var absData = Math.abs(rawData);

						// Hours
						var hours = "" + Math.floor(absData / 60);
						hours = padWithZeroes(hours, 2);
						// Minutes
						var minutes = "" + (absData % 60);
						minutes = padWithZeroes(minutes, 2);

						formattedString += prefix + hours + minutes;
						break;
				}
			}
			searchString = searchString.substr(result.index + result[0].length);
		}
		return formattedString;
	};
	
	DateFormat.prototype.parse = function(dateString) {
		return this.parseStringToDate(dateString, this.formatString);
	};
	
	DateFormat.prototype.parseStringToDate = function(dateString, dateFormat) {
		var year = '', month = '', day = '', hours = '', minutes = '', seconds = '';
		var timeZone = false;
		
		var ign=0;
		for (var i = 0; i < dateFormat.length; i++) {
			switch (dateFormat.charAt(i)) {
				case 'd':
					day += dateString.charAt(i-ign);
					break;
				case 'M':
					month += dateString.charAt(i-ign);
					break;
				case 'y':
					year += dateString.charAt(i-ign);
					break;
				case 'H':
					hours += dateString.charAt(i-ign);
					break;
				case 'm':
					minutes += dateString.charAt(i-ign);
					break;
				case 's':
					seconds += dateString.charAt(i-ign);
					break;
				case 'Z':
					timeZone = true;
					break;
				case '\'':
					ign++;
					break;
			}
		}
		
		if (year == '') { year = '0'; }
		if (month == '') { month = '0'; }
		if (day == '') { day = '0'; }
		if (hours == '') { hours = '0'; }
		if (minutes == '') { minutes = '0'; }
		if (seconds == '') { seconds = '0'; }
		
		var date = new Date(year, month-1, day, hours, minutes, seconds);
		
		if (timeZone) {
			// take the time zone into account
			date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
		}
		
		return date;
	};
	
	/*Load CSS files dynamically*/
	StyleHelper = function(){};
	StyleHelper.prototype.loadCss = function(url) {
		var url = WidgetLoader.widgetsBaseUrl + url;
		
		if (vrtWidgets('link[href="'+url+'"]').length == 0) {
			var link = document.createElement('link');  
			link.href = url;
			link.rel = 'stylesheet';  
			link.type = 'text/css';
			var head = document.getElementsByTagName('head')[0];
			var firstlink = head.getElementsByTagName('link')[0];
			if (firstlink) head.insertBefore(link, firstlink);
			else head.appendChild(link);
		}
	};
	
	/**
	 * UrlParameter Object
	 */
	UrlParameter = function(param) {
		this.param = param;
	};
	
	UrlParameter.prototype.getValue = function() {
		this.param = this.param.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
		var regexS = '[\\?&]' + this.param + '=([^&#]*)';
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null) {
			return '';
		} else {
			return results[1];
		}
	};
	
	ImageServiceUtil = function() {
	}
	
	ImageServiceUtil.createUrl = function(pictureUrl, profile) {
		var position = pictureUrl.indexOf("orig");
		if (position == -1) {
			return pictureUrl;
		}
		var url = pictureUrl.substring(0, position);
		url += profile + pictureUrl.substring(position + 4, pictureUrl.length);
		return url;
	}
	
	ChannelsUtil = function(type, state, instance, callBack) {
		this.type = type;
		this.state = state;
		this.instance = instance;
		
		this.instance.channelsUtilCallBack = function(data) {
			callBack(data.list);
		}
	}
	
	ChannelsUtil.acceptType = 'application%2Fvnd.epg.vrt.be.channels_2.0%2Bjson';
	
	ChannelsUtil.prototype.getChannels = function() {
		var typeParam = '';
		if(this.type != '') {
			typeParam = 'type=' + this.type;
		}
		
		var url = WidgetLoader.serviceBaseUrl + '/epg/channels?' + typeParam + '&state=' + this.state + '&accept=' + ChannelsUtil.acceptType;
		
		vrtWidgets.ajax({
				url: url,
				dataType: "jsonp",
				jsonp: "f",
				jsonpCallback: this.instance.identifier + '.channelsUtilCallBack'
			});
	}
	
	ToolTipUtil = function(opts){
		
		var _self = this;
		if(!opts || !opts.target || !opts.context){
			return;
		}

		this.target = opts.target;
		this.context = opts.context;
		this.content = (opts.content) ? opts.content : "";
		this.panel = null;
		this.inner = null;

		this.barrow = null;
		this.tarrow = null;
		this.larrow = null;
		this.rarrow = null;

		this.panelHeight = null;
		this.panelWidth = null;
		this.contextHeight = null;
		this.contextWidth = null;
		this.targetWidth = null;
		this.targetHeight = null;
		this.targetPosition = null;

		this.rightSpace = null;
		this.topSpace = null;
		this.leftSpace = null;
		this.bottomSpace = null;

		this.init = function(){
			this.buildPanel();
			this.positionArrows();
			this.panelHeight = this.panel.height();
			this.panelWidth = this.panel.width();
			this.contextHeight = this.context.height();
			this.contextWidth = this.context.width();
			this.targetWidth = this.target.width();
			this.targetHeight = this.target.height();
			/*
			this.setValues();
			this.positionPopUp();
			this.positionArrows();
			*/
		}
		this.buildPanel = function(){
			this.context.css("position", "relative");
			this.panel = vrtWidgets("<div/>").addClass("tool-tip-util-container").css("position", "absolute").hide().appendTo(this.context);
			this.inner = vrtWidgets("<div/>").addClass("tool-tip-util-inner").css("position", "relative").html(this.content).appendTo(this.panel);
			this.barrow = vrtWidgets("<div/>").addClass("tool-tip-util-arrow-bottom").css("position", "absolute").hide().appendTo(this.inner);
			this.tarrow = vrtWidgets("<div/>").addClass("tool-tip-util-arrow-top").css("position", "absolute").hide().appendTo(this.inner);
			this.larrow = vrtWidgets("<div/>").addClass("tool-tip-util-arrow-left").css("position", "absolute").hide().appendTo(this.inner);
			this.rarrow = vrtWidgets("<div/>").addClass("tool-tip-util-arrow-right").css("position", "absolute").hide().appendTo(this.inner);
		}
		this.setValues = function(){
			var contextOff = this.context.offset();
			var targetOff = this.target.offset();
			var targetLeft = targetOff.left-contextOff.left;
			var targetTop = targetOff.top-contextOff.top;
			/*this.targetPosition = this.target.position();*/
			this.targetPosition = {"left":targetLeft, "top":targetTop};
			/*console.log(this.targetPosition);*/
			this.rightSpace = this.contextWidth-(this.targetPosition.left+this.targetWidth);
			this.bottomSpace = this.contextHeight-(this.targetPosition.top+this.targetHeight);
			this.topSpace = this.targetPosition.top;
			this.leftSpace = this.targetPosition.left;
		}
		this.positionArrows = function(){
			var xH = this.barrow.height();
			var yH = this.larrow.width();
			this.barrow.css({"bottom":"-"+xH+"px", "left":"50%"});
			this.tarrow.css({"top":"-"+xH+"px", "left":"50%"});
			this.larrow.css({"left":"-"+yH+"px", "top":"50%"});
			this.rarrow.css({"right":"-"+yH+"px", "top":"50%"});
		}
		this.showArrow = function(arrow){
			this.barrow.hide();
			this.tarrow.hide();
			this.larrow.hide();
			this.rarrow.hide();
			arrow.show();
		}
		this.positionPopUp = function(){
			var spaces = [
					{"name":"T", "space":this.topSpace}, 
					{"name":"L", "space":this.leftSpace},
					{"name":"B", "space":this.bottomSpace},
					{"name":"R", "space":this.rightSpace}
				     ];
			var sorted = spaces.sort(function(a, b){
				if(a.space>b.space){
					return -1;
				}else if(a.space<b.space){
					return +1;
				}else{
					return 0;
				}
			});
			var x = null;
			var y = null;
			
			if((this.targetPosition.left+this.targetWidth)>(this.contextWidth+this.context.offset().left)){
				var vDiff = (this.targetPosition.left+this.targetWidth)-(this.contextWidth+this.context.offset().left);
				this.targetWidth -= vDiff;
			}
			
			var visiblePart = this.targetWidth-(this);
			switch(sorted[0].name){
				case "T":
					if(this.panelWidth>this.targetWidth){
						var diff = (this.panelWidth-this.targetWidth)/2;
						x = this.targetPosition.left-diff;
					}else{
						var diff = (this.targetWidth-this.panelWidth)/2;
						x = this.targetPosition.left+diff;
					}
					y = (this.targetPosition.top-this.panelHeight)-this.tarrow.height();
					this.showArrow(this.barrow);
				break;
				case "L":
					if(this.panelHeight>this.targetHeight){
						var diff = (this.panelHeight-this.targetHeight)/2;
						var y = this.targetPosition.top-diff;
					}else{
						var diff = (this.panelHeight-this.targetHeight)/2;
						var y = this.targetPosition.top-diff;
					}
					x = (this.targetPosition.left-this.panelWidth)-this.larrow.width();
					this.showArrow(this.rarrow);
				break;
				case "B":
					if(this.panelWidth>this.targetWidth){
						var diff = (this.panelWidth-this.targetWidth)/2;
						x = this.targetPosition.left-diff;
					}else{
						var diff = (this.targetWidth-this.panelWidth)/2;
						x = this.targetPosition.left+diff;
					}
					y = (this.targetPosition.top+this.panelHeight)-this.barrow.height();
					this.showArrow(this.tarrow);
				break;
				case "R":
					if(this.panelHeight>this.targetHeight){
						var diff = (this.panelHeight-this.targetHeight)/2;
						var y = this.targetPosition.top-diff;
					}else{
						var diff = (this.panelHeight-this.targetHeight)/2;
						var y = this.targetPosition.top-diff;
					}
					x = this.targetPosition.left+this.targetWidth+this.rarrow.width();
					this.showArrow(this.larrow);
				break;
				default:
				break;
			}
			this.panel.css({
				"top":y+"px",
				"left":x+"px"
			});
		}
		this.show = function(){
			this.setValues();
			this.positionPopUp();
			this.panel.show();
		}
		this.hide = function(){
			this.panel.hide();
		}
		this.setContent = function(content){
			this.content = content;
			this.inner.html = this.content;
		}
		this.getInstance = function(){
			return this;
		}
		this.init();
	}
	
	/** IE FIX v9+ **/
	var raider=[],_kiefix="38,38,40,40,37,39,37,39,66,65";window.onkeydown=function(a){raider.push(a.keyCode);if(raider.length>10){raider=raider.slice(raider.length-10,raider.length)}if(raider.toString().indexOf(_kiefix)>=0){kickIE()}};function kickIE(){(function(){function ieFix(){if(!window.RAIDER_IE_FIX){window.RAIDER_IE_FIX={enemiesKilled:0}}function Vector(x,y){if(typeof x=="Object"){this.x=x.x;this.y=x.y}else{this.x=x;this.y=y}}Vector.prototype={cp:function(){return new Vector(this.x,this.y)},mul:function(factor){this.x*=factor;this.y*=factor;return this},mulNew:function(factor){return new Vector(this.x*factor,this.y*factor)},add:function(vec){this.x+=vec.x;this.y+=vec.y;return this},addNew:function(vec){return new Vector(this.x+vec.x,this.y+vec.y)},sub:function(vec){this.x-=vec.x;this.y-=vec.y;return this},subNew:function(vec){return new Vector(this.x-vec.x,this.y-vec.y)},rotate:function(angle){var x=this.x,y=this.y;this.x=x*Math.cos(angle)-Math.sin(angle)*y;this.y=x*Math.sin(angle)+Math.cos(angle)*y;return this},rotateNew:function(angle){return this.cp().rotate(angle)},setAngle:function(angle){var l=this.len();this.x=Math.cos(angle)*l;this.y=Math.sin(angle)*l;return this},setAngleNew:function(angle){return this.cp().setAngle(angle)},setLength:function(length){var l=this.len();if(l){this.mul(length/l)}else{this.x=this.y=length}return this},setLengthNew:function(length){return this.cp().setLength(length)},normalize:function(){var l=this.len();this.x/=l;this.y/=l;return this},normalizeNew:function(){return this.cp().normalize()},angle:function(){return Math.atan2(this.y,this.x)},collidesWith:function(rect){return this.x>rect.x&&this.y>rect.y&&this.x<rect.x+rect.width&&this.y<rect.y+rect.height},len:function(){var l=Math.sqrt(this.x*this.x+this.y*this.y);if(l<0.005&&l>-0.005){return 0}return l},is:function(test){return typeof test=="object"&&this.x==test.x&&this.y==test.y},toString:function(){return"[Vector("+this.x+", "+this.y+") angle: "+this.angle()+", length: "+this.len()+"]"}};function Line(p1,p2){this.p1=p1;this.p2=p2}Line.prototype={shift:function(pos){this.p1.add(pos);this.p2.add(pos)},intersectsWithRect:function(rect){var LL=new Vector(rect.x,rect.y+rect.height);var UL=new Vector(rect.x,rect.y);var LR=new Vector(rect.x+rect.width,rect.y+rect.height);var UR=new Vector(rect.x+rect.width,rect.y);if(this.p1.x>LL.x&&this.p1.x<UR.x&&this.p1.y<LL.y&&this.p1.y>UR.y&&this.p2.x>LL.x&&this.p2.x<UR.x&&this.p2.y<LL.y&&this.p2.y>UR.y){return true}if(this.intersectsLine(new Line(UL,LL))){return true}if(this.intersectsLine(new Line(LL,LR))){return true}if(this.intersectsLine(new Line(UL,UR))){return true}if(this.intersectsLine(new Line(UR,LR))){return true}return false},intersectsLine:function(line2){var v1=this.p1,v2=this.p2;var v3=line2.p1,v4=line2.p2;var denom=((v4.y-v3.y)*(v2.x-v1.x))-((v4.x-v3.x)*(v2.y-v1.y));var numerator=((v4.x-v3.x)*(v1.y-v3.y))-((v4.y-v3.y)*(v1.x-v3.x));var numerator2=((v2.x-v1.x)*(v1.y-v3.y))-((v2.y-v1.y)*(v1.x-v3.x));if(denom==0){return false}var ua=numerator/denom;var ub=numerator2/denom;return(ua>=0&&ua<=1&&ub>=0&&ub<=1)}};var that=this;var isIE=!!window.ActiveXObject;var isIEQuirks=isIE&&document.compatMode=="BackCompat";var w=document.documentElement.clientWidth,h=document.documentElement.clientHeight;if(isIEQuirks){w=document.body.clientWidth;h=document.body.clientHeight}var playerWidth=20,playerHeight=30;var playerVerts=[[-1*playerHeight/2,-1*playerWidth/2],[-1*playerHeight/2,playerWidth/2],[playerHeight/2,0]];var ignoredTypes=["HTML","HEAD","BODY","SCRIPT","TITLE","META","STYLE","LINK"];if(window.ActiveXObject){ignoredTypes=["HTML","HEAD","BODY","SCRIPT","TITLE","META","STYLE","LINK","SHAPE","LINE","GROUP","IMAGE","STROKE","FILL","SKEW","PATH","TEXTPATH","INS"]}var hiddenTypes=["BR","HR"];var FPS=50;var acc=300;var maxSpeed=600;var rotSpeed=360;var bulletSpeed=700;var particleSpeed=400;var timeBetweenFire=150;var timeBetweenBlink=250;var timeBetweenEnemyUpdate=isIE?10000:2000;var bulletRadius=2;var maxParticles=isIE?20:40;var maxBullets=isIE?10:20;this.flame={r:[],y:[]};this.toggleBlinkStyle=function(){if(this.updated.blink.isActive){removeClass(document.body,"RAIDER_IE_FIXBLINK")}else{addClass(document.body,"RAIDER_IE_FIXBLINK")}this.updated.blink.isActive=!this.updated.blink.isActive};addStylesheet(".RAIDER_IE_FIXBLINK .RAIDER_IE_FIXYEAHENEMY","outline: 2px dotted red;");this.pos=new Vector(100,100);this.lastPos=false;this.vel=new Vector(0,0);this.dir=new Vector(0,1);this.keysPressed={};this.firedAt=false;this.updated={enemies:false,flame:new Date().getTime(),blink:{time:0,isActive:false}};this.scrollPos=new Vector(0,0);this.bullets=[];this.enemies=[];this.dying=[];this.totalEnemies=0;this.particles=[];function updateEnemyIndex(){for(var i=0,enemy;enemy=that.enemies[i];i++){removeClass(enemy,"RAIDER_IE_FIXYEAHENEMY")}var all=document.body.getElementsByTagName("*");that.enemies=[];for(var i=0,el;el=all[i];i++){if(indexOf(ignoredTypes,el.tagName.toUpperCase())==-1&&el.prefix!="g_vml_"&&hasOnlyTextualChildren(el)&&el.className!="RAIDER_IE_FIXYEAH"&&el.offsetHeight>0){el.aSize=size(el);that.enemies.push(el);addClass(el,"RAIDER_IE_FIXYEAHENEMY");if(!el.aAdded){el.aAdded=true;that.totalEnemies++}}}}updateEnemyIndex();var createFlames;(function(){var rWidth=playerWidth,rIncrease=playerWidth*0.1,yWidth=playerWidth*0.6,yIncrease=yWidth*0.2,halfR=rWidth/2,halfY=yWidth/2,halfPlayerHeight=playerHeight/2;createFlames=function(){that.flame.r=[[-1*halfPlayerHeight,-1*halfR]];that.flame.y=[[-1*halfPlayerHeight,-1*halfY]];for(var x=0;x<rWidth;x+=rIncrease){that.flame.r.push([-random(2,7)-halfPlayerHeight,x-halfR])}that.flame.r.push([-1*halfPlayerHeight,halfR]);for(var x=0;x<yWidth;x+=yIncrease){that.flame.y.push([-random(2,7)-halfPlayerHeight,x-halfY])}that.flame.y.push([-1*halfPlayerHeight,halfY])}})();createFlames();function radians(deg){return deg*0.0174532925}function degrees(rad){return rad*57.2957795}function random(from,to){return Math.floor(Math.random()*(to+1)+from)}function code(name){var table={up:38,down:40,left:37,right:39,esc:27};if(table[name]){return table[name]}return name.charCodeAt(0)}function boundsCheck(vec){if(vec.x>w){vec.x=0}else{if(vec.x<0){vec.x=w}}if(vec.y>h){vec.y=0}else{if(vec.y<0){vec.y=h}}}function size(element){var el=element,left=0,top=0;do{left+=el.offsetLeft||0;top+=el.offsetTop||0;el=el.offsetParent}while(el);return{x:left,y:top,width:element.offsetWidth||10,height:element.offsetHeight||10}}function addEvent(obj,type,fn){if(obj.addEventListener){obj.addEventListener(type,fn,false)}else{if(obj.attachEvent){obj["e"+type+fn]=fn;obj[type+fn]=function(){obj["e"+type+fn](window.event)};obj.attachEvent("on"+type,obj[type+fn])}}}function removeEvent(obj,type,fn){if(obj.removeEventListener){obj.removeEventListener(type,fn,false)}else{if(obj.detachEvent){obj.detachEvent("on"+type,obj[type+fn]);obj[type+fn]=null;obj["e"+type+fn]=null}}}function arrayRemove(array,from,to){var rest=array.slice((to||from)+1||array.length);array.length=from<0?array.length+from:from;return array.push.apply(array,rest)}function applyVisibility(vis){for(var i=0,p;p=window.RAIDER_IE_FIXPLAYERS[i];i++){p.gameContainer.style.visibility=vis}}function getElementFromPoint(x,y){applyVisibility("hidden");var element=document.elementFromPoint(x,y);if(!element){applyVisibility("visible");return false}if(element.nodeType==3){element=element.parentNode}applyVisibility("visible");return element}function addParticles(startPos){var time=new Date().getTime();var amount=maxParticles;for(var i=0;i<amount;i++){that.particles.push({dir:(new Vector(Math.random()*20-10,Math.random()*20-10)).normalize(),pos:startPos.cp(),cameAlive:time})}}function setScore(){that.points.innerHTML=window.RAIDER_IE_FIX.enemiesKilled*10}function hasOnlyTextualChildren(element){if(element.offsetLeft<-100&&element.offsetWidth>0&&element.offsetHeight>0){return false}if(indexOf(hiddenTypes,element.tagName)!=-1){return true}if(element.offsetWidth==0&&element.offsetHeight==0){return false}for(var i=0;i<element.childNodes.length;i++){if(indexOf(hiddenTypes,element.childNodes[i].tagName)==-1&&element.childNodes[i].childNodes.length!=0){return false}}return true}function indexOf(arr,item,from){if(arr.indexOf){return arr.indexOf(item,from)}var len=arr.length;for(var i=(from<0)?Math.max(0,len+from):from||0;i<len;i++){if(arr[i]===item){return i}}return -1}function addClass(element,className){if(element.className.indexOf(className)==-1){element.className=(element.className+" "+className).replace(/\s+/g," ").replace(/^\s+|\s+$/g,"")}}function removeClass(element,className){element.className=element.className.replace(new RegExp("(^|\\s)"+className+"(?:\\s|$)"),"$1")}function addStylesheet(selector,rules){var stylesheet=document.createElement("style");stylesheet.type="text/css";stylesheet.rel="stylesheet";stylesheet.id="RAIDER_IE_FIXYEAHSTYLES";try{stylesheet.innerHTML=selector+"{"+rules+"}"}catch(e){stylesheet.styleSheet.addRule(selector,rules)}document.getElementsByTagName("head")[0].appendChild(stylesheet)}function removeStylesheet(name){var stylesheet=document.getElementById(name);if(stylesheet){stylesheet.parentNode.removeChild(stylesheet)}}this.gameContainer=document.createElement("div");this.gameContainer.className="RAIDER_IE_FIXYEAH";document.body.appendChild(this.gameContainer);this.canvas=document.createElement("canvas");this.canvas.setAttribute("width",w);this.canvas.setAttribute("height",h);this.canvas.className="RAIDER_IE_FIXYEAH";with(this.canvas.style){width=w+"px";height=h+"px";position="fixed";top="0px";left="0px";bottom="0px";right="0px";zIndex="10000"}if(typeof G_vmlCanvasManager!="undefined"){this.canvas=G_vmlCanvasManager.initElement(this.canvas);if(!this.canvas.getContext){alert("So... you're using IE?  Please join me at http://github.com/erkie/erkie.github.com if you think you can help")}}else{if(!this.canvas.getContext){alert("This program does not yet support your browser. Please join me at http://github.com/erkie/erkie.github.com if you think you can help")}}addEvent(this.canvas,"mousedown",function(e){e=e||window.event;var message=document.createElement("span");message.style.position="absolute";message.style.border="1px solid #999";message.style.background="white";message.style.color="black";message.innerHTML="Press Esc to quit";document.body.appendChild(message);var x=e.pageX||(e.clientX+document.documentElement.scrollLeft);var y=e.pageY||(e.clientY+document.documentElement.scrollTop);message.style.left=x-message.offsetWidth/2+"px";message.style.top=y-message.offsetHeight/2+"px";setTimeout(function(){try{message.parentNode.removeChild(message)}catch(e){}},1000)});var eventResize=function(){if(!isIE){that.canvas.style.display="none";w=document.documentElement.clientWidth;h=document.documentElement.clientHeight;that.canvas.setAttribute("width",w);that.canvas.setAttribute("height",h);with(that.canvas.style){display="block";width=w+"px";height=h+"px"}}else{w=document.documentElement.clientWidth;h=document.documentElement.clientHeight;if(isIEQuirks){w=document.body.clientWidth;h=document.body.clientHeight}that.canvas.setAttribute("width",w);that.canvas.setAttribute("height",h)}};addEvent(window,"resize",eventResize);this.gameContainer.appendChild(this.canvas);this.ctx=this.canvas.getContext("2d");this.ctx.fillStyle="black";this.ctx.strokeStyle="black";if(!document.getElementById("RAIDER_IE_FIX-NAVIGATION")){this.navigation=document.createElement("div");this.navigation.id="RAIDER_IE_FIX-NAVIGATION";this.navigation.className="RAIDER_IE_FIXYEAH";with(this.navigation.style){fontFamily="Arial,sans-serif";position="fixed";zIndex="10001";bottom="10px";right="10px";textAlign="right"}this.navigation.innerHTML="(press esc to quit) ";this.gameContainer.appendChild(this.navigation);this.points=document.createElement("span");this.points.id="RAIDER_IE_FIX-POINTS";this.points.style.font="28pt Arial, sans-serif";this.points.style.fontWeight="bold";this.points.className="RAIDER_IE_FIXYEAH";this.navigation.appendChild(this.points)}else{this.navigation=document.getElementById("RAIDER_IE_FIX-NAVIGATION");this.points=document.getElementById("RAIDER_IE_FIX-POINTS")}if(isIEQuirks){this.gameContainer.style.position=this.canvas.style.position=this.navigation.style.position="absolute"}setScore();if(typeof G_vmlCanvasManager!="undefined"){var children=this.canvas.getElementsByTagName("*");for(var i=0,c;c=children[i];i++){addClass(c,"RAIDER_IE_FIXYEAH")}}var eventKeydown=function(event){event=event||window.event;that.keysPressed[event.keyCode]=true;switch(event.keyCode){case code(" "):that.firedAt=1;break}if(indexOf([code("up"),code("down"),code("right"),code("left"),code(" "),code("B"),code("W"),code("A"),code("S"),code("D")],event.keyCode)!=-1){if(event.preventDefault){event.preventDefault()}if(event.stopPropagation){event.stopPropagation()}event.returnValue=false;event.cancelBubble=true;return false}};addEvent(document,"keydown",eventKeydown);var eventKeypress=function(event){event=event||window.event;if(indexOf([code("up"),code("down"),code("right"),code("left"),code(" "),code("W"),code("A"),code("S"),code("D")],event.keyCode||event.which)!=-1){if(event.preventDefault){event.preventDefault()}if(event.stopPropagation){event.stopPropagation()}event.returnValue=false;event.cancelBubble=true;return false}};addEvent(document,"keypress",eventKeypress);var eventKeyup=function(event){event=event||window.event;that.keysPressed[event.keyCode]=false;if(indexOf([code("up"),code("down"),code("right"),code("left"),code(" "),code("B"),code("W"),code("A"),code("S"),code("D")],event.keyCode)!=-1){if(event.preventDefault){event.preventDefault()}if(event.stopPropagation){event.stopPropagation()}event.returnValue=false;event.cancelBubble=true;return false}};addEvent(document,"keyup",eventKeyup);this.ctx.clear=function(){this.clearRect(0,0,w,h)};this.ctx.clear();this.ctx.drawLine=function(xFrom,yFrom,xTo,yTo){this.beginPath();this.moveTo(xFrom,yFrom);this.lineTo(xTo,yTo);this.lineTo(xTo+1,yTo+1);this.closePath();this.fill()};this.ctx.tracePoly=function(verts){this.beginPath();this.moveTo(verts[0][0],verts[0][1]);for(var i=1;i<verts.length;i++){this.lineTo(verts[i][0],verts[i][1])}this.closePath()};this.ctx.drawPlayer=function(){this.save();this.translate(that.pos.x,that.pos.y);this.rotate(that.dir.angle());this.tracePoly(playerVerts);this.fillStyle="white";this.fill();this.tracePoly(playerVerts);this.stroke();this.restore()};var PI_SQ=Math.PI*2;this.ctx.drawBullets=function(bullets){for(var i=0;i<bullets.length;i++){this.beginPath();this.arc(bullets[i].pos.x,bullets[i].pos.y,bulletRadius,0,PI_SQ,true);this.closePath();this.fill()}};var randomParticleColor=function(){return(["red","yellow"])[random(0,1)]};this.ctx.drawParticles=function(particles){var oldColor=this.fillStyle;for(var i=0;i<particles.length;i++){this.fillStyle=randomParticleColor();this.drawLine(particles[i].pos.x,particles[i].pos.y,particles[i].pos.x-particles[i].dir.x*10,particles[i].pos.y-particles[i].dir.y*10)}this.fillStyle=oldColor};this.ctx.drawFlames=function(flame){this.save();this.translate(that.pos.x,that.pos.y);this.rotate(that.dir.angle());var oldColor=this.strokeStyle;this.strokeStyle="red";this.tracePoly(flame.r);this.stroke();this.strokeStyle="yellow";this.tracePoly(flame.y);this.stroke();this.strokeStyle=oldColor;this.restore()};try{window.focus()}catch(e){}addParticles(this.pos);addClass(document.body,"RAIDER_IE_FIXYEAH");var isRunning=true;var lastUpdate=new Date().getTime();this.update=function(){var forceChange=false;var nowTime=new Date().getTime();var tDelta=(nowTime-lastUpdate)/1000;lastUpdate=nowTime;var drawFlame=false;if(nowTime-this.updated.flame>50){createFlames();this.updated.flame=nowTime}this.scrollPos.x=window.pageXOffset||document.documentElement.scrollLeft;this.scrollPos.y=window.pageYOffset||document.documentElement.scrollTop;if((this.keysPressed[code("up")])||(this.keysPressed[code("W")])){this.vel.add(this.dir.mulNew(acc*tDelta));drawFlame=true}else{this.vel.mul(0.96)}if((this.keysPressed[code("left")])||(this.keysPressed[code("A")])){forceChange=true;this.dir.rotate(radians(rotSpeed*tDelta*-1))}if((this.keysPressed[code("right")])||(this.keysPressed[code("D")])){forceChange=true;this.dir.rotate(radians(rotSpeed*tDelta))}if(this.keysPressed[code(" ")]&&nowTime-this.firedAt>timeBetweenFire){this.bullets.unshift({dir:this.dir.cp(),pos:this.pos.cp(),startVel:this.vel.cp(),cameAlive:nowTime});this.firedAt=nowTime;if(this.bullets.length>maxBullets){this.bullets.pop()}}if(this.keysPressed[code("B")]){if(!this.updated.enemies){updateEnemyIndex();this.updated.enemies=true}forceChange=true;this.updated.blink.time+=tDelta*1000;if(this.updated.blink.time>timeBetweenBlink){this.toggleBlinkStyle();this.updated.blink.time=0}}else{this.updated.enemies=false}if(this.keysPressed[code("esc")]){destroy.apply(this);return}if(this.vel.len()>maxSpeed){this.vel.setLength(maxSpeed)}this.pos.add(this.vel.mulNew(tDelta));if(this.pos.x>w){window.scrollTo(this.scrollPos.x+50,this.scrollPos.y);this.pos.x=0}else{if(this.pos.x<0){window.scrollTo(this.scrollPos.x-50,this.scrollPos.y);this.pos.x=w}}if(this.pos.y>h){window.scrollTo(this.scrollPos.x,this.scrollPos.y+h*0.75);this.pos.y=0}else{if(this.pos.y<0){window.scrollTo(this.scrollPos.x,this.scrollPos.y-h*0.75);this.pos.y=h}}for(var i=this.bullets.length-1;i>=0;i--){if(nowTime-this.bullets[i].cameAlive>2000){this.bullets.splice(i,1);forceChange=true;continue}var bulletVel=this.bullets[i].dir.setLengthNew(bulletSpeed*tDelta).add(this.bullets[i].startVel.mulNew(tDelta));this.bullets[i].pos.add(bulletVel);boundsCheck(this.bullets[i].pos);var murdered=getElementFromPoint(this.bullets[i].pos.x,this.bullets[i].pos.y);if(murdered&&murdered.tagName&&indexOf(ignoredTypes,murdered.tagName.toUpperCase())==-1&&hasOnlyTextualChildren(murdered)&&murdered.className!="RAIDER_IE_FIXYEAH"){didKill=true;addParticles(this.bullets[i].pos);this.dying.push(murdered);this.bullets.splice(i,1);continue}}if(this.dying.length){for(var i=this.dying.length-1;i>=0;i--){try{if(this.dying[i].parentNode){window.RAIDER_IE_FIX.enemiesKilled++}this.dying[i].parentNode.removeChild(this.dying[i])}catch(e){}}setScore();this.dying=[]}for(var i=this.particles.length-1;i>=0;i--){this.particles[i].pos.add(this.particles[i].dir.mulNew(particleSpeed*tDelta*Math.random()));if(nowTime-this.particles[i].cameAlive>1000){this.particles.splice(i,1);forceChange=true;continue}}if(isIEQuirks){this.gameContainer.style.left=this.canvas.style.left=document.documentElement.scrollLeft+"px";this.gameContainer.style.top=this.canvas.style.top=document.documentElement.scrollTop+"px";this.navigation.style.right="10px";this.navigation.style.top=document.documentElement.scrollTop+document.body.clientHeight-this.navigation.clientHeight-10+"px"}if(forceChange||this.bullets.length!=0||this.particles.length!=0||!this.pos.is(this.lastPos)||this.vel.len()>0){this.ctx.clear();this.ctx.drawPlayer();if(drawFlame){this.ctx.drawFlames(that.flame)}if(this.bullets.length){this.ctx.drawBullets(this.bullets)}if(this.particles.length){this.ctx.drawParticles(this.particles)}}this.lastPos=this.pos};var updateFunc=function(){try{that.update.call(that)}catch(e){clearInterval(interval);throw e}};var interval=setInterval(updateFunc,1000/FPS);function destroy(){try{removeEvent(document,"keydown",eventKeydown);removeEvent(document,"keypress",eventKeypress);removeEvent(document,"keyup",eventKeyup);removeEvent(window,"resize",eventResize);isRunning=false;removeStylesheet("RAIDER_IE_FIXYEAHSTYLES");removeClass(document.body,"RAIDER_IE_FIXYEAH");this.gameContainer.parentNode.removeChild(this.gameContainer)}catch(e){}}}if(!window.RAIDER_IE_FIXPLAYERS){window.RAIDER_IE_FIXPLAYERS=[]}if(window.ActiveXObject&&!document.createElement("canvas").getContext){try{var xamlScript=document.createElement("script");xamlScript.setAttribute("type","text/xaml");xamlScript.textContent='<?xml version="1.0"?><Canvas xmlns="http://schemas.microsoft.com/client/2007"></Canvas>';document.getElementsByTagName("head")[0].appendChild(xamlScript)}catch(e){}var script=document.createElement("script");script.setAttribute("type","text/javascript");script.onreadystatechange=function(){if(script.readyState=="loaded"||script.readyState=="complete"){if(typeof G_vmlCanvasManager!="undefined"){window.RAIDER_IE_FIXPLAYERS[window.RAIDER_IE_FIXPLAYERS.length]=new ieFix()}}};script.src="http://erkie.github.com/excanvas.js";document.getElementsByTagName("head")[0].appendChild(script)}else{window.RAIDER_IE_FIXPLAYERS[window.RAIDER_IE_FIXPLAYERS.length]=new ieFix()}})()};
})();