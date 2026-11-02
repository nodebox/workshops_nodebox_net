WidgetLoader = function(widgetConfigs) {
	WidgetLoader.collectAllWidgetConfigs(widgetConfigs);

	WidgetLoader.widgetTypes = {
		'noa_1.0' : {
			className : 'NoaWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/noa/1.0/noa.js',
			          WidgetLoader.widgetsBaseUrl + '/conf/noa.js' ]
		},
		'playlist_1.0' : {
			className : 'PlaylistWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/playlist/1.0/playlist.js' ],
			push : true
		},
		'playlist_2.0' : {
			className : 'PlaylistWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/playlist/2.0/playlist.js' ],
			push : true
		},
		'playlists_1.0' : {
			className : 'PlaylistsWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.core.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.min.js',
						WidgetLoader.widgetsBaseUrl + '/playlists/1.0/playlists.js' ]
		},
		'playlists_2.0' : {
			className : 'PlaylistsWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.core.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.min.js',
						WidgetLoader.widgetsBaseUrl + '/playlists/2.0/playlists.js' ]
		},
		'radioschedule_1.0' : {
			className : 'RadioScheduleWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/radioschedule/1.0/radioschedule.js' ]
		},
		'radioschedule_1.1' : {
			className : 'RadioScheduleWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/radioschedule/1.1/radioschedule.js',
					  WidgetLoader.widgetsBaseUrl + '/conf/radioschedule.js' ]
		},
		'nos_1.0' : {
			className : 'NosWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-jcarousel-0.2.7.min.js',
						WidgetLoader.commonBaseUrl + '/js/iScroll-4-mod.js',
						WidgetLoader.widgetsBaseUrl + '/nos/1.0/nos.js' ]
		},
		'tvguide_1.0' : {
			className : 'TvGuideWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.core.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.min.js',
						WidgetLoader.commonBaseUrl + '/js/iScroll-4-mod.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.touchSwipe-1.2.3.js',
						WidgetLoader.widgetsBaseUrl + '/tvguide/1.0/tvguide.js' ],
			css : [ WidgetLoader.widgetsBaseUrl + '/tvguide/1.0/tvguide.css' ],
			loadGlow : true
		},
		'teletext_1.0' : {
			className : 'TeletextWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ba-bbq-1.2.1.min.js',
						WidgetLoader.widgetsBaseUrl + '/conf/teletext.js',
						WidgetLoader.widgetsBaseUrl + '/teletext/1.0/teletext.js' ]
		},
		'teletext_1.1' : {
			className : 'TeletextWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ba-bbq-1.2.1.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.touchSwipe-1.2.5.js',
						WidgetLoader.commonBaseUrl + '/js/localStorage.min.js',
						WidgetLoader.widgetsBaseUrl + '/conf/teletext.js',
						WidgetLoader.widgetsBaseUrl + '/teletext/1.1/teletext.js' ]
		},
		'weather_teaser_1.0' : {
			className : 'WeatherTeaserWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/conf/weatherteaser.js',
						WidgetLoader.widgetsBaseUrl + '/weatherteaser/1.0/weatherteaser.js' ]
		},
		'weather_table_1.0' : {
			className : 'WeatherTableWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/conf/weathertable.js',
						WidgetLoader.widgetsBaseUrl + '/weathertable/1.0/weathertable.js' ]
		},
		'weather_maps_1.0' : {
			className : 'WeatherMapsWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/conf/weathermaps.js',
						WidgetLoader.widgetsBaseUrl + '/weathermaps/1.0/weathermaps.js' ]
		},
		'weather_talk_1.0' : {
			className : 'WeatherTalkWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/conf/weathertalk.js',
						WidgetLoader.widgetsBaseUrl + '/weathertalk/1.0/weathertalk.js' ]
		},
		'trafficbarometer_1.0' : {
			className : 'TrafficBarometerWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/trafficbarometer/1.0/jqueryrotate.js',
						WidgetLoader.widgetsBaseUrl + '/trafficbarometer/1.0/trafficbarometer.js' ]
		},
		'trafficteaser_1.0' : {
			className : 'TrafficTeaserWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/trafficteaser/1.0/trafficteaser.js' ]
		},
		'songsearch_1.0' : {
			className : 'SongSearchWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.core.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.min.js',
						WidgetLoader.widgetsBaseUrl + '/songsearch/1.0/songsearch.js' ]
		},
		'songsearch_1.1' : {
			className : 'SongSearchWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.core.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.localization.nl-BE.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.autocomplete.js',
						WidgetLoader.widgetsBaseUrl + '/songsearch/1.1/songsearch.js' ]
		},
		'songsearch_2.0' : {
			className : 'SongSearchWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.core.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.5.datepicker.localization.nl-BE.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-ui-1.8.16.autocomplete.js',
						WidgetLoader.widgetsBaseUrl + '/songsearch/2.0/songsearch.js' ]
		},
		'radioplayer_0.1' : {
			className : 'RadioPlayerWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.hoverIntent.r6.min.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-dependClass.0.1b.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-slider.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/audioplayer.js',
						WidgetLoader.widgetsBaseUrl + '/noa/1.0/noa.js',
						WidgetLoader.widgetsBaseUrl + '/radioplayer/0.1/radioplayer.js' ]
		},
		'radioplayer_0.2' : {
			className : 'RadioPlayerWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.hoverIntent.r6.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.tinyscrollbar.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-dependClass.0.1b.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-slider.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/audioplayer.js',
						WidgetLoader.widgetsBaseUrl + '/noa/1.0/noa.js',
						WidgetLoader.widgetsBaseUrl + '/radioplayer/0.2/radioplayer.js' ],
			loadGlow : true
		},
		'radioplayer_0.3' : {
			className : 'RadioPlayerWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.hoverIntent.r6.min.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.tinyscrollbar.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/vrtWidgets-1.0.0-jquery-dependClass.0.1b.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/vrtWidgets-1.0.0-jquery-slider.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/vrtWidgets-1.0.0-jquery-tooltipster.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/audioplayer.js',
						WidgetLoader.widgetsBaseUrl + '/noa/1.0/noa.js',
						WidgetLoader.widgetsBaseUrl + '/radioplayer/0.3/radioplayer.js' ],
			css : [ WidgetLoader.serviceBaseUrl + '/audioplayer/1/css/audioplayer.css',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/css/audioplayer.css',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/css/jslider.css',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/css/tooltipster.css' ],
			loadGlow : true
		},
		'radioplaylist_1.0' : {
			className : 'RadioPlaylistWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/radioplayer/0.1/radioplaylist.js' ]
		},
		'radioZone_1.0' : {
			className : 'RadioZoneWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.hoverIntent.r6.min.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-dependClass.0.1b.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-slider.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/audioplayer.js',
						WidgetLoader.widgetsBaseUrl + '/noa/1.0/noa.js',
						WidgetLoader.commonBaseUrl + '/js/history.adapter.native.js',
						WidgetLoader.widgetsBaseUrl + '/radiozone/1.0/radioZone.js' ]
		},
		'radioguide_1.0' : {
			className : 'RadioGuideWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.tinyscrollbar.js',
						WidgetLoader.widgetsBaseUrl + '/radioguide/1.0/radioguide.js' ]
		},
		'audioplayer_1.0' : {
			className : 'AudioPlayerWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-dependClass.0.1b.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/vrtWidgets-1.0.0-jquery-slider.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.0/audioplayer.js' ]
		},
		'audioplayer_1.1' : {
			className : 'AudioPlayerWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/vrtWidgets-1.0.0-jquery-dependClass.0.1b.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/vrtWidgets-1.0.0-jquery-slider.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/vrtWidgets-1.0.0-jquery-tooltipster.js',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/audioplayer.js' ],
			css : [ WidgetLoader.serviceBaseUrl + '/audioplayer/1/css/audioplayer.css',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/css/audioplayer.css',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/css/jslider.css',
						WidgetLoader.widgetsBaseUrl + '/audioplayer/1.1/css/tooltipster.css' ]
		},
		'webcam_1.0' : {
			className : 'WebcamWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/webcam/1.0/webcam.js' ],
			css : [ WidgetLoader.widgetsBaseUrl + '/webcam/1.0/css/webcam.css' ]
		},
		'webcam_1.1' : {
			className : 'WebCamWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/webcam/1.1/webcam.js' ]
		},
		'atomfeed_1.0' : {
			className : 'AtomfeedWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/atomfeed/1.0/jquery.vticker.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-jcarousel-0.2.8.js',
						WidgetLoader.widgetsBaseUrl + '/atomfeed/1.0/atomfeed.js' ]
		},
		'twitter_1.0' : {
			className : 'TwitterWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/twitter/1.0/jScrollPane/jquery.mousewheel.js',
						WidgetLoader.widgetsBaseUrl + '/twitter/1.0/jScrollPane/jquery.jscrollpane.min.js',
						WidgetLoader.widgetsBaseUrl + '/twitter/1.0/tw.js' ],
			css : [ WidgetLoader.widgetsBaseUrl + '/twitter/1.0/css/tw.css',
						WidgetLoader.widgetsBaseUrl + '/twitter/1.0/css/jquery.jscrollpane.css' ]
		},
		'facebook_1.0' : {
			className : 'FaceBookWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/facebook/1.0/facebook.js' ]
		},
		'flickr_1.0' : {
			className : 'FlickrWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/flickr/1.0/flickr.js' ]
		},
		'trafficfilter_1.0' : {
			className : 'TrafficFilterWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrt-json2.js',
						WidgetLoader.widgetsBaseUrl + '/trafficfilter/1.0/vrtwidgets.cookie.js',
						WidgetLoader.widgetsBaseUrl + '/trafficfilter/1.0/trafficfilter.js' ],
			css : [WidgetLoader.widgetsBaseUrl + '/trafficfilter/1.0/css/trafficfilter.css' ]
		},
		'trafficforecast_1.0' : {
			className : 'TrafficForecastWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/trafficforecast/1.0/trafficforecast.js' ],
			css : [ WidgetLoader.widgetsBaseUrl + '/trafficforecast/1.0//css/trafficforecast.css']
		},
		'nextbroadcast_1.0' : {
			className : 'NextBroadcastWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/nextbroadcast/1.0/nextbroadcast.js' ]
		},
		'traffictraveltimes_1.0' : {
			className : 'TrafficTraveltimesWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrt-json2.js',
						WidgetLoader.widgetsBaseUrl + '/traffictraveltimes/1.0/vrtwidgets.cookie.js',
						WidgetLoader.widgetsBaseUrl + '/traffictraveltimes/1.0/traffictraveltimes.js' ],
			css : [WidgetLoader.widgetsBaseUrl + '/traffictraveltimes/1.0/css/traffictraveltimes.css' ]
		},
		'mini-epg_1.0' : {
			className : 'MiniEpg',
			files : [ WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-jcarousel-0.2.8.js',
						WidgetLoader.widgetsBaseUrl + '/mini-epg/1.0/mini-epg.js' ],
			css : [ WidgetLoader.widgetsBaseUrl + '/mini-epg/1.0/css/mini-epg.css' ]
		},
		'mobileguide_1.0' : {
			className : 'MobileGuideWidget',
			files : [ WidgetLoader.commonBaseUrl + '/js/iScroll-4-mod.js',
						WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery.touchSwipe-1.2.3.js',
						WidgetLoader.widgetsBaseUrl + '/mobileguide/1.0/mobileguide.js' ]
		},
		'ondemand_1.0' : {
			className : 'OnDemandWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/ondemand/1.0/ondemand.js' ]
		},
		'vrtbalk_1.0' : {
			className : 'VrtBalkWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/conf/vrtbalk.js',
						WidgetLoader.widgetsBaseUrl + '/vrtbalk/1.0/vrtbalk.js',
						WidgetLoader.widgetsBaseUrl + '/conf/vrtcookiebalk.js',
						WidgetLoader.widgetsBaseUrl + '/vrtbalk/1.0/vrtcookiebalk.js'],
			css : [WidgetLoader.widgetsBaseUrl + '/vrtbalk/1.0/css/vrtbalk.css',
						WidgetLoader.widgetsBaseUrl + '/vrtbalk/1.0/css/vrtcookiebalk.css']
		},
		'vrtcookiebalk_1.0' : {
			className : 'VrtCookieBalkWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/conf/vrtcookiebalk.js',
						WidgetLoader.widgetsBaseUrl + '/vrtbalk/1.0/vrtcookiebalk.js' ],
			css : [ WidgetLoader.widgetsBaseUrl + '/vrtbalk/1.0/css/vrtcookiebalk.css' ]
		},
		'vrtfooter_1.0' : {
			className : 'VrtFooterWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/conf/comscore-sitenames.js',
						WidgetLoader.widgetsBaseUrl + '/conf/vrtfooter.js',
						WidgetLoader.widgetsBaseUrl + '/vrtfooter/1.0/vrtfooter.js' ],
			css : [ WidgetLoader.widgetsBaseUrl + '/vrtbalk/1.0/css/vrtcookiebalk.css' ]
		},
		'hitlist_1.0' : {
			className : 'HitlistWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/hitlist/1.0/hitlist.js' ]
		},
		'votingslist_1.0' : {
			className : 'VotingslistWidget',
			files : [ WidgetLoader.widgetsBaseUrl + '/hitlist/1.0/votingslist.js' ]
		}
	};

	WidgetLoader.loadLibraries();
};


WidgetLoader.collectAllWidgetConfigs = function (widgetConfigs) {
	for (var i = 0; i < widgetConfigs.length; i++) {
		var widgetsList = widgetConfigs[i].widgets;
		WidgetLoader.widgetConfigs=WidgetLoader.widgetConfigs.concat(widgetsList);
	}
};

WidgetLoader.loadJavaScriptLibrary = function(path, onLoad) {
	if (onLoad) WidgetLoader.numberOfWidgetLibrariesToLoad++;
	WidgetLoader.loadJavaScript(path, onLoad);
};

WidgetLoader.loadJavaScript = function(path, onLoad) {
	// prevent scripts from loading twice
	function loadScriptHandler() {
		var rs = this.readyState;
		if (rs == 'loaded' || rs == 'complete') {
			this.onreadystatechange = null;
			this.onload = null;
			if (onLoad) {
				onLoad();
			}
		}
	}

	function scriptOnload() {
		this.onreadystatechange = null;
		this.onload = null;
		window.setTimeout(onLoad,20);
	}

	var script = document.createElement('script');
	script.type = 'text/javascript';
	if (onLoad) {
		script.onreadystatechange = loadScriptHandler;
		script.onload = scriptOnload;
	}
	script.src = path;

	document.getElementsByTagName('head')[0].appendChild(script);
};

WidgetLoader.loadWidgets = function() {
	var widgetList = WidgetLoader.widgetConfigs;
	WidgetLoader.numberOfWidgetsToLoad = widgetList.length;
	WidgetLoader.playlistArray = {};

	// load widgets which are defined in the config files
	for (var i = 0; i < widgetList.length; i++) {
		WidgetLoader.loadWidget(i);
	}
};

WidgetLoader.loadWidget = function(i) {
	var widgetList = WidgetLoader.widgetConfigs;
	var widgetType = widgetList[i].type;
	if(typeof WidgetLoader.widgetTypes[widgetType]!=="undefined"){
		window[widgetList[i].id]=new window[WidgetLoader.widgetTypes[widgetType].className](i,WidgetLoader.playlistArray[widgetList[i].targetPlayList]);
		if(WidgetLoader.widgetTypes[widgetType].push){
			WidgetLoader.playlistArray[window[widgetList[i].id].identifier]=window[widgetList[i].id];
		}
	}
};

WidgetLoader.numberOfLibrariesToLoad = 0;
WidgetLoader.numberOfLoadedLibraries = 0;

WidgetLoader.loadLibraries = function() {
	var widgetList = WidgetLoader.widgetConfigs;
	for (var i = 0; i < widgetList.length; i++) {
		var widgetType = widgetList[i].type;
		if(typeof WidgetLoader.widgetTypes[widgetType]!=="undefined" && WidgetLoader.widgetTypes[widgetType].loadGlow) {
			WidgetLoader.loadGlow = true;
			break;
		}
	}
	if (WidgetLoader.loadGlow) {
		WidgetLoader.numberOfLibrariesToLoad++;
		WidgetLoader.loadJavaScript(WidgetLoader.commonBaseUrl + '/js/glow/1.7.7/core/core.js', WidgetLoader.baseLibraryLoaded );
		//WidgetLoader.loadJavaScript(WidgetLoader.commonBaseUrl + '/js/glow/1.7.7/core/core.debug.js', WidgetLoader.baseLibraryLoaded );
	}
	WidgetLoader.numberOfLibrariesToLoad++;
	WidgetLoader.loadJavaScript(WidgetLoader.commonBaseUrl + '/js/vrtWidgets-1.0.0-jquery-1.8.3.min.js', WidgetLoader.baseLibraryLoaded  );
};

WidgetLoader.baseLibraryLoaded = function() {
	WidgetLoader.numberOfLoadedLibraries++;
	if (WidgetLoader.numberOfLoadedLibraries == WidgetLoader.numberOfLibrariesToLoad) {
		if(WidgetLoader.loadGlow) {
			WidgetLoader.loadJavaScript(WidgetLoader.commonBaseUrl + '/js/glow/1.7.7/widgets/widgets.js', WidgetLoader.glowCoreLibraryLoaded);
			//WidgetLoader.loadJavaScript(WidgetLoader.commonBaseUrl + '/js/glow/1.7.7/widgets/widgets.debug.js', WidgetLoader.glowCoreLibraryLoaded);
		}  else {
			WidgetLoader.loadWidgetLibraries();
		}
	}
};
WidgetLoader.glowCoreLibraryLoaded = function() {
	WidgetLoader.loadWidgetLibraries();
};


WidgetLoader.loadWidgetLibraries = function() {
	//check libraries which have to be loaded based on the widget types that are defined in the config files
	var widgetList = WidgetLoader.widgetConfigs;
	var widgetLibsToLoad = [];
	for (var i = 0; i < widgetList.length; i++) {
		var widgetType = widgetList[i].type;
		widgetLibsToLoad[widgetType]= widgetType;
	}
	//load the libraries
	WidgetLoader.loadJavaScriptLibrary(WidgetLoader.widgetsBaseUrl + '/common/commonUtils_1.0.js', WidgetLoader.libLoaded);

	for(var libs in widgetLibsToLoad){
		WidgetLoader.loadWidgetLibrary(libs, WidgetLoader.libLoaded);
	}
};

WidgetLoader.loadWidgetLibrary = function(widget, onLoad) {
	if(typeof WidgetLoader.widgetTypes[widget]!=="undefined"){
		var files = WidgetLoader.widgetTypes[widget].files;
		for (var i=0; i<files.length; i++) {
			WidgetLoader.loadJavaScriptLibrary(files[i], onLoad);
		}
		var css = WidgetLoader.widgetTypes[widget].css;
		if(css){
			for (var j=0; j<css.length; j++) {
				WidgetLoader.loadCss(css[j]);
			}
		}
	}
};

WidgetLoader.libLoaded = function() {
	WidgetLoader.numberOfLoadedWidgetLibraries++;
	if (!WidgetLoader.widgetsLoadStarted && WidgetLoader.numberOfLoadedWidgetLibraries == WidgetLoader.numberOfWidgetLibrariesToLoad) {
		WidgetLoader.widgetsLoadStarted = true;
		WidgetLoader.loadWidgets();
	}
};

WidgetLoader.widgetLoaded = function() {
	WidgetLoader.numberOfLoadedWidgets++;
	if(WidgetLoader.numberOfLoadedWidgets == WidgetLoader.numberOfWidgetsToLoad && typeof widgetsLoaded != "undefined") {
		try {
			widgetsLoaded();
		} catch (err) {
			console.error("Error in widgetsLoaded callback: "+err);
		}
	}
};

WidgetLoader.loadCss = function(path) {
	// prevent css from loading twice
	var links = document.getElementsByTagName("link");
	for (var i=0; i<links.length; i++) {
		var src = links[i].getAttribute("href");
		if (src == path) return;
	}

	var link = document.createElement('link');
	link.href = path;
	link.rel = 'stylesheet';
	link.type = 'text/css';
	var head = document.getElementsByTagName('head')[0];
	var firstlink = head.getElementsByTagName('link')[0];

	// try catch for IE6
	try {
		if (firstlink){
			head.insertBefore(link, firstlink);
		}else{
			head.appendChild(link);
		}
	} catch (err) {
		head.appendChild(link);
	}
};

WidgetLoader.serviceBaseUrl = 'http://services.vrt.be';
WidgetLoader.commonBaseUrl = 'http://services.vrt.be';
WidgetLoader.widgetsBaseUrl = 'http://services.vrt.be/widgets';
WidgetLoader.appsBaseUrl = 'http://apps.vrt.be';
WidgetLoader.widgetConfigs = [];
WidgetLoader.numberOfWidgetLibrariesToLoad = 0;
WidgetLoader.numberOfLoadedWidgetLibraries = 0;
WidgetLoader.numberOfWidgetsToLoad = -1;
WidgetLoader.numberOfLoadedWidgets = 0;
WidgetLoader.widgetsLoadStarted = false;
WidgetLoader.playlistArray = {};
WidgetLoader.loadGlow = false;

if(!window.console){
	window.console = {
		log:function(){},
		trace:function(){},
		debug:function(){},
		info:function(){},
		warn:function(){},
		error:function(){}
	};
}
//indexOf support for ie browsers
if(!Array.indexOf){
	Array.prototype.indexOf = function(obj){
			for(var i=0; i<this.length; i++){
					if(this[i]==obj){
							return i;
						}
				}
				return -1;
		};
}
