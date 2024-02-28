/**
 * zFeed Widget!
 **/
(function () {
	var zFeed = (function(name) {
		var rt = typeof window !== "undefined" ? window : global;
		var had = rt.hasOwnProperty(name);
		var prev = rt[name];
		var me = rt[name] = {};
		me.noConflict = function() {
			delete rt[name];
			if ( had ) {
				rt[name] = prev;
			}
			return this;
		};
		return me;
	}('zFeed'));

	zFeed.VERSION = '0.1.2';

	/** Feeds */
	zFeed.feeds = {};

	/** Widget Defaults */
	zFeed.defaults = {
		selector: "#zfeed",
		friends: null,
		limit: 20,
		gameId: 0,
		last: undefined,
		last_per: {},
		action: undefined,
		doTrack: true,
		profile: "http://profile.ak.fbcdn.net/static-ak/rsrc.php/v1/yL/r/HsTZSDw4avx.gif",
		spinner: "http://i.imgur.com/fq7T6.gif",
		api: {
			getFriends: function(callback){
				var request = {
					"method": "friends.get",
					"payload": { },
					"callback": callback
				};
				zFeed.log(["zFeed","getFriends","Request",request]);
				DAPI.api.send(request);
				DAPI.api.flush();
			},
			getFeeds: function(parameters, callback) {
				var request = {
					"method": "stream.getList",
					"payload": parameters,
					"callback": callback
				};
				zFeed.log(["zFeed","getFeeds","Request",request]);
				DAPI.api.send(request);
				DAPI.api.flush();
			},
			optOut: function(callback) {
				var request = {
					"method": "stream.optOut",
					"payload": {},
					"callback": callback
				};
				zFeed.log(["zFeed","optOut","Request",request]);
				DAPI.api.send(request);
				DAPI.api.flush();
			},
			optIn: function(callback) {
				var request = {
					"method": "stream.optIn",
					"payload": {},
					"callback": callback
				};
				zFeed.log(["zFeed","optIn","Request",request]);
				DAPI.api.send(request);
				DAPI.api.flush();
			},
			trackClick: function(parameters) {
				var request = {
					"method": "Track.logCount",
					"payload": parameters
				};
				zFeed.log(["zFeed","trackClick","Request",request]);
				DAPI.api.send(request);
				DAPI.api.flush();
			},			
			getInfo: function(parameters, callback) {
				var mapping = {
					"-1": {
						"id": "-1",
						"name": "a Zynga game",
						"link": "http://www.zynga.com",
						"icon_tiny": "https://zynga1-a.akamaihd.net/zlive/zdc-58243-static/js/compiled/zui/modules/widgets/zdc/home/gamechiclet/bg_badge.png",
						"icon_normal": "https://zynga1-a.akamaihd.net/zlive/zdc-58243-static/images/common_web/header/zdc-hdr-logo.png"
					},
					"63": {
						"id": "102452128776",
						"name": "FarmVille",
						"link": "http://www.facebook.com/apps/application.php?id=102452128776",
						"icon_tiny": "http://photos-g.ak.fbcdn.net/photos-ak-snc1/v85005/144/102452128776/app_2_102452128776_1812516670.gif",
						"icon_normal": "http://photos-f.ak.fbcdn.net/photos-ak-snc1/v85005/144/102452128776/app_1_102452128776_1856684156.gif" 
					},
					"75": {
						"id": "291549705119", 
						"name": "CityVille",
						"link": "http://www.facebook.com/apps/application.php?id=291549705119",
						"icon_tiny": "http://photos-f.ak.fbcdn.net/photos-ak-snc1/v85006/71/291549705119/app_2_291549705119_857480757.gif",
						"icon_normal": "http://photos-f.ak.fbcdn.net/photos-ak-snc1/v27562/71/291549705119/app_1_291549705119_514.gif"
					},
					"223": {
						"id": "107040076067341", 
						"name": "CastleVille",
						"link": "http://www.facebook.com/apps/application.php?id=107040076067341",
						"icon_tiny": "http://photos-e.ak.fbcdn.net/photos-ak-snc1/v85006/109/107040076067341/app_2_107040076067341_1894992473.gif",
						"icon_normal": "http://photos-b.ak.fbcdn.net/photos-ak-snc1/v85006/109/107040076067341/app_1_107040076067341_1528.gif"
					}
				};
				if ( "gid" in parameters && parameters.gid !== undefined ) {
					if ( parameters.gid in mapping ) {
						callback(mapping[parameters.gid]);
					} else {
						callback(mapping["-1"]);
					}
				} else {
					callback(mapping);
				}
			}
		}
	};

	/** Widget Settings (if null then non initalized) */
	zFeed.settings = null;

	/**
	 * Provides an interface for logging errors
	 *
	 * @param mixed message
	 *
	 * @return void
	 */
	zFeed.log = function log(msg) {
		if(console && console.log) {
			console.log(msg);
		}
	};

	zFeed.init = function(options) {
		zFeed.load_jquery_plugin();
		zFeed.settings = $.extend(true, {}, zFeed.defaults, options);
		if ( !$.isArray(zFeed.settings.games) ) {
			zFeed.settings.ratios = zFeed.settings.games;
			zFeed.settings.games = $.map(zFeed.settings.games, function(value,key){return key;});
		
		}
		zFeed.div = $(zFeed.settings.selector).addClass("zfeed_root");
		zFeed.div.html("<div class='zfeed_main zfeed_left'><ul class='zfeed_border'><li class='zfeed_center zfeed_spinner'><img src='"+zFeed.settings.spinner+"'/></ul></div><div class='zfeed_clear'/>");
		zFeed.settings.api.getFriends(zFeed.init_callback);
		zFeed.settings.api.getInfo({},function(result){zFeed.log(["getInfo",result]);zFeed.settings.info=result;});
	};
	
	zFeed.init_callback = function(result) {
		zFeed.log(["zFeed","getFriends","Result",result]);
		zFeed.settings.friends = {};
		zFeed.settings.friend_list = [];
		$.each(result, function(index,friend){
			zFeed.settings.friends[friend.zid] = friend;
			zFeed.settings.friend_list[index] = friend.zid;
		});
		zFeed.fetch();
	};

	zFeed.more = function() {
		zFeed.div.find("ul li.zfeed_more").removeClass("zfeed_more").addClass("zfeed_spinner").html("<img src='"+zFeed.settings.spinner+"'/>");
		zFeed.fetch();
	};

	zFeed.fetch = function() {
		var options = {};
		if ( zFeed.settings.ratios !== undefined ) {
			options.limit_by_game = {};
			$.each(zFeed.settings.ratios, function(key, value){
				options.limit_by_game[key] = {
					"gameLimit" : zFeed.settings.limit * value,
					"endTime": zFeed.settings.last_per[key]
				};
			});
		}
		var payload = {
			"games": zFeed.settings.games,
			"friendsZids": zFeed.settings.friend_list,
			"startTime": undefined,
			"endTime": zFeed.settings.last,
			"limit": zFeed.settings.limit,
			"types": ['gf', 'fwpf', 'impf', 'ff'],
			"timeoutMilliSec": 15000,
			"reload": true,
			"optionals": options
		};
		zFeed.settings.api.getFeeds(payload, zFeed.fetch_callback);
	};

	zFeed.fetch_callback = function(result){
		if ( result === undefined || result === null ) {
			zFeed.log(["zFeed","getFeeds","Error", result]);
			zFeed.div.find(".zfeed_spinner").remove();
			zFeed.div.find("ul").append("<li class='zfeed_center zfeed_more'><p>No Feeds</p><button onclick='zFeed.more()'>Load More</button></li>");
			return;
		}
		if ( result.error !== undefined ) {
			zFeed.log(["zFeed","getFeeds","Error", result]);
			if ( result.error == "stream.optout: stream error" ) {
				zFeed.div.find("ul").empty().append("<li class='zfeed_center'><button onclick='zFeed.optIn()'>Join Zynga Feeds</button></p></li>");
				return;
			}
			zFeed.div.find("ul").append("<li class='zfeed_center zfeed_more'><p>There was an error</p><button onclick='zFeed.more()'>Load More</button></li>");
			return;
		}
		zFeed.log(["zFeed","getFeeds","Result",result]);
		zFeed.div.find(".zfeed_spinner").remove();
		$.each(result, function(feed_id, feed){
			zFeed.insert(feed);
		});
		zFeed.div.find("ul").append("<li class='zfeed_center zfeed_more'><button onclick='zFeed.more()'>Load More</button><br/><button onclick='zFeed.optOut()'>Disable</button></li>");
	};

	zFeed.insert = function(feed) {
		if ( feed.id in zFeed.feeds ) {
			zFeed.log("Already Listed "+feed.id);
			return false;
		}
		if ( !zFeed.valid(feed) ) {
			zFeed.log("Nonvalid Feed");
			return false;
		}
		// Decode random inserted json
		if ( "profile" in feed && typeof feed.profile === "string" ) {
			feed.profile = JSON.parse(feed.profile);
		}
		if ( "attachment" in feed && "media" in feed.attachment && typeof feed.attachment.media === "string" ) {
			feed.attachment.media = JSON.parse(feed.attachment.media);
		}
		// Insert
		zFeed.feeds[feed.id] = feed;
		zFeed.log([feed.id,feed]);
		var html = zFeed.getFeedHTML(feed);
		var list = zFeed.div.find("ul");
		list.append(html);
		$("abbr.timeago").timeago();
		// Check if oldest and store
		if ( zFeed.settings.last === undefined || zFeed.settings.last > feed.created_time ) {
			zFeed.settings.last = feed.created_time;
		}
		if ( zFeed.settings.last_per[feed.game_id] === undefined || zFeed.settings.last_per[feed.game_id] > feed.created_time ) {
			zFeed.settings.last_per[feed.game_id] = feed.created_time;
		}
		return true;
	};

	/*
	 * Called via buttons to enable/disable zfeeds
	 */
	zFeed.optOut = function(optOutFlag) {
		zFeed.settings.api.optOut(function(result) {
			zFeed.log(["zFeed","optOut","Result",result]);
			zFeed.feeds = [];
			zFeed.div.find("ul").empty().append("<li class='zfeed_center'><button onclick='zFeed.optIn()'>Join Zynga Feeds</button></p></li>");
		});
	};
	
	/*
	 * Called via buttons to enable/disable zfeeds
	 */
	zFeed.optIn = function() {
		zFeed.settings.api.optIn(function(result) {
			zFeed.log(["zFeed","optIn","Result",result]);
			zFeed.div.find("ul").empty().append("<li class='zfeed_center zfeed_spinner'><img src='"+zFeed.settings.spinner+"'/></li>");
			zFeed.fetch();
			return;
		});
	};

	/*
	 * Event triggered when action link is called.
	 * Calls action callback with feed if passed in.
	 * Default action is to window.open url
	 */
	zFeed.actionClick = function(feed_id, action_index) {
		if ( ! ( feed_id in zFeed.feeds ) ) {
			zFeed.log(["zFeed","Error","actionClick","Unknown Feed",feed_id]);
			return false;
		}
		if ( ! ( action_index in zFeed.feeds[feed_id].action_links ) ) {
			zFeed.log(["zFeed","Error","actionClick","Unknown Action",feed_id,action_index]);
			return false;
		}
		if ( zFeed.settings.action !== undefined && typeof zFeed.settings.action === "function" ) {
			zFeed.log(["zFeed","Action","Running Function", zFeed.settings.action]);
			var captured = zFeed.settings.action(zFeed.feeds[feed_id], action_index);
			if ( captured ) {
				return false;
			}
		}
		//$('#' + zFeed.getSafeFeedId(feed.id)).remove();
		var href = zFeed.decode(zFeed.feeds[feed_id].action_links[action_index].href);
		window.open(href);
		
		//track click
		if(zFeed.settings.doTrack){
			var payload = {
					"clientId": 1027,
					"zid"    : DAPI.getCurrentUser(),
	 				"counter": "zfeed_widget",
					"value"  : "1",
					"key1"   : zFeed.feeds[feed_id].game_id,
					"key2"   : zFeed.settings.gameId,
					"key3"   : zFeed.feeds[feed_id].action_links[action_index].text
				};
			zFeed.settings.api.trackClick(payload); 
		}
		zFeed.log(["zFeed","Action","Default",href]);
		return false;
	};

	/*
	 * Generates a valid HTML id from a zFeed ID
	 * 
	 * @param string feedId The unique id of the feed
	 * 
	 * @return string
	 */
	zFeed.getSafeFeedId = function getSafeFeedId(feedId) {
		return "zfeed_" + feedId.replace(':','-');
	};
	
	/*
	 * Generates the original zFeed id from a modified zFeed id
	 * 
	 * @param string feedId The result of zFeed.getSafeFeedId
	 * 
	 * @return string
	 */
	zFeed.getRealFeedId = function getRealFeedId(feedId) {
		return feedId.replace('_',':');
	};

	/**
	 * Formats and Validates feed info different format
	 * 
	 * @param array feed Formatted array of parameters
	 * 
	 * @return boolean
	 */
	zFeed.valid = function(feed) {
		if ( !("attachment" in feed) || !("media" in feed.attachment) ) {
			return false;
		}
		return true;
	};

	/**
	 * Encode and Decode HTML characters that were in URLs, making them valid again
	 */
	zFeed.encode = function(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	};
	zFeed.decode = function(str) {
		return String(str)
			.replace(/&amp;/g, '&')
			.replace(/&quot/g, '"')
			.replace(/&#39;/g, '\'')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>');
	};

	/**
	 * Generates the HTML for a feed, given a feed payload
	 * 
	 * @param array feed		The payload for a feed returned from the server
	 * 
	 * @return string			The HTML to render the feed on the canvas
	 */
	zFeed.getFeedHTML = function getFeedHTML(feed) {
		var game = zFeed.settings.info["-1"];
		if ( feed.game_id in zFeed.settings.info ) {
			game = zFeed.settings.info[feed.game_id];
		}
		var feedHTML = '';
		feedHTML += '<li id="' + zFeed.getSafeFeedId(feed.id) + '">';
		feedHTML += '	<div class="image">' + '<img src="' + feed.attachment.media[0].src + '" class="feedImage" /></div>';
		feedHTML += '	<div class="content">';
		feedHTML += '		<div class="top">';
		
		if ( "from" in feed && feed.from in zFeed.settings.friends )
		feedHTML += '			<div class="profile_image"><img src="' + zFeed.settings.friends[feed.from].pic + '"/></div>';
		else
		feedHTML += '			<div class="profile_image"><img src="' + zFeed.settings.profile + '"/></div>';
		
		feedHTML += '			<div class="profile_content">';
		feedHTML += '				<div class="name">' + feed.from_name + '</div>';
		feedHTML += '				<div class="title">' + feed.attachment.name + '</div>';
		feedHTML += '			</div>';
		feedHTML += '			<div style="clear:both"></div>';
		feedHTML += '		</div>';
		feedHTML += '		<div style="clear:both"></div>';
		feedHTML += '		<div class="bottom">';
		
		feedHTML += '			<div class="game_image"><img src="' + game.icon_tiny + '"></div>';
		
		feedHTML += '			<span></span>';
		
		$.each(feed.action_links, function(index, value){
		feedHTML += '			<div class="action">' + '<a class="action" onclick="zFeed.actionClick(\'' + feed.id + '\', ' + index + ');">' + value.text + '</a></div>';
		feedHTML += '			<span></span>';
		});
		
		var date = new Date(feed.created_time*1000);
		feedHTML += '			<div class="time"><abbr class="timeago" id="timeago_' + zFeed.getSafeFeedId(feed.id) + '" title="' + date.toISOString() + '">' + date + '</abbr></div>';
		feedHTML += '			<span>via</span>';
		feedHTML += '			<div class="game">' + game.name + '</div>';
		feedHTML += '			<div style="clear:both"/>';
		feedHTML += '		</div>';
		feedHTML += '		<div style="clear:both"/>';
		feedHTML += '	</div>';
		feedHTML += '	<div style="clear:both"/>';
		feedHTML += '</li>';
		return feedHTML;
	};

/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.11.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
//(function($) {
zFeed.load_jquery_plugin = function() {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;
  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
};//}($));
}());

