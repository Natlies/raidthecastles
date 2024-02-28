/**
 * test
 * File Name: flash_integration.js
 *
 * All the functions in this file are needed to embed or used by Flash
 * © 2010 Zynga Game Network Inc.
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
});

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
        if(result){
            document.getElementById("flashapp").requestDone(result);
        }
        else {
            document.getElementById("flashapp").requestError();
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
        var friendList = [{name: 'Friends', user_ids: zidObj}];
        FB.ui({method:'apprequests', message:g_requestPayload['body'], title:g_requestPayload['title'],filters: friendList}, snapiRequestDone);
    }
    else {
         //, data:params
        FB.ui({method:'apprequests', message:g_requestPayload['body'], title:g_requestPayload['title'],to: zidObj[0]}, snapiRequestDone);
    }
}

/*
 *
*/
function snapiSendRequest(toZids, requestPayload, zEventType, requestType) {
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
function giftBackCallback(result){
  if(result.request_ids){
    window.top.location = g_canvasUrl + 'index.php?va=giftback&gbvid=' + g_giftBackVid + '&giftTo=' + g_giftTo + '&gbReq=' + result.request_ids[0];
  }
  else {
    window.top.location = g_canvasUrl +'index.php';
  }
}

function sendGiftBack(senderId, vid, body, title, canvUrl){
  g_giftTo = senderId;
  g_giftBackVid = vid;
  g_canvasUrl = canvUrl;
  
  var payload = [];
  payload['body'] = body;
  payload['title'] = title;
  
  snapiGiftBack(senderId, payload, 'giftback', giftBackCallback);
}


function snapiGetPermission(permission, uid) {
    SNAPI.api("users.getPermissions", {uid: uid},
              function(result){
                document.getElementById('flashapp').onPermissionReceived(uid, permission, result[uid][permission] == "1");
              }
    );
}


function snapiStreamPublish(viralPayload) {
	// fix for FB.ui. Expects an associative array for media properties
    //  associative arrays don't translate through actionscript to javascript functions
    //   so do conversion from object to associative array here.
    // TODO: CAF look into
    /////////////////////////////////////
    var media = [];
    for(key in viralPayload.full.media){
      media[key] = viralPayload.full.media[key];
    }
    viralPayload.full.media = media;
    viralPayload.simple.media = media;
    /////////////////////////////////////
    var params = {payload : JSON.stringify(viralPayload)};
    
    try{
        var result=SNAPI.api('stream.publish', params, function(response){
            document.getElementById('flashapp').onViralPublished(response);
        });
    }
    catch(e){
        alert(e);
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
	var params = { allowScriptAccess: "always", wmode: "opaque", allowFullScreen: "true" };
	var attrs = { id: "flashapp", name: "flashapp" };
	var heightParam = 
	swfobject.embedSWF(swfLocation, "flashContent", "100%", flashHeight, "10.0.0", "playerProductInstall.swf", flashVars, params, attrs);
}

/**
 * Pop open the ZSC
 */
function openZSC() {
	if (SNAPI_ENABLE && ZSC_ENABLE) {
		initZsc();
	}
}