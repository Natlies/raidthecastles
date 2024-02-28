/**
 * File Name: flash_integration.js
 *
 * All the functions in this file are needed to embed or used by Flash
 * C 2010 Zynga Game Network Inc.
 */

/** On load, listen for the scroll event and send it to flash */
$(window).load(function() {
	var element = $('#flashapp')[0];
	var callback = function(e) {
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
			if (window.opera) {
				delta = -delta;
			}
		} else if (e.detail) {
			delta = -e.detail * 3;
		}
		this.onMouseWheel && this.onMouseWheel(delta);
		e.stopPropagation();
		e.preventDefault();
	};

	if (element) {
		if (element.addEventListener) {
			element.addEventListener('DOMMouseScroll', callback, false);
			element.addEventListener('mousewheel', callback, false);
		} else if (element.attachEvent) {
			element.attachEvent("onmousewheel", callback);
		}
	}
	
	$('#z_lang').bind("hide_z_lang", function() {hideScreenshot()});
	$('#z_lang').bind("show_z_lang", function() {showScreenshot(0.25, 3.0, 0x30000000)});
	startSnapiRequestFBDialogCheck();
});

var fbDialogTimerId = 0;
var fbDialogIsShowing = false;
function startSnapiRequestFBDialogCheck() {
	if (fbDialogTimerId == 0) {
		fbDialogTimerId = setInterval(function() {
			var dialogIsOnScreen = false;
			var root = document.getElementById('fb-root');
			if (root) {
				var childNodes = root.childNodes;
				for (var i = 0; i < childNodes.length; i++) {
					var childNode = childNodes[i];
					if (childNode.offsetTop >= 0 && $(childNode).hasClass('fb_dialog')) {
						dialogIsOnScreen = true;
						break;
					}
				}
			}
			if (dialogIsOnScreen && !fbDialogIsShowing) {
				fbDialogIsShowing = true;
				showScreenshot(0.25, 3.0, 0x30000000);
			} else if (!dialogIsOnScreen && fbDialogIsShowing) {
				fbDialogIsShowing = false;
				hideScreenshot();
			}
		}, 250);				
	}
}

function stopSnapiRequestFBDialogCheck() {
	clearInterval(fbDialogTimerId);
	fbDialogTimerId = 0;
	if (fbDialogIsShowing) {
		fbDialogIsShowing = false;
		hideScreenshot();
	}
}

function enableAllInput() {
	document.getElementById('flashapp').enableAllInput();
}

function disableAllInput() {
	document.getElementById('flashapp').disableAllInput();
}

/** @return array	Returns an array of app friend ids for the current user */
function getAppFriendIds() {
	return g_appFriendIds;
}

/** @return array	Returns an array of friend data for the current user */
function getFriendData() {
	return g_friendData;
}

/** @return array	Returns user info for the current user */
function getUserInfo() {
	return g_userInfo;
}

/** @return array	Returns an array of ZTrack experiments for this user */
function getExperiments() {
	return g_experiments;
}

var g_appRequestParams;
var g_requestPayload;
var g_requestCallback = null;

function snapiRequestCallback(result){
    document.getElementById("flashapp").requestCallback(result);
}

function snapiRequestDone(result){
    if(!g_requestCallback){
        if(result != null){
            document.getElementById("flashapp").requestDone(result);
        }
        else {
            document.getElementById("flashapp").onViralCanceled();
        }
    }
    else {
        g_requestCallback(result);
    }
}


function snapiRequestSNUID(zidObj){
    if(!zidObj || zidObj.length == 0){
        
        FB.ui({method:'apprequests', message:g_requestPayload['body'], title:g_requestPayload['title'],filter: ['app_users']}, snapiRequestDone);
    }
    else if(zidObj.length > 1){
        FB.ui({method:'apprequests', message:g_requestPayload['body'], title:g_requestPayload['title'],to: zidObj}, snapiRequestDone);
    }
    else {
         //, data:params
        FB.ui({method:'apprequests', message:g_requestPayload['body'], title:g_requestPayload['title'],to: zidObj[0]}, snapiRequestDone);
    }
}

/*
 *
*/
function snapiSendRequestOld(toZids, requestPayload, zEventType, requestType) {
    var reqparams = [];
    reqparams['toZid'] = toZids;
    reqparams['eventTypeId'] = zEventType;
    reqparams['data'] = requestPayload;
    
    g_requestPayload = requestPayload;
    if(!toZids){
        snapiRequestSNUID(toZids);
    }
    SNAPI.getSNUIDs(toZids, SNAPI.FACEBOOK, function(e) {
              var d = [];
              for(var f = 0;f < toZids.length; ++f) {
                e[toZids[f]] ? d.push(e[toZids[f]]) : SNAPI.Logger.error("Error: ZID -> FBID mapping issue.");
              }
              snapiRequestSNUID(d);
    })

}

function snapiSendRequest(toZids, requestPayload, zEventType, requestType){
	 var reqparams = {
		gameId: g_gameId,
		toZid: toZids,
		type: requestType,
		data: requestPayload,
		eventTypeId: zEventType
	 };

	try{
	    SNAPI.api('request.send', reqparams, snapiRequestDone);
    }
    catch(e){
        document.getElementById("flashapp").onRequestError(e);
    }
}

function snapiGiftBack(toZid, giftBackPayload, zEventType, callback){
    var toZidArr = [toZid];
    if(callback){
        g_requestCallback = callback;
    }
    snapiSendRequest(toZidArr, giftBackPayload, zEventType, 'gift')
}

var g_giftBackVid;
var g_giftTo;
var g_canvasUrl;
var g_viralName;
function giftBackCallback(result){
	if (result != null) {
		window.top.location = g_canvasUrl + 'index.php?va=giftback&gbvid=' + g_giftBackVid + '&giftTo=' + g_giftTo + '&gbReq=' + result[g_giftTo] + '&gbName=' + g_viralName;
	} else {
		window.top.location = g_canvasUrl +'index.php';
	}
}

function sendGiftBack(senderId, vid, payload, gameId, canvUrl){
  g_giftTo = senderId;
  g_giftBackVid = vid;
  g_canvasUrl = canvUrl;
  g_gameId = gameId;
  
  //var payload = [];
  //payload['body'] = body;
  //payload['title'] = title;
  var payloadObj = JSON.parse(payload);
  g_viralName = payloadObj.viralName;
  snapiGiftBack(senderId, payloadObj, 14000, giftBackCallback);
}


function snapiGetPermission(permission, uid, appCallback) {
    SNAPI.api("users.getPermissions", {uid: uid},
              function(result){
				var perm = "0";
				if(result[uid]){
					if(result[uid][permission]){
						perm = result[uid][permission];
					}
				}
                var app = document.getElementById('flashapp');
                app[appCallback](uid, permission, perm == "1");
              }
    );
}


function snapiStreamPublish(viralPayload) {
    var media = [viralPayload.full.media];

    viralPayload.full.media = media;
    viralPayload.simple.media = media;

    /////////////////////////////////////
    var params = {payload : JSON.stringify(viralPayload)};
    
    try{
        var result=SNAPI.api('stream.publish', params, function(response){
			if(response){
				document.getElementById('flashapp').onViralPublished(response);
			}
			else {
				document.getElementById('flashapp').onViralCanceled();
			}
        });
    }
    catch(e){
        document.getElementById('flashapp').onViralError();
    }
}

/** SNAPI wrapper to award ZPoints **/
function snapiAwardXp(amount) {
	try {
	  SNAPI.api("points.grantXP", amount);
	} catch(e) {
	  //do something
	}
}


/**
* Get a reference to the swf file
*
* @param string	swf	id of swf reference 
*/
function movie(swf) {
	return document[swf];
}


/** Embed the game SWF  */ 
function embedGameSwf(swfLocation, flashWidth, flashHeight, flashVars) {
    var minimumFlashVersion = "10.2.0";
	var params = { allowScriptAccess: "always", wmode: "window", allowFullScreen: "true" };
	var attrs = { id: "flashapp", name: "flashapp" };
	var flashPlayerVer = swfobject.getFlashPlayerVersion();
	var versionString = flashPlayerVer.major+'.'+flashPlayerVer.minor+'.'+flashPlayerVer.release;

	//Stats Calls for FlashVersion (log these regardless of whether the user has the required version or not)
    var trackData = { channel: 'flash_version', category: versionString };
    var flashUrl = g_callbackURL + '/ztrack/ztrack_flash.php?zaspSessionKey='+flashVars.zaspSessionKey+'&zyAuthHash='+flashVars.zyAuthHash+'&zySig='+flashVars.zySig;
    $.ajax({url:flashUrl, data: trackData, success: ''});
    // End of Stats
    // Check the minimum version against what the user has, and react accordingly
    if (swfobject.hasFlashPlayerVersion(minimumFlashVersion)) {
        var heightParam =
            swfobject.embedSWF(swfLocation, "flashContent", "100%", flashHeight, minimumFlashVersion, "playerProductInstall.swf", flashVars, params, attrs);
    }
    else if (versionString == '0.0.0') {
        // The user doesn't have flash installed at all, so just show the default background
    }
    else {
        // The user doesn't have a new enough version of flash installed, so the game won't show. Swap out the message
        // they see so it's more specific to their problem.
        $('#upgradeFlashLink').click(function() {
            sendVersionStats('upgrade');
            swfobject.embedSWF(swfLocation, "flashContent", "100%", flashHeight, minimumFlashVersion, "playerProductInstall.swf", flashVars, params, attrs);
        });

        $('#loadingPlaceholder').hide();
        $('#upgradeFlashPlaceholder').show();
    }
}

/**
 * Pop open the ZSC
 */
function openZSC() {
	if (SNAPI_ENABLE && ZSC_ENABLE) {
		initZsc();
		SNAPI.ZSC.addOnOpenedListener(function(){showScreenshot(0.25, 3.0, 0x30000000)});
		SNAPI.ZSC.addOnClosedListener(function(){hideScreenshot()});
	}
}

var ZCastleTabs = (function() {
	var me = {};
	
	me.click = function(tabName){
		var app = document.getElementById('flashapp');
		if(typeof app['tabClick'] == 'function'){
			app.tabClick(tabName);
		}
	}
	
	return me;
})();


/**ZTrack querying**/
var ZTrackQuery = (function() {
	var me = {};
	var ztrackValues = new Array();
	// debugging
	//var callUrl = "http://fb.caflores-zcastle-development.dev3.dallas.zynga.com/zsc/ztrack_callback.php";
	
	var strAppCallback = null;
	
	me.GetKey = function(ztrackinfo, appCallback){
		var callUrl = g_callbackURL + '/ztrack/ztrack_callback.php';
		strAppCallback = appCallback;
		$.ajax({url:callUrl, data: ztrackinfo, success: me.KeyReceived});
	}
	
	me.KeyReceived = function(data) {
		
		var app = document.getElementById('flashapp');
		if(!app){
			alert("Could not find flash client");
		}
		
		//check if there was data returned
		if(strAppCallback != null && typeof app[strAppCallback] == 'function'){	
			
			if(data != null){
				var res = {
					result: "Success",
					key: data.key,
                    keyMsgCtr: data.keyMsgCtr
				};
				
			   app[strAppCallback](res);
			}
			else {
				var res = {
					result: "Error",
					message: "no Key returned"
				};
				
				app[strAppCallback](res);
			}
		}
		else {
			alert("Flash client callback not found");
		}
	}
	return me;
	
})();


function getZTrackKey(channel, category, subcategory, family, genus, userId, appCallback){
	var data = {
			channel: channel,
			category: category,
			subcategory: subcategory,
			family: family,
			genus: genus,
			userId: userId
		};
		ZTrackQuery.GetKey(data, appCallback);
}

function TestZTrackCall(){
	var data = {
	};
	ZTrackQuery.GetKey(data);
}


/**
 * Payments object
 */
var CastlePayments = (function() {
	
	var me = {};
	
	me.addToCart = function(in_itemCode, in_qty, in_ref) {

		if (in_itemCode == 0) { return; }
		if (in_qty == 0) { return; }
		if (typeof g_paymentHashes[in_itemCode] == "undefined") { return; }
		
		var gameId = 223;
		var snId = SNAPI.getSNID();
		var uid = SNAPI.getConfig(snId).session.user_id;
		var clientId = 1; // Set to always be web
		var itemCode = in_itemCode;
		var qty = in_qty;
		var cb_fcn = preFunction;
		var complete_fcn = postFunction;
		var ref = in_ref;
		var appId = SNAPI.getCurrentGameId(snId);
		var sig = g_paymentHashes[in_itemCode];
		
		ZPURCHASE.add_to_cart(gameId, snId, uid, clientId, itemCode, qty, cb_fcn, complete_fcn, ref, appId, sig);
	}
	
	var preFunction = function() {
		
	}
	
	var postFunction = function() {
		
	}
	
	me.openOffers = function() {
		var gameId = 223;
		var snId = SNAPI.getSNID();
		var uid = SNAPI.getConfig(snId).session.user_id;
		var clientId = 1; // Set to always be web
		var appId = SNAPI.getCurrentGameId(snId);
		
		ZPAYMENTS.get_offers(gameId, snId, uid, clientId, offersCallback, offersComplete, appId);
	}
	
	var offersCallback = function(response) {
		if (response) {
			// Error
		} else {
			
		}
	}
	
	var offersComplete = function(response) {
		
	}
	
	return me;
})();

/**
 * Bridge between ZSC and client
 */
var ZscClientNotif = (function() {

	var me = {};
	var requests = new Array();
	
	me.Accept = function(data) {
		var params = new Array(data['viralName'], data['contextVars']);
		requests.push(params);		
	}
		
	/**
	 * Called when ZSC is closed
	 */
	me.ProcessRequests = function() {
		var processed = false;
		
		for (var i = 0; i < requests.length; i++) {
			var parms = new Array();
			parms.push(requests[i][0]);
			parms.push(requests[i][1]);
			
			var app = document.getElementById('flashapp');
			if(app && app.onZscEvent && typeof app.onZscEvent == 'function') {
				 app.onZscEvent(parms);
			}
			
			processed = true;
		}
		
		// If we processed something then kick off a transaction
		if (processed) {
			var app = document.getElementById('flashapp');
			if(app && app.processRequests && typeof app.processRequests == 'function') {
				 app.processRequests();
			}			
		}
		
	   requests = [];
	}
	
	return me;
	
})();

var ZscClientNotifAccept = ZscClientNotif.Accept;
