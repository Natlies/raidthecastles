/** Opens an overlaying iframe */
(function() {
	var prepUrl = function(url) {
		return ZY.PrepareURL(url) + "&overlayed=true&" + (new Date() - 0) + '#overlay';
	};

	var appFrame, flashFrame, loadingFrame, htmlFrame, iframe, oldIframe, tabs, flashTab, preloadedUrls = {}, needToRestore;
	
	var cleanup = function() {
		oldIframe.remove();
		if (needToRestore) {
			preloadUrl(needToRestore);
			needToRestore = null;
		}
	};
	
	var tabClick = function(e) {
		if (e && e.target) {
			var el = $(e.target);
			if (!el.is('a')) {
				el = el.parents('a');
			}
			navigateTo(el.attr('href'));
			tabs.children('a').parent().removeClass('selected');
			el.parent().addClass('selected');
			return false;	
		}
	};
	
	/**
	 * Simulates a tab click so the tab highlighting changes as well as the tab contents being loaded
	 * 
	 * @param	tab		String		The CSS class of the tab
	 */
	var simulateTabClick = function(tab) {
		$('#tabs li.'+tab+' > a').trigger('click');
	}
	
	var createIframe = function() {
		return $("<iframe/>", {scrolling: 'no', border: '0', frameborder: '0', height: '0'});
	};
	
	var setupElements = function() {
		appFrame = $('#appFrame');
		flashFrame = $('#flashFrame');
		loadingFrame = $('#loadingFrame');
		htmlFrame = $('#htmlFrame');
		flashTab = $('#flashTab');
	};
	
	$(function() {
		tabs = $('#tabs li');
		tabs.children('a').not('.skipZyParams').click(tabClick);
		$('#z_lang_button').click(languageMenu);
		setupElements();
	});

	var hideFlash = function() {
		window.location.hash = '#notOnFlash';
		flashFrame.addClass('offscreen');
		// disableAllInput();
	};
	
	var closeLanguageMenu = function(){
		$('#languageMenuOverlay').hide();
		$('#z_lang').unbind("mouseleave");
		$('#z_lang').unbind("mouseenter");
		$('#z_lang_button').unbind("mouseleave");
	};
	
	var isClosing = false;
	
	var closingLanguageMenu = function(){
		isClosing = true;
		setTimeout(function(){
			if(isClosing){
				closeLanguageMenu();
			}
		},500);
	};
	
	var languageMenu = function() {
		if (!$('#appFrame').hasClass('flashVisible')) {
			switchToFlash();
			$('#languageMenuOverlay').show();
			return;
		}
		if ($('#languageMenuOverlay').is(':visible')) {
			closeLanguageMenu();
		} else {
			$('#languageMenuOverlay').show();
			$('#z_lang').bind("mouseenter",function (){
				isClosing = false;
			});
			$('#z_lang_button').bind("mouseleave",closingLanguageMenu);
			$('#z_lang').bind("mouseleave",closingLanguageMenu);
		}
	}
	
	var hideHtml = function() { htmlFrame.addClass('offscreen'); };
	var hideLoading = function() { loadingFrame.addClass('offscreen'); };
	
	var showHtml = function() {
		hideLoading();
		hideFlash();
		htmlFrame.removeClass('offscreen');
		appFrame.removeClass('flashVisible');
	};
	
	var showLoading = function() {
		hideHtml();
		hideFlash();
		loadingFrame.show();
		loadingFrame.removeClass('offscreen');
		appFrame.removeClass('flashVisible');
	};
	
	var showFlash = function() {
		hideHtml();
		hideLoading();
		flashFrame.removeClass('offscreen');
		flashFrame.show();
		appFrame.addClass('flashVisible');
		oldIframe = iframe;
		iframe = false;
		
		tabs.children('a').parent().removeClass('selected');
		flashTab.addClass('selected');
		setTimeout(cleanup, 1000);
		// enableAllInput();
	};
	
	var interval, innerDoc, lastHeight;

	var computeHeight = function(doc) {
		var body = doc.body, docElement = doc.documentElement;
		var bottom = Math.max(
			Math.max(body.offsetHeight, body.scrollHeight) +
			body.offsetTop,
			Math.max(docElement.offsetHeight, docElement.scrollHeight) +
			docElement.offsetTop);

		if (docElement.clientTop > 0) {
			bottom += (docElement.clientTop * 2);
		}

		return bottom;
	};
	
	var innerIFramePoller = function() {
		try {
			if (iframe == null || (iframe[0].contentWindow && iframe[0].contentWindow.location.hash == "#switchToFlash")) {
				showFlash();
				clearInterval(interval);
				interval = null;
				iframe[0].contentWindow.location.hash = '#switched';
			} else {
				if (!innerDoc || lastHeight == null || lastHeight == 0) {
					innerDoc = iframe[0].contentWindow.document;
				}
				
				var height = computeHeight(innerDoc);
				
				if (height != lastHeight) {
					iframe.height(height);
					lastHeight = height;
				}
			}
		} catch(e) {
			//security errors thrown by accessing location of another domain
		}
	};
	
	var iframeLoaded = function() {
		iframe && iframe.unbind('ready', iframeLoaded);
		showHtml();
	};	
	
	var navigateTo = function(url) {
		if (url.match(/^#switchToFlash/)) {
			switchToFlash();
			return;
		}
		setupElements();
		if (preloadedUrls[url]) {
			if (iframe) {
				oldIframe = iframe;
				cleanup();
			}
			iframe = preloadedUrls[url];
			needToRestore = url;
			preloadedUrls[url] = null;
			iframe.attr('height', '').removeClass('preloaded');
			iframeLoaded();
		} else {
			showLoading();
			if (!iframe) {
				iframe = createIframe().appendTo(htmlFrame);
			}
			iframe.ready(iframeLoaded);
			iframe.attr('src', prepUrl(url));
		}
		innerDoc = null; lastHeight = 0;
		interval = setInterval(innerIFramePoller, 500);
	};

	var switchToFlash = function() {
		interval && clearInterval(interval);
		interval = null;
		showFlash();
	};
	
	var preloadFuncs = [];
	var preloadUrl = function(url) {
		var preloader = function(){
			var preloadedFrame = createIframe();
			preloadedFrame.addClass('preloaded').attr('src', prepUrl(url)).appendTo(htmlFrame).load(function() {
				preloadedUrls[url] = preloadedFrame;
			});
		};
		preloadFuncs.push(preloader);
	};
	
	var readyToPreload = function() {
		setupElements();
		var funcs = preloadFuncs;
		preloadFuncs = [];
		setTimeout(function() {
			for (var i = 0; i < funcs.length; ++i) {
				funcs[i]();
			}
		}, 5000);
	};
	
	window.ZYFrameManager = {
		'navigateTo': navigateTo,
		'simulateTabClick': simulateTabClick,
		'switchToFlash': switchToFlash,
		'openIFrame': navigateTo, //backwards compat
		'preloadUrl': preloadUrl,
		'readyToPreload': readyToPreload
	};
})();
