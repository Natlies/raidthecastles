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

function showRequestDialog(messageString, dialogTitle, params) 
{
	disableAllInput();
	g_appRequestParams = params;
    //alert(params);
	FB.ui({method:'apprequests', message:messageString, title:dialogTitle, data:params}, RequestDone);
}

//actual directed requests are disabled until the SN ID is correct in the game
function showDirectedNeighborRequestDialog(messageString, dialogTitle, targetID, data) {
    disableAllInput();
    g_appRequestParams = data;
    FB.ui({method:'apprequests', message:messageString, title:dialogTitle, data:data},  RequestDone);
    
}

function RequestDone(response) {
	enableAllInput();
    //this is worthless, as the response isn't accurate...
	if(response && response.request_ids)
	{
		// this is a test, only a test
		element = document.getElementById("flashapp");
		element.requestCreated(g_appRequestParams, response.request_ids);
	}
}

/**
 * DEPRECATED Shows the feed dialog for the user
 *
 * @param integer	bundleId	id of the bundle to display template
 * @param integer	bundleData	Data to display in the bundle
 * @param array		targetId	Array of ids to publish story to
 * @param string	bodyGeneral	Associated text for stories
 */	
function showFeedDialog(bundleId,bundleData,targetId,bodyGeneral) {	
	FB.ensureInit(function() {
		var result=FB.Connect.showFeedDialog(bundleId,bundleData,targetId,null,null,FB.RequireConnect.require,onFeedClosed,bundleData.user_message_prompt,null);
		if(result) {
			document.getElementById('flashapp').logShowFeedDialog();
			disableAllInput();
		}
	});
}	

/** DEPRECATED Callback for when the feed dialog has closed */
function onFeedClosed() {
	enableAllInput();
	document.getElementById('flashapp').logCloseFeedDialog();
}

function snapiGetPermission(permission, uid) {
    SNAPI.api("users.getPermissions", {uid: uid},
              function(result){
                document.getElementById('flashapp').onPermissionReceived(uid, permission, result[uid][permission] == "1");
              }
    );
}


function snapiTest(payload) {
  snapiStreamPublish(payload);
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

/** Callback for when the stream publish dialog has closed */
function onStreamClosed( post_id, exception ) {
	var result = "unknown";
	if( post_id == "null" ) {
		result = "skipped";
	} else if ( post_id == null ) {
		result = "closed";
	} else if ( post_id && exception == null ) {
		result = "posted";
	}
	enableAllInput();
	document.getElementById('flashapp').logCloseFeedDialog( result );
}

/**
* Show permissions dialog for the user
*/
function showStreamPermissions(callback) {
	if(SNAPI_ENABLE) {
		SNAPI.ui("showPermissionDialog", {perms: "read_stream"},callback ? callback : onPermissionDialogClosed);
	} else {
		FB.ensureInit(function() {
			FB.Connect.showPermissionDialog("publish_stream", onPermissionDialogClosed);	
			disableAllInput();
		});
	}
}

/** 
 * Callback for when the permissions dialog has closed.
 *
 * @param	string	permissionsAccepted		CSV string of permissions granted if user accepts, otherwise empty string.
 */
function onPermissionDialogClosed(permissionsAccepted) {
	var allowed = false
	if (permissionsAccepted != "") {
		allowed = true;
		FB.Connect.forceSessionRefresh();
	}	

	enableAllInput();
	document.getElementById('flashapp').permissionDialogClosed(allowed);
}

/** Show bookmark dialog for the user */
function showBookmarkDialog(callback) {
	if(SNAPI_ENABLE) {
		SNAPI.ui("showBookmarkDialog",callback);
	} else {
		FB.ensureInit(function() {
			FB.Connect.showBookmarkDialog();	
		});
	}
}

/**
* Show 'email' permissions dialog for the user
*/
function showEmailPermission(callback) {
	if(SNAPI_ENABLE) {
		SNAPI.ui("showPermissionDialog", {perms: "email"},callback ? callback : onEmailPermissionDialogClosed);
	} else {
		FB.ensureInit(function() {
			FB.Connect.showPermissionDialog("email", onEmailPermissionDialogClosed);	
			disableAllInput();
		});
	}
}

/** 
 * Callback for when the 'email' permissions dialog has closed.
 *
 * @param	string	permissionsAccepted		CSV string of permissions granted if user accepts, otherwise empty string.
 */
function onEmailPermissionDialogClosed(permissionsAccepted) {
	var allowed = false
	if ( permissionsAccepted != "" ) {
		allowed = true;
		FB.Connect.forceSessionRefresh();
	}	
	enableAllInput();
	document.getElementById( 'flashapp' ).emailPermissionDialogClosed( allowed );
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
	swfobject.embedSWF(swfLocation, "flashContent", flashWidth, flashHeight, "10.0.0", "playerProductInstall.swf", flashVars, params, attrs);
}
