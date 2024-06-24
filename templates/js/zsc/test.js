/*global FB, SNAPI*/
$(function () {
	//DAPI is init'd once SNAPI is init'd once FB is auth'd

	var
		// Add your fbid -> zid map here. Necessary just for testing harness.
		zidMap = {
			'100000178030080': 31015437036,  // Brian
			'506809047': 31032660757,  // Chris
			'100000664518118': 31144184512,  // Juice
			'690671785': 31144481712,  // Leon
			'506749194': 31144481692,  // lilmatt
			'516078268': 31144481694  // Ryan T
		},
		// CityVille FB App ID
		fbappid = 291549705119
	;

	FB.init({
		appId: fbappid,
		status: true,
		cookie: true,
		oauth: true
	});

	FB.getLoginStatus(function (response) {
		if (response && response.authResponse) {
			SNAPI.init({
				"currentHost": 1,
				"allConnections": {
					"1": {
						"app": {
							"appId": fbappid,
							"canvasUrl": "http:\/\/apps.facebook.com\/cityville\/",
							"callbackUrl": "http:\/\/fb-zc1.cityville.zynga.com\/"
						},
						"session": {
							"access_token": response.authResponse.accessToken,
							"user_id": response.authResponse.userID
						}
					}
				},
				"currentUser": zidMap[response.authResponse.userID],
				"appId": 75,
				"proxy": "/snapi_proxy.php",
				"xdReceiver": "",
				"urls": {
					"snapi": "http:\/\/zgn.static.zynga.com\/snapi\/g571b601-debug-prod",
					"zrest": "http:\/\/api.zynga.com",
					"drest": "http:\/\/api.zynga.com",
					"local_xd_receiver": "\/xd_receiver.html",
					"parent_xd_receiver": "https:\/\/site.zynga.com\/xd_receiver_zdc.html",
					"dapi": "http:\/\/zgn.static.zynga.com\/dapi\/r57676-debug-prod"
				},
				"dapiDisablePartitioning": false
			});
		}
	});

});
var ZY = { PrepareURL: function (url) { return url; } };
