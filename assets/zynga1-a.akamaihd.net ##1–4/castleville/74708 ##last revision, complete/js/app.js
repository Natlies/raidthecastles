/**
 * File Name: app.js
 *
 * © 2010 Zynga Game Network Inc.
 */

/** Binds a function to an object's scope */
function bind(func, obj) {
	var args = $.makeArray(arguments).slice(2);
	return function() { return func.apply(obj, args.concat($.makeArray(arguments))); };
}

/** Redirects the user to a new page */
function redirect(url) {
	window.location = ZY.PrepareURL(url);
}


/**
 * ZY manages the ZY signature params and is responsible for keeping the signature updated.
 * @param params Array	The current ZY signature params
 * @param updateUrl String	The URL to hit to update the sig
 * @param updateInterval Integer	How frequently in seconds to update the signature
 */
function ZY(params, updateUrl, updateInterval) {
	this.params = params;
	this.updateUrl = updateUrl;
	ZY.instance = this;
	setInterval(bind(this.updateParams, this), updateInterval * 1000);
	$(bind(this.registerClickHandler, this));
}

/**
 * ZY.PrepareURL adds the ZY signature to a url if necessary.
 * @param url String the URL to convert
 * @return String the URL with the ZY sig conditionally added
 */
ZY.PrepareURL = function (url) {
	if (ZY.instance && ZY.instance.shouldAddSig(url)) {
		return ZY.instance.prepareUrl(url);
	} else {
		return url;
	}
};

ZY.prototype = {
	/**
	 * Callback to make an ajax request to update the ZY signature.
	 */
	updateParams: function() {
		$.post(this.prepareUrl(this.updateUrl), bind(this.updateSuccess, this), 'json');
	},
	/**
	 * Updates the params instance variable with the newly received data.
	 */
	updateSuccess: function(data) {
		this.params = data;

		document.getElementById("flashapp").updateZyParams(data);
	},
	/**
	 * Registers a global click handler to intercept all clicks
	 */
	registerClickHandler: function() {
		$('body').click(bind(this.click, this));
	},
	/**
	 * Click handler for the entire body, clicks on A and INPUT tags 
	 * are redirected to their respective functions.
	 */
	click: function(e) {
		if (e.target) {
			if (e.target.nodeName == "A") {
				return this.hrefClick(e);
			} else if (e.target.nodeName == "INPUT") {
				return this.inputClick(e);
			}
		}
	},
	/**
	 * Handles a click an hyperlink-reference (A tag).
	 * This function checks to see if the link that was clicked on has a URL that
	 * should be rewritten to contain our signature.
	 */
	hrefClick: function(e) {
		var el = $(e.target);
		if (el && this.shouldAddSig(el.attr('href'))) {
			// Don't want to send our sig out into the wild
			el.attr('href', this.prepareUrl(el.attr('href')));
		}
	},
	/**
	 * Handles a click an input tag
	 * This function checks to see if the button is a submit button of a form.
	 * If it is, it adds hidden input tags to the parent form if it exists that 
	 * contains our signature params.
	 */
	inputClick: function(e) {
		var el = $(e.target);
		if (el && el.attr('type') == 'submit') {
			var form = el.closest('form');
			if (form.size() > 0) {
				for (var key in this.params) {
					$("<input>", {type: 'hidden', name: key, value: this.params[key]}).appendTo(form);
				}
			}
		}
	},
	/**
	 * Checks to see if the passed URL is in our domain or is a relative URL.
	 * @param url String The URL to check
	 * @return Boolean	Whether or not the passed URL needs to have our sig added
	 */
	shouldAddSig: function(url) {
		var acceptableHostRE = '^' + window.location.toString().match(/https?:\/\/[^\/]*/)[0];
		return !url.match(/^#/) && (!url.match(/^http/) || url.match(new RegExp(acceptableHostRE)));
	},
	/**
	 * This method rewrites the passed URL to contain our signature.
	 * @param String url The URL to rewrite with our signature
	 * @return String The URL rewritten to contain our signature
	 */
	prepareUrl: function(url) {
		if (url.indexOf('?') == -1) {
			url += '?';
		}
		for (var key in this.params) {
			url = url.replace(new RegExp(key + "=[^&]*&?"), '');
			url += '&' + key + '=' + encodeURI(this.params[key]);
		}
		return url;
	}
};


/**
 * SKUpdater is responsible for maintaing a valid 
 * FB Session key while you play the game in an iframe.
 */
function SKUpdater(url, initialDelay) {
	initialDelay = initialDelay < 0 ? 0 : initialDelay;
	this.url = url;
	this.iframe = this.createIframe();
	this.refreshIn(initialDelay);
	SKUpdater.instance = this;
}

SKUpdater.prototype = {
	/**
	 * Creates an iframe tag at the bottom of the dom to hit the canvas URL
	 */
	createIframe: function() {
		var iframe = $('<iframe></iframe>');
		$("<div></div>", {id: 'skUpdater'}).prependTo($('body')).append(iframe);
		return iframe;
	},
	/**
	 * Points to the hidden iframe we created earlier to a cache-busted URL
	 */
	updateSK: function() {
		this.iframe && this.iframe.attr('src', ZY.PrepareURL(this.getCacheBustedUrl()));
	},
	/**
	 * Simply adds the timestamp to the end of the URL so it changes
	 */
	getCacheBustedUrl: function() {
		var cb = (new Date()) - 0; // minus 0 to force into int
		if (this.url.indexOf('?') == -1) {
			return this.url + "?" + cb;
		} else {
			return this.url + "&" + cb;
		}
	},
	/**
	 * Sets a timer to refresh the SK
	 * @param delay int (in seconds)
	 */
	refreshIn: function(delay) {
		setTimeout(bind(this.updateSK, this), delay * 1000);
	}
};
