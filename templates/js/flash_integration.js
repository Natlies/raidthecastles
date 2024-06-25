/**
 * File Name: flash_integration.js
 *
 * All the functions in this file are needed to embed or used by Flash
 * C 2010 Zynga Game Network Inc.
 */

/** On load, listen for the scroll event and send it to flash */
$(window).load(function() {
    initZsc();
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
    startHideAppMonitor();
});

function ztrackCountSample( _sample, _counter, _kingdom, _phylum, _class, _family, _genus, _value) {
    ztrackCount(_counter, _kingdom, _phylum, _class, _family, _genus, _value, _sample);
}

function ztrackCount(_counter, _kingdom, _phylum, _class, _family, _genus, _value, _sample) {
    var elems = jQuery.parseJSON(zaspVals);
    var data = {
        zcounter: _counter,
        zkingdom: _kingdom || '',
        zphylum: _phylum || '',
        zclass: _class || '',
        zfamily: _family || '',
        zgenus: _genus || '',
        zvalue: _value || 1,
        zsample: _sample || 100
    };

    var callUrl = callbackURL + '/ztrack/ztrack_flash.php?zaspSessionKey='+elems.zaspSessionKey+'&zyAuthHash='+elems.zyAuthHash+'&zySig='+elems.zySig + "&zySnid=" + elems.zySnid;

    $.ajax({url:callUrl, data: data, success: ''});
}

function onSNAPIInit(){
    if (SNAPI.getNativeInterface().hasOwnProperty('Canvas')) {
        SNAPI.getNativeInterface().Canvas.setUrlHandler(onUrl);
    }
  gameMessageInit();
}

function onUrl(data) {
    SNAPI.ZSC.open();
}

var fbDialogTimerId = 0;
var fbDialogIsShowing = false;
var zscIsShowing = false;
function startHideAppMonitor() {
    if (fbDialogTimerId == 0) {
        fbDialogTimerId = setInterval(function() {
            // Test for the fb request dialog
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

            // Test for the zsc menu
            if (SNAPI.ZSC.isOpen() && !zscIsShowing) {
                zscIsShowing = true;
                showScreenshot(0.25, 3.0, 0x30000000);
            } else if (!SNAPI.ZSC.isOpen() && zscIsShowing) {
                zscIsShowing = false;
                hideScreenshot();
            }
        }, 250);
    }
}

function stopHideAppMonitor() {
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

/** @return array   Returns an array of app friend ids for the current user */
function getAppFriendIds() {
    return g_appFriendIds;
}

/** @return array   Returns an array of friend data for the current user */
function getFriendData() {
    return g_friendData;
}

/** @return array   Returns user info for the current user */
function getUserInfo() {
    return g_userInfo;
}

/** @return Object Returns the session information for the current social network */
function getUserSession() {

    return SNAPI.sessionInformation[SNAPI.getSNID()].session;
}

/** @return array   Returns an array of ZTrack experiments for this user */
function getExperiments() {
    return g_experiments;
}

function getLoadingScreenConfig() {
    return g_loadingScreenConfig;
}
function callAmexFrame() {
        if($('#amexOverlay').is(':hidden'))
        {
                showScreenshot(0.25, 3.0, 0x30000000);
                $('#amexOverlayFrame').attr('src', ZY.PrepareURL("amex_overlay.php"));
                $('#amexOverlay').show();            
        }
}
function hideAmexOverlay() {
    hideScreenshot();
    $('#amexOverlay').hide();            
    $('#amexOverlayFrame').attr('src', '');
}

function updateProgressData(progressValue) {
    if (SNAPI.getSNID() == SNAPI.ZDC) {
        SNAPI.GameMessages.send('gameLoading', { percent: progressValue });
    }
}
var g_appRequestParams;
var g_requestPayload;
var g_requestCallback = null;

function snapiRequestCallback(result){
    document.getElementById("flashapp").requestCallback(result);
}

function snapiRequestDone(post_ids){
    if(g_requestCallback){
        g_requestCallback(post_ids);
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

    var params = {
        gameId: SNAPI.getCurrentGameId(1), // '108198598031886'
        toZid : toZids,
        type: "invite",
        // This is the ZMC spacific data
        data: requestPayload,
        eventTypeId : zEventType,
        zid: SNAPI.getCurrentUserId()
   }

    SNAPI.api(
        'request.send',
        params,
        function (post_ids) {
            snapiRequestDone();
        }

    );

}

function snapiSendRequest(toZids, requestPayload, zEventType, requestType, vid){
     var reqparams = {
        gameId: g_gameId,
        toZid: toZids,
        type: requestType,
        data: requestPayload,
        eventTypeId: zEventType
     };

    try{
        SNAPI.api('request.send', reqparams, function(post_ids) {
            if(post_ids != null){
                document.getElementById("flashapp").requestDone(post_ids, vid);
            }
            else {
                document.getElementById("flashapp").onViralCanceled(vid);
            }
        });
    }
    catch(e){
        document.getElementById("flashapp").onRequestError(e, vid);
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
  var payloadObj = JSON.parse(payload);
  g_viralName = payloadObj.viralName;

  //hide the button.
  $('#giftBackButton').hide();
  snapiGiftBack(senderId, payloadObj, 14000, giftBackCallback);
}


function snapiGetPermission(permission, uid, appCallback) {
    SNAPI.api("users.getPermissions", {uid: uid, perms:new Array(permission)},
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


/* This is the format ZFeeds/Snapi is looking for and works with FB too */
function snapiStreamPublish (viralPayload, vid, displayOverride) {
    
    if ( viralPayload.full.media != undefined 
            && viralPayload.full.media["src"] != undefined 
            && viralPayload.full.media["href"] != undefined ) 
    {
        var media = [{
            "type":"image",
            "src":viralPayload.full.media["src"],
            "href":viralPayload.full.media["href"]
        }];
    
        viralPayload.full.media = media;
        viralPayload.simple.media = media;
    }
    
    if (typeof g_locale == "undefined") {
        g_locale = null;
    }
    
    // CST-26801 - Semi-hack suggested by ZDC team to prevent feeds from showing on right-rail stream;
    // not setting locale prevents feeds from being published there.
    if (viralPayload.activityStreamDisabled == undefined) {
        var locale = g_locale || g_userInfo.locale || 'en_US';
        viralPayload.locale = locale;
        viralPayload.version = "v1";
    }

    var params = { payload : viralPayload };
    
    if (displayOverride) {
        params.display = displayOverride;
    }
    
    try {
        var result = SNAPI.api ( 'stream.publish', params, 
                        function (response) {
                            if(response) {
                                hideScreenshot (true);
                                if(response.hasOwnProperty("error_code") && response.error_code == "341") {
                                    document.getElementById('flashapp').onFeedRateLimitError(vid);
                                }
                                else if (response.hasOwnProperty("error_code")) {
                                    document.getElementById('flashapp').onViralError(vid, response);
                                }
                                else {
                                    document.getElementById('flashapp').onViralPublished(response, vid);
                                }
                            }
                            else {
                                document.getElementById('flashapp').onViralCanceled(vid);
                            }
                        }
                    );
    }
    catch (e) {
        
        hideScreenshot (true);

        var logMsg = '';
        
        if (e.name) {
            logMsg += e.name;
        }
        
        if (e.message) {
            logMsg += e.message;
        }

        if (logMsg != '') {
            document.getElementById('flashapp').onViralError(vid, {error_code: logMsg});
        } 
        else {
            document.getElementById('flashapp').onViralError(vid);
        }
    }
    
} // end method snapiStreamPublish

function fbShare(payload, scrapeUrl, vid) {
    //share payload for fb share
    var sharePayload = {
        method: '/me/links/',
        display: 'dialog',
        link:  scrapeUrl,
        title:  payload.full.title,
        description: payload.full.description,
        icon: payload.full.media.src
    };

    try {

        FB.api('/me/links/', 'post', sharePayload, function(response) {
            hideScreenshot(true);

            if(response && response.id){
                document.getElementById('flashapp').onViralPublished(response, vid);
            }
            else {
                hideScreenshot(true);
                document.getElementById('flashapp').onViralError(vid, {error_code: 'fbShare'});
            }
        });
    }
    catch(e) {
        hideScreenshot(true);

        var logMsg = '';
        if (e.name) {
            logMsg += e.name;
        }
        if (e.message) {
            logMsg += e.message;
        }

        if (logMsg != '') {
            document.getElementById('flashapp').onViralError(vid, {error_code: logMsg});
        } else {
            document.getElementById('flashapp').onViralError(vid);
        }
    }
}

function fbShareUI(payload, scrapeUrl, vid) {
    var sharePayload = {
        method: 'stream.share',
        display: 'popup',
        u: scrapeUrl
    };

     try {
        FB.ui(sharePayload, function(response) {
            hideScreenshot(true);

            if(response && response.id){
                document.getElementById('flashapp').onViralPublished(response, vid);
            }
            else {
            hideScreenshot(true);
                document.getElementById('flashapp').onViralError(vid, {error_code: 'fbShareUI'});
            }
        });
      }
      catch(e) {
        hideScreenshot(true);

        var logMsg = '';
        if (e.name) {
            logMsg += e.name;
        }
        if (e.message) {
            logMsg += e.message;
        }

        if (logMsg != '') {
            document.getElementById('flashapp').onViralError(vid, {error_code: logMsg});
        } else {
            document.getElementById('flashapp').onViralError(vid);
        }
      }
}

function postCOGS( payload ) {

    var postData = {};
    var trackData ={};
    postData["access_token"] = payload.access_token;
    postData[payload.cogObject] = payload.url;
    try {

        FB.api(
            '/me/' + payload.appNamespace + ':' + payload.cogAction,
            'post',
            postData,
            function (response) {
                if (!response || response.error) {
                    trackData = { error:response.error.type + " " + response.error.message, action:payload.cogAction, obj:payload.object };

                } else {
                    trackData = { response:response.id, obj:payload.object };
                }
                var flashUrl = callbackURL + '/ztrack/ztrack_cogs.php?zaspSessionKey=' + payload.zaspSessionKey + '&zyAuthHash=' + payload.zyAuthHash + '&zySig=' + payload.zySig + "&zySnid=" + payload.zySnid;
                $.ajax({url:flashUrl, data:trackData, success:''});
            });
    }
    catch (e) {

    }

}

/** Post Achievements*/
function postAchievements( payload ) {

    var postData = {};
    var trackData ={};
    postData["access_token"] = payload.access_token;
    postData["achievement"] = payload.name;
    try {

        FB.api(
            '/'+'me'+'/achievements',
            'post',
            postData,
            function (response) {
                if (!response || response.error) {
                    // do nothing
                }
            });
    }
    catch (e) {

    }

}

/** SNAPI wrapper to award ZPoints **/
//CST-49193 Removing Rewardville calls
//function snapiAwardXp(amount) {
//    try {
//      SNAPI.api("points.grantXP", amount);
//    } catch(e) {
//      //do something
//    }
//}


/**
* Get a reference to the swf file
*
* @param string swf id of swf reference
*/
function movie(swf) {
    return document[swf];
}


/**
* Embed the game SWF
*
* @param swfLocations an array with structure [version, swfLocation, version, swfLocation, ...] ordered from max to min version
*/
function embedGameSwf(swfLocations, flashWidth, flashHeight, flashVars) {
    var flashPlayerVer = swfobject.getFlashPlayerVersion();
    var versionString = flashPlayerVer.major+'.'+flashPlayerVer.minor+'.'+flashPlayerVer.release;

    //Stats Calls for FlashVersion (log these regardless of whether the user has the required version or not)
    var trackData = { zcounter: 'flash_version', zkingdom: versionString };
    var flashUrl = callbackURL + '/ztrack/ztrack_flash.php?zaspSessionKey='+flashVars.zaspSessionKey+'&zyAuthHash='+flashVars.zyAuthHash+'&zySig='+flashVars.zySig + "&zySnid=" + flashVars.zySnid;
    $.ajax({url:flashUrl, data: trackData, success: ''});

    var params = { allowScriptAccess: "always", wmode: "window", allowFullScreen: "true" };
    var attrs = { id: "flashapp", name: "flashapp" };

    var numSupportedVersions = swfLocations.length / 2;
    var foundSupportedVersion = false;
    for (var i = 0; i < numSupportedVersions; i++) {
        var minimumFlashVersion = swfLocations[i * 2];
        var swfLocation = swfLocations[i * 2 + 1];
        if (swfobject.hasFlashPlayerVersion(minimumFlashVersion)) {
            flashVars.swfLocation = flashVars.swfLocation[i * 2 + 1];
            swfobject.embedSWF(swfLocation, "flashContent", "100%", flashHeight, minimumFlashVersion, "playerProductInstall.swf", flashVars, params, attrs);
            foundSupportedVersion = true;
            break;
        }
    }

    if (!foundSupportedVersion) {
        if (versionString == '0.0.0') {
            // The user doesn't have flash installed at all, so just show the default background
        }
        else {
            // The user doesn't have a new enough version of flash installed, so the game won't show. Swap out the message
            // they see so it's more specific to their problem.
            $('#upgradeFlashLink').click(function() {
                sendVersionStats('upgrade');
                flashVars.swfLocation = flashVars.swfLocation[1];
                swfobject.embedSWF(swfLocations[1], "flashContent", "100%", flashHeight, swfLocations[0], "playerProductInstall.swf", flashVars, params, attrs);
            });

            $('#loadingPlaceholder').hide();
            $('#upgradeFlashPlaceholder').show();
        }
    }
}

/**
 * Pop open the ZSC
 */
function openZSC() {
    if (SNAPI_ENABLE && ZSC_ENABLE) {
        SNAPI.ZSC.open(true);
        var zscInitTime = (+new Date / 1000); // Init timestamp
        ZscClientNotif.onZSCOpened();
        SNAPI.ZSC.addOnOpenedListener(function()
        {
            if (!zscIsShowing) {
                // Record time difference between init and show
                var zscTimeShown = (+new Date / 1000);
                var zscTimeToShow = (zscTimeShown - zscInitTime);
                zscTimeToShow = zscTimeToShow.toFixed(2);
                ztrackCount('debug_stats', 'zsc', 'time_to_open', zscTimeToShow);
                zscIsShowing = true;
                showScreenshot(0.25, 3.0, 0x30000000)
            }
        });
        SNAPI.ZSC.addOnClosedListener(onZscClose);
    }
}

function onZscClose() {
    // Make a post to the server, giving it the opportunity to clean out facebook requests
    $.post(
        ZY.PrepareURL(callbackURL + 'zsc/zsc_closed.php'),
        {
            timestamp: Math.round(+new Date / 1000)
        }
    );
    ZscClientNotif.onZSCClosed();

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

/**
 * Payments object
 */
var CastlePayments = (function() {
    var me = {};
	var currentTab = null;
	var my_payments = null; // ZYNGA.PAYMENTS.PAYFRAME.getPayFrameInstance();
	//my_payments.addListener(handleClose, 'onAfterIframeClose');
	var appId;
	var gameId;
	
	me.initialize = function(app_id, zl_app_id) {
		appId = app_id;
		gameId = zl_app_id;	
	}


    /*
     * Integration guide - https://zyntranet.apps.corp.zynga.com/display/PLAT/In-App+Purchase+JS+API
     */
    me.addToCart = function(in_itemCode, in_qty, in_ref, fb_app_id, itemName, description) {

        if (in_itemCode == 0) { return; }
        if (in_qty == 0) { return; }
        if (typeof g_paymentHashes[in_itemCode] == "undefined") { return; }

        var clientId = 1; // Set to always be web
        var itemCode = in_itemCode;
        var qty = in_qty;
        var cb_fcn = preFunction;
        var complete_fcn = postFunction;
        var ref = in_ref;
		var price_card_code = "DEFAULT_"+itemCode;
        var sig = g_paymentHashes[in_itemCode];

        var snId = SNAPI.getSNID();
        if (snId == SNAPI.ZDC)
        {
          clientId = 6;
        }
        var uid = SNAPI.getConfig(snId).session.user_id;
		if(SNAPI.getConfig(snId).session.user_id) {
        	uid = SNAPI.getConfig(snId).session.user_id;
		} else {		
        	uid = parseInt(SNAPI.getConfig(snId).session.zid);
		}
		if (itemName != '') {
            ZPURCHASE.item.override({title:itemName, description:description});
        } else {
            ZPURCHASE.item.override({description:description});
        }
		ZPURCHASE.price_card_code = price_card_code;
       	console.log(uid); 
		ZPURCHASE.add_to_cart(gameId, snId, uid, clientId, itemCode, qty, cb_fcn, complete_fcn, ref, appId, sig);
	}
	
    var preFunction = function(result) {
        // [CST-13828] TEMP WORKAROUND - Detect IE8 and, if necessary, force screenshot logic here since FB is failing currently (remove this when they fix hideFlashCallback!)
        if (result.success) {
            var useragent = navigator.userAgent.toLowerCase();
            if (useragent.indexOf("msie") != -1) {
                var browserVersion = parseFloat(useragent.substring(useragent.indexOf('msie') + 4));
                if (browserVersion == 8)
                {
                    showScreenshot(0.25, 3.0, 0x30000000);
                }
            }
        }
    }

    var postFunction = function(result) {
        // [CST-13828] TEMP WORKAROUND - Detect IE8 and, if necessary, force screenshot logic here since FB is failing currently (remove this when they fix hideFlashCallback!)
        var useragent = navigator.userAgent.toLowerCase();
        if (useragent.indexOf("msie") != -1) {
            var browserVersion = parseFloat(useragent.substring(useragent.indexOf('msie') + 4));
            if (browserVersion == 8)
            {
                hideScreenshot();
            }
        }
    }

	me.showPage = function(pageType, tabId) {
		if(currentTab == null) {
			currentTab = tabId;
			var elems = jQuery.parseJSON(zaspVals);
			$.get(
				callbackURL + 'payment.json',
				{
					type: pageType,
					zyAuthHash: elems.zyAuthHash,
					zySig: elems.zySig,
					zySnid: elems.zySnid
				},
				function (response) {
					var params = {
						"page": pageType,
						"zugid": response.zugid,
						"package_id":response.packageID,
						"modal": {"close_button": true},
						"query_string_params": {"sighash":response.sighash, "encrypted_params": response.encrypted_params}
					};
					//my_payments.openPaymentIframe(params);
					$(tabId).addClass("selected");
				}
			);
		} 
		else {
			//my_payments.closePaymentIframe();
		}
	}

	function handleClose() {
		$(currentTab).removeClass("selected");
		currentTab = null;

	}

    me.openOffers = function(fb_app_id, zlive_app_id, z_offers_hash) {
        console.log("anand - open offers" + z_offers_hash);
        var gameId = zlive_app_id;
        var snId = SNAPI.getSNID();
        var uid = SNAPI.getConfig(snId).session.user_id;
        var clientId = 1; // Set to always be web

        var earn_params = {
            zhash: z_offers_hash,
            gameid: gameId,
            snid: snId,
            uid: uid,
            appid: fb_app_id,
            clientid: 1,
            callback: function(response){offersComplete(response)},
            precallback: function(){showScreenshot(0.25, 3.0, 0x30000000)},
            zindex: 101
        };

        if ("oldflow" == z_offers_hash) {
            console.log("anand - open offers with old flow get_offers");
            ZPAYMENTS.get_offers(gameId, snId, uid, clientId, offersCallback, offersComplete, fb_app_id);
        }
        else {
            console.log("anand - open offers with new flow earn");
            ZPAYMENTS.earn(earn_params);
        }
    }

    var offersCallback = function(response) {
        if (response) {
            // Error
        } else {

        }
    }

    var offersComplete = function(response) {
        hideScreenshot(true);
    }

    return me;
})();


/**
 * Bridge between ZSC and client
 */
var ZscClientNotif = (function() {

    var me = {};
    var requests = new Array();
    var reservedRequests = new Array();
    var onServerResponseTimer = false;
    var onServerResponseRef = 0;
    var zscOpened = false;

     me.onZSCOpened = function() {
         zscOpened = true;
     }

     me.onZSCClosed = function() {
         zscOpened = false;
     }

    me.Accept = function(data) {
        var params = new Array(data['viralName'], data['contextVars']);
        if(zscOpened){
            requests.push(params);
        }
        else {
            reservedRequests.push(params);
            if(!onServerResponseTimer){
                onServerResponseRef = 1;
                onServerResponseTimer = true;
                setTimeout('ZscClientNotif.onServerResponseTimeout()', 2000);
            }
            else {
                onServerResponseRef++;
            }
        }
    }

    me.onServerResponseTimeout = function() {
        onServerResponseRef--;
        if(onServerResponseRef <= 0){
            if(reservedRequests.length > 0){
                var app = document.getElementById('flashapp');
                if(app && app.processRequests && typeof app.processRequests == 'function') {
                    app.processRequests();
                }
            }
            // erase the reserve array
            reservedRequests = new Array();
            onServerResponseTimer = false;
            onServerResponseRef = 0;
        }
        else {
            setTimeout('ZscClientNotif.onServerResponseTimeout()', 500);
        }
    }

    /**
     * Called when ZSC is closed
     */
    me.ProcessRequests = function(chunkCount) {
    try {
      var processed = false;

      for (var i = 0; i < requests.length; i++) {
        try {
          var parms = new Array();
          parms.push(requests[i][0]);
          parms.push(requests[i][1]);

          var app = document.getElementById('flashapp');
          if(app && app.onZscEvent && typeof app.onZscEvent == 'function') {
            app.onZscEvent(parms);
          }

          processed = true;
        } catch(e) {
          //
        }
      }

      // If we processed something then kick off a transaction
      if (processed) {
        var app = document.getElementById('flashapp');
        if(app && app.processRequests && typeof app.processRequests == 'function') {
          if (typeof chunkCount != 'undefined') {
            app.processRequests(chunkCount);
          } else {
            app.processRequests();
          }
      }
      }
    } catch(e) {
      //
    }

    if (zscIsShowing) {
        zscIsShowing = false;
        hideScreenshot();
    }

    requests = [];
  }

    return me;

})();

var ZscClientNotifGiftAccept = ZscClientNotif.GiftAccept;
var ZscClientNotifInviteAccept = ZscClientNotif.InviteAccept;
var ZscClientNotifHelpAccept = ZscClientNotif.HelpAccept;
var ZscClientNotifAccept = ZscClientNotif.Accept;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ZDC SPECIFIC JS CODE
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var gfc = (function () {
    var me = {};

    /**
     *
     */
    me.HandleFeed = function (url, callback) {
        url = ZY.PrepareURL(url);
        $.ajax({
            url: url + '&_t=json' + '&chunk=0',
            dataType: 'json',
            success: function (data, textStatus) {
                var d = data;
                var s = textStatus;
                if (data.accepted && data.viralName) {
                    var senderVars = data.senderVars || {};
                    var receiverVars = data.receiverVars || {};
                    ZscClientNotif.Accept({viralName: data.viralName, contextVars: {senderVars:senderVars, receiverVars:receiverVars}});
                    ZscClientNotif.ProcessRequests();
                }
                if (callback) {
                    callback(data);
                }
            },
            error : function (xhr, textStatus) {
                var x = xhr;
                var s = textStatus;
            }
        });
    };

  return me;
})();

/**
 * ZDC - Used to give the user one energy from a friend
 */
function refreshClientData() {
    var app = document.getElementById('flashapp');
    if(app && app.runGrantGoodsOnClient && typeof app.runGrantGoodsOnClient == 'function') {
        app.runGrantGoodsOnClient(114);
    }
}

function muteGame() {
    var app = document.getElementById('flashapp');
    if(app && app.muteGame && typeof app.muteGame == 'function') {
        app.muteGame(true);
    }
}

function unmuteGame() {
    var app = document.getElementById('flashapp');
    if(app && app.muteGame && typeof app.muteGame == 'function') {
        app.muteGame(false);
    }
}

function gameMessageInit() {
        // Don't start listening for messages until the flash app is
        // ready to handle them.
        var app = document.getElementById('flashapp');
        if(!(app && app.onZscEvent && typeof app.onZscEvent == 'function' && typeof app.onZFriendsGameMessageReceived == 'function')) {
                setTimeout(gameMessageInit, 250);
                return;
        }

        var g = SNAPI.GameMessages;
        g.listen('invite', function () { ZCastleTabs.click('neighbor'); });
        g.listen('gift', function () { ZCastleTabs.click('gift'); });
        g.listen('handleFeed', function (data) {
                gfc.HandleFeed(data.href, function (d2) {
                        if (d2.hasOwnProperty('statusMessage')) {
                                data.statusMessage = d2.statusMessage;
                        } else if (d2.hasOwnProperty('errorMessage')) {
                                data.errorMessage = d2.errorMessage;
                        }
                        g.send('feedHandled', data);
                });
        });
        g.listen('beforeDialogOpen', ZYFrameManager.freezeFlash);
        g.listen('afterDialogClose', ZYFrameManager.unfreezeFlash);
        g.listen('goodsGranted', refreshClientData);
        g.listen('sleep', muteGame);
        g.listen('wake', unmuteGame);
        if (SNAPI.getSNID() == SNAPI.ZGN) {
            loadZFriends();
         }
}

var wasZFriendsGameMessageReceived = false;

function loadZFriends() {
    SNAPI.GameMessages.listen('zFriends', function(data) {
            onZFriendsGameMessageReceived(data);
        }
    );
    SNAPI.GameMessages.once('zFriends', function() {
            var sendRes = SNAPI.GameMessages.send('zFriends');
            if (sendRes) {
                if (g_zFriendsGameMessageTimeout > 0) {
                    setTimeout(onZFriendsGameMessageCallFailure, g_zFriendsGameMessageTimeout);
                }
            } else {
                // could not send game message
                // perform emergency plan
                onZFriendsGameMessageCallFailure(0);
            }
        }
    );
}

function onZFriendsGameMessageCallFailure(retryCount) {
    if (typeof retryCount == 'undefined') {
        retryCount = 0;
    }
    if (wasZFriendsGameMessageReceived || retryCount > g_zFriendsScriptMaxRetries) {
        return;
    }
    var zaspValues = jQuery.parseJSON(zaspVals);
    var url = callbackURL + 'zdc/get_zfriends.php?zaspSessionKey='+zaspValues.zaspSessionKey+'&zyAuthHash='+zaspValues.zyAuthHash+'&zySig='+zaspValues.zySig + "&zySnid=" + zaspValues.zySnid + "&retryCount=" + retryCount;
    $.ajax({
        url: url,
        dataType: 'json',
        timeout: 10000, // fetching zFriends takes up to 8 seconds
        success: function (data) {
            onZFriendsGameMessageReceived(data);
        },
        error : function (data) {
            // retry
            onZFriendsGameMessageCallFailure(retryCount + 1);
        }
    });
}

function onZFriendsGameMessageReceived(data) {
    if (!wasZFriendsGameMessageReceived) {
        wasZFriendsGameMessageReceived = true;
        document.getElementById('flashapp').onZFriendsGameMessageReceived(data);
    }
}

// Have not loaded Zbar yet.
var zbarInited = false;

// Have not loaded ads yet,
var adsInited = false;

// Salute to Mafia Wars 1
CastlePopup = (function() {
    var me;
    me = {};

    function getWrapperDivId(id) {
        return 'pop_' + id;
    }

    function getBgDivId(id) {
        return 'pop_bg_' + id;
    }

    function getBoxDivId(id) {
        return 'pop_box_' + id;
    }

    function show(id, delay) {
        var bg, box, showPopup;
        if (typeof delay == 'number' && delay >= 0) {
            return setTimeout(function() {
                show(id);
            }, delay);
        } else {
            bg = $('#interstitialOverlay'); // Standard overlay.
            box = $('#' + getWrapperDivId(id));

            showPopup = function(canvasData) {
                hideInnerFlash();
bg.height(bg.parent().parent().parent().height());             
   bg.show();

                if( box.hasClass('pop_prevent_fade') ) {
                    box.show();
                } else {
                    box.fadeIn(150);
                }
            };

            showPopup();
        }
    }

    function hide(id, delay) {
        hideHelper(id, false, delay);
    }

    function hideAndRemove(id, delay) {
        hideHelper(id, true, delay);
    }

    function hideHelper(id, remove, delay) {
        var bg, box, finalWrapper;
        if (typeof delay == 'number' && delay >= 0) {
            return setTimeout(function() {
                hideHelper(id, remove);
            }, delay);
        } else {
            bg = $('#interstitialOverlay').hide();      // these return jQuery
            box = $('#' + getWrapperDivId(id));

            if (remove) {
                box.fadeOut(150, function() {
                    $('#' + getWrapperDivId(id)).remove();
                });
            } else {
                box.fadeOut(150);
            }

            if(!zscIsShowing) {
               showInnerFlash();
            }
            //SNAPI.ZSC.open(true);
        }
    }

    function registerClose(id) {
        $('#'+ getBoxDivId(id) + ' .pop_box_close').click(function() {
            CastlePopup.hide(id);
        });
    }

    me.registerClose = function(id) {           registerClose(id); };
    me.show = function(id, delay) {             show(id, delay); };
    me.hide = function(id, delay) {             hide(id, delay); };
    me.hideAndRemove = function(id, delay) {    hideAndRemove(id, delay); };
    return me;
}());

function showZCachePromptIcon() {
    $('#zCachePromptIcon').click(function() {
       var app = document.getElementById('flashapp');
       app.showZCachePrompt();
    });

    $('#zCachePromptIcon').show();
}

function hideZCachePromptIcon() {
    $('#zCachePromptIcon').hide();
    $('#zCachePromptIcon').remove();
}

function startNowAskForFBPerms(permissions) {
    if(!permissions) {
        permissions = ["email","publish_actions"];
    }
    FB.login(function(response) {
        FB.api('/me/permissions', {limit: 0}, function(permResponse) {
            // permResponse is a length 1 array holding an unnamed Object whose fields are the names of the permissions, each with the value "1" if granted
            // need to iterate through this object and make sure all permissions have been granted to return a success
            var newPerms = permResponse.data[0];
            var hasAllPerms = true;
            var numPerms = permissions.length;
            for (var i = 0; i < numPerms; i ++) {
                var reqPerm = permissions[i];
                if(!newPerms.hasOwnProperty(reqPerm) || newPerms[reqPerm] != 1) {
                    hasAllPerms = false;
                    break;
                }
            }
            if(hasAllPerms) { // user accepted all perms, return success
                document.getElementById('flashapp').startNowAskForFBPermsResponse(true);
            } else { // return failure
                document.getElementById('flashapp').startNowAskForFBPermsResponse(false);
            }
        });
    }, {scope: permissions.join()});
}

/**ZTrack querying**/
var ZTrackQuery = (function() {
	var me = {};
	var ztrackValues = new Array();
	// debugging
	//var callUrl = "http://fb.caflores-zcastle-development.dev3.dallas.zynga.com/zsc/ztrack_callback.php";

	var strAppCallback = null;

	me.GetKey = function(ztrackinfo, appCallback){
		var callUrl = callbackURL + '/ztrack/ztrack_callback.php';
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

			if(data != null && 'key' in data && data.key.length > 0){
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
